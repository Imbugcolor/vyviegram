import React from 'react'
import { useParams } from 'react-router-dom'
import Notfound from './components/Notfound';

const generatePage = (slug) =>{
    const component = () => require(`./pages/${slug}`).default;
    try {
        return React.createElement(component())
    } catch (error) {
        return <Notfound/>
    }
}

const PageRender = () => {
    const {page, id} = useParams()
   let slug = "";
   if(id){
    slug = `${page}/[id]`;
   }
   else{
    slug = `${page}`;
   }
   console.log(slug)
  return generatePage(slug)
}

export default PageRender