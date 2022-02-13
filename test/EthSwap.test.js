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
contract('EthSwap', ([deployer, investor, investor2]) => {
        let token, ethSwap
        console.log(`deployer:\n ${deployer}`);
        console.log(`investor:\n ${investor}`);
        console.log(`investor2:\n ${investor2}`);

    before(async () => {

        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        
        // Check state of both contracts after instanciation
        console.log(`token address on create:\n ${token.address}`)
        console.log(`ethSwap address on create:\n ${token.address}`)
        
        // Balance before transfer 
        console.log(`ethSwap token balance before transfer:\n ${await token.balanceOf(ethSwap.address)}`)
        

        // Transfer all tokens to ethSwap contract (1 million)
        token.transfer(ethSwap.address, tokens('1000000'))

        // Balance after transfer
        console.log(`ethSwap token balance after transfer:\n ${await token.balanceOf(ethSwap.address)}`)
    })

    // Helper to convert number of tokens to wei
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
    describe('\n\n\n\n\nbuyTokens()', async () => {
        it('Allows user to instantly purchase DAPP tokens from ethSwap', async () => {
            console.log(`ethSwap contract balance of ether before purchase\n  ${await ethSwap.getEtherBalance(ethSwap.address)} `);
            console.log(`ethSwap contract balance of tokens before purchase\n  ${await token.balanceOf(ethSwap.address)} `);
            console.log(`investor2 account balance of tokens before purchase\n  ${await token.balanceOf(investor2)} `);
            console.log(`investor2 account balance of ether before purchase\n  ${await ethSwap.getEtherBalance(investor2)} `);
            
            let result = await ethSwap.buyTokens({ from: investor2, value: '25000000000000000000'});
            console.log(`After purchase of 25 ether, balance of tokens should be '2500' tokens`);
            assert.equal('2500', await token.balanceOf(investor2));
                                                              
            console.log(`ethSwap contract balance of ether after purchase\n  ${await ethSwap.getEtherBalance(ethSwap.address)} `);
            console.log(`ethSwap contract balance of tokens after purchase\n  ${await token.balanceOf(ethSwap.address)} `);
            console.log(`investor2 account balance of tokens after purchase\n  ${await token.balanceOf(investor2)} `);
            console.log(`investor2 account balance of ether after purchase\n  ${await ethSwap.getEtherBalance(investor2)} `);
            
            // Check logs to see that the event was emitted with correct data
            console.log(result.logs[0].args);
            const event = result.logs[0].args
            assert.equal(event.account, investor2)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), '2500'.toString())
            assert.equal(event.rate.toString(), '100')

        })
        
        
    })
    
    // Sell Tokens back to ethSwap
    describe('\n\n\n\n\nsellTokens()', async () => {
        it('Allow accounts to sell tokens back to ethSwap contract in exchange for ether', async () => {
            // start with current balance (should be 2500 from previous transaction of buying tokens)
            console.log(`Token balance b4 trading tokens\n ${await token.balanceOf(investor2)}`);
            
            before(async () => {
                let approved;

                // investor2 must approve ethSwap contract to exchange tokens on its behalf
                // this must take place prior to invoking sellTokens(), or tx will revert.
                approved = await token.approve(ethSwap.address, tokens('100'), {from: investor2});
                
                // console.log(`Was token transfer approved?\n ${approved.toString()}`);
                assert.equal(approved.toString(), 'true');
                
                // sell some tokens
                // Note: This will revert if tokens not first approved 
                let result = await ethSwap.sellTokens(tokens('100'), {from: investor2}); // amount in 18 decimals (150 * 10**18)

                // Check logs to see that the event was emitted with correct data
                const event = result.logs[0].args
                assert.equal(event.account, investor2)
                assert.equal(event.token, token.address)
                assert.equal(event.amount.toString(), tokens(100).toString())
                assert.equal(event.rate.toString(), '100')

                // Create FAILURE to ensure that failure case is handled
                await ethSwap.sellTokens(tokens('5000'), {from: investor2}).should.be.rejected; // amount in 18 decimals (150 * 10**18)



            });
            

            // check updated balance
            console.log(`Token balance aft trading tokens\n ${await token.balanceOf(investor2)}`);

        })





    })







    // Determine contract vs account types
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