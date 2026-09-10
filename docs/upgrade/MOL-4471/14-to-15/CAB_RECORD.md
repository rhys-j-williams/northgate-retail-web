<!-- Generated with AI assistance (AIT-014) on 2026-09-10; reviewed by <handle>. -->
# CAB record (draft): MOL-4471 northgate-retail-web Angular 14 -> 15

Status: **DRAFT, not submitted.** Fill `CHG` reference and train at submission. Blocked on KAN-23
(libraries not on Artifactory), KAN-25 (transfers / bill-pay coverage), KAN-30 (flex-layout visual
sign-off) before this change can be scheduled. Sections follow the LNTN-401 CAB record.

## 1. Change

| | |
|---|---|
| CHG reference | _TBD_ |
| Release train | _TBD_ (earliest: the train after Canopy 4.0.0 / Lantern 5.0.0 reach Artifactory; see `RELEASE_CALENDAR.md`) |
| Jira | MOL-4471 (mirror KAN-23) |
| Repository / branch | `rhys-j-williams/northgate-retail-web`, `feature/MOL-4471-angular-14-to-15` -> `develop` |
| Type | Framework upgrade, Tier 1 consumer web application, no API or data change |
| Summary | Angular 14.3.0 -> 15.2.10, Material/CDK 14.2.7 -> 15.2.9 (MDC components), `@northgate/canopy-ui` 3.7.2 -> 4.0.0, `@northgate/lantern-sdk` 2.4.1 -> 5.0.0, NgRx 15.4.0, TypeScript 4.9.5, zone.js 0.12.0; `@angular/flex-layout` removed (724 usages in 95 templates replaced by CSS utilities); `ngcc` `postinstall` and `legacy-peer-deps` removed. Node 16.20.2 unchanged. |
| Standard | GIS-STD-022 `FRAMEWORK_SUPPORT_STANDARD.md` (TR-1188 ceiling 2026.11), `DEPENDENCY_POLICY.md` |
| ADR | `docs/adr/0015-angular-14-to-15.md` supersedes `0014-defer-angular-upgrade-2024.md` |
| Evidence | `docs/upgrade/MOL-4471/14-to-15/` (REPORT.md, CONSUMERS.md, logs/, flex-layout-visual/, iris-host-check/) |

## 2. Risk

| | |
|---|---|
| Rating | **Medium** |
| Blast radius | Every Northgate Online screen: the shell (Canopy 4 `cn-page-shell`, MDC dialogs/form fields/paginator), all 64 routed pages (layout now CSS classes instead of flex-layout directives), transfers and bill pay included. No BFF, Keystone, Lantern data contract or service-worker manifest change. |
| Customer journeys | Login (OIDC PKCE, `angular-oauth2-oidc` 15.0.1), accounts and transactions, transfers (incl. MFA step-up), bill pay, cards, alerts, help, profile. Journeys were exercised by the estate smoke (20/20) and by rendering all 64 routes at two viewports against the mock estate. |
| Feature flag | none (framework-wide; cannot be flagged) |
| Visual change | Yes, in two classes: (a) Angular Material MDC and Canopy 4 component rendering (heights, paddings, chip/button/field intrinsic widths), reviewed under KAN-31 for Canopy and classified per page in `flex-layout-visual/diff/SUMMARY.md` (codes M, C, W, H); (b) flex-layout -> CSS conversion, 0 unexplained differences across 128 page pairs and 2,589 computed-style checks, **sign-off pending in KAN-30**. |
| Accessibility | No template semantics changed by the conversion (layout attributes -> classes only); MDC components carry Material 15 a11y behaviour (focus rings, ripple, announcer) which differs from legacy Material. A keyboard/focus-order pass on transfers, bill pay and the idle-warning dialog is recommended before UAT (PR template item). |
| Performance | Initial bundle 2.05 MB -> 2.27 MB raw (398 -> 411 kB transfer). Warning budget already exceeded on 14 (by 54 kB), now by 274.86 kB; error budget (3 MB) not reached, budget unchanged. Decision needed (REPORT.md section 10 item 1). |
| Security | No new production advisory id. 3 new dev-only ids from the Angular CLI 15 toolchain (KAN-32 / KAN-37). CSP unchanged. Lantern GIS-1471 privacy rules untouched (Lantern 5.0.0 consumed through its public API only, `LanternModule.forRoot` config unchanged). |
| Compliance | KAN-25: transfers (9.09% lines) and bill-pay (14.20%) coverage unchanged; their `.ts`/routing were not modified, only template layout attributes. |

## 3. Pre-conditions

1. `@northgate/canopy-ui@4.0.0` and `@northgate/lantern-sdk@5.0.0` published to Artifactory from the
   merged Canopy PR #3 (CNPY-2140) and Lantern PR #6 (LNTN-401). **Currently only on the sub-agent
   VM's Verdaccio (KAN-23 waiver).** The lockfile resolves them from `http://localhost:4873/`; the
   Jenkins `.npmrc` registry rewrite must resolve the same integrity hashes, otherwise re-lock on the
   VLAN as a follow-up commit before merge.
2. KAN-30 visual sign-off recorded in Jira.
3. KAN-25 decision recorded (accept the gap for a framework hop that does not touch forms/router
   logic, or gate on a coverage story).
4. Bundle budget decision (increase warning, or accept the warning as is).

## 4. Deployment

Standard `northgateNodePipeline` build from `develop` after merge; image + chart unchanged in shape.
Node 16.20.2 (`.nvmrc`) unchanged so no agent label change. UAT deploy Monday of the train, smoke via
`mock-external/smoke.sh` equivalent on UAT (login, dashboard, transfers, bill pay, cards, help), and
the Iris host check is **not applicable** until KAN-42 lands vendoring (Iris is not served by
retail-web today).

