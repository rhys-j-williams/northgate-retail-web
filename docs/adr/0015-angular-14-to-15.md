<!-- Generated with AI assistance (AIT-014) on 2026-09-10; reviewed by <handle>. -->
# ADR 0015: Angular 14 -> 15 (Canopy 4, Lantern 5, flex-layout removal, ngcc removal)

Status: Proposed (supersedes ADR 0014; becomes Accepted when MOL-4471 merges)
Date: 2026-09-10
Deciders: retail-digital lead, CSWT Architecture, GIS AppSec (KAN-32), design system (KAN-30/KAN-31)
Tickets: MOL-4471 (epic), KAN-23 (estate Stage 3 mirror and registry waiver), KAN-25, KAN-30, KAN-42; GIS-STD-022 / TR-1188

## Context

ADR 0014 (June 2024) deferred the Angular 15+ upgrade because five things stood in the way: Canopy
had no Angular 15 release, `@angular/flex-layout` was end of life in over a hundred templates,
Lantern SDK 2.x was View Engine and needed `ngcc`, transfers and bill pay had thin tests, and a
long tail of small removals. Its 2026-01 update records that TR-1188 reaches the thirty-six month
ceiling in GIS-STD-022 with the 2026.11 train and that MOL-4471 was unparked, with Lantern first,
then Canopy 4 alongside business-web, then flex-layout with visual regression, then the framework.

By September 2026 the first two are in place as open pull requests on their own repositories
(PLAT-2610 split): Canopy 4.0.0 (`northgate-canopy-ui` PR #3, CNPY-2140, Angular 15 / MDC, partial
Ivy) and Lantern 5.0.0 (`northgate-lantern-sdk` PR #6, LNTN-401, partial Ivy, `^15` peers). Both are
published to the Stage 3 VM's Verdaccio only; the KAN-23 waiver lets Stage 3 branches be prepared
against them before they reach Artifactory. Architecture's roadmap target is the current major, but
`FRAMEWORK_SUPPORT_STANDARD.md` and the estate playbook require one major per hop with a full gate
set and an app never newer than the libraries it pins.

## Decision

Move Northgate Online from Angular 14.3.0 to **Angular 15.2.10** (Material/CDK 15.2.9 with the MDC
components, TypeScript 4.9.5, zone.js 0.12.0, NgRx 15.4.0, angular-eslint 15.2.1) on Node 16.20.2,
as a single feature branch (`feature/MOL-4471-angular-14-to-15`) with one milestone per commit:

1. Pin `@northgate/canopy-ui` **4.0.0** and `@northgate/lantern-sdk` **5.0.0** exactly, as this
   repository's own change (they declare `^15` peers, so the pin commits precede the framework hop
   on the same branch).
2. `ng update` to 15 (core, CLI, angular-eslint), Material 15 plus the `mdc-migration` schematic
   for every component, the Canopy 4 `canopy-4-theme-mixin` schematic (no local typography
   overrides, nothing to rewrite), NgRx and the three third-party Angular packages.
3. Replace every `@angular/flex-layout` directive (724 usages in 95 templates, 101 responsive
   `.lt-md`) with plain CSS: a small set of `mol-flex-*` / `mol-gap-*` / `mol-justify-*` / `mol-align-*`
   utilities in `src/styles/_layout.scss` (breakpoint `max-width: 959.98px`, the flex-layout `lt-md`
   query) and one component stylesheet for the `fxLayoutGap="16px grid"` card grid; remove
   `FlexLayoutModule` and the dependency. Evidence for the human sign-off is 128 before/after
   full-page screenshot pairs with pixel diffs and computed-style checks (0 unexplained), decided in
   **KAN-30**, not here.
4. Remove the `postinstall` `ngcc` step once a clean install proves no View Engine package remains
   (0 `*.metadata.json`, 0 `__ivy_ngcc__`, ngcc dry run a no-op), and remove `.npmrc`
   `legacy-peer-deps`, which existed only for flex-layout's exact Angular 14.0 peer.
5. **Stop at 15.** 15 -> 16 is a separate hop with its own baseline, ADR and CAB; nothing on this
   branch targets 16 (no standalone migration, no `provideRouter`, no esbuild builder).

Constraints honoured: Canopy is used only through its public entry points (canopy-ui ADR-0004);
Lantern's GIS-1471 privacy configuration is untouched; transfers and bill-pay source is changed only
by the mechanical template conversion (their `.ts`, routing and coverage, 9.09% and 14.20% lines, are
unchanged) because the coverage gap is a compliance decision in **KAN-25**; no coverage threshold,
bundle budget or `npm audit` override is changed.

## Consequences

- Angular 14 leaves the estate for this application; the GIS-2207 "framework out of vendor support"
  finding narrows to Angular 15 (also out of LTS) as an intermediate position under TR-1188 until the
  16+ hops land.
- The `ngcc` install step is gone, which was the one hard install-time blocker ADR 0014 named for
  Angular 16; the remaining 16 items (`CanLoad` -> `canMatch`, `zone.js/dist/zone` import,
  `toPromise`) are logged in `docs/upgrade/MOL-4471/14-to-15/deprecations.log`.
- Layout is now application-owned CSS; new templates use the `mol-*` utilities or component styles,
  never a layout directive library.
- Visual change lands in two forms at once: the flex-layout conversion (evidenced, KAN-30) and the
  Material MDC / Canopy 4 re-render (KAN-31 for Canopy). Both are classified per page in
  `flex-layout-visual/diff/SUMMARY.md` so reviewers can tell them apart.
- Initial bundle grows from 2.05 MB to 2.27 MB raw (398 -> 411 kB transfer); the 2 MB warning
  budget, already exceeded on 14, is exceeded further and needs a decision (budget vs trimming).
- The lockfile resolves Canopy 4.0.0 and Lantern 5.0.0 from Verdaccio; the branch cannot merge
  until both are on Artifactory (KAN-23) and, if the tarball hashes differ, is re-locked there.
- retail-web still has no Iris host integration in source (KAN-42): neither the CDN mount ADR 0013
  / `docs/architecture.md` describe nor the MOL-4133 manifest vendoring exists. The Stage 2 Iris
  build was shown to mount in the Angular 15 host when injected, so KAN-42 is an integration story,
  not an upgrade blocker.
- Twelve of the branch's milestone commits predate the `AI-Assisted: AIT-014` trailer being added;
  the PR carries the policy's **AI-assisted content** section and the reviewers decide whether the
  trailers are rebased in before merge.

ADR 0014 stays in the directory as the record of why the upgrade waited two years; its status is
changed to Superseded by this ADR.

Full evidence: `docs/upgrade/MOL-4471/14-to-15/REPORT.md`, `CAB_RECORD.md`, `CONSUMERS.md`,
`docs/upgrade/MOL-4471/COMPATIBILITY_MATRIX.md`.
