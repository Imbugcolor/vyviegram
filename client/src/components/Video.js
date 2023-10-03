import React, { useRef } from 'react'
import { AdvancedVideo, lazyload } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { useDispatch, useSelector } from 'react-redux';
import { FaPlay } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { GLOBALTYPES } from '../redux/actions/globalTypes';

const Video = ({ public_id, url }) => {
  const { theme } = useSelector(state => state)

  const dispatch = useDispatch()
  const videoId = uuidv4()

  const advancedVideoRef = useRef(null)
  
  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'vyvie-gram'
    }
  }); 

  // Use the video with public ID, 'docs/walking_talking'.
  const myVideo = cld.video(public_id);

  const handleVideoToggle = () => {
    const videoRef = advancedVideoRef.current.videoRef
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleOnPlay = () => {
    const playBtn = document.getElementById(videoId)
    playBtn.classList.remove('play-btn-active')
  }

  const handleOnPause = () => {
    const playBtn = document.getElementById(videoId)
    playBtn.classList.add('play-btn-active')
  }

  const handleView = () => {
    if(!url) return;
    dispatch({ type: GLOBALTYPES.MEDIA_VIEW, payload: url }) 
  }

  return (
    <div className='video_player'>
        <AdvancedVideo 
          id='videoPlayer'
          cldVid={myVideo} 
          cldPoster="auto" 
          plugins={[lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.25})]} 
          style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
          ref={advancedVideoRef}
          onClick={handleVideoToggle}
          onPlay={handleOnPlay}
          onPause={handleOnPause}
          onDoubleClick={handleView}
        />
        <FaPlay 
          id={videoId} 
          className='play-btn play-btn-active' 
          onClick={handleVideoToggle}
          style={{ filter: theme ? 'invert(1)' : 'invert(0)'}}
        />
    </div>
  )
}

export default Video
