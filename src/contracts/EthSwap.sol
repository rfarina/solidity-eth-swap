// SPDX-License-Identifier: MIT

pragma solidity ^0.5.16;

import './Token.sol';

contract EthSwap {
    string public name = 'EthSwap Currency Exchange';
    
    // Get a reference to the Token Contract Code (not the address, which is token.address)
    // Note: This means we are storing this code on the blockchain
    // Question: If it's already on the blockchain, does it make sense to actually store it, 
    //           or just simply have the caller send in the address of the Token contract? In 
    //           this way, we would be pointing directly at the Token contract wherever it lives
    //           on the blockchain rather than duplicating it and storing it a second time.

    // Clarification:   
    //           What is now better understood, is that the EthSwap constructor actually does
    //           receive the token's address, which allows us to get a reference to the running instance
    //           of the Token contract. We simple assign it to the state variable token.
    //
    //           So, no, the object is not duplicated. There is still only one instance of the
    //           Token contract.
    Token public token;  

    uint public ratePerToken = 100; // 100 DAPP for 1 ether

    constructor(Token _token) public {
        token = _token;

    }

    // Another account or contract wants to buy DAPP tokens with ether
    function buyTokens() public payable {

        // Note: this function does not have input parameters. However, solidity will 
        // automatically provide msg.sender and msg.value as sender's account address 
        // and amount of ether sent in. (msg, address, and block objects are part of the global
        // context made available by solidity)

        // Also note the use of the payable keyword. This allows this function to accept
        // incoming payments
        
        
        // Calculate the number of DAPP tokens the ether will buy
        uint tokensPurchased = msg.value * ratePerToken;

        // Invoke the transaction on the Token contract
        token.transfer(msg.sender, tokensPurchased);    
    }
    // Determine whether address is eoa or contract
    function getAccountType(address addr) public view returns(string memory) {
        uint256 codeLength;

        assembly { codeLength := extcodesize(addr) }
        return codeLength == 0 ? 'eoa' : 'contract';
    }

    function isContract(address addr) public view returns(bool) {
        uint256 codeLength;

        assembly { codeLength := extcodesize(addr) }
        return codeLength == 0 ? false : true;
    }

}