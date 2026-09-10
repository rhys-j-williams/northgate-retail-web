// Route list shared by capture.js (screenshots) and verify-layout.js (computed-style equivalence).
const ACC = 'ACC-477215249';      // Bills account (CHECKING) - has transactions
const CARD = 'CRD-980719437';
const PAYEE = 'PYE-904418309';

async function clickText(page, re) {
  const btn = page.getByRole('button', { name: re }).first();
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(600); return 'clicked'; }
  return 'button not found';
}

const ROUTES = [
  { id: 'dashboard', path: '/dashboard' },
  { id: 'accounts', path: '/accounts' },
  { id: 'accounts-detail', path: `/accounts/${ACC}` },
  { id: 'accounts-detail-export-dialog', path: `/accounts/${ACC}`, after: async p => clickText(p, /export/i) },
  { id: 'accounts-transaction-detail', path: `/accounts/${ACC}/transactions/__TX__` },
  { id: 'accounts-transaction-dispute', path: `/accounts/${ACC}/transactions/__TX__/dispute` },
  { id: 'transfers', path: '/transfers' },
  { id: 'transfers-new', path: '/transfers/new' },
  // MfaStepUpGuard reads the wizard's parked amount from sessionStorage; deep links without it loop
  // back to the wizard start, so park a below-threshold amount (threshold 250000 minor) first.
  { id: 'transfers-new-review', path: '/transfers/new/review', pendingAmount: '12500' },
  { id: 'transfers-confirmation', path: '/transfers/TRF-000001/confirmation' },
  { id: 'transfers-history', path: '/transfers/history' },
  { id: 'transfers-detail', path: '/transfers/TRF-000001' },
  { id: 'transfers-payees', path: '/transfers/payees' },
  { id: 'transfers-payees-new', path: '/transfers/payees/new', pendingAmount: '12500' }, // threshold 0: needs recent MFA (login < 10 min ago)
  { id: 'transfers-payee-verify', path: `/transfers/payees/${PAYEE}/verify` },
  { id: 'bill-pay', path: '/bill-pay' },
  { id: 'bill-pay-bill-detail', path: `/bill-pay/bills/${PAYEE}` },
  { id: 'bill-pay-pay-bill', path: `/bill-pay/bills/${PAYEE}/pay`, pendingAmount: '12500' },
  { id: 'bill-pay-scheduled', path: '/bill-pay/scheduled' },
  { id: 'bill-pay-history', path: '/bill-pay/history' },
  { id: 'bill-pay-payees-new', path: '/bill-pay/payees/new' },
  { id: 'bill-pay-autopay', path: `/bill-pay/bills/${PAYEE}/autopay` },
  { id: 'cards', path: '/cards' },
  { id: 'cards-detail', path: `/cards/${CARD}` },
  { id: 'cards-controls', path: `/cards/${CARD}/controls` },
  { id: 'cards-report', path: `/cards/${CARD}/report` },
  { id: 'cards-travel', path: `/cards/${CARD}/travel` },
  { id: 'cards-activate', path: `/cards/${CARD}/activate` },
  { id: 'statements', path: '/statements' },
  { id: 'statements-tax', path: '/statements/tax' },
  { id: 'statements-paperless', path: '/statements/paperless' },
  { id: 'statements-viewer', path: '/statements/STM-000001' },
  { id: 'alerts', path: '/alerts' },
  { id: 'alerts-history', path: '/alerts/history' },
  { id: 'profile', path: '/profile' },
  { id: 'profile-contact', path: '/profile/contact' },
  { id: 'profile-address', path: '/profile/address' },
  { id: 'profile-security', path: '/profile/security' },
  { id: 'profile-security-password', path: '/profile/security/password' },
  { id: 'profile-security-username', path: '/profile/security/username' },
  { id: 'profile-security-mfa', path: '/profile/security/mfa' },
  { id: 'profile-security-devices', path: '/profile/security/devices' },
  { id: 'profile-security-activity', path: '/profile/security/activity' },
  { id: 'messages', path: '/messages' },
  { id: 'messages-new', path: '/messages/new' },
  { id: 'messages-thread', path: '/messages/THR-000001' },
  { id: 'rewards', path: '/rewards' },
  { id: 'rewards-activity', path: '/rewards/activity' },
  { id: 'rewards-redeem', path: '/rewards/redeem' },
  // public tree
  { id: 'help', path: '/help', public: true },
  { id: 'help-faq', path: '/help/faq', public: true },
  { id: 'help-contact', path: '/help/contact', public: true },
  { id: 'disclosures', path: '/disclosures', public: true },
  { id: 'disclosures-viewer', path: '/disclosures/privacy-notice', public: true },
  { id: 'open-account', path: '/open-account', public: true },
  { id: 'open-account-identity', path: '/open-account/identity', public: true },
  { id: 'open-account-contact', path: '/open-account/contact', public: true },
  { id: 'open-account-product', path: '/open-account/product', public: true },
  { id: 'open-account-funding', path: '/open-account/funding', public: true },
  { id: 'open-account-review', path: '/open-account/review', public: true },
  { id: 'errors-not-found', path: '/not-found', public: true },
  { id: 'errors-forbidden', path: '/forbidden', public: true },
  { id: 'errors-generic', path: '/error', public: true },
  { id: 'logged-out', path: '/logged-out', public: true },
];

const VIEWPORTS = [{ width: 1280, height: 800 }, { width: 375, height: 812 }];

module.exports = { ROUTES, VIEWPORTS, ACC, CARD, PAYEE, clickText };
