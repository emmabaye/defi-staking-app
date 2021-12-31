import React, { useState, useEffect, useLayoutEffect } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import ParticleSettings from "./Particles";
import Main from "./Main";

const App = () => {
  const [account, setAccount] = useState("0x0");
  const [tether, setTether] = useState({});
  const [rwd, setRwd] = useState({});
  const [decentralBank, setDecentralBank] = useState({});
  const [tetherBalance, setTetherBalance] = useState("0");
  const [rwdBalance, setRwdBalance] = useState("0");
  const [stakingBalance, setStakingBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    loadWeb3();
  }, []);

  /* useEffect(() => {
    loadBlockChainData();
  }, []); */

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // connect wallet to site and get accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      loadBlockChainData();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "No ethereum brwoser detected!. You can check out metamask!"
      );
    }
  };

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    // Load Tether Contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = await new web3.eth.Contract(
        Tether.abi,
        tetherData.address
      );
      setTether(tether);
      let tetherBalance = await tether.methods.balanceOf(accounts[0]).call();
      setTetherBalance(tetherBalance.toString());
    } else {
      window.alert(
        "Error! Tether contract not deployed - no detected network!"
      );
    }

    // Load RWD Contract
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      setRwd(rwd);
      let rwdBalance = await rwd.methods.balanceOf(accounts[0]).call();
      setRwdBalance(rwdBalance.toString());
    } else {
      window.alert("Error! RWD contract not deployed - no detected network!");
    }

    // Load RWD Contract
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      setDecentralBank(decentralBank);
      let stakingBalance = await decentralBank.methods
        .stakingBalance(accounts[0])
        .call();
      setStakingBalance(stakingBalance.toString());
    } else {
      window.alert(
        "Error! Staking contract not deployed - no detected network!"
      );
    }

    setLoading(false);
  };

  const stakeTokens = (amount) => {
    setLoading(false)
    tether.methods.approve(decentralBank._address, amount);
    decentralBank
      .methods
      .depositTokens(amount)
      .send({
        from: account
       })
      .on("transactionHash", (hash) => {
       setLoading(false)
      });

  };

  const unstakeTokens = () => {
    setLoading(false)
    decentralBank
      .methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setLoading(false)
      });

  };

  let content;

  content = loading
    ? (content = (
        <p
          id="loader"
          className="text-center"
          style={{ color: "white", margin: "30px" }}
        >
          LOADING PLEASE...
        </p>
      ))
    : (content = (
        <Main
          tetherBalance={tetherBalance}
          rwdBalance={rwdBalance}
          stakingBalance={stakingBalance}
          stakeTokens={stakeTokens}
          unstakeTokens={unstakeTokens}
          // decentralBankContract={this.decentralBank}
        />
      ));

 
  return (
    <>
      <div className="App" style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <ParticleSettings />
        </div>
        <Navbar account={account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px", minHeight: "100vm" }}
            >
              <div>{content}</div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
