import React from 'react';
// import {
//   Navigate
// } from "react-router-dom";
// import {Button, Card, ListGroup, ListGroupItem, Accordion} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { MemoryRouter, Switch, Route } from 'react-router-dom';
// import { LinkContainer } from 'react-router-bootstrap';
import './Home.css';
import Header from './components/Header'
import axios from "axios";
import Footer from './components/Footer';
import Listposts from './components/Listposts';
import Post from './components/Post';
import Cookies from 'universal-cookie';
import CreatePost from './components/CreatePost';
import CreateStory from './components/CreateStory';
import UserStory from './components/UserStory';
const cookie = new Cookies()

window.server_url = '10.1.11.249:8000';
// window.server_url = '127.0.0.1:8000';

function cookieGet() {
    return cookie.get('token');
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            ustory: []
            // status: checkSession()
        };
        this.getPosts = this.getPosts.bind(this);
        this.opencrPost = this.opencrPost.bind(this);
        this.getStories = this.getStories.bind(this);
        this.checkLog();
    }
    componentDidMount() {
        this.getStories();
        this.getPosts();

    }


    checkLog() {
        let data = cookieGet()
        if (data == undefined) {
            document.location.href = '/login'
        }
    }

    getPosts() {
        const toke = cookieGet()
        // console.log(toke)
        if (toke === undefined) {
            console.log('token is empty')
            return []
        }
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + toke
            }
        };

        fetch('http://'+window.server_url+'/post/all_posts/', requestOptions)
            .then(res => {
                return res.json();
            })
            .then(data => {
                this.setState({ posts: data })
                //   console.log(this.state.posts)
            });


    }
    getStories() {
        const toke = cookieGet();
        axios.get('http://'+window.server_url+'/post/users_stories/', {
            headers: {
              'content-type': 'multipart/form-data',
              'Authorization': 'Token ' + toke
            }
          }).then(res => {
            return res.data
        }).then(data => {
            this.setState({ ustory: data }, function(){
                console.log(this.state.ustory)
            })
        })
    }

    opencrPost(e) {
        document.body.style.overflow = 'hidden';
        e.target.nextSibling.style.display = 'block';
    }



    render() {
        return (
            <div className="body">
                <Header currloc='home' />
                <div className='postscontain'>
                    <div id='stories'>
                    <button className='creatstory' onClick={(e) => { this.opencrPost(e) }}>+</button>
                    <CreateStory updatepost={this.getStories} /><br />
                        {this.state.ustory?.map((str) => {
                            return <UserStory updatepost={this.getStories} uname={str.username} key={str.id} id={str.id} />
                        })}
                    </div>
                    <button className='createpost' onClick={(e) => { this.opencrPost(e) }}>Create POST</button>
                    <CreatePost updatepost={this.getPosts} closen={(e) => { this.setState({ crshow: false }) }} /><br />

                    {this.state.posts?.map((ps, key) => {
                        // console.log(ps)
                        return (
                            <Post
                                key={ps.id}
                                author={ps.author_name}
                                id={ps.id}
                                pub_date={ps.pub_date}
                                text={ps.text}
                                title={ps.title}
                                images={ps.images}
                                video={ps.videos}
                                audio={ps.audios}
                                liked={ps.liked}
                                likes_count={ps.embedded_likes_count}
                                bookmarked={ps.bookmarked}
                                updpost={this.getPosts}
                                currloc='home'
                                commcount={ps.comments_count}
                            />
                        )
                    })}
                    {/* <Listposts data={this.state.posts}/> */}

                </div>
                <Footer />

            </div>
        )
    }
}

export default Home;