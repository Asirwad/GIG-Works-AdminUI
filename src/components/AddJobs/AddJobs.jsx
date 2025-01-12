import React, { useState } from 'react'
import "./AddJobs.css"
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { motion } from 'framer-motion';
import axios from 'axios';

const AddJobs = () => {

    const uStarPointsMapping = new Map();
    uStarPointsMapping.set("1", "RisingStar");
    uStarPointsMapping.set("2", "ShiningStar");
    uStarPointsMapping.set("3", "SuperStar");
    uStarPointsMapping.set("4", "NovaStar");

    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        task: '',
        ustarPoints: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = () => {
        alert("Saved");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        const newErrors = {};
        for (const field in formData) {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        }
        if (Object.keys(newErrors).length === 0) {
            try {
                const payload = {
                    topic: formData.heading,
                    description: formData.description,
                    title: formData.task,
                    ustar_category: uStarPointsMapping.get(formData.ustarPoints),
                    email: "admin@email.com"
                };
                const response = await axios.post("http://localhost:8089/api/v1/create_gig", payload, {
                    headers: {
                        "Content-Type": "application/json",
                        user_id: '675712e7450aead0d3a404f7'
                    }
                });
                console.log(response);
                alert("Job Submitted Successfully");
            } catch (error) {
                alert("Error in submitting job");
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className='outer-box'>
            <motion.div
            initial={{ x: 50, opacity: 0}}
            whileInView={{ x: 0, opacity: 1}}
            transition={{ duration: 0.5}}
            viewport={{ amount: 0.3, once: true}}
            className='addjobs-coverbox sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto space-y-6'
            >
                <h1 className='text-2xl font-bold mt-4'>ADD JOB</h1>
                <form onSubmit={handleSubmit} className="w-1/2 sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto space-y-6">
                {["heading", "description", "task", "ustarPoints"].map((field) => (
                    <div key={field} className="bg-white rounded-lg shadow-sm">
                        <label
                            htmlFor={field}
                            className={`text-sm font-medium ${errors[field] ? "text-red-500" : ""}`}
                        >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                            {errors[field] && (
                                <span className="text-red-500 text-xs ml-1">Required</span>
                            )}
                        </label>
                        <Input
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className={`mt-1 ${errors[field] ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                    </div>
                ))}

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50"
                    >
                        Save
                    </Button>
                    <Button
                        type="submit"
                        className="bg-teal-600 text-white hover:bg-teal-700"
                    >
                        Submit
                    </Button>
                </div>
                </form>
            </motion.div>
        </div>
    );
}

export default AddJobs;
