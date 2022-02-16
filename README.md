# Solidity Eth-Swap Contract


## **February 2022**


# OVERVIEW

Eth-Swap is a Web 3 Distributed Exchange application that mints 1,000,000 ERC20 DAPP tokens and makes them available for purchase and sale. The imported “Token” contract is based on the OpenZeppelin ERC20 Standard, but with slight modifications and comments intended for learning and teaching purposes. 

Eth-Swap was developed using Solidity and the Truffle Suite, and is deployed to a local Ganache Blockchain. Eth-Swap can also be deployed to the Ethereum Blockchain on Mainnet once security audits have been completed and the application is shown to be production ready.

All functional testing was performed manually in the Truffle Console using the web3 javascript API.  Unit tests were implemented with the mocha framework and chai assertion library.


# Goals

Implement the ERC20 Standard using Solidity and the Truffle Suite


## **Dependencies**

Node.js:[ https://nodejs.org/en/](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbjFpNFNQUjNCdlNZeldkUHV0MV96VW9CNEdvd3xBQ3Jtc0tsWFUyVTE2MFByV19HZmV3eXdQV2hwTXp6MU45QkJteGpKX1BoQmZDb1E4UmxmT3QxTF9CSGp0SHVQSlQzOVpkbDJFNm1vdjNOTUltQi0yYnV1MWpqLS1yWTB3ZUp3ci12ZzRCb2oydmhieS00SmxWbw&q=https%3A%2F%2Fnodejs.org%2Fen%2F) (recommended v14.16.0)

Truffle:[ https://www.trufflesuite.com/](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbHEtZW9IamRub1RUYVlKSkVpdWVaaWo4andLZ3xBQ3Jtc0tsT0dsQ0pJUW1IX202MlBFenZ3YWVCcUFqOFhPbFdmdGtRRmFIS2RQRWExNGRIb1hxekxNY3J3dXhCM3hMY1VPS1RlbjFnYjY4dlk0Qk8talZoWnAyNlBNeFhVdTF3b01QR1E3QmZwamxwM0VYT2hpaw&q=https%3A%2F%2Fwww.trufflesuite.com%2F) (recommended v5.1.39)

Ganache:[ https://www.trufflesuite.com/ganache](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbFdsRTJTYzNUU1lVamhxU2ZoMy13bE5oeEExQXxBQ3Jtc0tuMDF5MEpTSy1NNjZzakNJeDdtQ0Zqb0wzTjZ6UmtnVmphN2N5RndyRlNwZ1ZEM2lzZk5MeHVEbzFwYUVFZzkyeFZUV3ZJeTZIQ2Frdl9Cc095SUN6aHB3cFNLbzN4aVpYSXBJclB5VUt2aThUcUJyUQ&q=https%3A%2F%2Fwww.trufflesuite.com%2Fganache)

Metamask: [https://metamask.io/](https://metamask.io/)


## **Installation**

git clone [git@github.com](mailto:git@github.com):rfarina/solidity-eth-swap.git eth-swap

npm install -g truffle@5.1.39

npm install

Download, Install and run ganache to establish the Blockchain for local testing

[https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)


## **Test truffle installation**

truffle version (should result in the following):

Truffle v5.1.39 (core: 5.1.39)

Solidity - 0.5.16 (solc-js)

Node v14.16.0

Web3.js v1.2.1


## **Compilation**

_Make sure ganache is started_

truffle compile


## **Unit Testing**

truffle test


## **Deployment to Ganache**

truffle migrate ---reset (should result in Accounts created and Contracts deployed to Ganache)


# Attributions

Prior to modification, this repo was originally cloned from DappUniversity.com at [https://github.com/dappuniversity/eth_swap](https://github.com/dappuniversity/eth_swap)

**_End of Document_**
