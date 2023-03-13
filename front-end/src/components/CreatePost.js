import React from "react";
import {
  Form, Button, FloatingLabel,
  Modal,
  handleClose, Container, Row, Col
} from "react-bootstrap";
import "./Post.css"
import axios from "axios";
import Cookies from 'universal-cookie';
const cookie = new Cookies()
function cookieGet() {
  return cookie.get('token');
}


class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: "",
      images: [],
      video: [],
      audio: []
    }
    this.refs = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleVideoUpload = this.handleVideoUpload.bind(this);
    this.handleAudioUpload = this.handleAudioUpload.bind(this);
    this.closePost = this.closePost.bind(this)
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.closen()
    let form_data = new FormData();
    if (this.state.images !== []) this.state.images.forEach(x => form_data.append('image', x));
    if (this.state.video !==[]) this.state.video.forEach(x => form_data.append('video', x));
    if (this.state.audio !==[]) this.state.audio.forEach(x => form_data.append('audio', x));
    // if (this.state.video.length > 0) form_data.append('video', this.state.video, this.state.video.name);
    // if (this.state.audio.length > 0) form_data.append('audio', this.state.audio, this.state.audio.name);

    form_data.append('title', this.state.title);
    form_data.append('text', this.state.text);
    console.log('form_data content:')
    for (var pair of form_data.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    let url = 'http://'+window.server_url+'/post/make_post/';
    const toke = cookieGet()
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Token ' + toke
      }
    })
      .then(res => {
        this.props.updatepost(res.data)
        console.log(res.status)
        console.log(res)
      })
      .catch(err => console.log(err))
    this.closePost(event)
  }

  imagesCopy() {
    return this.state.images.length
  }
  videosCopy() {
    return this.state.video.length
  }
  audioCopy() {
    return this.state.audio.length
  }

  handleImageUpload(event) {
    event.preventDefault()
    let filesim = [...this.state.images]
    Array.from(event.target.files).forEach(x=>filesim.push(x))
    this.setState({ images: filesim},()=>{
      // console.log(this.state.images)
    });
  }
  handleVideoUpload(event) {
    event.preventDefault()
    let filesim = [...this.state.video]
    Array.from(event.target.files).forEach(x=>filesim.push(x))
    this.setState({ video: filesim},()=>{
      // console.log(this.state.video)
    });

  }
  handleAudioUpload(event) {
    event.preventDefault()
    let filesim = [...this.state.audio]
    Array.from(event.target.files).forEach(x=>filesim.push(x))
    this.setState({ audio: filesim},()=>{
      // console.log(this.state.audio)
    });
  }


  closePost(e) {
    const main = e.target.parentNode.parentNode.parentNode.parentNode.parentNode
    main.style.display = 'none'
    document.body.style.overflow = 'scroll'
    this.setState({
      audio: [],
      video: [],
      images: [],
      title: '',
      text: ''
    })
  }
  render() {
    return (
      <div className="blur-screen">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Create post</Modal.Title>
          </Modal.Header>
          <br />
          <Container>
            <Row>
              <Col xs lg='1' />
              <Col>
                <input
                  ref="fileInput1"
                  onChange={this.handleImageUpload}
                  type="file"
                  style={{ display: "none" }}
                  multiple={true}
                  accept="image/*"
                />
                <button className="inputbtn" onClick={(ev) => { this.refs.fileInput1.click() }} >Add Image</button>
                <p >{this.imagesCopy()}</p>
              </Col>
              <Col>
                <input
                  ref="fileInput2"
                  onChange={this.handleVideoUpload}
                  type="file"
                  style={{ display: "none" }}
                  multiple={true}
                  accept="video/*"
                />
                <button className="inputbtn" onClick={(ev) => { this.refs.fileInput2.click() }} >Add Video</button>
                <p >{this.videosCopy()}</p>
              </Col>
              <Col>
                <input
                  ref="fileInput3"
                  onChange={this.handleAudioUpload}
                  type="file"
                  style={{ display: "none" }}
                  multiple={true}
                  accept="audio/*"
                />
                <button className="inputbtn" onClick={(ev) => { this.refs.fileInput3.click() }} >Add Audio</button>
                <p >{this.audioCopy()}</p>
              </Col>
            </Row>
          </Container>
          <hr />
          <Form >
            <Form.Group className="mb-3 m-3">

              <Form.Control
                type="text"
                placeholder="Title"
                onChange={(event) => {
                  this.setState({ title: event.target.value })
                }}
                value={this.state.title}
                required /><br />
              <Form.Control
                as="textarea"
                placeholder="Text"
                style={{ height: '100px' }}
                onChange={(event) => {
                  this.setState({ text: event.target.value })
                }}
                value={this.state.text}
                required
              />
              {/* <FloatingLabel controlId="floatingTextarea2" label="Comments">
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      style={{ height: '100px' }}
                    />
                  </FloatingLabel> */}
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.closePost}>Close</Button>
              <Button variant="primary" type="submit" onClick={(event) => this.handleSubmit(event)}>Create</Button>
            </Modal.Footer>
          </Form>

        </Modal.Dialog>
      </div>
    )
  }
}

export default CreatePost
