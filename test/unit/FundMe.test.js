const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts } = require("hardhat")

// 对FundME合约进行单元测试
describe("FundMe", async function () {
    let fundMe, deployer, mockV3Aggregator
    const sendValue = ethers.parseEther("1")
    // 测试前先部署合约
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        // 一键部署所有的合约
        await deployments.fixture("all")
        // 获取最新部署的FundMe合约
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    // 测试构造方法
    describe("Constrator", async function () {
        it("测试合约的地址是否正确", async function () {
            const response = await fundMe.getPriceFeedAddress()
            assert.equal(response, mockV3Aggregator.target)
        })
    })

    // 测试sendFund()
    describe("sendFund", async function () {
        it("测试小于50$时能否发送成功", async function () {
            await expect(fundMe.sendFund()).to.be.revertedWith(
                "Cann't enough eth"
            )
        })
        it("测试发送的eth是否和收到的相等", async function () {
            await fundMe.sendFund({ value: sendValue })
            const getValue = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(getValue.toString(), sendValue)
        })
        it("测试是否成功将捐赠者添加到funders数组中", async function () {
            await fundMe.sendFund({ value: sendValue })
            const funder = await fundMe.getFunders(0)
            assert.equal(funder, deployer)
        })
    })

    // 测试withdraw()
    describe("withdraw", async function () {
        // 在测试withdraw操作前,给合约注入资金
        beforeEach(async function () {
            await fundMe.sendFund({ value: sendValue })
        })
        it("测试一个用户时是否成功提取资金", async function () {
            // 开始总资金 = 结束总资金 + gas
            const startFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            assert.equal(endFundMeBalance.toString(), 0)
            assert.equal(
                startFundMeBalance + startDeployerBalance,
                endDeployerBalance + gasCost
            )
        })
        it("测试多个用户时是否能够成功提取资金", async function () {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const connectWallet = await fundMe.connect(accounts[i])
                await fundMe.sendFund({ value: sendValue })
            }
            // 开始资金 = 结束资金 + 部署者使用的gas
            const startFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startWalletBalance = await ethers.provider.getBalance(
                deployer
            )
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            assert.equal(endFundMeBalance, 0)
            assert.equal(
                startFundMeBalance + startWalletBalance,
                endDeployerBalance + gasCost
            )
            // 使数组和mapping都被重置
            await expect(fundMe.getFunders(0)).to.be.reverted
            for (let i = 1; i < 7; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })
        it("测试是否只有合约拥有者能够提取", async function () {
            const accounts = await ethers.getSigners()
            const attackerConnect = await fundMe.connect(accounts[1])
            await expect(attackerConnect.withdraw()).to.be.reverted
        })
    })
})
