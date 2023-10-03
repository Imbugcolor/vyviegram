import React from 'react'
import Status from '../components/home/Status'
import Posts from '../components/home/Posts'
import { useSelector } from 'react-redux'
import LoadIcon from '../images/loading.gif'
import RightSidebar from '../components/home/RightSidebar'
import SuggestPosts from '../components/home/SuggestPosts'

const Home = () => {
    const { homePosts } = useSelector(state => state)
    return (
      <div className='home row mx-0'>
          <div className='col-md-7 center__side'>
            <Status />
            {
              homePosts.suggestion === true && 
              <div className='title_suggest_posts'>
                <h4>Suggested Posts</h4>
              </div>
            }
            {
                homePosts.loading ?
                <img src={LoadIcon} alt='loading' className='d-block mx-auto' />
                : (homePosts.result !== 0 && homePosts.posts.length !== 0 ) ?
                <Posts /> 
                : <SuggestPosts /> 
            }
          </div>
          
          <div className='col-md-4 right__side_bar'>
              <RightSidebar/>
          </div>
      </div>
    )
}

export default Home