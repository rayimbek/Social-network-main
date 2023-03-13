import React, { useState } from "react";
import {
  ListGroup, NavLink, Accordion,
  InputGroup, FormControl, Button
} from 'react-bootstrap';
import axios from "axios";
import './Header.css'


import Cookies from 'universal-cookie';
const cookie = new Cookies()
function cookieGet() {
  return cookie.get('token');
}




export default function Search(props) {
  const [text, setText] = useState('');
  const [reszs, setRes] = useState();

  const ref=React.createRef();

  const getResult = (e)=>{
    const toke = cookieGet()
    if (toke === null) {
      return null
    }
    let txtname
    if(e){
    if (e.target.value==''){
      txtname=null
    }else{
      txtname=e.target.value
    }
  }else{
    txtname=null
  }
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + toke
      }
    };
    // console.log(e.target.value)
    fetch('http://'+window.server_url+'/chat/users/?search=' + txtname, requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        // console.log(data.results)
        // this.setState({ comments: data })
        setRes(data.results)
        
      });
  }

  const handleClick = (e, id, name)=>{
    if(e) e.preventDefault()
    // console.log('1 phase '+id)
    props.loadthem(id)
    getResult()
    ref.current.value = ''

  }

  React.useEffect(() => {
    // console.log(reszs);
  }, [reszs]);
  return (
    <div className="searchbar">
      <InputGroup className="mb-3 flex-grow-1">
        <FormControl
          ref={ref}
          placeholder="Search..."
          aria-label="search"

          aria-describedby="basic-addon2"
          onChange={(e)=>{getResult(e)}}
        />
        {/* <Button variant="outline-secondary" id="button-addon2">
          Button
        </Button> */}
      </InputGroup>
      <ListGroup id="searchList">
      {reszs?.map((rez, key)=>{
        // console.log(rez.username)
        return <ListGroup.Item key={key} onClick={(e)=>{handleClick(e, rez.id, rez.username)}}>
          {rez.username}
        </ListGroup.Item>
      })}
      </ListGroup>

    </div>
  )

}