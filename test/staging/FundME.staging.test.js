const { ethers, getNamedAccounts, network } = require("hardhat")
const { development } = require("../../helper-hardhat-config")
const { assert } = require("chai")
!development.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe, deployer
          const sendValue = ethers.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
              it("允许用户捐赠和提款", async function () {
                  await fundMe.sendFund({ value: sendValue })
                  await fundMe.withdraw()
                  const endingBalance = await fundMe.provider.getBalance(
                      fundMe.target
                  )
                  assert.equal(endingBalance.toString(), 0)
              })
          })
      })
