export const getAddresses = (network) => {
  if (network === "sepolia") {
    return {
      USDC_ADDRESS: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      FACTORY_ADDRESS: "0x14BF6D8f65b9e4b11919C3E9D4aC53C7b6bE21f0",
    };
  } else {
    // Default to localhost
    return {
      USDC_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      FACTORY_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    };
  }
};
