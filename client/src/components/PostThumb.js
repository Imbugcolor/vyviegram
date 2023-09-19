import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiSquare2Stack, HiOutlineCamera } from 'react-icons/hi2'
import Video from './Video'
import { MdSlowMotionVideo } from 'react-icons/md'
import UserCard from './UserCard'
import FollowBtn from './FollowBtn'
import { SwiperSlide, Swiper } from 'swiper/react';
import SwiperCore, { Navigation} from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Followers from './profile/Followers'


const PostThumb = ({id, auth, posts, result, profile}) => {
    const { theme } = useSelector(state => state)
    SwiperCore.use([Navigation]);

    const swiperRef = useRef(null);
    const [userData, setUserData] = useState([]);
    const [followedBy, setFollowedBy] = useState([])
    const [showFollowers, setShowFollowers] = useState(false);

    useEffect(() => {
        //   const newData = profile.users.filter(user => user._id === id && user._id !== auth.user._id)
        //   setUserData(newData)
        //   let followByUser = []
        //     if(newData) {
        //         const tempArray = []
                
        //         auth.user.following.forEach(following => {
        //             newData[0]?.followers?.forEach(follower => {
        //                 if(follower._id !== following._id && auth.user._id !==follower._id && !tempArray.includes(follower._id))
        //                 followByUser.push(follower)
        //             // Thêm người dùng vào mảng tạm thời
        //                 tempArray.push(follower._id)
        //             })
        //         })
        //     }
        //   setFollowedBy(followByUser)

        const newData = profile.users.find(user => user._id === id && user._id !== auth.user._id);
        setUserData([newData]);
      
        if (newData) {
          const followingIds = auth.user.following.map(user => user._id);
      
          const notFollowedByUser = newData.followers.filter(follower => !followingIds.includes(follower._id));
      
          setFollowedBy(notFollowedByUser);
        }
      }, [id, profile.users, auth.user.following, auth.user._id]);
    

    if(result === 0) 
    return (
        <div className='no_posts'>
            <div className='no__posts_icon'>
                <HiOutlineCamera />
            </div>
            <h2 className='text-center'>No Posts Yet</h2>
            {
                id !== auth.user._id && (
                    <div style={{margin:"2vw", height:"200px"}}>
                        <div className="text-center-seeAll">
                            <span>Suggested for you</span>
                            <div className="see-allUser" onClick={() => setShowFollowers(true)}>
                                See all
                            </div>
                        </div>
                        
                        {
                            followedBy.length > 3 &&
                            <div className='suggest-follower'>
                                <Swiper
                                    modules={[Navigation]}
                                    navigation
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper;
                                    }}
                                    grabCursor={true}
                                    spaceBetween={10}
                                    slidesPerView={'4'}
                                    >
                                    {
                                    
                                        followedBy.map((user,i) => (
                                            <SwiperSlide key={i}>
                                                <UserCard key={user._id} user={user}>
                                                    <FollowBtn user={user}/>
                                                </UserCard> 
                                            </SwiperSlide>
                                        ))
                                    }

                                </Swiper>
                            </div>
                        }
                          
                    </div>
                )
            }
             {
                  showFollowers &&
                  <Followers 
                  users={followedBy} 
                  setShowFollowers={setShowFollowers} 
                  />
              }
        </div>
       
    )
  
    return (
    <div className='post_thumb'>
      {
            posts.map(post => (
                <Link key={post._id} to={`/post/${post._id}`}>
                    <div className='post_thumb_display'>
                        {
                            post.images[0].url.match(/video/i)
                            ?
                            <Video public_id={post.images[0].public_id}/>
                            :   
                            <img src={post.images[0].url} alt={post.images[0].url}
                                     style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                        }

                        {
                            post.images.length > 1 &&
                            <div className='images_stack'>
                                <HiSquare2Stack />                
                            </div> 
                        }

                        {
                            post.images.length === 1 && post.images[0].url.match(/video/i) &&
                            <div className='images_stack'>
                                <MdSlowMotionVideo />                
                            </div> 
                        }

                        <div className='post_thumb_menu'>
                            <i className='fas fa-heart react-icon'>{post.likes.length}</i>
                            <i className='fas fa-comment react-icon'>{post.comments.length}</i>
                        </div> 
                    </div>
                </Link>
            ))
      }
    </div>
  )
}

export default PostThumb
