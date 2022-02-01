const { assert } = require('chai');
const Web3  = require('web3');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

// Chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

// Helper to convert tokens to wei
// Note, although we are not using ether, we can still pass it in, as we are using 18 decimals, 
// just as in either
function tokens(numberOfTokens) {
    return Web3.utils.toWei(numberOfTokens, 'ether');
}    

contract('EthSwap', (accounts) => {
    let token, ethSwap

    before(async () => {

        token = await Token.new()
        ethSwap = await EthSwap.new()
        // Transfer all tokens to ethSwap contract (1 million)
        token.transfer(ethSwap.address, tokens('1000000'))
        
    })
    

    describe('Token deployment', async () => {
        it('token contract has name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })

    })    

    describe('EthSwap deployment', async () => {
        it('eth contract has name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Currency Exchange')
        })

        it('eth contract has tokens', async () => {
            const balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))

        })

    })

});