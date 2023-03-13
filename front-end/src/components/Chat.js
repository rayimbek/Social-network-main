import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import SimpleBar from 'simplebar-react';
import "./Myprofile.css";
import axios from "axios";
import Cookies from 'universal-cookie';

// import "./style.css";

// let id = 0;

const cookie = new Cookies()

function cookieIdGet() {
  const gid = cookie.get('id');
  // console.log(typeof gid +" "+gid)
  return gid;
}

function cookieGet() {
  return cookie.get('token');
}






class Chat extends Component {
  chatContainer = React.createRef();
  state = {
    messages: null,
    value: ""
  };
  client = new W3CWebSocket('ws://'+window.server_url+'/ws/chat/'+ this.props.id+'/', ['Token', cookieGet()]);
  // chat_id= this.props.id
  loadMessages() {
    let url = 'http://'+window.server_url+'/chat/load_messages/'+ this.props.id;
    
    // console.log(url)
    const toke = cookieGet()
    axios.get(url, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Token ' + toke
      }
    })
      .then(res => {
        var string1 = JSON.stringify(res.data);
        var data = JSON.parse(string1);
        let messages = [];
        data['messages'].map((getts) => {
          var message_dat = {
            id: getts.id,
            chat_id: getts.chat,
            text: getts.text,
            send_date: getts.send_date,
            yours: getts.yours,
            username: getts.owner
          };//send_date: data.send_date, owner: data.owner, chat: data.chat
          // console.log(message)
          messages.push(message_dat);
        });
        this.setState(
          {
            messages
          },
          () => this.scrollToMyRef()
        );
        // console.log(this.state.messages);
      })
      .catch(err => console.log(err))
  }
  componentDidMount() {
    this.loadMessages()
    this.client.onopen = (e) => {
      // console.log("Connected")
    }

    this.client.onmessage = (e) => {
      // console.log(JSON.parse(e.data))
      var data = JSON.parse(e.data);
      var message_dat = {
        id: data.message_id,
        chat_id: data.chat_id,
        text: data.message,
        send_date: data.send_date,
        yours: data.yours,
        username: data.username
      };//send_date: data.send_date, owner: data.owner, chat: data.chat

      let messages = [...this.state.messages];
      messages.push(message_dat);
      this.setState(
        {
          messages
        },
        () => this.scrollToMyRef()
        , function () {
          console.log(this.state.value);
        }
      );
      // console.log(this.state.messages)
    };

    this.client.onclose = (e) => {
      console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-message-input').focus();
    // document.querySelector('#chat-message-input').onkeyup = (e) => {
    //     this.clickSubmitMessage
    // };

    document.querySelector('#chat-message-submit').onclick = (e) => {
      var messageInputDom = document.querySelector('#chat-message-input');
      var message = messageInputDom.value;
      // console.log(this.chat_id)
      if (message) this.client.send(JSON.stringify({

        // 'id':( this.props.id ?  this.props.id: ''),
        'chat_id': this.props.id,
        'message': message
      }));
      this.setState({value: ""})
      this.scrollToMyRef()
      // this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    };

    // this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
  // async addMessage(messages){
  //   await this.setState(
  //     {
  //       messages
  //     }
  //     ,() => this.scrollToMyRef()
  //   );
  //   console.log(this.state.messages)
  // }

  handleChange = ({ target: { value } }) => {
    this.setState({
      value
    });
  };
  // riseID(){
  //   let ids =  this.props.id;
  //   ids +=1;
  //   this.setState({id:ids})
  //   return (ids-1);
  // }

  //   sendMessage = () => {
  //     let messages = [...this.state.messages, this.state.value];

  //     this.setState(
  //       {
  //         messages
  //       },
  //       () => this.scrollToMyRef()
  //     );
  //   };

  scrollToMyRef = () => {
    const scroll =
      this.chatContainer.current.scrollHeight -
      this.chatContainer.current.clientHeight;
    this.chatContainer.current.scrollTo(0, scroll);
  };

  render() {
    return (
      <div className="chatwindow">
        <div ref={this.chatContainer} className="chatdatascroller">

          {this.state.messages?.map((txs, index) => {
            // console.log(txs.user_id+" "+ this.props.id+" "+(txs.user_id== this.props.id))
            if (txs.yours) {
              return (<div key={txs.id} className="sendedmessage">
                <p className='name_date'>
                  {txs.send_date.substr(11)}
                </p><br />
                <div className='msgtxt'>{txs.text}</div>
              </div>)
            } else {
              return (<div key={txs.id} className="receivedmessage">
                <p className='name_date'>
                  {txs.username}
                </p>
                <p className='date_date'>{txs.send_date.substr(11)}</p><br />
                <div className='msgtxt'>{txs.text}</div>
              </div>)
            }
          })}
        </div>

        {/* <input value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.sendMessage}>SEND</button> */}
        <form className="messaging" >
          <textarea className="chatting" name="chatting" id="chat-message-input" placeholder="message..." value={this.state.value} onChange={this.handleChange} autoFocus />
          <button id="chat-message-submit" type='button' className="sendmessage" >Send</button>
        </form>
      </div>
    );
  }
}

export default Chat;
