
import React from 'react';
import Post from './Post';

const ListPosts = (data)=>{
    console.log(data)
    if (data.length === 0){
        return 'yes'
    }else{
        return data && data?.map((ps, key) => {
            return (
                <Post
                    key = {ps.id}
                    author={ps.author}
                    embedded_likes_count= {ps.embedded_likes_count}
                    id= {ps.id}
                    pub_date= {ps.pub_date}
                    text= {ps.text}
                    title= {ps.title}
                />  
            );
        })
    }
    
}

export default ListPosts