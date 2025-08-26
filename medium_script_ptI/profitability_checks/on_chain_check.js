const { ethers } = require("ethers");
const {
  QUOTER_CONTRACT_ADDRESS,
  UNISWAP_V2_SUSHSISWAP_ABI,
  ROUTER_ADDRESS_OBJECT,
} = require("../constants");
const { verfiy_token_path } = require("./utlis");
const Quoter = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
const INFURA_URL_VETTING_KEY = process.env.INFURA_URL_VETTING_KEY;
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_VETTING_KEY);

/**
 * Calculates the output amount for a given input amount using Uniswap V3.
 *
 * This function interacts with the Uniswap V3 smart contract to determine the
 * amount of output tokens that will be received for a given input amount of tokens.
 * It takes into account the current state of the liquidity pool, including the
 * reserves and fees.
 *
 * @param {string} poolAddress - The address of the Uniswap V3 pool.
 * @param {string} tokenIn - The address of the input token.
 * @param {string} tokenOut - The address of the output token.
 * @param {number} amountIn - The amount of input tokens.
 * @param {number} fee - The fee tier of the Uniswap V3 pool (e.g., 3000 for 0.3%).
 * @returns {Promise<number>} A promise that resolves to the amount of output tokens.
 * @throws {Error} Throws an error if the calculation fails or the pool is not found.
 */
async function get_amount_out_from_uniswap_V3(liquidity_pool, amount) {
  try {
    const { token0, token1, token_in, token_out, fee } = liquidity_pool;

    const token_in_decimals =
      token_in === token0.id ? token0.decimals : token1.decimals;
    const token_out_decimals =
      token_out === token0.id ? token0.decimals : token1.decimals;

    const uniswap_V3_quoter_contract = new ethers.Contract(
      QUOTER_CONTRACT_ADDRESS,
      Quoter.abi,
      provider
    );
    const amouunt_in_parsed_big_int = ethers.utils.parseUnits(
      amount,
      token_in_decimals
    );

    const quotedAmountOut =
      await uniswap_V3_quoter_contract.callStatic.quoteExactInputSingle(
        token_in, // input token
        token_out, // output token
        Number(fee),
        amouunt_in_parsed_big_int,
        0
      );

    const parsed_amounts_out = ethers.utils.formatUnits(
      quotedAmountOut,
      token_out_decimals
    );

    return parsed_amounts_out;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves the output amount from a Uniswap V2 or Sushiswap liquidity pool for a given input amount.
 *
 * @param {Object} liquidity_pool - The liquidity pool object containing details about the pool.
 * @param {Object} liquidity_pool.token0 - The first token in the liquidity pool.
 * @param {string} liquidity_pool.token0.id - The ID of the first token.
 * @param {number} liquidity_pool.token0.decimals - The number of decimals for the first token.
 * @param {Object} liquidity_pool.token1 - The second token in the liquidity pool.
 * @param {string} liquidity_pool.token1.id - The ID of the second token.
 * @param {number} liquidity_pool.token1.decimals - The number of decimals for the second token.
 * @param {string} liquidity_pool.exchange - The exchange name (e.g., 'uniswap', 'sushiswap').
 * @param {string} liquidity_pool.token_in - The ID of the input token.
 * @param {string} liquidity_pool.token_out - The ID of the output token.
 * @param {string} amount - The amount of the input token to trade.
 * @returns {Promise<string>} - The output amount of the output token, formatted as a string.
 * @throws Will log an error to the console if the operation fails.
 */
async function get_amount_out_from_uniswap_V2_and_sushiswap(
  liquidity_pool,
  amount
) {
  try {
    const { token0, token1, exchange, token_in, token_out } = liquidity_pool;

    const token_in_decimals =
      token_in === token0.id ? token0.decimals : token1.decimals;
    const token_out_decimals =
      token_out === token1.id ? token1.decimals : token0.decimals;

    const poolContract = new ethers.Contract(
      ROUTER_ADDRESS_OBJECT[exchange],
      UNISWAP_V2_SUSHSISWAP_ABI,
      provider
    );

    const amouunt_in_parsed_big_int = ethers.utils.parseUnits(
      amount,
      token_in_decimals
    );

    const amount_out_from_trade = await poolContract.callStatic.getAmountsOut(
      amouunt_in_parsed_big_int,
      [token_in, token_out]
    );

    const parsed_amounts_out = ethers.utils.formatUnits(
      amount_out_from_trade[1],
      token_out_decimals
    );

    return parsed_amounts_out;
  } catch (error) {
    console.error(error);
  }
}

async function on_chain_check(path_object) {
  try {
    const { path, loan_pools, optimal_amount } = path_object;
    verfiy_token_path(path);

    const loan_pool = loan_pools[path[0].token_in];

    const borrow_token_usd_price =
      path[0].token_in === loan_pool.token0.id
        ? loan_pool.token_0_usd_price
        : loan_pool.token_1_usd_price;

    if (loan_pool) {
      const start_amount = optimal_amount;
      let input_amount = optimal_amount;

      for (const pool of path) {
        const token_in_decimals =
          pool.token_in === pool.token0.id
            ? pool.token0.decimals
            : pool.token1.decimals;

        input_amount = Number(input_amount).toFixed(token_in_decimals);

        if (pool.exchange === "uniswapV3") {
          const amounts_out = await get_amount_out_from_uniswap_V3(
            pool,
            input_amount.toString()
          );
          input_amount = amounts_out;
        } else {
          const amounts_out =
            await get_amount_out_from_uniswap_V2_and_sushiswap(
              pool,
              input_amount.toString()
            );
          input_amount = amounts_out;
        }
      }
      const profit = (input_amount - start_amount) * borrow_token_usd_price;

      path_object.profit_usd_onchain_check = profit;
      path_object.ending_amount = input_amount - start_amount;
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { on_chain_check };
