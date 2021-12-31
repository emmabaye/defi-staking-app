import React, { useRef } from "react";
import tether from "../tether.png";

const Main = ({
  stakingBalance,
  rwdBalance,
  tetherBalance,
  stakeTokens,
  unstakeTokens,
}) => {
  const inputRef = useRef("");

  return (
    <div id="content" className="mt-3">
      <table className="table text-muted text-center">
        <thead>
          <tr style={{ color: "white" }}>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: "white" }}>
            <td>{window.web3.utils.fromWei(stakingBalance, "Ether")} USDT</td>
            <td>{window.web3.utils.fromWei(rwdBalance, "Ether")} RWD</td>
          </tr>
        </tbody>
      </table>
      <div className="card mb-2" style={{ opacity: ".9" }}>
        <form
          className="mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            let amount = inputRef.current.value.toString();
            amount = window.web3.utils.toWei(amount, "Ether");
            stakeTokens(amount);
          }}
        >
          <div style={{ borderSpacing: "0 1em" }}>
            <label className="float-left" style={{ marginLeft: "15px" }}>
              <b>Stake Tokens</b>
            </label>
            <span className="float-right" style={{ marginRight: "8px" }}>
              Balance: {window.web3.utils.fromWei(tetherBalance, "Ether")}
            </span>
            <div className="input-group mb-4">
              <input ref={inputRef} type="text" placeholder="0" required />
              <div className="input-group-open">
                <div className="input-group-text">
                  <img src={tether} alt="tether" height="32" />
                  &nbsp;&nbsp;&nbsp; USDT
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              DEPOSIT
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            unstakeTokens();
          }}
          className="btn btn-primary btn-lg btn-block"
        >
          WITHDRAW
        </button>
      </div>
    </div>
  );
};

export default Main;
