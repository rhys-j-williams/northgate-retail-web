# Changelog

Notable changes to Northgate Online (`northgate-retail-web`). The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/); releases are named after the train that
shipped them (`release/2026.MM`, tags `vYYYY.MM.n`). Entries reference MOL tickets. Started with
MOL-4471; earlier trains are recorded in the release notes on the `CSWT-REL` wiki space.

## [Unreleased]

### Changed
- Angular 14.3.0 -> 15.2.10, Angular CLI 15.2.11, Angular Material / CDK 15.2.9 with the MDC
  components (`mdc-migration` applied to every component), TypeScript 4.9.5, zone.js 0.12.0, NgRx
  15.4.0, `angular-oauth2-oidc` 15.0.1, `ngx-cookie-service` 15.0.0, `ngx-mask` 15.2.3
  (`provideEnvironmentNgxMask`), angular-eslint 15.2.1. Node stays 16.20.2. One major only; 16 is a
  separate hop (MOL-4471, ADR 0015 supersedes ADR 0014).
- `@northgate/canopy-ui` 3.7.2 -> 4.0.0 (Angular 15 / MDC) and `@northgate/lantern-sdk` 2.4.1 ->
  5.0.0 (partial Ivy), pinned exactly (MOL-4471, CNPY-2140, LNTN-401).
- Page layout no longer uses `@angular/flex-layout`: 724 `fxLayout*` / `fxFlex*` usages in 95
  templates replaced by the `mol-flex-*` / `mol-gap-*` / `mol-justify-*` / `mol-align-*` utilities in
  `src/styles/_layout.scss` (responsive `.lt-md` -> `max-width: 959.98px`) and a component-owned
  card grid. Visual evidence for every route at 1280x800 and 375x812 in
  `docs/upgrade/MOL-4471/14-to-15/flex-layout-visual/` (sign-off KAN-30) (MOL-4471).
- Karma spec discovery and the whole-`app/` coverage denominator (MOL-2911) moved from
  `require.context` in `src/test.ts` to `test.options.include` in `angular.json` (MOL-4471).
- `relativeLinkResolution: 'legacy'` removed from the router config (removed in Angular 15; the
  two relative navigations in the app behave identically under the default) (MOL-4471).

### Removed
- `@angular/flex-layout` dependency and `FlexLayoutModule` (MOL-4471).
- `postinstall` `ngcc` step: no View Engine package remains after Lantern 5.0.0 (proof in
  `docs/upgrade/MOL-4471/14-to-15/logs/ngcc-proof.txt`) (MOL-4471).
- `.npmrc` `legacy-peer-deps=true` (MOL-3611); it existed only for flex-layout's exact Angular 14.0
  peer and strict peer resolution now works (MOL-4471).

### Known
- Initial bundle 2.27 MB raw exceeds the 2 MB warning budget (was 2.05 MB on Angular 14); the
  error budget is not reached and the budget is unchanged pending a decision (MOL-4471).
- `npm audit` full tree shows three new dev-only Angular CLI 15 advisories
  (GHSA-52v5-jr5w-gjxr, GHSA-73wf-gq98-2v4g, GHSA-c83g-rgw3-j3cx) under GIS decision KAN-32 /
  KAN-37; no new production advisory (MOL-4471).
- No Iris widget host integration exists in source despite `docs/architecture.md` (KAN-42); the
  Angular 15 host was shown to mount the Iris 15 build when injected (MOL-4471).
