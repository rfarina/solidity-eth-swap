// SPDX-License-Identifier: MIT

pragma solidity ^0.5.16;

// This import provides us with a Type of Token
import './Token.sol';

contract ProveReference {
    string public name = 'Prove that address provides reference to instance of contract';
    Token public token;

    constructor(Token _token) public {
        token = _token;

    }


}