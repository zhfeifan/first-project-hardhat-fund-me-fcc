const { network } = require("hardhat")
const {
    development,
    DECIMALS,
    INITAL_ANSWER,
} = require("../helper-hardhat-config")

// 运行的网络不提供喂价合约是,使用MockV3Aggregator获取出一个模拟的喂价合约
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (development.includes(network.name)) {
        log("Local network. Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITAL_ANSWER],
        })
    }
    log("----------------------------------")
}
module.exports.tags = ["all", "macks"]
