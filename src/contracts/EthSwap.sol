// SPDX-License-Identifier: MIT

pragma solidity ^0.5.16;

import './Token.sol';

contract EthSwap {
    string public name = 'EthSwap Currency Exchange';
    Token public token;
    uint public rate = 100; // 100 DAPP for 1 ether
    constructor(Token _token) public {
        token = _token;

    }

    // Another account or contract wants to buy DApp tokens with ether
    function buyTokens() public payable {


        // Note: this function does not have input parameters. However, solidity will 
        // automatically provide msg.sender and msg.value as sender's account address 
        // and amount of ether sent in.
        
        
        // Calculate the number of DAPP tokens the ether will buy
        uint tokenAmount = msg.value * rate;

        // Invoke the transaction on the Token contract
        token.transfer(msg.sender, tokenAmount);    
    }


}