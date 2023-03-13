import React from "react";
import './Post.css'
import {
  Form, Button, FloatingLabel,
  Modal,
  handleClose
} from "react-bootstrap";
import Cookies from 'universal-cookie';
const cookie = new Cookies()
function cookieGet() {
  return cookie.get('token');
}

// function submitPost(event){

// }

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      text: this.props.text
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeEdit = this.closeEdit.bind(this)
  }


  handleSubmit(event) {
    event.preventDefault()

    var toke = cookieGet('token')
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + toke
      },
      body: JSON.stringify({
        title: this.state.title,
        text: this.state.text
      })
    };
    // console.log(requestOptions)
    fetch('http://'+window.server_url+'/post/edit_post/' + this.props.id + "/", requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        var tooken = data
        // this.props.history.push('/')
        // console.log(tooken)
        this.closeEdit(event)
        this.props.getposts(tooken)
      })
  }
  closeEdit(e){
    const main=e.target.parentNode.parentNode.parentNode.parentNode.parentNode
    main.style.display = 'none'
    document.body.style.overflow ='scroll'
  }


  render() {
    return (
      <div className="blur-screen">
        <Modal.Dialog >
        <Modal.Header >
          <Modal.Title>Edit post</Modal.Title>
        </Modal.Header>
        <Form >
          <Form.Group className="mb-3 m-3">
            {/* <Form.Control type="file" placeholder="upload images" onChange={(event) => {
              this.setState({ image: event.target.files[0] })
            }}></Form.Control><br /> */}
            <Form.Control type="text" placeholder="Title" value={this.state.title} onChange={(event) => {
              this.setState({ title: event.target.value })
            }} /><br />
            <Form.Control
              as="textarea"
              placeholder="Text"
              value={this.state.text}
              style={{ height: '100px' }}
              onChange={(event) => {
                this.setState({ text: event.target.value })
              }}
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
            <Button variant="secondary" onClick={(e)=>{this.closeEdit(e)}}>Close</Button>
            <Button variant="primary" type="submit" onClick={(e)=>{this.handleSubmit(e)}}>Edit</Button>
          </Modal.Footer>
        </Form>

      </Modal.Dialog>
      </div>

      
      // <div>
      //     <Button variant="primary" onClick={this.setState({show:"true"})}>
      //         Launch static backdrop modal
      //       </Button>

      // <Modal
      //       show={this.state.show}
      //       onHide={handleClose}
      //       backdrop="static"
      //       keyboard={false}
      //     >
      //       <Modal.Header closeButton>
      //         <Modal.Title>Modal title</Modal.Title>
      //       </Modal.Header>
      //       <Modal.Body>
      //         I will not close if you click outside me. Don't even try to press
      //         escape key.
      //       </Modal.Body>
      //       <Modal.Footer>
      //         <Button variant="secondary" onClick={this.setState({show: "false"})}>
      //           Close
      //         </Button>
      //         <Button variant="primary">Understood</Button>
      //       </Modal.Footer>
      //     </Modal>

      // </div>


    )
  }
}

export default CreatePost
