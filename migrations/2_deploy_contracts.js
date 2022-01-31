
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {

/* 
During deployment, we have access to both instances of the token and ethSwap contracts.

Because token created all the tokens, BUT, we want them on the ethSwap contract, we must
then use the token.transfer function to get the total supply to the ethSwap contract.
*/


    // Deploy Token
    await deployer.deploy(Token);
    const token = await Token.deployed()
  
    // Deploy EthSwap
    await deployer.deploy(EthSwap);
    const ethSwap = await EthSwap.deployed()

    // Transfer all tokens to EthSwap contract
    await token.transfer(ethSwap.address, '1000000000000000000000000')

};