## 5. Rollback

Revert the merge commit on `develop` (single commit) and redeploy the previous image from the train.
No data, storage, service-worker schema (`ngsw-config.json` unchanged) or API migration is involved,
so "revert the commit" is sufficient. `package-lock.json` reverts with it, restoring Canopy 3.7.2 /
Lantern 2.4.1 (still on Artifactory), `legacy-peer-deps=true` and the `ngcc` `postinstall`. Runbook:
`docs/runbooks/rollback-failed-deploy.md`.

## 6. Carried findings (npm audit)

Baseline: `00-baseline-14/audit-full-ids.md` (82 ids), `00-baseline-14/audit-prod-ids.md` (21 ids).
After: `audit-full-ids.md` (81 ids), `audit-prod-ids.md` (18 ids). No `overrides` added; existing
`minimist` / `loader-utils` overrides (GIS-2207) unchanged.

| set | new vs baseline | resolved | carried | reference |
|---|---|---|---|---|
| production (`npm audit --production`) | **0** | 3 (`minimatch` 5.x ReDoS: GHSA-23c5-xmqv-rm74, GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj) | 18: Angular `@angular/common|compiler|core <=19.2.x` advisories (fix versions >= 17/19, outside the one-major rule, GIS-2207 compensating controls), `@ngrx` peers of the same, transitive `tslib`/`rxjs`-adjacent ids already accepted on 14 | GIS-2207, KAN-23 |
| full tree (`npm audit`) | **3**, dev-only: GHSA-52v5-jr5w-gjxr (`sigstore` via `@angular/cli` -> `pacote`), GHSA-73wf-gq98-2v4g and GHSA-c83g-rgw3-j3cx (`browserslist` via `@angular-devkit/build-angular`) | 4 (the three `minimatch` ids + GHSA-wr3j-pwj9-hqq6 `webpack-dev-middleware`) | 78 dev-tooling ids carried from 14 (webpack 5.x, `@babel/*`, `tar`, `path-to-regexp`, `express` under `webpack-dev-server`, Karma/Jasmine tooling) | KAN-32 / KAN-37 (GIS decision on Angular-CLI-15 tooling ids), GIS-2207 |

Path counts rose (62 -> 81 full, 7 -> 23 prod) because strict peer resolution (no
`legacy-peer-deps`) attributes each `@angular/core` advisory to every dependant that peers on it;
the unique-id measure used by `DEPENDENCY_POLICY.md` is what is compared above.

## 7. Verification evidence

| gate | result | evidence |
|---|---|---|
| `npm ci` clean, strict peers, no ngcc | pass | `logs/npm-ci-clean-no-ngcc.log`, `logs/ngcc-proof.txt` |
| `npm run build:prod` | pass (budget warning, see 2) | `logs/build-prod.log`, `logs/bundle-sizes.txt` |
| `npm run lint` | 0 errors / 2 pre-existing warnings | `logs/lint.log` |
| `npm run test:ci` | 196/198 (2 skipped as on 14), 36.19% lines >= 30% threshold | `logs/test-ci.log`, `logs/coverage-by-module.md` |
| `npm audit`, `--production` | see 6 | `logs/audit-*.txt`, `audit-*-ids.md` |
| `ng version`, `npm ls --depth=0` | 15.2.10 / CLI 15.2.11 / TS 4.9.5 / Node 16.20.2; tree valid | `logs/ng-version.log`, `logs/npm-ls.log` |
| estate smoke | 20 pass / 0 fail / 0 skip | `logs/estate-smoke.log`, `CONSUMERS.md` |
| `verify-estate.sh --quick retail-web` | 10 pass / 0 fail / 2 skip | `logs/verify-estate-quick.log` |
| flex-layout inventory after | 0 usages, dependency and lockfile entries gone | `flex-layout-removal/flex-layout-inventory-after.md` |
| flex-layout visual diff | 128 pairs, 0 unexplained; **KAN-30 sign-off pending** | `flex-layout-visual/diff/SUMMARY.md` |
| Iris host check | Stage 2 Iris scratch build mounts in the Angular 15 host when injected; no mount in source (KAN-42) | `iris-host-check/`, `CONSUMERS.md` |

## 8. Coverage for the KAN-25 record

| module | lines before | lines after |
|---|---|---|
| `src/app/features/transfers` | 32 / 352 (9.09%) | 32 / 352 (9.09%) |
| `src/app/features/bill-pay` | 23 / 162 (14.20%) | 23 / 162 (14.20%) |
| whole application | 1057 / 2920 (36.19%) | 1057 / 2920 (36.19%) |

Threshold (`karma.conf.js`, Sonar gate) 30% lines: met before and after; threshold not changed.

## 9. AI-assisted content

Prepared with AI assistance under AIT-014 (`AI_ASSISTED_CODE_POLICY.md`). Scope: all files on the
branch (`package.json`, lockfile, `angular.json`, `tsconfig.json`, `.npmrc`, `src/**` template/style
/ module edits, `docs/**`, `CHANGELOG.md`, `README.md`). Commit trailers are present from `9e58592`
onwards; earlier milestone commits carry only `Co-Authored-By` (REPORT.md section 10 item 2). The
branch exceeds 400 changed lines so policy 4.3 applies: two reviewers or two review sessions, one
of them from `retail-digital` code owners, `@northgate/gis-appsec` for `src/index.html`/CSP-adjacent
and audit-related content.

## 10. Approvals

| role | name | date |
|---|---|---|
| Change owner (retail-digital) | | |
| Reviewer 1 | | |
| Reviewer 2 (policy 4.3) | | |
| GIS AppSec (KAN-32 / audit) | | |
| KAN-30 visual sign-off | | |
| KAN-25 compliance decision | | |
