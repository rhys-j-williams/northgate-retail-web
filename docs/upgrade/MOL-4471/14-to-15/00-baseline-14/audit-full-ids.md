| Advisory | Severity | Package | Title | Vulnerable range |
|---|---|---|---|---|
| GHSA-23c5-xmqv-rm74 | high | minimatch | minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions | `>=5.0.0 <5.1.8` |
| GHSA-23hp-3jrh-7fpw | critical | tar | node-tar: Decompression/parse DoS via unlimited input | `<=7.5.18` |
| GHSA-2g4f-4pwh-qvx6 | moderate | ajv | ajv has ReDoS when using `$data` option | `>=7.0.0-alpha.0 <8.18.0` |
| GHSA-34x7-hfp2-rc4v | high | tar | node-tar Vulnerable to Arbitrary File Creation/Overwrite via Hardlink Path Traversal | `<7.5.7` |
| GHSA-37ch-88jc-xwx2 | high | path-to-regexp | path-to-regexp vulnerable to Regular Expression Denial of Service via multiple route parameters | `<0.1.13` |
| GHSA-38r7-794h-5758 | low | webpack | webpack buildHttp HttpUriPlugin allowedUris bypass via HTTP redirects → SSRF + cache persistence | `>=5.49.0 <5.104.0` |
| GHSA-39pv-4j6c-2g6v | high | @angular/common | @angular/common: Weak 32-Bit Cache Key Hashing in `HttpTransferCache` Leading to Cross-Request Data Leakage and State Poisoning | `<=19.2.25` |
| GHSA-3ppc-4f35-3m26 | high | minimatch | minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern | `>=5.0.0 <5.1.7` |
| GHSA-3rfm-jhwj-7488 | high | loader-utils | loader-utils is vulnerable to Regular Expression Denial of Service (ReDoS) via url variable | `>=2.0.0 <2.0.4` |
| GHSA-48r7-hpm6-gfxm | high | @angular/common | @angular/common: Denial of Service (DoS) via OOM in Date Formatting (formatDate) | `<=19.2.25` |
| GHSA-4mjr-xmp4-gh2g | moderate | qs | qs: Denial of Service via Attacker Controlled isBuffer | `>=2.2.5 <6.16.0` |
| GHSA-4v9v-hfq4-rm2v | moderate | webpack-dev-server | webpack-dev-server users' source code may be stolen when they access a malicious web site | `<=5.2.0` |
| GHSA-4vvj-4cpr-p986 | moderate | webpack | Webpack's AutoPublicPathRuntimeModule has a DOM Clobbering Gadget that leads to XSS | `>=5.0.0-alpha.0 <5.94.0` |
| GHSA-4x5r-pxfx-6jf8 | low | @babel/core | @babel/core: Arbitrary File Read via sourceMappingURL Comment | `<=7.29.0` |
| GHSA-52f5-9888-hmc6 | low | tmp | tmp allows arbitrary temporary file / directory write via symbolic link `dir` parameter | `<=0.2.3` |
| GHSA-58c5-g7wp-6w37 | high | @angular/common | Angular is Vulnerable to XSRF Token Leakage via Protocol-Relative URLs in Angular HTTP Client | `<19.2.16` |
| GHSA-58w9-8g37-x9v5 | moderate | @angular/compiler | @angular/compiler: Two-Way Property Binding Sanitization Bypass (XSS) | `<=19.2.25` |
| GHSA-5c6j-r48x-rmvq | high | serialize-javascript | Serialize JavaScript is Vulnerable to RCE via RegExp.flags and Date.prototype.toISOString() | `<=7.0.2` |
| GHSA-5p2g-fcmc-qvqq | high | image-size | image-size: JXL and HEIF parsers allow denial of service through infinite loops | `<=2.0.2` |
| GHSA-67mh-4wv8-2f99 | moderate | esbuild | esbuild enables any website to send any requests to the development server and read the response | `<=0.24.2` |
| GHSA-692r-grfm-v8x7 | moderate | @angular/core | @angular/core: Angular Template and Dynamic Component Namespace Bypass leading to Cross-Site Scripting (XSS) | `<=18.2.14` |
| GHSA-6g55-p6wh-862q | high | postcss | PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments | `<=8.5.11` |
| GHSA-6rw7-vpxm-498p | moderate | qs | qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion | `<6.14.1` |
| GHSA-72xf-g2v4-qvf3 | moderate | tough-cookie | tough-cookie Prototype Pollution vulnerability | `<4.1.3` |
| GHSA-776f-qx25-q3cc | moderate | xml2js | xml2js is vulnerable to prototype pollution | `<0.5.0` |
| GHSA-79cf-xcqc-c78w | moderate | webpack-dev-server | webpack-dev-server vulnerable to cross-origin source code exposure on non-HTTPS origins | `<=5.2.3` |
| GHSA-7r86-cg39-jmmj | high | minimatch | minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments | `>=5.0.0 <5.1.8` |
| GHSA-83g3-92jg-28cx | high | tar | Arbitrary File Read/Write via Hardlink Target Escape Through Symlink Chain in node-tar Extraction | `<7.5.8` |
| GHSA-8fgc-7cc6-rx7x | low | webpack | webpack buildHttp: allowedUris allow-list bypass via URL userinfo (@) leading to build-time SSRF behavior | `>=5.49.0 <=5.104.0` |
| GHSA-8qq5-rm4j-mr97 | high | tar | node-tar is Vulnerable to Arbitrary File Overwrite and Symlink Poisoning via Insufficient Path Sanitization | `<=7.5.2` |
| GHSA-8x88-c5mf-7j5w | high | tar | node-tar: Negative tar entry size causes infinite loop in archive replace | `<=7.5.17` |
| GHSA-95qp-cmmw-mgqv | moderate | @angular/service-worker | @angular/service-worker: Request Credential & Cache Policy Stripping | `<=18.2.14` |
| GHSA-968p-4wvh-cqc8 | moderate | @babel/runtime | Babel has inefficient RegExp complexity in generated code with .replace when transpiling named capturing groups | `<7.26.10` |
| GHSA-9jgg-88mc-972h | moderate | webpack-dev-server | webpack-dev-server users' source code may be stolen when they access a malicious web site with non-Chromium based browser | `<=5.2.0` |
| GHSA-9ppj-qmqm-q256 | high | tar | node-tar Symlink Path Traversal via Drive-Relative Linkpath | `<=7.5.10` |
| GHSA-9wv6-86v2-598j | high | path-to-regexp | path-to-regexp outputs backtracking regular expressions | `<0.1.10` |
| GHSA-cm22-4g7w-348p | low | serve-static | serve-static vulnerable to template injection that can lead to XSS | `<1.16.0` |
| GHSA-f3m7-gqxr-g87x | moderate | @angular/compiler | Angular: Template and Attribute Namespace Sanitization Bypass (XSS) | `<=18.2.14` |
| GHSA-f5vj-f2hx-8m93 | moderate | webpack-dev-server | webpack-dev-server vulnerable to cross-site request forgery via internal developer endpoints | `<=5.2.5` |
| GHSA-fjxv-7rqg-78g4 | critical | form-data | form-data uses unsafe random function in form-data for choosing boundary | `<2.5.4` |
| GHSA-fxqj-rqcc-2cmp | moderate | postcss | PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset | `<=8.5.22` |
| GHSA-gv2q-mqqv-365m | moderate | @angular/service-worker | Angular Service Worker Policy-Bypass & Credential-Stripping Vulnerabilities | `<=18.2.14` |
| GHSA-gvwx-54wh-qm9j | moderate | tar | node-tar: Uncaught Exception DoS via NUL byte in PAX path/linkpath records | `<=7.5.16` |
| GHSA-hhq3-ff78-jv3g | high | loader-utils | loader-utils is vulnerable to Regular Expression Denial of Service (ReDoS) | `>=2.0.0 <2.0.4` |
| GHSA-hmw2-7cc7-3qxx | high | form-data | form-data: CRLF injection in form-data via unescaped multipart field names and filenames | `<2.5.6` |
| GHSA-jhpw-976m-542j | high | @angular/common | Angular: Cache-Key Ambiguity in HttpTransferCache Leading to Cross-Request Response Reuse and State Poisoning | `<=19.2.25` |
| GHSA-jj27-h5hq-8x99 | high | @angular/compiler | Angular i18n: Cross-Site Scripting (XSS) via event-handler attributes | `<=19.2.25` |
| GHSA-jrmj-c5cx-3cw6 | high | @angular/compiler | Angular has XSS Vulnerability via Unsanitized SVG Script Attributes | `<=18.2.14` |
| GHSA-m28w-2pqf-7qgj | moderate | webpack-dev-server | webpack-dev-server vulnerable to denial of service via a malformed Host or Origin header | `<=5.2.5` |
| GHSA-m6fv-jmcg-4jfg | low | send | send vulnerable to template injection that can lead to XSS | `<0.19.0` |
| GHSA-mx8g-39q3-5c79 | moderate | webpack-dev-server | webpack-dev-server vulnerable to HMR WebSocket interception via permissive user proxies | `<5.2.5` |
| GHSA-p3vc-36g9-x9gr | high | @angular/common | @angular/common: Denial of Service (DoS) via OOM in Number Formatting (digitsInfo) | `<=18.2.14` |
| GHSA-p8p7-x288-28g6 | moderate | request | Server-Side Request Forgery in Request | `<=2.88.2` |
| GHSA-ph9p-34f9-6g65 | high | tmp | tmp has Path Traversal via unsanitized prefix/postfix that enables directory escape | `<0.2.6` |
| GHSA-prjf-86w9-mfqv | high | @angular/core | Angular i18n vulnerable to Cross-Site Scripting | `<=18.2.14` |
| GHSA-pxg6-pf52-xh8x | low | cookie | cookie accepts cookie name, path, and domain with out of bounds characters | `<0.7.0` |
| GHSA-q6f4-qqrg-jv6x | high | @angular/common | @angular/common: Information Leak via Default Caching of Credentialed Requests in HttpTransferCache | `<=18.2.14` |
| GHSA-qffp-2rhf-9h96 | high | tar | tar has Hardlink Path Traversal via Drive-Relative Linkpath | `<=7.5.9` |
| GHSA-qj8w-gfj5-8c6v | moderate | serialize-javascript | Serialize JavaScript has CPU Exhaustion Denial of Service via crafted array-like objects | `>=5.0.0 <7.0.5` |
| GHSA-qw6h-vgh9-j6wx | low | express | express vulnerable to XSS via response.redirect() | `<4.20.0` |
| GHSA-qwcr-r2fm-qrc7 | high | body-parser | body-parser vulnerable to denial of service when url encoding is enabled | `<1.20.3` |
| GHSA-qx2v-qp2m-jg93 | moderate | postcss | PostCSS has XSS via Unescaped </style> in its CSS Stringify Output | `<8.5.10` |
| GHSA-qxh6-94w6-9r5p | high | @angular/service-worker | @angular/service-worker: Sensitive Header Leakage on Cross-Origin Redirects in Angular Service Worker | `<=19.2.25` |
| GHSA-r28c-9q8g-f849 | high | postcss | PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure | `<=8.5.17` |
| GHSA-r292-9mhp-454m | high | tar | node-tar: Uncontrolled recursion in mapHas/filesFilter allows uncatchable stack-overflow DoS via crafted long-path tar with member selection | `<=7.5.20` |
| GHSA-r6q2-hw4h-h46w | high | tar | Race Condition in node-tar Path Reservations via Unicode Ligature Collisions on macOS APFS | `<=7.5.3` |
| GHSA-rgjc-h3x7-9mwg | high | @angular/core | Angular Client Hydration DOM Clobbering & Response-Cache Poisoning | `<=19.2.25` |
| GHSA-rhx6-c78j-4q9w | high | path-to-regexp | path-to-regexp contains a ReDoS | `<0.1.12` |
| GHSA-rv95-896h-c2vc | moderate | express | Express.js Open Redirect in malformed URLs | `<4.19.2` |
| GHSA-v422-hmwv-36x6 | low | body-parser | body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement | `<1.20.6` |
| GHSA-v4hv-rgfq-gp49 | high | @angular/compiler | Angular Stored XSS Vulnerability via SVG Animation, SVG URL and MathML Attributes | `<=18.2.14` |
| GHSA-vmf3-w455-68vh | moderate | tar | node-tar applies PAX size override to intermediary GNU long-name/long-link headers, causing tar parser interpretation differential (file smuggling) | `<=7.5.15` |
| GHSA-vwc7-r8mq-g2x9 | moderate | adm-zip | adm-zip extraction follows destination symlinks, allowing arbitrary file overwrite | `>=0.5.9 <=0.6.0` |
| GHSA-w3rx-r6r6-pgpr | high | image-size | image-size: ICNS parser allows denial of service through an infinite loop | `<=2.0.2` |
| GHSA-w4pp-8pjf-rmxw | high | pacote | pacote is vulnerable to Denial of Service (DoS) via the addGitSha function | `>=11.2.7 <21.5.1` |
| GHSA-w5hq-g745-h8pq | moderate | uuid | uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided | `<11.1.1` |
| GHSA-w7fw-mjwx-w883 | low | qs | qs's arrayLimit bypass in comma parsing allows denial of service | `>=6.7.0 <=6.14.1` |
| GHSA-w8wr-v893-vjvp | moderate | tar | node-tar: Process crash via PAX numeric path type confusion | `<=7.5.17` |
| GHSA-wr3j-pwj9-hqq6 | high | webpack-dev-middleware | Path traversal in webpack-dev-middleware | `<=5.3.3` |
| GHSA-x9g3-xrwr-cwfg | high | piscina | piscina: Prototype Pollution Gadget → RCE via inherited options.filename | `<=4.9.2` |
| GHSA-xcpc-8h2w-3j85 | high | adm-zip | adm-zip: Crafted ZIP file triggers 4GB memory allocation | `<0.6.0` |
| GHSA-xvch-5gv4-984h | critical | minimist | Prototype Pollution in minimist | `>=1.0.0 <1.2.6` |

Totals: 62 (critical 7, high 29, moderate 17, low 9, info 0); unique advisory ids: 82
