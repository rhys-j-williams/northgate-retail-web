# Flex-layout visual baseline - route/template coverage

Generated from `00-baseline-14/flex-layout-inventory.json` (95 templates, 724 usages) and `manifest.json` (128 screenshots, 0 failed).

* Templates rendered by at least one captured route: **83**
* Templates whose only route redirected away (not rendered): **1**
* Templates not reachable at runtime (no route/dialog/host renders the selector): **11**

Each captured route exists at 1280x800 and 375x812 (`<id>--<w>x<h>.png`). Route ids are the `id` column of `capture.js`.

| Template | fx usages | Rendered on route(s) | Screenshot ids | Status |
|---|---:|---|---|---|
| `features/accounts/components/account-detail/account-detail.component.html` | 8 | `/accounts/:accountId` | accounts-detail, accounts-detail-export-dialog | captured |
| `features/accounts/components/account-list/account-list.component.html` | 2 | `/accounts` | accounts | captured |
| `features/accounts/components/dispute-transaction/dispute-transaction.component.html` | 11 | `/accounts/:accountId/transactions/:transactionId/dispute` | accounts-transaction-dispute | captured |
| `features/accounts/components/export-transactions/export-transactions.component.html` | 3 | `dialog from transaction-list.component` | - | NOT REACHABLE - Dialog opened from the transaction list Export button; the local BFF returns 404 for account details so the transaction list (and its Export button) never renders for the fixture customer. |
| `features/accounts/components/interest-summary/interest-summary.component.html` | 2 | `/accounts/:accountId` | accounts-detail, accounts-detail-export-dialog | captured |
| `features/accounts/components/pending-transactions/pending-transactions.component.html` | 4 | `/accounts/:accountId` | accounts-detail, accounts-detail-export-dialog | captured |
| `features/accounts/components/rename-account/rename-account.component.html` | 3 | - | - | NOT REACHABLE |
| `features/accounts/components/routing-details/routing-details.component.html` | 12 | `/accounts/:accountId` | accounts-detail, accounts-detail-export-dialog | captured |
| `features/accounts/components/transaction-detail/transaction-detail.component.html` | 6 | `/accounts/:accountId/transactions/:transactionId` | accounts-transaction-detail | captured |
| `features/accounts/components/transaction-filters/transaction-filters.component.html` | 12 | `/accounts/:accountId` | accounts-detail, accounts-detail-export-dialog | captured |
| `features/accounts/components/transaction-list/transaction-list.component.html` | 3 | `/accounts/:accountId` | accounts-detail, accounts-detail-export-dialog | captured |
| `features/alerts/components/alert-history/alert-history.component.html` | 9 | `/alerts/history` | alerts-history | captured |
| `features/alerts/components/alert-preference-row/alert-preference-row.component.html` | 13 | `/alerts` | alerts | captured |
| `features/alerts/components/alert-preferences/alert-preferences.component.html` | 2 | `/alerts` | alerts | captured |
| `features/alerts/components/alerts-home/alerts-home.component.html` | 2 | `/alerts` | alerts | captured |
| `features/alerts/components/quiet-hours/quiet-hours.component.html` | 7 | `/alerts` | alerts | captured |
| `features/alerts/components/test-alert/test-alert.component.html` | 3 | - | - | NOT REACHABLE |
| `features/bill-pay/components/add-bill-payee/add-bill-payee.component.html` | 16 | `/bill-pay/payees/new` | bill-pay-payees-new | captured |
| `features/bill-pay/components/autopay-settings/autopay-settings.component.html` | 10 | `/bill-pay/bills/:billId/autopay` | bill-pay-autopay | captured |
| `features/bill-pay/components/bill-detail/bill-detail.component.html` | 32 | `/bill-pay/bills/:billId` | bill-pay-bill-detail | captured |
| `features/bill-pay/components/bill-pay-home/bill-pay-home.component.html` | 2 | `/bill-pay` | bill-pay | captured |
| `features/bill-pay/components/cancel-payment/cancel-payment.component.html` | 3 | - | - | NOT REACHABLE |
| `features/bill-pay/components/pay-bill/pay-bill.component.html` | 16 | `/bill-pay/bills/:billId/pay` | bill-pay-pay-bill | captured |
| `features/bill-pay/components/payment-history/payment-history.component.html` | 2 | `/bill-pay/history` | bill-pay-history | captured |
| `features/bill-pay/components/scheduled-payments/scheduled-payments.component.html` | 2 | `/bill-pay/scheduled` | bill-pay-scheduled | captured |
| `features/cards/components/activate-card/activate-card.component.html` | 9 | `/cards/:cardId/activate` | cards-activate | captured |
| `features/cards/components/card-controls/card-controls.component.html` | 11 | `/cards/:cardId/controls` | cards-controls | captured |
| `features/cards/components/card-detail/card-detail.component.html` | 13 | `/cards/:cardId` | cards-detail | captured |
| `features/cards/components/card-list/card-list.component.html` | 15 | `/cards` | cards | captured |
| `features/cards/components/lock-card/lock-card.component.html` | 3 | - | - | NOT REACHABLE |
| `features/cards/components/report-card/report-card.component.html` | 11 | `/cards/:cardId/report` | cards-report | captured |
| `features/cards/components/travel-notice/travel-notice.component.html` | 15 | `/cards/:cardId/travel` | cards-travel | captured |
| `features/dashboard/components/alerts-digest/alerts-digest.component.html` | 5 | `/dashboard` | dashboard | captured |
| `features/dashboard/components/dashboard-overview/dashboard-overview.component.html` | 14 | `/dashboard` | dashboard | captured |
| `features/dashboard/components/promo-banner/promo-banner.component.html` | 7 | `/dashboard` | dashboard | captured |
| `features/dashboard/components/quick-transfer/quick-transfer.component.html` | 5 | `/dashboard` | dashboard | captured |
| `features/dashboard/components/recent-activity/recent-activity.component.html` | 5 | `/dashboard` | dashboard | captured |
| `features/dashboard/components/spending-snapshot/spending-snapshot.component.html` | 7 | `/dashboard` | dashboard | captured |
| `features/dashboard/components/upcoming-payments/upcoming-payments.component.html` | 7 | `/dashboard` | dashboard | captured |
| `features/disclosures/components/disclosure-list/disclosure-list.component.html` | 2 | `/disclosures` | disclosures | captured |
| `features/disclosures/components/disclosure-viewer/disclosure-viewer.component.html` | 2 | `/disclosures/:key` | disclosures-viewer | captured |
| `features/errors/components/forbidden/forbidden.component.html` | 2 | `/forbidden` | errors-forbidden | captured |
| `features/errors/components/generic-error/generic-error.component.html` | 2 | `/error` | errors-generic | captured |
| `features/errors/components/not-found/not-found.component.html` | 2 | `/not-found`, `/**` | errors-not-found, dashboard, accounts, accounts-detail, accounts-detail-export-dialog, accounts-transaction-detail, accounts-transaction-dispute, transfers, transfers-new, transfers-new-review, transfers-confirmation, transfers-history, transfers-detail, transfers-payees, transfers-payees-new, transfers-payee-verify, bill-pay, bill-pay-bill-detail, bill-pay-pay-bill, bill-pay-scheduled, bill-pay-history, bill-pay-payees-new, bill-pay-autopay, cards, cards-detail, cards-controls, cards-report, cards-travel, cards-activate, statements, statements-tax, statements-paperless, statements-viewer, alerts, alerts-history, profile, profile-contact, profile-address, profile-security, profile-security-password, profile-security-username, profile-security-mfa, profile-security-devices, profile-security-activity, messages, messages-new, messages-thread, rewards, rewards-activity, rewards-redeem, help, help-faq, help-contact, disclosures, disclosures-viewer, open-account, open-account-identity, open-account-contact, open-account-product, open-account-funding, open-account-review, errors-forbidden, errors-generic, logged-out | captured |
| `features/help/components/contact-us/contact-us.component.html` | 2 | `/help/contact` | help-contact | captured |
| `features/help/components/faq/faq.component.html` | 2 | `/help/faq` | help-faq | captured |
| `features/help/components/help-home/help-home.component.html` | 2 | `/help` | help | captured |
| `features/messages/components/compose-message/compose-message.component.html` | 15 | `/messages/new` | messages-new | captured |
| `features/messages/components/message-bubble/message-bubble.component.html` | 2 | - | - | NOT REACHABLE |
| `features/messages/components/thread-list/thread-list.component.html` | 2 | `/messages` | messages | captured |
| `features/messages/components/thread-view/thread-view.component.html` | 2 | `/messages/:threadId` | messages-new, messages-thread | captured |
| `features/onboarding/components/contact-step/contact-step.component.html` | 21 | `/open-account/contact` | open-account-contact | captured |
| `features/onboarding/components/funding-step/funding-step.component.html` | 15 | `/open-account/funding` | open-account-funding | captured |
| `features/onboarding/components/identity-step/identity-step.component.html` | 16 | `/open-account/identity` | open-account-identity | captured |
| `features/onboarding/components/onboarding-start/onboarding-start.component.html` | 2 | `/open-account` | open-account | captured |
| `features/onboarding/components/product-step/product-step.component.html` | 13 | `/open-account/product` | open-account-product | captured |
| `features/onboarding/components/review-step/review-step.component.html` | 2 | `/open-account/review` | open-account-review | captured |
| `features/profile/components/address-form/address-form.component.html` | 20 | `/profile/address` | profile-address | captured |
| `features/profile/components/change-password/change-password.component.html` | 8 | `/profile/security/password` | profile-security-password | captured |
| `features/profile/components/change-username/change-username.component.html` | 10 | `/profile/security/username` | profile-security-username | captured |
| `features/profile/components/contact-details/contact-details.component.html` | 15 | `/profile/contact` | profile-contact | captured |
| `features/profile/components/login-history/login-history.component.html` | 2 | `/profile/security/activity` | profile-security-activity | captured |
| `features/profile/components/mfa-settings/mfa-settings.component.html` | 4 | `/profile/security/mfa` | profile-security-mfa | captured |
| `features/profile/components/profile-home/profile-home.component.html` | 20 | `/profile` | profile | captured |
| `features/profile/components/security-settings/security-settings.component.html` | 2 | `/profile/security` | profile-security | captured |
| `features/profile/components/trusted-devices/trusted-devices.component.html` | 7 | `/profile/security/devices` | profile-security-devices | captured |
| `features/rewards/components/redeem-points/redeem-points.component.html` | 11 | `/rewards/redeem` | rewards-redeem | captured |
| `features/rewards/components/rewards-activity/rewards-activity.component.html` | 2 | `/rewards/activity` | rewards-activity | captured |
| `features/rewards/components/rewards-summary/rewards-summary.component.html` | 2 | `/rewards` | rewards | captured |
| `features/statements/components/document-search/document-search.component.html` | 2 | - | - | NOT REACHABLE |
| `features/statements/components/paperless-settings/paperless-settings.component.html` | 11 | `/statements/paperless` | statements-paperless | captured |
| `features/statements/components/statement-list/statement-list.component.html` | 10 | `/statements` | statements | captured |
| `features/statements/components/statement-viewer/statement-viewer.component.html` | 5 | `/statements/:statementId` | statements-tax, statements-paperless, statements-viewer | captured |
| `features/statements/components/tax-documents/tax-documents.component.html` | 7 | `/statements/tax` | statements-tax | captured |
| `features/transfers/components/add-payee/add-payee.component.html` | 20 | `/transfers/payees/new` | transfers-payees-new | captured |
| `features/transfers/components/cancel-transfer/cancel-transfer.component.html` | 3 | - | - | NOT REACHABLE |
| `features/transfers/components/payee-list/payee-list.component.html` | 13 | `/transfers/payees` | transfers-payees | captured |
| `features/transfers/components/scheduled-transfers/scheduled-transfers.component.html` | 2 | `/transfers` | transfers | captured |
| `features/transfers/components/transfer-confirmation/transfer-confirmation.component.html` | 6 | `/transfers/:transferId/confirmation` | transfers-confirmation | captured |
| `features/transfers/components/transfer-detail/transfer-detail.component.html` | 37 | `/transfers/:transferId` | transfers-new, transfers-history, transfers-detail, transfers-payees | captured |
| `features/transfers/components/transfer-details-step/transfer-details-step.component.html` | 15 | `/transfers/new` | transfers-new | captured |
| `features/transfers/components/transfer-history/transfer-history.component.html` | 2 | `/transfers/history` | transfers-history | captured |
| `features/transfers/components/transfer-limits-panel/transfer-limits-panel.component.html` | 2 | `/transfers` | transfers | captured |
| `features/transfers/components/transfer-review-step/transfer-review-step.component.html` | 9 | `/transfers/new/review` | transfers-new-review | REDIRECTED - The review step redirects to /transfers/new when no draft transfer exists in the store; the wizard cannot progress with the local BFF (no accounts resolve), so the step is not renderable here. |
| `features/transfers/components/transfer-schedule-step/transfer-schedule-step.component.html` | 4 | `/transfers/new` | transfers-new | captured |
| `features/transfers/components/transfers-home/transfers-home.component.html` | 11 | `/transfers` | transfers | captured |
| `features/transfers/components/verify-payee/verify-payee.component.html` | 11 | `/transfers/payees/:payeeId/verify` | transfers-payee-verify | captured |
| `shared/components/empty-state/empty-state.component.ts` | 3 | `/accounts`, `/alerts/history`, `/bill-pay`, `/bill-pay/history`, `/bill-pay/scheduled`, `/cards`, `/dashboard`, `/messages`, `/profile/security/activity`, `/profile/security/devices`, `/rewards/activity`, `/statements`, `/statements/tax`, `/transfers/payees`, `/transfers`, `/transfers/history` | accounts, alerts-history, bill-pay, bill-pay-history, bill-pay-scheduled, cards, dashboard, messages, profile-security-activity, profile-security-devices, rewards-activity, statements, statements-tax, transfers-payees, transfers, transfers-history | captured |
| `shared/components/error-banner/error-banner.component.ts` | 7 | `/accounts`, `/accounts/:accountId/transactions/:transactionId/dispute`, `dialog from transaction-list.component`, `/accounts/:accountId`, `/alerts`, `/bill-pay/payees/new`, `/bill-pay/bills/:billId/autopay`, `/bill-pay`, `/bill-pay/bills/:billId/pay`, `/bill-pay/history`, `/bill-pay/scheduled`, `/cards/:cardId/activate`, `/cards/:cardId/controls`, `/cards/:cardId`, `/cards`, `/cards/:cardId/report`, `/cards/:cardId/travel`, `/dashboard`, `/messages/new`, `/messages`, `/open-account/contact`, `/open-account/funding`, `/open-account/identity`, `/open-account/product`, `/profile/address`, `/profile/security/password`, `/profile/security/username`, `/profile/contact`, `/profile/security/activity`, `/profile/security/mfa`, `/profile/security/devices`, `/rewards/redeem`, `/rewards/activity`, `/statements`, `/statements/:statementId`, `/transfers/payees/new`, `/transfers/payees`, `/transfers`, `/transfers/history`, `/transfers/new/review`, `/transfers/payees/:payeeId/verify` | accounts, accounts-transaction-dispute, accounts-detail, accounts-detail-export-dialog, alerts, bill-pay-payees-new, bill-pay-autopay, bill-pay, bill-pay-pay-bill, bill-pay-history, bill-pay-scheduled, cards-activate, cards-controls, cards-detail, cards, cards-report, cards-travel, dashboard, messages-new, messages, open-account-contact, open-account-funding, open-account-identity, open-account-product, profile-address, profile-security-password, profile-security-username, profile-contact, profile-security-activity, profile-security-mfa, profile-security-devices, rewards-redeem, rewards-activity, statements, statements-tax, statements-paperless, statements-viewer, transfers-payees-new, transfers-payees, transfers, transfers-history, transfers-new-review, transfers-payee-verify | captured |
| `shared/components/masked-number/masked-number.component.ts` | 3 | `/transfers/payees`, `/transfers/new/review` | transfers-payees, transfers-new-review | captured |
| `shared/components/page-section/page-section.component.ts` | 5 | `/accounts/:accountId`, `/accounts`, `/alerts`, `/bill-pay`, `/bill-pay/history`, `/bill-pay/scheduled`, `/cards/:cardId/controls`, `/messages`, `/rewards/activity`, `/transfers`, `/transfers/history` | accounts-detail, accounts-detail-export-dialog, accounts, alerts, bill-pay, bill-pay-history, bill-pay-scheduled, cards-controls, messages, rewards-activity, transfers, transfers-history | captured |
| `shell/auth-callback/auth-callback.component.ts` | 3 | `/auth/callback`, `/auth/callback` | - | NOT REACHABLE - Transient page shown for < 1 s while the Keystone code is exchanged; not screenshot-stable. Inline template, 2 usages. |
| `shell/idle-warning-dialog/idle-warning-dialog.component.ts` | 3 | `dialog from shell.component` | - | NOT REACHABLE - Opened by the shell after the idle timeout (minutes); not triggered during capture. Inline template. |
| `shell/logged-out/logged-out.component.ts` | 5 | `/logged-out`, `/logged-out` | logged-out | captured |
| `shell/sw-update-banner/sw-update-banner.component.ts` | 4 | `(app root, every route)` | - | NOT REACHABLE - Only shown when the service worker reports a new version; the dev server has no service worker. Inline template. |

