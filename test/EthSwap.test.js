// const { artifacts, contract, before } = require("truffle");
const utils = require("../src/test-helpers/utils");

const { assert } = require('chai');
// const web3 = require('web3');  // automatically made available by Truffle

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

// Chai 
// The following configures the Assertion library 
require('chai')
    .use(require('chai-as-promised'))
    .should()

// Helper to convert number of tokens to wei
// Note, although we are not using ether, we can still pass it in, as we are using 18 decimals, 
// just as in either
function tokens(numberOfTokens) {
    return web3.utils.toWei(numberOfTokens, 'ether');
}
// This is a better function to append the number of tokenDecimals
// the problem is, "tokenDecimals" seems to cause a circular reference within mocha
function toTokenDecimals(numberOfTokens, _tokenDecimals) {
    return (numberOfTokens * (10 ** _tokenDecimals))
}
// contract('EthSwap', accounts => {})  // brings in array of accounts from ganache. Better to break
// out into individual accounts as below.
contract('EthSwap', async ([deployer, investor, investor2]) => {
    let token, ethSwap
    console.log(`deployer:\n ${deployer}`);
    console.log(`investor:\n ${investor}`);
    console.log(`investor2:\n ${investor2}`);

    
    before(async () => {


        // token and ethSwap are "new" contract instances; NOT the instances in ganache.
        // However, the EOA addresses DO come from ganache
        token = await Token.new()
        // token = await Token.deployed()
        ethSwap = await EthSwap.new(token.address)
        
        // ethSwap = await EthSwap.deployed()
        
        // // Get token decimals
        // tokenDecimals = await token.decimals()
        // console.log(`Token decimals\n ${tokenDecimals}`)
        
        
        // Transfer all tokens to ethSwap
        let result = await token.transfer(ethSwap.address, tokens('1000000'));
        console.log(`Results of token.transfer: args\n ${JSON.stringify(result.logs[0].args, null, 2)}`);
        console.log(`Results of token.transfer: Tx\n ${JSON.stringify(result.tx, null, 2)}`);
        console.log(`Results of token.transfer: Receipt\n ${JSON.stringify(result.receipt, null, 2)}`);
        console.log(`Results of token.transfer: Receipt Status\n ${JSON.stringify(result.receipt.status, null, 2)}`);
        console.log(`Results of token.transfer: value\n ${JSON.stringify(result.receipt.logs[0].args.value.toString(), null, 2)}`);
        console.log(`ethSwap token balance ethSwap after transfer of 1M tokens into it:\n ${await token.balanceOf(ethSwap.address)}`)


        // // Balances before transfer 
        // console.log(`token balance of token contract before transfer of 1M tokens to ethSwap:\n ${await token.balanceOf(token.address)}`)
        // console.log(`ethSwap token balance ethSwap before transfer of 1M tokens into it:\n ${await token.balanceOf(ethSwap.address)}`)

        // // Transfer all minted tokens to ethSwap contract (1 million)
        // token.transfer(ethSwap.address, tokens('1000000'))

        // // Balances after transfer
        // console.log(`token balance of token contract after transfer of 1M tokens to ethSwap:\n ${await token.balanceOf(token.address)}`)
        // console.log(`ethSwap token balance ethSwap after transfer of 1M tokens into it:\n ${await token.balanceOf(ethSwap.address)}`)


        // // Check state of both contracts after instanciation
        // console.log(`token address on create:\n ${token.address}`)
        // console.log(`ethSwap address on create:\n ${ethSwap.address}`)

    })


    // Token properties
    describe('Token deployment', async () => {
        it('token contract has name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })

    })

    // EthSwap properties
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
    describe('buyTokens()\n', async () => {
        it('Allows user to instantly purchase DAPP tokens from ethSwap', async () => {
            console.log(`ethSwap contract balance of ether before purchase\n  ${await ethSwap.getEtherBalance(ethSwap.address)} `);
            console.log(`ethSwap contract balance of tokens before purchase\n  ${await token.balanceOf(ethSwap.address)} `);
            console.log(`investor2 account balance of tokens before purchase\n  ${await token.balanceOf(investor2)} `);
            console.log(`investor2 account balance of ether before purchase\n  ${await ethSwap.getEtherBalance(investor2)} `);

            let result = await ethSwap.buyTokens({ from: investor2, value: '25000000000000000000' });
            console.log(`After purchase of 25 ether, balance of tokens should be '2500' tokens`);
            assert.equal('2500', await token.balanceOf(investor2));

            console.log(`ethSwap contract balance of ether after purchase\n  ${await ethSwap.getEtherBalance(ethSwap.address)} `);
            console.log(`ethSwap contract balance of tokens after purchase\n  ${await token.balanceOf(ethSwap.address)} `);
            console.log(`investor2 account balance of tokens after purchase\n  ${await token.balanceOf(investor2)} `);
            console.log(`investor2 account balance of ether after purchase\n  ${await ethSwap.getEtherBalance(investor2)} `);
            // let w3EthSwapBal = await web3.util.getBalance(ethSwap.address);
            assert.equal(await ethSwap.getEtherBalance(ethSwap.address), await web3.eth.getBalance(ethSwap.address))

            // Check logs to see that the event was emitted with correct data
            const event = result.logs[0].args
            console.log(`Event emitted after purchase of tokens:\n ${JSON.stringify(event, null, 2)}`);
            assert.equal(event.account, investor2)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), '2500')
            assert.equal(event.rate.toString(), '100')

        })
    })

    // Sell Tokens back to ethSwap
    describe('sellTokens()\n', async () => {
        it('Allow accounts to sell tokens back to ethSwap contract in exchange for ether', async () => {
            // start with current balance (should be 2500 from previous transaction of buying tokens)
            console.log(`Token balance Investor2 b4 trading tokens\n ${await token.balanceOf(investor2)}`);

            before(async () => {
                let approved;

                // investor2 must approve ethSwap contract to exchange tokens on its behalf
                // this must take place prior to invoking sellTokens(), or tx will revert.
                approved = await token.approve(ethSwap.address, tokens('100'), { from: investor2 });

                // console.log(`Was token transfer approved?\n ${approved.toString()}`);
                assert.equal(approved.toString(), 'true');

                // sell some tokens
                // Note: This will revert if tokens not first approved 
                let result = await ethSwap.sellTokens(tokens('100'), { from: investor2 }); // amount in 18 decimals (100 * 10**18)

                // Check logs to see that the 'approved' event was emitted with correct data
                const event = result.logs[0].args
                assert.equal(event.account, investor2)
                assert.equal(event.token, token.address)
                assert.equal(event.amount.toString(), tokens(100).toString())
                assert.equal(event.rate.toString(), '100')

                
            });
            
            
            // check updated balance
            console.log(`Token balance Investor2 aft trading tokens\n ${await token.balanceOf(investor2)}`);
            
        })



    })
    
    // Force failures
    describe('Force failures', async () => {
        // Create FAILURE to ensure that failure cases are handled
        let result, approved, event

        before(async () => {

            // First, buy some tokens (100)
            result = await utils.shouldThrow(ethSwap.buyTokens({ from: investor2, value: tokens('100') }));
            event = result.logs[0].args;
            console.log(`result of buying 100 tokens in failure section :\n ${JSON.stringify(event.amount.toString(), null, 2)}`)
            assert.equal(event.amount.toString(), '100');
    
            // Approve 100 tokens to be transferred
            approved = await utils.shouldThrow(token.approve(ethSwap.address, tokens('100'), { from: investor2 }));
            console.log(`approved:\n ${approved}`)
            assert.equal(approved.toString(), 'false'); 
            await utils.shouldThrow(ethSwap.sellTokens(tokens('2000000000000000000'), { from: investor2 })); // amount in 18 decimals (5000 * 10**18)

        })
        
        // it('Should be reverted for lack of tokens to trade', async () => {
            
        //     // console.log(`Was transfer of 100 tokens approved?\n ${approved}`);
    
        //     // attempt to sell more tokens than approved 
        //     // Note: This will revert if not enough tokens approved 
        //     // result = await catchRevert(ethSwap.sellTokens(tokens('1000'), { from: investor2 })); // amount in 18 decimals (100 * 10**18)
        //     // console.log(`Result of reverted tx:\n ${result.toString()}`);
    
        // })



    })

    // Compare conversion routines
    describe('Compare conversion routines', async () => {
        it('tokens() and toTokenDecimals() should return same value', async () => {

            let result1 = await tokens("100")
            let result2 = await toTokenDecimals("100", await token.decimals())
            console.log(`100 tokens to decimal(result1) ${result1}`)
            console.log(`Fix: 100 tokens to decimal(result2) ${result2}`)
            assert.equal(result1, result2);
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

})