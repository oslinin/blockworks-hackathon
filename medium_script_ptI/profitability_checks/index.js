const { off_chain_check } = require("./off_chain_check");
const { on_chain_check } = require("./on_chain_check");
const { check_all_structured_paths } = require("./intial_check");
const { MIN_PROFIT_TO_CONSIDER_FOR_ON_CHAIN_CALL } = require("../constants");

/**
 * Performs profitability checks on a set of mapped paths.
 *
 * This function first performs an off-chain check to filter out paths that do not meet the minimum profit threshold.
 * Then, it performs an on-chain check on the remaining paths to further filter them.
 *
 * @param {Array} mapped_paths - An array of paths to check for profitability.
 * @returns {Promise<Array>} - A promise that resolves to an array of profitable paths that are ready to be staged for a smart contract.
 */
async function profitablity_checks(mapped_paths) {
  const ordered_profitable_path_with_optimal_input_amount = [];

  const proftibale_paths_to_stage_for_smart_contract = [];

  /**
   * off chain check
   */
  for (const path of mapped_paths) {
    off_chain_check(path);
    console.log(path.profit_usd);
    if (path.profit_usd > MIN_PROFIT_TO_CONSIDER_FOR_ON_CHAIN_CALL) {
      ordered_profitable_path_with_optimal_input_amount.push(path);
    }
  }
  /**
   * on chain check our final vet cycle
   */
  for (const final_path of ordered_profitable_path_with_optimal_input_amount) {
    await on_chain_check(final_path);
    if (
      final_path.profit_usd_onchain_check >
      MIN_PROFIT_TO_CONSIDER_FOR_ON_CHAIN_CALL
    ) {
      proftibale_paths_to_stage_for_smart_contract.push(final_path);
    }
  }
  return proftibale_paths_to_stage_for_smart_contract;
}

module.exports = { profitablity_checks, check_all_structured_paths };
