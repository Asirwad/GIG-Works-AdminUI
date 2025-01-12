import React from 'react'
import "./AddJobs.css"
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { motion } from 'framer-motion';

const AddJobs = () => {
    const saveClick = () => {
        alert("Save Clicked")
    }
    const submitClick = () => {
        alert("Submit Clicked")
    }
    
    return (
        <motion.div
            initial={{ x: 50, opacity: 0}}
            whileInView={{ x: 0, opacity: 1}}
            transition={{ duration: 0.5}}
            viewport={{ amount: 0.3, once: true}}
        >
            <div className='container-addJobs'>
                <div className='mt-8'>
                    <div className='addjobs-coverbox'>
                        <h2 className="text-2xl font-semibold text-gray-800">Add New Job</h2>
                        <p className="text-sm text-gray-600 mb-8">Fill in the details for the new job posting below.</p>
                        <Input placeholder="Heading" className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400"/>
                        <Input placeholder="Description" className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400"/>
                        <Input placeholder="Task" className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400"/>
                        <Input placeholder="Ustar Points" className="w-full px-4 py-2 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400"/>
                        <div className='addJob-btn-box'>
                            <Button className="bg-green-600 hover:bg-green-500 text-white text-sm px-6 py-2 rounded-lg transition duration-300" buttonName="Save" onClick={saveClick}/>
                            <Button className="bg-green-600 hover:bg-green-500 text-white text-sm px-6 py-2 rounded-lg transition duration-300" buttonName="Submit" onClick={submitClick}/>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default AddJobs
