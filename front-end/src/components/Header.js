import { useState, useEffect, React } from 'react';
import { Navbar, Container, Nav, NavDropdown, Navlink, NavLink } from 'react-bootstrap';
import "./Header.css"
import {
  BrowserRouter,
  Navigate,
  Routes,
  Router,
  Route,
  Link,
  NavLink as NavLink2
} from "react-router-dom";
import Search from "./Search";

import axios from "axios";
import Cookies from 'universal-cookie';
const cookie = new Cookies()

function logout() {
  cookie.remove('token')
  window.location.reload();
}

function cookieGet() {
  return cookie.get('token');
}

function checkSession() {
  var toke = cookieGet('token')
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + toke
    }
  };
  fetch('http://'+window.server_url+'/post/posts/', requestOptions)
    .then(res => {
      console.log(res.ok)
      if (res.ok) {
        return res.ok;
      }
      // else{
      //     <Navigate to="/login" ></Navigate>
      // }
      throw new Error('Network response was not ok.' + res.ok);
    })
    .catch(function (error) {
      console.log('There has been a problem with your fetch operation: ',
        error.message);
    });
}

const Navdrop = (props) => {
  return (
    <Nav className="justify-content-end" >
      <NavDropdown title={props.un} id='basic-nav-dropdown'>
        <NavDropdown.Item href="/myprofile">My profile</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={() => logout("Polo Ralph Lauren")}>Log out</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

const Navln = () => {
  return (
    <Nav className="justify-content-end" >
      <NavLink className="navbar-item"
        activeclassname="is-active"
        href="/login"
        exact="true"
      >Log in</NavLink>
      <NavLink className="navbar-item"
        activeclassame="is-active"
        href="/register"
        exact="true">Register</NavLink>
    </Nav>
  )
}



const Header = (props) => {
  const [uname, setnem] = useState(null);
  const loading = (n)=>{
    // console.log('2 phase'+n)
    if(props.loadthem) props.loadthem(n)
  }
  const getName = () => {
    const toke = cookieGet();
    axios.get('http://' + window.server_url + '/post/get_username/', {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Token ' + toke
        }
    }).then(res => {
        return res.data
    }).then(data => {
        // setwin(true)
        setnem(data)
    })
}
useEffect((e) => {
  console.log('got')
  getName()
});

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/">Nigma Galaxy</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav 
          className="me-5"
          >
            <Nav.Link to="/" >
              Home
            </Nav.Link>
            <Nav.Link href="#">About us</Nav.Link>
            {/* <Link to="/invoices">Invoices</Link> |{" "}
                        <Link to="/expenses">Expenses</Link> */}
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
          </Nav>
          <Nav className='justify-content-start flex-grow-1 me-5' justify>
          {props.currloc == 'myprofile' ? <Search loadthem={loading}/> : ''}
          </Nav>

            


          {cookieGet() === undefined ? <Navln /> : <Navdrop un={uname}/>}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}



export default Header;