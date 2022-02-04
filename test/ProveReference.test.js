const { assert } = require('chai');
const Web3  = require('web3');

const Token = artifacts.require("Token");
const ProveReference = artifacts.require("ProveReference");

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

contract('ProveReference', (accounts) => {
    let token, proveReference
    console.log(`accounts:\n ${accounts}`);

    before(async () => {

        token = await Token.new();
        proveReference = await ProveReference.new(token.address);
        
    })
    
    // Prove Reference
    describe('Name', async () => {
        it('proveReference has name', async () => {
            const name = await proveReference.name()
            assert.equal(name, 'Prove that address provides reference to instance of contract')
        })

    })    

    // Token Reference
    describe('Reference to Token contract', async () => {
        it('proveReference has access to Token contract', async () => {
            const tokenReference = await proveReference.token();
            console.log(`proveReference.token()\n  ${tokenReference} `);
            assert.equal(tokenReference, token.address);


         })   
    })  

});