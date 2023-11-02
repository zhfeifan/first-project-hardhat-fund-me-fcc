// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    // 获取eth的价格  address  ABI
    function getPrice(address priceAddress) internal view returns (uint256) {
        //0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43   0x694AA1769357215DE4FAC081bf1f309aDC325306
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceAddress);
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    // 计算50美金有多少eth
    function getConversionRate(
        uint256 ethAmount,
        address priceAddress
    ) internal view returns (uint256) {
        uint256 ethAmountInUsd = (getPrice(priceAddress) * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
