// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.16;

contract Transfers {
    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can send eth");
        _;
    }

    //Declare an Event
    // event DepositViaFallback(address indexed _from, bytes32 indexed _id, uint _value);
    event DepositViaFallback(address indexed _from, uint _value);

    constructor(address _owner) public {
        owner = _owner;

    }

    function sendEth(address payable _to) public payable returns(uint256) {
        _to.transfer(msg.value);
        //Emit an event
        return address(this).balance;
    }

    // fallback
    function() external payable  {
        // Note: the following line is not needed, as the fallback automatically 
        //       increases the contract's balance msg.value
        // address(this).balance += msg.value;
        emit DepositViaFallback(msg.sender, msg.value);
    }

}