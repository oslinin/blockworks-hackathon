
export const PREDICTION_MARKET_FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "marketAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum PredictionMarket.Category",
        "name": "category",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "question",
        "type": "string"
      }
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allMarkets",
    "outputs": [
      {
        "internalType": "contract PredictionMarket",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_usdcAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_question",
        "type": "string"
      },
      {
        "internalType": "enum PredictionMarket.Category",
        "name": "_category",
        "type": "uint8"
      }
    ],
    "name": "createMarket",
    "outputs": [
      {
        "internalType": "contract PredictionMarket",
        "name": "newMarket",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBets",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllMarkets",
    "outputs": [
      {
        "internalType": "contract PredictionMarket[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum PredictionMarket.Category",
        "name": "_category",
        "type": "uint8"
      }
    ],
    "name": "getMarketsByCategory",
    "outputs": [
      {
        "internalType": "contract PredictionMarket[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum PredictionMarket.Category",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "marketsByCategory",
    "outputs": [
      {
        "internalType": "contract PredictionMarket",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
export const PREDICTION_MARKET_FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
