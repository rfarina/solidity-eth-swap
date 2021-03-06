// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Token.sol";

contract EthSwap{
    string public name = "EthSwap Currency Exchange";

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

    uint256 public ratePerToken = 100; // 100 DAPP for 1 ether

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );
    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event EtherReceived(
        address account,
        uint256 amount
    );
    constructor(Token _token) {
        token = _token;
    }

    // Another account or contract wants to buy DAPP tokens with ether
    // We will transfer tokens to the buyer, who is providing ether
    function buyTokens() external payable {
        // Note: this function does not have input parameters. However, solidity will
        // automatically provide msg.sender and msg.value as sender's account address
        // and amount of ether sent in wei. (msg, address, and block objects are part of the global
        // context made available by solidity)

        // Also note the use of the payable keyword. This allows this function to accept
        // incoming payments of ether, which will automatically be added to this contract's (ethSwap) address.

        // Calculate the number of DAPP tokens the ether will buy
        uint256 tokensPurchased = (msg.value / 10**18) * ratePerToken; // divide by 10**18 to convert wei to ether

        // Invoke the transaction on the Token contract
        token.transfer(msg.sender, tokensPurchased);

        // emit event allowing subcribers to be aware of the purchase
        emit TokensPurchased(
            msg.sender,
            address(token),
            tokensPurchased,
            ratePerToken
        );

        /* 
        rrf note:
        =========
        All of the following to update the balance of the contract IS NOT NEEDED!
        Solidity has already recognized this as a payment transaction and takes
        care of and is responsible for adding to the contract's balance.
         */

        // Add the funds to the current contract's balance
        // address payable contractAddress = payable(address(this));
        // contractAddress.balance += msg.value;
    }

    // Sell tokens back to the exchange in return for ether at the current exchange rate
    function sellTokens(uint256 numberOfTokensToSell) public {
        uint256 ethOwed = (numberOfTokensToSell / ratePerToken);

        // rrf note: the following requires are actually accounted for in the underlying ERC20 token functions.
        // this is being done as a learning excercise, as both requires will need to be satisfied for the tx to take place.

        // Require user has enough tokens to sell, else revert
        require(
            token.balanceOf(msg.sender) >= numberOfTokensToSell,
            "Not enough tokens in account"
        );

        // Require that contract has enough ether to support the transaction, else revert
        require(
            address(this).balance >= ethOwed,
            "Not enough ether in account"
        );

        // transfer tokens from msg.sender to this contract
        // token.transfer(msg.sender, numberOfTokensToTrade);  // this function is not the correct one to invoke
        token.transferFrom(msg.sender, address(this), numberOfTokensToSell); // this function transfers token balance to the contract

        // transfer ether from this contract to msg.sender
        payable(msg.sender).transfer(ethOwed); // Contract sending ether to msg.sender

        // emit event allowing subcribers to be aware of the purchase
        emit TokensSold(
            msg.sender,
            address(token),
            numberOfTokensToSell,
            ratePerToken
        );
    }

    // Determine whether address is eoa or contract
    function getAccountType(address addr) public view returns (string memory) {
        uint256 codeLength;

        // if account has data (codeLength > ), then it is a contract, as eoa
        // accounts do not have data.
        // BUT, it is possible for eoa accounts to send data. It is just that eoa
        //      accounts do not currently processs that data. SO, this could result
        //      in false information being sent back to the caller.
        assembly {
            codeLength := extcodesize(addr)
        }
        return codeLength == 0 ? "eoa" : "contract";
    }

    function isContract(address addr) public view returns (bool) {
        uint256 codeLength;

        assembly {
            codeLength := extcodesize(addr)
        }
        return codeLength == 0 ? false : true;
    }
     /* 
        @dev Note that to set and get mapping values no longer allows [] access. Instead, it takes
             the corresponding values as parameters.
             So, instead of return token.allowance[_tokenOwner][_spender], we use:
                            return token.allowance(_tokenOwner, _spender)
      */
     /* 
        @dev Note that to set and get mapping values no longer allows [] access. Instead, it takes
             the corresponding values as parameters.
             So, instead of return token.balanceOf[_addr], we use:
                            return token.balanceOf(_addr)
      */
    
    function getAllowance(address _tokenOwner, address _spender) external view returns(uint256){
        uint256 tokenAllowance;
        tokenAllowance = (token.allowance(_tokenOwner, _spender));
        return tokenAllowance;
    }
    
    // function deleteAllowance(address _tokenOwner, address _spender) external {
    //     bool _isDeleted = true;
    //     // delete token.allowance(_tokenOwner, _spender);
    //     token.allowance[_tokenOwner][_spender]._isDeleted = true;
    // }
    
    
    function getTokenBalance(address _addr) public view returns (uint256) {

        return (token.balanceOf(_addr));
    }

    function getEtherBalance(address _addr) public view returns (uint256) {
        return _addr.balance;
    }

    function sendEthToContract() payable external {
        // should add msg.value to contract balance
        emit EtherReceived(
            msg.sender,
            msg.value
        );
    }


    receive() payable external {}
}
