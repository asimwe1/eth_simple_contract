// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Storage {
    uint256 public storedData;

    constructor() {
        storedData = 0; // Explicit initialization
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}