## Status notes

* **NOT REACHABLE** - Declared but never rendered by any route, dialog or host template in this checkout (dead template) - CSS conversion is verified by code review + unit tests only.
* **REDIRECTED** - Route redirects before the template renders with the local BFF (see manifest finalUrl).

## Per-route capture details

| id | route | final URL | viewport | page size | page errors |
|---|---|---|---|---|---|
| dashboard | `/dashboard` | = | 1280x800 | 1280x1227 | - |
| accounts | `/accounts` | = | 1280x800 | 1280x800 | - |
| accounts-detail | `/accounts/ACC-477215249` | = | 1280x800 | 1280x800 | - |
| accounts-detail-export-dialog | `/accounts/ACC-477215249` | = | 1280x800 | 1280x800 | - |
| accounts-transaction-detail | `/accounts/ACC-477215249/transactions/TXN-000001` | = | 1280x800 | 1280x800 | - |
| accounts-transaction-dispute | `/accounts/ACC-477215249/transactions/TXN-000001/dispute` | = | 1280x800 | 1280x800 | - |
| transfers | `/transfers` | = | 1280x800 | 1280x1169 | - |
| transfers-new | `/transfers/new` | = | 1280x800 | 1280x800 | - |
| transfers-new-review | `/transfers/new/review` | `/transfers/new` | 1280x800 | 1280x800 | - |
| transfers-confirmation | `/transfers/TRF-000001/confirmation` | = | 1280x800 | 1280x800 | - |
| transfers-history | `/transfers/history` | = | 1280x800 | 1280x800 | - |
| transfers-detail | `/transfers/TRF-000001` | = | 1280x800 | 1280x800 | - |
| transfers-payees | `/transfers/payees` | = | 1280x800 | 1280x800 | - |
| transfers-payees-new | `/transfers/payees/new` | = | 1280x800 | 1280x800 | - |
| transfers-payee-verify | `/transfers/payees/PYE-904418309/verify` | = | 1280x800 | 1280x800 | - |
| bill-pay | `/bill-pay` | = | 1280x800 | 1280x800 | - |
| bill-pay-bill-detail | `/bill-pay/bills/PYE-904418309` | = | 1280x800 | 1280x800 | - |
| bill-pay-pay-bill | `/bill-pay/bills/PYE-904418309/pay` | = | 1280x800 | 1280x800 | - |
| bill-pay-scheduled | `/bill-pay/scheduled` | = | 1280x800 | 1280x800 | - |
| bill-pay-history | `/bill-pay/history` | = | 1280x800 | 1280x800 | - |
| bill-pay-payees-new | `/bill-pay/payees/new` | = | 1280x800 | 1280x800 | - |
| bill-pay-autopay | `/bill-pay/bills/PYE-904418309/autopay` | = | 1280x800 | 1280x800 | - |
| cards | `/cards` | = | 1280x800 | 1280x800 | - |
| cards-detail | `/cards/CRD-980719437` | = | 1280x800 | 1280x800 | - |
| cards-controls | `/cards/CRD-980719437/controls` | = | 1280x800 | 1280x1021 | - |
| cards-report | `/cards/CRD-980719437/report` | = | 1280x800 | 1280x800 | - |
| cards-travel | `/cards/CRD-980719437/travel` | = | 1280x800 | 1280x800 | - |
| cards-activate | `/cards/CRD-980719437/activate` | = | 1280x800 | 1280x800 | - |
| statements | `/statements` | = | 1280x800 | 1280x800 | - |
| statements-tax | `/statements/tax` | = | 1280x800 | 1280x800 | - |
| statements-paperless | `/statements/paperless` | = | 1280x800 | 1280x800 | - |
| statements-viewer | `/statements/STM-000001` | = | 1280x800 | 1280x800 | - |
| alerts | `/alerts` | = | 1280x800 | 1280x800 | - |
| alerts-history | `/alerts/history` | = | 1280x800 | 1280x800 | - |
| profile | `/profile` | = | 1280x800 | 1280x800 | - |
| profile-contact | `/profile/contact` | = | 1280x800 | 1280x800 | - |
| profile-address | `/profile/address` | = | 1280x800 | 1280x800 | - |
| profile-security | `/profile/security` | = | 1280x800 | 1280x800 | - |
| profile-security-password | `/profile/security/password` | = | 1280x800 | 1280x827 | - |
| profile-security-username | `/profile/security/username` | = | 1280x800 | 1280x800 | - |
| profile-security-mfa | `/profile/security/mfa` | = | 1280x800 | 1280x800 | - |
| profile-security-devices | `/profile/security/devices` | = | 1280x800 | 1280x800 | - |
| profile-security-activity | `/profile/security/activity` | = | 1280x800 | 1280x800 | - |
| messages | `/messages` | = | 1280x800 | 1280x800 | - |
| messages-new | `/messages/new` | = | 1280x800 | 1280x800 | - |
| messages-thread | `/messages/THR-000001` | = | 1280x800 | 1280x800 | - |
| rewards | `/rewards` | = | 1280x800 | 1280x800 | - |
| rewards-activity | `/rewards/activity` | = | 1280x800 | 1280x800 | - |
| rewards-redeem | `/rewards/redeem` | = | 1280x800 | 1280x800 | - |
| help | `/help` | = | 1280x800 | 1280x800 | - |
| help-faq | `/help/faq` | = | 1280x800 | 1280x800 | - |
| help-contact | `/help/contact` | = | 1280x800 | 1280x800 | - |
| disclosures | `/disclosures` | = | 1280x800 | 1280x800 | - |
| disclosures-viewer | `/disclosures/privacy-notice` | = | 1280x800 | 1280x800 | - |
| open-account | `/open-account` | = | 1280x800 | 1280x800 | - |
| open-account-identity | `/open-account/identity` | = | 1280x800 | 1280x800 | - |
| open-account-contact | `/open-account/contact` | = | 1280x800 | 1280x800 | - |
| open-account-product | `/open-account/product` | = | 1280x800 | 1280x800 | - |
| open-account-funding | `/open-account/funding` | = | 1280x800 | 1280x800 | - |
| open-account-review | `/open-account/review` | = | 1280x800 | 1280x800 | - |
| errors-not-found | `/not-found` | = | 1280x800 | 1280x800 | - |
| errors-forbidden | `/forbidden` | = | 1280x800 | 1280x800 | - |
| errors-generic | `/error` | = | 1280x800 | 1280x800 | - |
| logged-out | `/logged-out` | = | 1280x800 | 1280x800 | - |
| dashboard | `/dashboard` | = | 375x812 | 424x1659 | - |
| accounts | `/accounts` | = | 375x812 | 424x812 | - |
| accounts-detail | `/accounts/ACC-477215249` | = | 375x812 | 424x812 | - |
| accounts-detail-export-dialog | `/accounts/ACC-477215249` | = | 375x812 | 424x812 | - |
| accounts-transaction-detail | `/accounts/ACC-477215249/transactions/TXN-000001` | = | 375x812 | 424x812 | - |
| accounts-transaction-dispute | `/accounts/ACC-477215249/transactions/TXN-000001/dispute` | = | 375x812 | 424x812 | - |
| transfers | `/transfers` | = | 375x812 | 424x1625 | - |
| transfers-new | `/transfers/new` | = | 375x812 | 424x812 | - |
| transfers-new-review | `/transfers/new/review` | `/transfers/new` | 375x812 | 424x812 | - |
| transfers-confirmation | `/transfers/TRF-000001/confirmation` | = | 375x812 | 424x812 | - |
| transfers-history | `/transfers/history` | = | 375x812 | 424x812 | - |
| transfers-detail | `/transfers/TRF-000001` | = | 375x812 | 424x812 | - |
| transfers-payees | `/transfers/payees` | = | 375x812 | 424x812 | - |
| transfers-payees-new | `/transfers/payees/new` | = | 375x812 | 424x1001 | - |
| transfers-payee-verify | `/transfers/payees/PYE-904418309/verify` | = | 375x812 | 424x812 | - |
| bill-pay | `/bill-pay` | = | 375x812 | 424x812 | - |
| bill-pay-bill-detail | `/bill-pay/bills/PYE-904418309` | = | 375x812 | 424x812 | - |
| bill-pay-pay-bill | `/bill-pay/bills/PYE-904418309/pay` | = | 375x812 | 424x924 | - |
| bill-pay-scheduled | `/bill-pay/scheduled` | = | 375x812 | 424x812 | - |
| bill-pay-history | `/bill-pay/history` | = | 375x812 | 424x812 | - |
| bill-pay-payees-new | `/bill-pay/payees/new` | = | 375x812 | 424x936 | - |
| bill-pay-autopay | `/bill-pay/bills/PYE-904418309/autopay` | = | 375x812 | 424x812 | - |
| cards | `/cards` | = | 375x812 | 424x812 | - |
| cards-detail | `/cards/CRD-980719437` | = | 375x812 | 424x812 | - |
| cards-controls | `/cards/CRD-980719437/controls` | = | 375x812 | 424x1245 | - |
| cards-report | `/cards/CRD-980719437/report` | = | 375x812 | 424x812 | - |
| cards-travel | `/cards/CRD-980719437/travel` | = | 375x812 | 424x831 | - |
| cards-activate | `/cards/CRD-980719437/activate` | = | 375x812 | 424x812 | - |
| statements | `/statements` | = | 375x812 | 424x909 | - |
| statements-tax | `/statements/tax` | = | 375x812 | 424x812 | - |
| statements-paperless | `/statements/paperless` | = | 375x812 | 424x812 | - |
| statements-viewer | `/statements/STM-000001` | = | 375x812 | 424x812 | - |
| alerts | `/alerts` | = | 375x812 | 424x812 | - |
| alerts-history | `/alerts/history` | = | 375x812 | 424x812 | - |
| profile | `/profile` | = | 375x812 | 424x812 | - |
| profile-contact | `/profile/contact` | = | 375x812 | 424x871 | - |
| profile-address | `/profile/address` | = | 375x812 | 424x1025 | - |
| profile-security | `/profile/security` | = | 375x812 | 424x812 | - |
| profile-security-password | `/profile/security/password` | = | 375x812 | 424x859 | - |
| profile-security-username | `/profile/security/username` | = | 375x812 | 424x812 | - |
| profile-security-mfa | `/profile/security/mfa` | = | 375x812 | 424x812 | - |
| profile-security-devices | `/profile/security/devices` | = | 375x812 | 424x812 | - |
| profile-security-activity | `/profile/security/activity` | = | 375x812 | 424x812 | - |
| messages | `/messages` | = | 375x812 | 424x812 | - |
| messages-new | `/messages/new` | = | 375x812 | 424x812 | - |
| messages-thread | `/messages/THR-000001` | = | 375x812 | 424x812 | - |
| rewards | `/rewards` | = | 375x812 | 424x812 | - |
| rewards-activity | `/rewards/activity` | = | 375x812 | 424x812 | - |
| rewards-redeem | `/rewards/redeem` | = | 375x812 | 424x812 | - |
| help | `/help` | = | 375x812 | 375x812 | - |
| help-faq | `/help/faq` | = | 375x812 | 375x812 | - |
| help-contact | `/help/contact` | = | 375x812 | 375x812 | - |
| disclosures | `/disclosures` | = | 375x812 | 375x812 | - |
| disclosures-viewer | `/disclosures/privacy-notice` | = | 375x812 | 375x812 | - |
| open-account | `/open-account` | = | 375x812 | 375x812 | - |
| open-account-identity | `/open-account/identity` | = | 375x812 | 375x812 | - |
| open-account-contact | `/open-account/contact` | = | 375x812 | 375x954 | - |
| open-account-product | `/open-account/product` | = | 375x812 | 375x812 | - |
| open-account-funding | `/open-account/funding` | = | 375x812 | 375x812 | - |
| open-account-review | `/open-account/review` | = | 375x812 | 375x812 | - |
| errors-not-found | `/not-found` | = | 375x812 | 375x812 | - |
| errors-forbidden | `/forbidden` | = | 375x812 | 375x812 | - |
| errors-generic | `/error` | = | 375x812 | 375x812 | - |
| logged-out | `/logged-out` | = | 375x812 | 375x812 | - |
