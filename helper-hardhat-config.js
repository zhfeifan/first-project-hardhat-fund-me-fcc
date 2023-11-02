// MockV3Aggregator需要的两个参数
const DECIMALS = 8
const INITAL_ANSWER = 200000000000
const development = ["localhost", "hardhat"]

// 提供喂价接口的合约
const networkConfig = {
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}

module.exports = {
    networkConfig,
    development,
    DECIMALS,
    INITAL_ANSWER,
}
