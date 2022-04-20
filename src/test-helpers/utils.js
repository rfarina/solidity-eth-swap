const { assert } = require("chai");

async function shouldThrow(promise) {

    try {
        await promise;
        assert(true);
        
    } catch (error) {
        return;
    }
    assert(false, "The contract did not throw");
}

module.exports = {
    shouldThrow
};