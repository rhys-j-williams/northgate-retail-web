// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Spec discovery and the coverage denominator are both driven by `test.options.include` in
// angular.json (`**/*.spec.ts` plus `app/**/*.ts`). The Angular 15 Karma builder disables webpack's
// `require.context`, so every source file under app/ is added as an entry point instead of being
// required from here; files without a spec still count towards coverage (MOL-2911). Module files
// are safe to include; nothing bootstraps. Keep this in step with codeCoverageExclude.
