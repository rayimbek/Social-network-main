import React from "react";
import {
  Card, ListGroup, ListGroupItem, Button, ButtonGroup,
  Container, Row, Col, Form, Modal
} from "react-bootstrap";
import './Post.css'

import Cookies from 'universal-cookie';
const cookie = new Cookies()
function cookieGet() {
  return cookie.get('token');
}



class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      likes: null,
      likenum: 0
    }
    this.editComment = this.editComment.bind(this);
    this.editCommentComp = this.editCommentComp.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
  }
  componentDidMount() {
    // console.log(this.props.post)
    this.setState({ text: this.props.text })
    this.setState({ likes: this.props.liked })
    this.setState({likenum: this.props.likes})
  }
  // setedit(e) {
  //   e.preventDefault()
  //   this.setState({ edit: true })
  // }
  editComment(event) {
    event.preventDefault()

    var toke = cookieGet('token')
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + toke
      },
      body: JSON.stringify({
        text: this.state.text
      })
    };
    console.log(requestOptions)
    fetch('http://'+window.server_url+'/post/edit_comment/' + this.props.id + "/", requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        // this.props.history.push('/')
        this.setState({ text: data['text'] }, function () {
          console.log(this.state.text)
        })
      })
  }

  likes(e) {
    if (e) e.preventDefault()
    const toke = cookieGet()
    if (toke === null) {
      return []
    }
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + toke
      }
    };

    fetch('http://'+window.server_url+'/post/like_comment/' + this.props.id + "/", requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ likes: data['Liked'] })
        this.setState({likenum: data['likes_count']})

      });
  }

  editCommentComp(ev) {
    const grand = ev.target.parentNode.parentNode
    grand.parentNode.style.display = 'none'
    grand.parentNode.previousSibling.style.display = 'none'
    grand.parentNode.previousSibling.previousSibling.style.display = 'block'
  }

  closeEdit(ev) {
    const grand = ev.target.parentNode.parentNode
    grand.parentNode.parentNode.style.display = 'none'
    grand.parentNode.parentNode.nextSibling.style.display = 'block'
    grand.parentNode.parentNode.nextSibling.nextSibling.style.display = 'block'
    console.log(grand.parentNode.parentNode.nextSibling)
  }
  delComment(e) {
    e.preventDefault()
    const toke = cookieGet()
    if (toke === null) {
      return []
    }
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + toke
      }
    };

    fetch('http://'+window.server_url+'/post/delete_comment/' + this.props.id + "", requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data)
        this.props.getComments(this.props.post)
      });
  }
  

  render() {
    return (
      <Card>
        <Card.Header>
          <Row className="justify-content-center">
            <Col lg="6">Author: {this.props.author}</Col>
            <Col>Last update: {this.props.pub_date}</Col>
          </Row>
        </Card.Header>
        <Form.Group className="mb-3" style={{ display: 'none' }}>
          <Form.Control
            as="textarea"
            placeholder="Text"
            value={this.state.text}
            style={{ height: '100px' }}
            onChange={(event) => {
              this.setState({ text: event.target.value })
            }}
          />
          <ButtonGroup className="justify-content-end">
            <Row>
              <Col xs md="5"><Button  onClick={(ev) => { this.closeEdit(ev); this.setState({text:this.props.text}) }}>Close</Button></Col>
              <Col xs md="5"><Button  type="submit" onClick={(ev) => { this.closeEdit(ev); this.editComment(ev) }}>Edit</Button></Col>
            </Row>
          </ButtonGroup>
        </Form.Group>
        <Card.Body >
          {this.state.text}
        </Card.Body>
        <Card.Footer>
          <Row className="justify-content-center">
            <Col xs md="6"></Col>
            <Col lg="2">{this.props.yours===true ? <Button onClick={(e) => this.editCommentComp(e)}>Edit</Button>:''}</Col>
            <Col lg="2">{this.props.yours===true ? <Button onClick={(e)=>{this.delComment(e)}}> Delete</Button>:''}</Col>
            <Col xs lg="2">
              {this.state.likes === true ? <i className="bi bi-heart-fill " onClick={(e) => this.likes(e)} /> : <i className="bi bi-heart " onClick={(e) => this.likes(e)} />}
              <p>{this.state.likenum}</p>
            </Col>
          </Row></Card.Footer>
        {/* {this.state.edit === true ? this.editCommentComp() : ""} */}
      </Card>
    )
  }
}

export default Comment