import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';

const Search = () => {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])

  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()
    useEffect(() => {
      if(search && auth.token) {
        getDataAPI(`search?username=${search}`, auth.token)
        .then(res => console.log(res))
      }
    }, [search, auth.token]);
  return (
    <form className="search_form">
        <input type="text" name="search" value={search} id="search"
        onChange={e => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
        />
        <div className="search_icon" style={{opacity: search ? 0 : 0.3}}>
            <span className="material-icons" >search</span>
            <span>Search</span>
        </div>
        <div className="close_search">&times;</div>
    </form>
  )
}

export default Search