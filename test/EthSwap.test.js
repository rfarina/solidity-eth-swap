const { assert } = require('chai');
const web3  = require('web3');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

// Chai
require('chai')
    .use(require('chai-as-promised'))
    .should()




// The default was to receive an array of accounts. With Ganache, this brings in all 
// 10 accounts.

// But a way to bring in only the first 2 accounts, is as shown on the modified contract stmt.
// Here, we are deciding that the first account will be the deployer, and the second the investor.

//      deployer: deploys the contract to the blockchain
//      investor: buys the DAPP tokens

// contract('EthSwap', (accounts) => {
contract('EthSwap', ([deployer, investor]) => {
        let token, ethSwap
        console.log(`deployer:\n ${deployer}`);
        console.log(`investor:\n ${investor}`);

    before(async () => {

        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        
        // Check state of both contracts after instanciation
        console.log(`token address on create:\n ${token.address}`)
        console.log(`ethSwap address on create:\n ${token.address}`)
        
        // Balance before transfer 
        console.log(`ethSwap balance before transfer:\n ${await token.balanceOf(ethSwap.address)}`)
        

        // Transfer all tokens to ethSwap contract (1 million)
        token.transfer(ethSwap.address, tokens('1000000'))

        // Balance after transfer
        console.log(`ethSwap balance after transfer:\n ${await token.balanceOf(ethSwap.address)}`)
    })

    // Helper to convert tokens to wei
    // Note, although we are not using ether, we can still pass it in, as we are using 18 decimals, 
    // just as in either
    function tokens(numberOfTokens) {
        return web3.utils.toWei(numberOfTokens, 'ether');
    }    
    
    // Token
    describe('Token deployment', async () => {
        it('token contract has name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })

    })    

    // EthSwap
    describe('EthSwap deployment', async () => {
        it('eth contract has name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Currency Exchange')
        })

        it('eth contract has tokens', async () => {
            const balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))

        })

        it('eth contract has reference to Token contract', async () => {
            const tokenReference = await ethSwap.token()
            console.log(`ethSwap.token()\n  ${tokenReference} `);
            assert.equal(tokenReference, token.address)
        })

    })

    // Buy Tokens from ethSwap
    describe('buyTokens()', async () => {
        it('Allows user to instantly purchase DAPP tokens from ethSwap', async () => {
            console.log(`ethSwap balance before purchase\n  ${await token.balanceOf(ethSwap.address)} `);
            console.log(`investor balance before purchase\n  ${await token.balanceOf(investor)} `);

            await ethSwap.buyTokens({ from: investor, value: '1000000000000000000'})

            console.log(`ethSwap balance after purchase\n  ${await token.balanceOf(ethSwap.address)} `);
            console.log(`investor balance after purchase\n  ${await token.balanceOf(investor)} `);
            
        })
        
        
    })
    
    describe('Determine account type', async () => {
        it('what is account type?', async () => {
            var accountType = await ethSwap.getAccountType(ethSwap.address);
            console.log(`what is account type?\n  ${accountType} `);
            assert.equal(accountType, 'contract');

        })
        it('is ethSwap.address account contract', async () => {
            var isContract = await ethSwap.isContract(ethSwap.address);
            console.log(`is ethSwap.address a contract?\n  ${isContract} `);
            assert.equal(isContract, true);

        })
        it('is token.address contract', async () => {
            var isContract = await ethSwap.isContract(ethSwap.address);
            console.log(`is token.address a contract?\n  ${isContract} `);
            assert.equal(isContract, true);

        })
        it('is investor account contract', async () => {
            var isContract = await ethSwap.isContract(investor);
            console.log(`is investor a contract?\n  ${isContract} `);
            assert.equal(isContract, false);

        })


    })


});