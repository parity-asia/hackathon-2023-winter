// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

/// @title IUniswapV2Pair Interface
/// @notice Minimal interface for our interactions with the Uniswap V2's Pair contract
interface IUniswapV2Pair {
    function getReserves() external view returns (uint112, uint112, uint32);

    function kLast() external view returns (uint256);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function totalSupply() external view returns (uint256);
}