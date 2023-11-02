// SPDX-License-Identifier: MIT
//pragam
pragma solidity ^0.8.8;
//imports
import "./PriceConverter.sol";

//Error Codes
error FundMe__NotOwn();

//Interface  Libriary  Contracts
contract FundMe {
    using PriceConverter for uint256;

    address[] private funders;
    address private immutable i_owner;
    address private priceFeedAddress;
    uint256 public constant MIN_USD = 25 * 1e18;
    mapping(address => uint256) private addressToAmountFunded;

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Can't got those money!");
        if (msg.sender != i_owner) revert FundMe__NotOwn();
        _;
    }

    constructor(address priceAddress) {
        priceFeedAddress = priceAddress;
        i_owner = msg.sender;
    }

    receive() external payable {
        sendFund();
    }

    fallback() external payable {
        sendFund();
    }

    // 发送资产
    function sendFund() public payable {
        require(
            msg.value.getConversionRate(priceFeedAddress) >= MIN_USD,
            "Cann't enough eth"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    // 接收资产
    function withdraw() public onlyOwner {
        // 将存储的金额置为0
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // 提取金额
        funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return addressToAmountFunded[funder];
    }

    function getPriceFeedAddress() public view returns (address) {
        return priceFeedAddress;
    }

    // function cheaperWithdraw() public onlyOwner {
    //     address[] memory funders = funders;
    //     // 将存储的金额置为0
    //     for (
    //         uint256 funderIndex = 0;
    //         funderIndex < funders.length;
    //         funderIndex++
    //     ) {
    //         address funder = funders[funderIndex];
    //         addressToAmountFunded[funder] = 0;
    //     }
    //     // 提取金额
    //     funders = new address[](0);
    //     (bool callSuccess, ) = payable(msg.sender).call{
    //         value: address(this).balance
    //     }("");
    //     require(callSuccess);
    // }
}
