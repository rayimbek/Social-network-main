import React from "react";
import './Myprofile.css';
import { ListGroup, NavLink, Accordion } from 'react-bootstrap';
import axios from "axios";
import Chat from './Chat';


export default function Friend(props) {
  const [chat, setChat]=React.useState()
  // const addChat
  return (
    <ListGroup.Item  id = {'chat_'+props.id}>
      <button type="button" className="btn-close" aria-label="Close" onClick={(ev) => { props.rvclass(ev); setChat(null) }} />
      <div style={{ display: 'inline-block', width: '90%' }} onClick={(ev) => { props.addclass(ev); setChat(<Chat id={props.id}/>)}}>
       {props.friend}
      </div>
      {chat}
    </ListGroup.Item>
  )
}