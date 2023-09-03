import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserCard from '../UserCard'
import FollowBtn from '../FollowBtn'
import LoadIcon from "../../images/loading.gif"
import { getSuggestions } from '../../redux/actions/suggestionsAcion'
import CardHover from './post_card/CardHover'
const RightSidebar = () => {
    const {auth, suggestions} = useSelector(state => state)
    // console.log(suggestions)
    const dispatch = useDispatch()
    return ( 
    <div className="mt-3" style={{ maxWidth: '380px'}}>
        <UserCard user={auth.user}/>

        <div className="d-flex justify-content-between align-items-center my-2">
            <h6 style={{color: '#666666'}}>Suggested for you</h6>
            {
                !suggestions.loading && 
                <i className="fas fa-redo" style={{cursor:'pointer'}}
                onClick={() => dispatch(getSuggestions(auth.token))}
                />
            }
            
        </div>
        {

            suggestions.loading
            ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4"/>
            : <div className="suggestions">
                {
                    suggestions.users.map(user => (
                        <UserCard key={user._id} user={user}>
                            <CardHover user={user}/>
                            <FollowBtn user={user}/>
                            
                        </UserCard>
                    ))
                }
            </div>
        }
        <div style={{opacity: 0.5}} className="my-2" >
            <a href="https://www.facebook.com/tanvyqng/" target="_blank" rel="noreferrer"
                    style={{wordBreak: 'break-all'}} >
                       https://www.facebook.com/tanvyqng/
            </a>
            <small className="d-block">
                    Welcome to our channel "VYVIEGRAM"
            </small>

            <small>
                &copy; 2023 VYVIEGRAM
            </small>
        </div>
    </div>
  )
}

export default RightSidebar
