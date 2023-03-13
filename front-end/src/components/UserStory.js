import React, { useState } from "react";
import {
    ListGroup, NavLink, Accordion,
    InputGroup, FormControl, Button,
    Modal, Form, Col, Popover, OverlayTrigger
} from 'react-bootstrap';
import axios from "axios";
import '../Home.css';
import backim from "../assets/images/anonym.png"


import Cookies from 'universal-cookie';
const cookie = new Cookies()
function cookieGet() {
    return cookie.get('token');
}

function Window(props) {
    const [viss, setvis] = useState([]);
    
    const popover = (
            <Popover id="popover-basic">
                <Popover.Header as="h3">Visitors</Popover.Header>
                <Popover.Body>
                        {viss.map((vis) => {
                            return <p> {vis}<hr/></p>
                        })}
                </Popover.Body>
            </Popover>
        );
    // console.log(props.results[0].id)
    const visits = (e) => {
        e.preventDefault()
        const toke = cookieGet();
        axios.get('http://' + window.server_url + '/post/story_readers/' + props.results[0].id, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Token ' + toke
            }
        }).then(res => {
            return res.data
        }).then(data => {
            // setwin(true)
            setvis(data.readers)
        })
    }
    const delSt = (e) => {
        e.preventDefault()
        const toke = cookieGet();
        axios.delete('http://' + window.server_url + '/post/delete_story/' + props.results[0].id, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Token ' + toke
            }
        }).then(() => {
            props.close(e);
        })
    }
    return (

        <div className="blur-screen" style={{ display: 'block' }} onClick={(e) => { props.close(e) }}>
            <Modal.Dialog >
                <Modal.Header >
                    <Modal.Title>{props.user}</Modal.Title>
                    {props.results[0].yours==true ? 
                    <OverlayTrigger trigger="click" placement="left" overlay={popover}>
                    <button className="bi bi-three-dots-vertical storymenu" style={{ display: 'block' }} onClick={(e)=>{visits(e)}}></button>
                    </OverlayTrigger>:''}
                    
                    <button type="button" className="btn-close" style={{ display: 'block' }} aria-label="Close" onClick={(e) => { props.close(e) }} />
                </Modal.Header>
                <Modal.Body>
                    <div className="slid slid-left" onClick={(e) => { props.nextf(e, props.previous) }}></div>
                    <div className="slid slid-right" onClick={(e) => { props.nextf(e, props.next) }}></div>
                    <div className="strnum">
                        {props.count.map((i, key)=>{
                            return <div key={i} className="stritem"></div>
                        })}
                    </div>
                    <img src={props.results[0].image} />
                </Modal.Body>
                {props.results[0].yours == true ?
                    <Modal.Footer>
                        <button className="createpost" value={props.results[0].id} onClick={(e) => delSt(e)}>Delete</button>

                    </Modal.Footer> : ''}
            </Modal.Dialog>
        </div>
    )
}


export default function UserStory(props) {
    // const [win, setwin] = useState(false);
    const [str, setstr] = useState(null);

    const ref = React.createRef();
    const next = (e, nex) => {
        e.preventDefault()
        if (nex === null) {
            close(e, true);
            return
        }
        const toke = cookieGet();
        axios.get(nex, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Token ' + toke
            }
        }).then(res => {
            return res.data
        }).then(data => {
            // setwin(true)
            let fcs = [];
            for(let i =0;i<data.count; i++){
                fcs.push(i);
            }
            setstr(<Window
                count={fcs}
                next={data.next}
                previous={data.previous}
                results={data.results}
                user={props.uname}
                close={close}
                nextf={next}
            />)
        })
    }

    const handleClick = (e) => {
        if (e.target.classList[0] !== 'userstory')
            return;
        e.preventDefault()
        const toke = cookieGet();
        axios.get('http://' + window.server_url + '/post/user_stories/' + props.id, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Token ' + toke
            }
        }).then(res => {
            return res.data
        }).then(data => {
            let fcs = [];
            for(let i =0;i<data.count; i++){
                fcs.push(i);
            }
            setstr(<Window
                count={fcs}
                next={data.next}
                previous={data.previous}
                results={data.results}
                user={props.uname}
                close={close}
                nextf={next}
            />)
            
        })

    }
    const close = (e, doit=false) => {
        const classes = ['btn-close', 'blur-screen', 'createpost']
        if(doit){

        }
        else if (!classes.includes(e.target.classList[0]))
            return;
        e.preventDefault();
        setstr(null);
        props.updatepost();
    }

    return (
        <div className="userstpar">
            <div className="userstory" style={{
                backgroundImage: `url(${backim})`
            }}
                onClick={(e) => { handleClick(e) }}
            >
                {str}
            </div>
            <p>{props.uname}</p>
        </div>
    )

}