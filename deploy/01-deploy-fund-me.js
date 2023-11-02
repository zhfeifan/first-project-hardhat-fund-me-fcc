const { network } = require("hardhat")
const { networkConfig, development } = require("../helper-hardhat-config")
const { verify } = require("../utils/Verify")

//用于部署fundMe合约的脚本 => hardhat-deploy插件
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    // 不提供喂价接口的合约,使用mock插件模拟出合约的地址
    // 提供喂价接口的合约,获取合约地址
    if (development.includes(network.name)) {
        const contractMock = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = contractMock.address
    } else {
        ethUsdPriceFeedAddress = await networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // 部署FundMe合约
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConformation: network.config.blockConfirmations || 1,
    })
    const args = [ethUsdPriceFeedAddress]
    // 如果不在本地部署,在主网上面验证合约代码
    if (!development.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(fundMe.address, args)
    }
}
// 设置部署的关键词  yarn harhat deploy --tags fundme
module.exports.tags = ["all", "fundme"]
