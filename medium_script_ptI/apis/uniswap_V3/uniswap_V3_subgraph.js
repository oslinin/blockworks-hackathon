const axios = require("axios");

/**
 * Makes a POST request to the Uniswap V3 subgraph API with the provided GraphQL query.
 *
 * @param {Object} query - The GraphQL query to be sent to the Uniswap V3 subgraph API.
 * @returns {Promise<Object>} The data returned from the Uniswap V3 subgraph API.
 * @throws Will log an error message if the request fails.
 */
async function uniswapSubgraph_V3_Api(query) {
  try {
    const url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
    const { data } = await axios.post(url, query);

    return data.data;
  } catch (error) {
    console.error("there was an issue with calling uniswap_v3 subGraph", error);
  }
}

module.exports = {
  uniswapSubgraph_V3_Api,
};
