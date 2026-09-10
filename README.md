# Northgate Online (`retail-web`)

Consumer online banking. Angular 15, NgRx, Canopy. Owned by @northgate/retail-digital (Charlotte
and Plano, with the payments work shared with @northgate/payments-platform in Jersey City and
Chennai). Jira project `MOL`. On call rota is in the team space; the app is Tier 1 so the rota is
real.

If you are new: read CONTRIBUTING.md, then `docs/architecture.md`, then skim the ADRs in
`docs/adr/`. The architecture diagram is a little behind (it still shows the Iris widget being
served from here; it has been its own repo since MOL-3410) but the shape is right.

## Toolchain

| Thing | Version | Where it is pinned |
|---|---|---|
| Node | 16.20.2 | `.nvmrc`, Jenkins agent label `nodejs16-rhel8` |
| npm | 8.19.4 | comes with Node 16 |
| Angular | 15.2.10 | `package.json`, exact |
| Angular CLI | 15.2.11 | `package.json` |
| Angular Material / CDK | 15.2.9 (MDC components) | `package.json` |
| TypeScript | 4.9.5 | `package.json` |
| RxJS | 7.5.7 | `package.json` |
| zone.js | 0.12.0 | `package.json` |
| NgRx | 15.4.0 | `package.json` |
| Canopy UI | 4.0.0 | `package.json`, `@northgate/canopy-ui` |
| Lantern SDK | 5.0.0 | `package.json`, `@northgate/lantern-sdk` |

Everything is exact-pinned. `save-exact=true` is in `.npmrc` so `npm install <thing>` does the
right thing. Do not add `^` back; we have been bitten (MOL-2270, the zone.js patch that broke
`fakeAsync` across 40 specs overnight).

`@types/node` is pinned to 16.18.11 on purpose. Newer 16.x builds ship `Disposable` declarations
that TypeScript 4.7 could not parse and the build died with TS2304 (MOL-4433). TypeScript 4.9
parses them, but the pin stays until the next deliberate bump.

Angular 14 -> 15 landed under MOL-4471 (`docs/adr/0015-angular-14-to-15.md`, which supersedes
0014; artefacts in `docs/upgrade/MOL-4471/14-to-15/`). One major at a time: 16 is a separate hop
with its own ticket. Do not `ng update` on `develop`; always a feature branch.

## Running it

```
nvm use
npm ci
npm start
```

`npm start` runs `ng serve` with `proxy.conf.json`, which forwards `/api` to the retail BFF on
4500, `/flags` to Semaphore on 4608 and `/telemetry` to the Splunk HEC stand-in. All of those come
from `mock-external/estate-up.sh` at the repo root; without them you get a login redirect to
nothing. Keystone (the mock, port 4400) accepts any customer from `@northgate/domain-fixtures` with
the OTP `000000`.

There is no `postinstall` step any more. The `ngcc` run that used to be there existed for the
View Engine Lantern SDK 2.x; Lantern 5.0.0 is partial Ivy and every other Angular package in the
tree is Ivy, so `ngcc` has nothing to do (proof in
`docs/upgrade/MOL-4471/14-to-15/logs/ngcc-proof.txt`). If a View Engine package ever comes back,
the build fails at compile time with a clear "not compatible with Angular Ivy" error rather than
at runtime.

Runtime configuration is `src/assets/config/env.json`, loaded by an `APP_INITIALIZER` before
anything else. Per-developer overrides go in `env.local.json` (gitignored). In every deployed
environment the ConfigMap replaces the file wholesale; the committed one is the local shape and
nothing else.

## Tests

```
npm test                    # watch mode, Chrome
npm run test:ci             # headless, coverage, what Jenkins runs
```

Karma with headless Chrome and `--no-sandbox` for the agents (`karma.conf.js`). Coverage sits in
the mid thirties. The number is not the point; the distribution is. Every guard, interceptor and
reducer has a real spec. Most components have a creation spec and nothing else. Transfers and bill
pay have almost no component specs, which is the wrong way round for the compliance-critical code
and is tracked as MOL-4476 under the upgrade epic because the untyped forms in there are also what
makes them hard to test. Two specs are `xit` with a ticket each; search for `xit(` if you want to
argue about them.

Do not pad coverage to get a Sonar gate through. Fix the gate or fix the tests.

`npm run e2e` still exists. It has not run in CI since the agents moved to RHEL 8 (MOL-3644). See
`e2e/protractor.conf.js` before you spend time on it.

## Building

```
npm run build:prod                  # en-US and es, service worker, AOT
npm run build:analyze               # single locale, stats.json for webpack-bundle-analyzer
npm run i18n:extract                # regenerates src/locale/messages.xlf
node tools/verify-ngsw.js           # CAB wants this output attached to the change record
```

Two i18n mechanisms, both in use. `$localize` for anything in templates and component copy;
`ngx-translate` for the content the marketing team edits through the CMS (`assets/i18n/*.json`,
promo banners, disclosures, help). ADR 0009 explains why we have both and why we have not
consolidated. Spanish `.xlf` is produced by the vendor and merged with `tools/i18n/merge-xlf.py`;
never edit `messages.es.xlf` by hand.

The build uses the Webpack browser builder with `aot: false` in the development configuration
because the `ng serve` cycle was over a minute with AOT on the Plano laptops in 2022. Production
is AOT. Yes, this means templates that are wrong only fail on a prod build; the Jenkins PR job runs
a prod build for that reason.

## Layout

```
src/app/core        config, auth (Keystone PKCE), guards, interceptors, session, telemetry, store
src/app/shared      SharedModule: Canopy re-exports, pipes, directives, masked-number, etc.
src/app/features    lazy feature modules, one NgRx slice each
src/locale          extracted and translated .xlf
src/assets/config   runtime env.json
docs/               ADRs, runbooks, architecture
backlog/            epic and story notes that do not fit in Jira (MOL-4471)
e2e/                Protractor. See above.
tools/              scaffolder, i18n merge, ngsw check
```

Features: dashboard, accounts, transfers, bill-pay, cards, statements, alerts, profile, messages,
rewards, onboarding, help, disclosures, errors. Each is a lazy module behind `LazyModuleGuard`
where entitlement matters (transfers, bill-pay, cards) and `FeatureFlagGuard` where Semaphore
gates it (rewards, messages, onboarding).

## Things that get asked every quarter

- Why session storage for tokens? GIS-STD-021. Local storage survives the tab and the shared
  branch kiosks were the incident (INC-2021-1140).
- Why does the idle timeout not use a library? It did (`ng-idle`), it disagreed with zone.js after
  a patch bump, and rewriting it on RxJS timers took an afternoon. `core/session/idle-timeout.service.ts`.
- Why is MFA step-up on transfers by amount and not always? Regulation and customer complaints,
  in that order. The threshold is runtime config (`transfers.mfaStepUpThresholdMinor`) and the
  claim age is ten minutes (`mfaMaxAgeSeconds`). `MfaStepUpGuard`.
- Why is the Iris chat widget not here? MOL-3410, it is its own repo and loads from the CDN.
- Why no flex-layout? It was end of life with Angular 14. MOL-4471 replaced every `fxLayout`/
  `fxFlex`/`fxLayoutGap`/`fxLayoutAlign` with the `mol-*` utility classes in
  `src/styles/_layout.scss` (responsive `.lt-md` variants are media queries at the estate `md`
  breakpoint). The pixel-level evidence is in
  `docs/upgrade/MOL-4471/14-to-15/flex-layout-visual/`.
