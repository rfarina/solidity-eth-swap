
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {

/* 
During deployment, we have access to both instances of the token and ethSwap contracts.

Because token created all the tokens, BUT, we want them on the ethSwap contract, we must
then use the token.transfer function to get the total supply to the ethSwap contract.
*/


    // Deploy Token
    // Note: by default (see constructor), the totalSupply will go to the 
    // addess that created the contract. With Ganache, this will be the
    // first address in the list.
    await deployer.deploy(Token);
    const token = await Token.deployed()
  
    // Deploy EthSwap
    await deployer.deploy(EthSwap,token.address);
    const ethSwap = await EthSwap.deployed();

    // Transfer all tokens to EthSwap contract
    // await token.transfer(ethSwap.address, '1000000000000000000000000')
    await token.transfer(ethSwap.address, '1000000000000000000000000');

};