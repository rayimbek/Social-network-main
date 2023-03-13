import React from 'react';
import { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from "axios"
import { Link } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import Cookies from 'universal-cookie';
const cookie = new Cookies()


 function createCookies(toke){
    cookie.set('token', toke['token'], {path: '/'})
}

function cookieGet(){
    return cookie.get('token');
}

// const Alerting = ()=>{
//   this.props.history.push('/')
// }
class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: "damir4",
            password: "damir123",
            name:'damir',
            email:'ema@adfa.com',
            loggedIN: cookieGet()
        };

        this.loginSubmit = this.loginSubmit.bind(this);
        this.checkLog()
      }
    
      
      checkLog(){
        if(this.state.loggedIN!=undefined){
           document.location.href= '/';
        }else{
          console.log('login required');

        }
      }

  loginSubmit(e){
    e.preventDefault();
    var txte="";
    const requestOptions = {
        method:'POST',
        headers: { 
            'Content-Type': 'application/json'
        },   
        body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            registered: 0
        })
    };
    fetch('http://'+window.server_url+'/post/register/', requestOptions)
    .then(res => {
      if (res.status >= 400) {
        console.log(res.status)
        console.log("Error bad request")
        return null
      }
        return res.json();
      })
      .then(data => {
        if(data.username){
          console.log("User already exists")
          console.log(document.querySelector('.invalid-feedback'));
          document.querySelector('.invalid-feedback').style.display = 'block';
          return null
        }
        this.setState({loggedIN:1})
        console.log(data)
        txte = data
        document.location.href='/login'
      })
    // fetch('http://'+window.server_url+'/post/login/', requestOptions)
    // .then(res => {
    //     // if(res.status<400) document.location.href = '/'
    //     console.log(res.status)
    //     return null
    //     // return res.json();
    //   })
    //   .then(data => {
    //     var tooken = data
    //     console.log(tooken)
    //   })
  };

  render(){
    
    return (
        <div>
        {this.state.loggedIN === 'undefined'||this.state.loggedIN===undefined ? "":document.location.href='/login'}
        <Card className="text-center" style={{maxWidth:400+"px", margin: 50 +"px auto", borderRadius:50+"px"}}>
        <Card.Header style = {{background: "#e1a7fa", borderTopLeftRadius:50+"px", borderTopRightRadius:50+"px"}}>Register</Card.Header>
        <Card.Body>
        <form id="loginform" onSubmit={this.loginSubmit}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                    //   id="EmailInput"
                    //   name="EmailInput"
                    //   aria-describedby="emailHelp"
                      placeholder="Enter username"
                      onChange={(event) => {
                          this.setState({username: event.target.value})
                        }}
                    />
                    <small id="emailHelp" className="text-danger form-text">
                      {}
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                    //   id="exampleInputPassword1"
                      placeholder="Password"
                      onChange={(event) => {
                          this.setState({password: event.target.value})
                        }}
                    />
                    <small id="passworderror" className="text-danger form-text">
                      {}
                    </small>
                  </div>
                  <div className="form-group form-check">
                    {/* <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                    /> */}
                    {/* <label className="form-check-label">Check me out</label> */}
                  </div>
                  <button type="submit" className="btn" style={{background: '#350f4f', color: 'white'}}>
                    Submit
                  </button>
                  <div className="invalid-feedback">
                    User with this username already exists.
                  </div>
                </form>
                {/* <div className='loginapi'><span>Login with <i className="bi bi-google"></i></span>oogle</div> */}
        </Card.Body>
        <Card.Footer className="text" style={{borderBottomLeftRadius:50+"px", borderBottomRightRadius:50+"px"}}><Link to="/login">Login</Link></Card.Footer>
      </Card>
      </div>
      );
      
  }
  
}



export default Register;