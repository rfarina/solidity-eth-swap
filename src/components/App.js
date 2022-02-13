import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    // console.log(window.web3)
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3 // shortcut for full name

    const accounts = await web3.eth.getAccounts()
    // console.log(accounts[0])  // account to be stored in React state
    this.setState({account: accounts[0]})
    // console.log(`account from state\n ${this.state.account}`)
    const ethBalance = await web3.eth.getBalance(this.state.account)
    console.log(`account ether balance\n ${ethBalance}`)
    // store ethBalance to state
    this.setState({ethBalance}) // 997805807600000000000
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider using Metamask')
    }
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      ethBalance: 0
     }
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
