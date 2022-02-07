
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");
const ProveReference = artifacts.require("ProveReference");
const Transfers = artifacts.require("Transfers");

module.exports = async function(deployer, network, accounts) {

/* 
During deployment, we have access to both instances of the token and ethSwap contracts.

Because token created all the tokens, BUT, we want them on the ethSwap contract, we must
then use the token.transfer function to get the total supply to the ethSwap contract.

Clarification:
    Actually, the 
*/


    // Deploy Token
    // Note: by default (see constructor), the totalSupply will go to the 
    // address that created the contract. With Ganache, this will be the
    // first address in the list.
    await deployer.deploy(Token);
    const token = await Token.deployed()
  
    // Deploy EthSwap
    await deployer.deploy(EthSwap,token.address);
    const ethSwap = await EthSwap.deployed();

    // Transfer all tokens to EthSwap contract (literally, minting 1M tokens)
    // Note: this is not sending eth. It is simply populating the balanceOf mapping
    // for the ethSwap address with 1M tokens, i.e. "balanceOf[ethSwap.address] = 1M"
    //
    // With that done, the ethSwap exchange now has tokens it can exchance for ether 
    await token.transfer(ethSwap.address, '1000000000000000000000000');

    // Deploy ProveReference
    await deployer.deploy(ProveReference, token.address);

    // Deploy Transfers
    const transfers = await deployer.deploy(Transfers, accounts[0]);

    // Initialize contract with 1,000 ether
    // Note: This tx is processed by the fallback() function
    transfers.sendTransaction({from: accounts[1], value: '5000000000000000000' })
};