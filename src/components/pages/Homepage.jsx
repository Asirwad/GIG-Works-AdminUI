import { useState } from 'react'
import React from 'react'
import Dashboard from '../Dashboard/dashboard'

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
       <>
       <Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
       {/* <Footer/> */}
       </> 
        
    </div>
  )
}

export default Homepage