module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network ID
    }
  },
  compilers: {
    solc: {
      version: "0.8.0", // Change to your desired Solidity compiler version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
