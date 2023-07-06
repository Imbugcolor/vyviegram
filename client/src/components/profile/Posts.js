import React, { useEffect, useState } from 'react'
import PostThumb from '../PostThumb'

const Posts = ({auth,id,dispatch,profile}) => {
  const [posts, setPosts] = useState([])
  const [result, setResult] = useState(9)
  useEffect(() => {
    profile.posts.forEach(data => {
        if(data._id === id){
            setPosts(data.posts)
            setResult(data.result)
            
        }
    })
},[profile.posts, id])
  return (
    <PostThumb posts={posts} result={result} />

  )
}

export default Posts