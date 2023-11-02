const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)

    console.log("即将注入资金")
    const transactionResponse = await fundMe.sendFund({
        value: ethers.parseEther("1"),
    })
    await transactionResponse.wait(1)
    console.log("success")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(0)
    })
