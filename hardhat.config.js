require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-ethers")
require("dotenv").config({ path: __dirname + "/.env" })
require("hardhat-deploy")

// 让Hardhat使用VPN进行全局代理
const { ProxyAgent, setGlobalDispatcher } = require("undici")
const proxyAgent = new ProxyAgent("http://172.19.48.1:7890")
setGlobalDispatcher(proxyAgent)

// .env文件中配置的常量
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

// hardhat程序的主入口
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        reposten: {
            url: process.env.POSTEN_URL || "",
            accounts: [],
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 20,
        },
        // localhost: {
        //     url: "http://127.0.0.1:8545",
        //     chainId: 31337,
        // },
        hardhat: {
            chainId: 31337,
        },
    },
    // 设置编译器的版本solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    // Verify代码的API
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    // 对代码进行单元测试时的gas-fee报告
    gasReporter: {
        enabled: true,
        // outputFile: "gas-reporter.txt",
        nocolor: true,
        currency: "USD",
        // coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },
    // 不同网络部署时使用不同的密钥
    namedAccounts: {
        deployer: {
            default: 0,
            // sepolia: 1,
        },
    },
}
