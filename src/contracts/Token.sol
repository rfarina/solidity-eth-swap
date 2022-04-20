// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// pragma solidity ^0.8.6;

// use latest solidity version at time of writing, need not worry about overflow and underflow

/// @title ERC20 Contract 

/* 
Token.sol will generate (mint) tokens for itself. 
But our objective is to transfer the tokens created to the EthSwap contract. This will be done
in the 2_deploy_contracts.js file. 
*/

contract Token {

    // My Variables
    string public name = 'DApp Token';
    string public symbol = 'DAPP';
    uint256 public decimals = 18;
    
    // Note 1 wei is 18 decimal places 
    // 1000000000000000000       // 1 DApp expressed in wei (18 decimal places)

    // to get 1 million DApp tokens, we need to add 6 more zeros
    // 1000000000000000000000000
    uint256 public totalSupply = 1000000000000000000000000;
    

    // Keep track balances and allowances approved
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events - fire events on state changes etc
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() payable {   // why is payable needed?  //TODO
        // name = _name;
        // symbol = _symbol;
        // decimals = _decimals;
        // totalSupply = _totalSupply; 
        balanceOf[payable(msg.sender)] = totalSupply;  // why is payable needed?
    }

    /// @notice transfer amount of tokens to an address
    /// @param _to receiver of token
    /// @param _value amount value of token to send
    /// @return success as true, for transfer 
    function transfer(address _to, uint256 _value) external returns (bool success) {
        /* 
        rrf important note:
        ===================
        This token contract makes the assumption that msg.sender is the address of a 
        calling contract.

        Question?
        =========
        What if this function is invoked from an eoa, such as a wallet or web3 invocation?
        A. It may still be the same... Address of eoa would be msg.sender, and it should work.

        But, if a contract is invoking transfer, then msg.sender is the contract, not the eoa (not tx.origin) 

        This makes for an interesting case. If ContractA calls ContractB; and ContractB calls transfer, then ContractB
        becomes msg.sender. And it is ContractB's tokens that will be transfered to the "to" address. AND, ContractA will
        receive the ether!!  Bad deal for ContractB!
         */
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    /// @dev internal helper transfer function with required safety checks
    /// @param _from, where funds coming the sender
    /// @param _to receiver of token
    /// @param _value amount value of token to send
    // Internal function transfer can only be called by this contract
    //  Emit Transfer Event event 
    function _transfer(address _from, address _to, uint256 _value) internal {
        // Ensure sending is to valid address! 0x0 address can be used to burn() 
        require(_to != address(0));
        require(_from != address(0));  // rrf note: check both from and to for address(0)
        balanceOf[_from] = balanceOf[_from] - (_value);
        balanceOf[_to] = balanceOf[_to] + (_value);
        emit Transfer(_from, _to, _value);
    }

    /// @notice Approve other to spend on your behalf eg an exchange 
    /// @param _spender allowed to spend and a max amount allowed to spend
    /// @param _value amount value of token to send
    /// @return true, success once address approved
    //  Emit the Approval event  
    // Allow _spender to spend up to _value on your behalf
    function approve(address _spender, uint256 _value) external returns (bool) {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /// @notice transfer by approved person from original address of an amount within approved limit 
    /// @param _from, address sending to and the amount to send
    /// @param _to receiver of token
    /// @param _value amount value of token to send
    /// @dev internal helper transfer function with required safety checks
    /// @return true, success once transfered from original account    
    // Allow _spender to spend up to _value on your behalf
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - (_value);
        _transfer(_from, _to, _value);
        return true;
    }

}