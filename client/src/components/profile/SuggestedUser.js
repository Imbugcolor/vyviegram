import React, { useEffect, useRef, useState } from 'react'
import { SwiperSlide, Swiper } from 'swiper/react';
import SwiperCore, { Navigation} from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import UserCard from '../UserCard';
import FollowBtn from '../FollowBtn';
import Followers from './Followers';

const SuggestedUser = ({id, auth, profile}) => {
    SwiperCore.use([Navigation]);

    const swiperRef = useRef(null);
    const [userData, setUserData] = useState([]);
    const [followedBy, setFollowedBy] = useState([])
    const [showFollowers, setShowFollowers] = useState(false);

    useEffect(() => {
        const newData = profile.users.find(user => user._id === id && user._id !== auth.user._id);
        setUserData([newData]);
      
        if (newData) {
          const followingIds = auth.user.following.map(user => user._id);
      
          const notFollowedByUser = newData.followers.filter(follower => !followingIds.includes(follower._id));
      
          setFollowedBy(notFollowedByUser);
        }
    }, [id, profile.users, auth.user.following, auth.user._id]);
    
    return (
        <div className='no_posts'>
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
}

export default SuggestedUser
