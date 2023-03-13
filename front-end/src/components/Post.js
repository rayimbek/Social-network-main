import React from "react";
import {
  Card, ListGroup, ListGroupItem, Button, ButtonGroup,
  Container, Row, Col, Accordion, InputGroup, Form, Carousel
} from 'react-bootstrap';
import './Post.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import EditPost from "./EditPost";
import Comment from "./Comment";
import axios from "axios";


import Cookies from 'universal-cookie';
const cookie = new Cookies()
function cookieGet() {
  return cookie.get('token');
}


class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // show: false,
      currloc:'',
      bkmark: this.props.bookmarked,
      likes: this.props.liked,
      likenum: this.props.likes_count,
      comments: [],
      commtxt: ''
      // commcount: this.props.commcount
    }
    // console.log(this.props.liked)\
    // this.showmod = this.showmod.bind(this);
    this.bookmrk = this.bookmrk.bind(this);
    // this.closemod = this.closemod.bind(this);
    this.getComments = this.getComments.bind(this)
    this.createComment = this.createComment.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    // this.closeEdit = this.closeEdit.bind(this)
    this.updatePost = this.updatePost.bind(this)
  }
  componentDidMount() {
    this.getComments()
    
// if(parts[parts.length - 1] == 'trucks.php') {
//     location.href = 'some-other-page';
// }

  }
  bookmrk(e) {
    e.preventDefault()
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

    fetch('http://'+window.server_url+'/post/bookmark_post/' + this.props.id + "/", requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ bkmark: data })
      });
  }
  likes(e) {
    e.preventDefault()
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

    fetch('http://'+window.server_url+'/post/like_post/' + this.props.id + "/", requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ likes: data['Liked'] })
        this.setState({ likenum: data['likes_count'] })
        // let num = parseInt(this.state.likenum)
        // if (data['liked']) num = num+1
        // else num = num-1
        // this.setState({likenum:num})
      });
  }
  // showmod(e) {
  //   e.preventDefault()
  //   this.setState({ show: true })
  // }
  // closemod(e) {
  //   e.preventDefault();
  //   this.setState({ show: false })
  // }

  getComments(id) {
    let idm
    this.props ? idm = this.props.id : idm = id
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
    // console.log(this.props.id)
    fetch('http://'+window.server_url+'/post/post_comments/' + idm, requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        // console.log(data)
        this.setState({ comments: data })
      });
  }
  // creatComment(e){

  // }
  delPost(e) {
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

    fetch('http://'+window.server_url+'/post/delete_post/' + this.props.id + "", requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data)
        this.props.updpost()

      });
  }
  createComment(ev) {
    let form_data = new FormData();
    form_data.append('text', this.state.commtxt)
    form_data.append('post', this.props.id)
    let url = 'http://'+window.server_url+'/post/create_comment/';
    const toke = cookieGet()
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Token ' + toke
      }
    })
      .then(res => {
        this.getComments()
        console.log(res.status)
        console.log(res)
        this.setState({ commtxt: '' })
      })
      .catch(err => console.log(err))

  }
  handleEdit(e) {
    const edit = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    // console.log(edit)
    edit.previousSibling.style.display = 'block'
    document.body.style.overflow = 'hidden'
  }
  updatePost(data) {
    this.props.updpost()
  }
  render() {
    return (
      <div>
        <EditPost id={this.props.id} getposts={this.updatePost} title={this.props.title} text={this.props.text} closeEdit={this.closeEdit} />
        <Card >
          <Carousel>

            {this.props.images?.map((data, key) => {
              // console.log(data)
              return (
                <Carousel.Item key={data.id}>
                  <Card.Img variant="top" src={data.image} />

                  <Carousel.Caption>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })}
            {this.props.video?.map((data, key) => {
              // console.log(data.audio)
              return (
                <Carousel.Item key={data.id}>
                  <video controls width='100%' autoPlay>
                    <source src={data.video} type="video/mp4" />
                  </video>

                  <Carousel.Caption>

                  </Carousel.Caption>
                </Carousel.Item>
              )
            })}
          </Carousel>
          <Card.Body>
            <Card.Title>{this.props.title}</Card.Title>
            <Card.Text>{this.props.text}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Container>

              {this.props.audio?.map((data, key) => {
                // console.log(data.video)
                return (
                  <audio key={data.id} width="320" height="240" controls>
                    <source src={data.audio} type="audio/mp3" />
                  </audio>
                )
              })}
              <Row>
                <Col>
                {this.props.currloc === 'post' ? (<ButtonGroup >
                    <Row>
                      <Col xs md="5"><Button value={this.props.id} onClick={(e) => this.handleEdit(e)}>Edit</Button></Col>
                      <Col xs md="5"><Button value={this.props.id} onClick={(e) => this.delPost(e)}> Delete</Button></Col>
                    </Row>
                  </ButtonGroup>) :'' }
                  
                </Col>
                <Col xs lg="2">
                  {this.state.bkmark === true ? <i className="bi bi-bookmark-check-fill" onClick={(e) => this.bookmrk(e)} /> : <i className="bi bi-bookmark" onClick={(e) => this.bookmrk(e)} />}
                </Col>
                <Col xs lg="3">
                  {this.state.likes === true ? <i className="bi bi-heart-fill " onClick={(e) => this.likes(e)} /> : <i className="bi bi-heart " onClick={(e) => this.likes(e)} />}
                  <p>{this.state.likenum}</p>
                </Col>
              </Row>
            </Container>

          </Card.Body>
          <Card.Footer>
            <Container>
              <Row>
                <Col>Author: {this.props.author}</Col>
                <Col xs>Last update: {this.props.pub_date}</Col>
              </Row>
            </Container>
          </Card.Footer>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Comments {(" "+this.props.commcount)}</Accordion.Header>
              <Accordion.Body>
                {this.state.comments?.map((ps, key) => {
                  // console.log(ps)
                  return (
                    <Comment
                      key={ps.id}
                      // author={ps.author}
                      // embedded_likes_count= {ps.embedded_likes_count}
                      id={ps.id}
                      text={ps.text}
                      liked={ps.liked}
                      author={ps.author_name}
                      likes={ps.embedded_likes_count}
                      pub_date={ps.pub_date}
                      getComments={this.getComments}
                      post={ps.post}
                      yours = {ps.yours}
                    />
                  );
                })}
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="comment"
                    aria-label="comment"
                    aria-describedby="basic-addon2"
                    onChange={(ev) => { this.setState({ commtxt: ev.target.value }) }}
                    value={this.state.commtxt}
                  />
                  <Button variant="outline-secondary" id="button-addon2" onClick={(event) => {
                    this.createComment(event.target.value)
                  }}>
                    Send
                  </Button>
                </InputGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      </div>

    )
  }
}
//Create post{Title, }, write comment
export default Post