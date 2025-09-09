/// ######## BANNER WITH FIXES START ########

// ---- DYNAMIC_REQUIRE_FS_FIX ----
var require = (await import("node:module")).createRequire(import.meta.url);
var __filename = (await import("node:url")).fileURLToPath(import.meta.url);
var __dirname = (await import("node:path")).dirname(__filename);
// ---- DYNAMIC_REQUIRE_FS_FIX ----

/// ######## BANNER WITH FIXES END ########


// test/wallet-setup/basic.setup.ts
import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";
var SEED_PHRASE = "test test test test test test test test test test test junk";
var PASSWORD = "SynpressIsAwesomeNow!!!";
var basic_setup_default = defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD);
  await metamask.importWallet(SEED_PHRASE);
});
export {
  basic_setup_default as default
};
