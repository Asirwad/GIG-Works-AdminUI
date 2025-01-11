import React from 'react'
import "./AddJobs.css"
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
const AddJobs = () => {
    const saveClick=()=>{
        alert("Save Clicked")
    }
    const submitClick=()=>{
        alert("Save Clicked")
    }
    return (
        <div>
        <div className='container-addJobs'>
            <div className='addjobs-coverbox'>
            <Input placeholder="Headding"/>
            <Input placeholder="Description"/>
            <Input placeholder="Task"/>
            <Input placeholder="Ustar Points"/>
           
            </div>
            
            </div>
            <div className='addJob-btn-box'>
                <div><Button className = "bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded" buttonName="Save" onClick={saveClick}/></div>
                <div><Button className = "bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded" buttonName="Submit" onClick={submitClick}/></div>
            </div>
            </div>
    )
}

export default AddJobs