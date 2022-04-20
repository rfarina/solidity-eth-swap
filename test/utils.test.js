const utils = require("../src/test-helpers/utils");

const assert = require("chai");

// The following configures the Assertion library
// require('chai')
//     .use(require('chai-as promised'))
//     .should()

describe('Prove out utils.js', async () => {
    it('should fail', async () => {
        let promise = new Promise((resolve, reject) => {
            reject();
        })
        await utils.shouldThrow(promise);
    })

})
