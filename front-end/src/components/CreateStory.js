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


class CreateStory extends React.Component {
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
    this.closePost = this.closePost.bind(this)
  }
  handleSubmit(event) {
    event.preventDefault()
    // this.props.closen()
    let form_data = new FormData();
    if (this.state.images !== []) this.state.images.forEach(x => form_data.append('image', x));
    // if (this.state.video.length > 0) form_data.append('video', this.state.video, this.state.video.name);
    // if (this.state.audio.length > 0) form_data.append('audio', this.state.audio, this.state.audio.name);
    // console.log('form_data content:')
    // for (var pair of form_data.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    let url = 'http://'+window.server_url+'/post/create_story/';
    const toke = cookieGet()
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Token ' + toke
      }
    })
      .then(res => {
        // this.props.updatepost(res.data)
        // console.log(res.status)
        // console.log(res)
      })
      .catch(err => console.log(err))
    this.closePost(event)
  }

  imagesCopy() {
    return this.state.images.length
  }


  handleImageUpload(event) {
    event.preventDefault()
    let filesim = [...this.state.images]
    Array.from(event.target.files).forEach(x=>filesim.push(x))
    this.setState({ images: filesim},()=>{
      // console.log(this.state.images)
    });
  }



  closePost(e) {
    const main = e.target.parentNode.parentNode.parentNode.parentNode
    main.style.display = 'none'
    document.body.style.overflow = 'scroll'
    this.setState({
      images: [],
    })
    this.props.updatepost()
  }
  render() {
    return (
      <div className="blur-screen">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Create story</Modal.Title>
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
            </Row>
          </Container>
          <hr />
            <Modal.Footer>
              <Button  onClick={this.closePost}>Close</Button>
              <Button  type="submit" onClick={(event) => this.handleSubmit(event)}>Create</Button>
            </Modal.Footer>

        </Modal.Dialog>
      </div>
    )
  }
}

export default CreateStory
