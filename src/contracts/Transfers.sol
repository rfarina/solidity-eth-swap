// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.16;

contract Transfers {
    address payable private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can send eth");
        _;
    }
    constructor(address payable _owner) public {
        owner = _owner;

    }

    function sendEth(address payable _to) public payable returns(uint256) {
        _to.transfer(msg.value);
        return address(this).balance;
    }

    // fallback
    function() external payable {}

}