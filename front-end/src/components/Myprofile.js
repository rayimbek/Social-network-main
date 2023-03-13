import React from "react";
import './Myprofile.css';
import { ListGroup, NavLink, Accordion, Nav, Navbar, Container } from 'react-bootstrap';
import Header from './Header'
import axios from "axios";
import Footer from './Footer';
import Post from './Post';
import Friend from './Friend';
import Profile from './Profile';


import Cookies from 'universal-cookie';
const cookie = new Cookies()
function cookieGet() {
  return cookie.get('token');
}




class Myprofile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      chats: null,
      books: null,
      perposts: null,
      perid: null
    };
    this.friendsref = React.createRef()
    this.postref = React.createRef()
    this.bookref = React.createRef()
    this.profileref = React.createRef()
    this.personpost = React.createRef()
    this.menu = React.createRef()
    this.addClasses = this.addClasses.bind(this)
    this.loadChats = this.loadChats.bind(this)
    this.rvclass = this.rvclass.bind(this)
    this.loadMyPosts = this.loadMyPosts.bind(this)
    this.loadMyBooks = this.loadMyBooks.bind(this)
    this.loadPersonPost = this.loadPersonPost.bind(this)
    this.creatChat = this.creatChat.bind(this)
    this.checkLog();
  }
  checkLog(){
    let data = cookieGet()
    if(data==undefined){
       document.location.href='/login'
    }
  }

  // getPosts() {
  //   const toke = cookieGet()
  //   // console.log(toke)
  //   if (toke === undefined) {
  //     console.log('token is empty')
  //     return []
  //   }
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Token ' + toke
  //     }
  //   };

  //   fetch('http://'+window.server_url+'/post/author_posts/', requestOptions)
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(data => {
  //       this.setState({ posts: data })
  //       //   console.log(this.state.posts)
  //       return data
  //     });


  // }
  componentDidMount() {
    this.loadChats()
    this.loadMyPosts()
    this.loadMyBooks()
  }
  loadMyBooks() {
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

    fetch('http://'+window.server_url+'/post/bookmarked_posts/', requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        data = data.reverse()
        this.setState({ books: data }, () => {
          // console.log(this.state.books)
        })
        return data
      });
  }
  loadMyPosts() {
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

    fetch('http://'+window.server_url+'/post/own_posts/', requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        data = data.reverse()
        this.setState({ posts: data }, () => {
          // console.log(this.state.posts)
        })
        return data
      });
  }
  toggle(ev, elem) {
    if (ev) ev.preventDefault()
    const friend = this.friendsref.current;
    const abby = document.location.toString();
    switch (elem) {
      case 'friend':
        this.profileref.current.style.display = 'none';
        this.friendsref.current.style.display = 'block';
        this.postref.current.style.display = 'none';
        this.bookref.current.style.display = 'none';
        this.personpost.current.style.display = 'none';
        document.location.href = abby.substr(0, abby.indexOf('#')) + '#friend'
        break;
      case 'post':
        this.profileref.current.style.display = 'none';
        this.friendsref.current.style.display = 'none';
        this.postref.current.style.display = 'block';
        this.bookref.current.style.display = 'none';
        this.personpost.current.style.display = 'none';
        document.location.href = abby.substr(0, abby.indexOf('#')) + '#post'
        break;
      case 'bookmarks':
        this.profileref.current.style.display = 'none';
        this.friendsref.current.style.display = 'none';
        this.postref.current.style.display = 'none';
        this.bookref.current.style.display = 'block';
        this.personpost.current.style.display = 'none';
        document.location.href = abby.substr(0, abby.indexOf('#')) + '#bookmarks'
        break;
      case 'profile':
        this.profileref.current.style.display = 'block';
        this.friendsref.current.style.display = 'none';
        this.postref.current.style.display = 'none';
        this.bookref.current.style.display = 'none';
        this.personpost.current.style.display = 'none';
        document.location.href = abby.substr(0, abby.indexOf('#'))
        break;
      case 'perpost':
        this.profileref.current.style.display = 'none';
        this.friendsref.current.style.display = 'none';
        this.postref.current.style.display = 'none';
        this.bookref.current.style.display = 'none';
        this.personpost.current.style.display = 'flex';
        document.location.href = abby.substr(0, abby.indexOf('#')) + '#authorposts'
        break;
      default:
    }
  }

  addClasses(e, id) {
    const elem = e.target;
    const prnt = elem.parentNode;
    const grand = prnt.parentNode;
    // console.log(prnt.children[2])
    const sibls = []
    let sibl = grand.firstElementChild;
    do {
      if (sibl != prnt) {
        sibls.push(sibl);
      }
    } while (sibl = sibl.nextElementSibling);

    sibls.forEach((el) => {
      el.style.display = 'none'
    })
    // const chat = <Chat key={id} id={id} />
    // prnt.children.concat(<Chat key={id} id={id} />)


    // prnt.children[2].style.display = "block"
    prnt.children[0].style.display = "inline-block"
  }
  rvclass(e, id) {
    const elem = e.target;
    const prnt = elem.parentNode;
    const grand = prnt.parentNode;
    const sibls = []
    let sibl = grand.firstElementChild;
    do {
      if (sibl != prnt) {
        sibls.push(sibl);
      }
    } while (sibl = sibl.nextElementSibling);

    sibls.forEach((el) => {
      el.style.display = 'block'
    })


    prnt.children[0].style.display = "none"

  }

  loadChats() {
    let url = 'http://'+window.server_url+'/chat/load_chats/';
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
        let chats = [];
        data.map((getts) => {
          var message_dat = {
            id: getts.id,
            friend: getts.friend,
            user: getts.user,
            created_date: getts.created_date
          };//send_date: data.send_date, owner: data.owner, chat: data.chat
          // console.log(message)
          chats.push(message_dat);
        });
        chats = chats.reverse()
        this.setState(
          {
            chats
          }
          // , function () {
          //   console.log('chats loaded')
          //   console.log(this.state.chats)
          // }
        );
        // console.log(this.state.messages);
      })
      .catch(err => console.log(err))
  }

  loadPersonPost(id) {
    // console.log('3 phase'+id)
    this.setState({ perid: id })
    if (!id) return
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

    fetch('http://'+window.server_url+'/post/author_posts/' + id, requestOptions)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ perposts: data }, () => {
          // console.log(this.state.perposts)
        })
        return data
      });
    this.toggle(null, 'perpost')
  }
  creatChat(e) {
    e.preventDefault()
    let form_data = new FormData();
    form_data.append('user', this.state.perid)
    // console.log('form_data content:')
    // for (var pair of form_data.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    let url = 'http://'+window.server_url+'/chat/start_chat/';
    const toke = cookieGet()
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Token ' + toke
      }
    })
      .then(res => {

        this.loadChats()
        this.menu.current.click()
        // console.log('[key= "'+res.data+'"]')
        console.log(this.friendsref.current.children[0].querySelector('#chat_' + res.data))
        this.friendsref.current.children[0].querySelector('#chat_' + res.data).children[1].click()
      })
      .catch(err => console.log(err))

  }


  render() {
    return (
      <div>
        <Header currloc='myprofile' loadthem={this.loadPersonPost} />
        <Navbar collapseOnSelect expand="lg" variant="dark" className="menulist">
  <Container>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
    <NavLink className="navbar-item"
            activeclassame="is-active"
            href="/myprofile"
            onClick={(event) => { this.toggle(event, 'profile') }}
            exact="true">My profile</NavLink>
    <NavLink className="navbar-item"
            ref={this.menu}
            activeclassame="is-active"
            href="#friends"
            onClick={(event) => { this.toggle(event, 'friend') }}
            exact="true">Friends</NavLink>
    <NavLink className="navbar-item"
              activeclassame="is-active"
              href="#post"
              onClick={(event) => { this.toggle(event, 'post') }}
              exact="true">My Posts</NavLink>
    <NavLink className="navbar-item"
              activeclassame="is-active"
              href="#bookmarks"
              onClick={(event) => { this.toggle(event, 'bookmarks') }}
              exact="true">My Bookamrks</NavLink>
            </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>
    
             <ListGroup variant="flush" className="flex-column bg-purple menu-bar list-group1" >
          <ListGroup.Item className="nav-item"><NavLink className="navbar-item"
            activeclassame="is-active"
            href="/myprofile"
            onClick={(event) => { this.toggle(event, 'profile') }}
            exact="true">My profile</NavLink></ListGroup.Item>
          <ListGroup.Item className="nav-item"><NavLink className="navbar-item"
            ref={this.menu}
            activeclassame="is-active"
            href="#friends"
            onClick={(event) => { this.toggle(event, 'friend') }}
            exact="true">Friends</NavLink></ListGroup.Item>
          <ListGroup.Item className="nav-item"><NavLink className="navbar-item"
            activeclassame="is-active"
            href="#post"
            onClick={(event) => { this.toggle(event, 'post') }}
            exact="true">My Posts</NavLink></ListGroup.Item>
          <ListGroup.Item className="nav-item"><NavLink className="navbar-item"
            activeclassame="is-active"
            href="#bookmarks"
            onClick={(event) => { this.toggle(event, 'bookmarks') }}
            exact="true">My Bookamrks</NavLink></ListGroup.Item>
        </ListGroup>
        
        <main>
          <section id="profile" className="justify-content-center" ref={this.profileref} style={{ display: 'block' }}>
            {/* <h1 style={{ margin: '0 auto' }}>Here is some profile data</h1> */}
            <Profile friends = {this.friendsref} posts={this.postref} books={this.bookref}/>
          </section>
          <section id="friends" className="friend-list" ref={this.friendsref} style={{ display: 'none' }}>

            <ListGroup id="friendsList">
              {this.state.chats?.map((ps, key) => {
                return (
                  <Friend
                    key={ps.id}
                    rvclass={this.rvclass}
                    addclass={this.addClasses}
                    id={ps.id}
                    friend={ps.friend}
                  />
                  // <ListGroup.Item key={ps.id}>
                  //   <button type="button" className="btn-close" aria-label="Close" onClick={(ev) => { this.rvclass(ev, ps.id) }} />
                  //   <div style={{ display: 'inline-block', width: '90%' }} onClick={(ev) => { this.addClasses(ev, ps.id) }}>
                  //     {ps.friend}
                  //   </div>
                  //   {/* <Chat
                  //     id={ps.id}
                  //   /> */}
                  // </ListGroup.Item>
                )
              })}
            </ListGroup>
          </section>
          <section id="post" ref={this.postref} style={{ display: 'none' }}>
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
                  updpost={this.loadMyPosts}
                  currloc='post'
                  commcount = {ps.comments_count}
                />
              )
            })}
          </section>
          <section id="bookmark" ref={this.bookref} style={{ display: 'none' }}>
            {this.state.books?.map((ps2, key) => {
              const ps = ps2['post']
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
                  updpost={this.loadMyPosts}
                  currloc='bookmark'
                  commcount = {ps.comments_count}
                />
              )
            })}
          </section>
          <section ref={this.personpost} style={{ display: 'none', flexDirection: 'column' }}>
            <button className='createchat' onClick={(e) => { this.creatChat(e) }}>Message</button>
            {this.state.perposts?.map((ps, key) => {
              // const ps = ps2['post']
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
                  updpost={this.loadMyPosts}
                  currloc='bookmark'
                />
              )
            })}
          </section>
        </main>
        <Footer />
      </div>

    )
  }

}

export default Myprofile