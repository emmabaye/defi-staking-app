import React, { Component } from "react";
import "./App.css";
import Navbar from "./Navbar";

export default class App extends Component {

 constructor(props) {
     super(props)
     this.state = {
         account: '0x0'
     }
 }
  render() {
    return (
      <>
        <Navbar account={this.state.account}/>
        <div className="text-center">
          <h1>Hello</h1>
        </div>
      </>
    );
  }
}
