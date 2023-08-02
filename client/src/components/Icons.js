import React from 'react'
import { AiOutlineSmile } from 'react-icons/ai'

const Icons = ({setContent, content, theme}) => {

    const smileys = [
        '🙂', '😀', '😄', '😆', '😅', '😂', '🤣', '😊', '😌', '😉', '😏', '😍', '😘', '😗', '😙', '😚', '🤗', '😳', '🙃', '😇', '😈', '😛', '😝', '😜', '😋', 
        '🤤', '🤓', '😎', '🤑', '😒', '🙁', '😞', '😔', '😖', '😓', '😢', '😭', '😟', '😣', '😩', '😫', '😕', '🤔', '🙄', '😤', '😠', '😡', '😶', '🤐',
        '😐', '😑', '😯', '😲', '😧', '😨', '😰', '😱', '😪', '😴', '😬', '🤥', '🤧', '🤒', '😷', '🤕', '😵', '🤢', '🤠', '🤡', '👿', '👹', '👺', '👻', '💀',
        '👽', '👾', '🤖', '💩', '🎃'
    ]

    const gestures = [
        '👍', '👎', '✌️', '🤞', '👌', '🤙', '🤘', '🖕', '☝️', '💅', '👉', '👈', '👇', '👆', '👊', '✊', '🤜', '🤛', '💪', '✍️', '🙏', '🤳'
    ]
    
    return (
        <div className="nav-item dropdown" 
        style={{filter: theme ? 'invert(1)' : 'invert(0)', opacity: 1, paddingRight: '10px'}}>
            <span className="nav-link position-relative px-0" id="navbarDropdown" role="button" 
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                
                <AiOutlineSmile style={{fontSize: '26px', filter: theme ? 'invert(1)' : 'invert(0)'}}/>

            </span> 
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <div className='reactions'>
                    <div className='icon_label'>Smileys</div>
                    <div className='icon_display'>
                    {
                        smileys.map(icon => (
                            <span key={icon} onClick={() => setContent(content + icon)}>
                                {icon}
                            </span>
                        ))
                    }
                    </div>
                    <div className='icon_label'>Gestures</div>
                    <div className='icon_display'>
                    {
                        gestures.map(icon => (
                            <span key={icon} onClick={() => setContent(content + icon)}>
                                {icon}
                            </span>
                        ))
                    }
                    </div>
                </div>
            </div>        
        </div>   
    )
}

export default Icons
