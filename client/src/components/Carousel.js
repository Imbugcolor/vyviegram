import React from 'react'
import { useSelector } from 'react-redux'
import Video from './Video';

const Carousel = ({images, id}) => {
    const isActive = index => {
        if(index === 0) return 'active';
    }
    
    const { theme } = useSelector(state => state)

    return (
        <div id={`image${id}`} className="carousel" data-interval="false">
            {
                images.length > 1 &&
                <ol className="carousel-indicators" style={{zIndex: 1, filter: theme ? 'invert(1)' : 'invert(0)'}}
                >
                    {
                        images.map((img, index) => (
                            <li key={index}
                                data-target={`#image${id}`} 
                                data-slide-to={index} 
                                className={isActive(index)}
                            >
                            </li>
                        ))
                    }
                
                
                </ol>
            }
            <div className="carousel-inner image__display">
                {
                    images.map((img, index) => (
                        <div key={index} 
                            className={`carousel-item ${isActive(index)}`}
                        >
                            {
                                img.url.match(/video/i) ?
                                // <video controls src={img.url} 
                                //     className="d-block w-100" 
                                //     alt={img.url}
                                //     style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                                // />  
                                <Video public_id={img.public_id}/> 
                                :
                                <img src={img.url} 
                                    className="d-block w-100" 
                                    alt={img.url}
                                    style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                                />
                            }
                            
                        </div>
                    ))
                }
            </div>

            {
                images.length > 1 &&
                <>
                    <a className="carousel-control-prev" href={`#image${id}`} role="button" data-slide="prev"
                    style={{width: '5%'}}>
                        <span className="carousel-control-prev-icon" aria-hidden="true" style={{filter: theme ? 'invert(1)' : 'invert(0)'}}></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href={`#image${id}`} role="button" data-slide="next"
                    style={{width: '5%', filter: theme ? 'invert(1)' : 'invert(0)'}}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </>
            }
            
        </div>
    )
}

export default Carousel
