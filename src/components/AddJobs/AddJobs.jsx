import React, { useState } from 'react'
import "./AddJobs.css"
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { motion } from 'framer-motion';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { applicationConfiguration as appConfig } from '../../AppConfig';
import { cn, getUStarName } from '../../lib/util';

const AddJobs = () => {

    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        task: '',
        ustarPoints: '1'
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
        toast.info("Job saved")
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
                    ustar_category: getUStarName.get(formData.ustarPoints),
                    email: "admin@email.com"
                };
                await axios.post(appConfig.api.BASE_URL + "/create_gig", payload, {
                    headers: {
                        "Content-Type": "application/json",
                        user_id: '675712e7450aead0d3a404f7'
                    }
                });
                toast.success("Job submitted successfully");
                resetForm();
                
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            } catch (error) {
                toast.error("Failed to submit job");
            }
        } else {
            setErrors(newErrors);
        }
    };

    const resetForm = () => {
        setFormData({ heading: "", description: "", task: "", ustarPoints: "" });
        setErrors({});
    };

    return (
        <div className="w-full h-full flex items-center justify-center py-12 px-6 bg-gray-50">
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ amount: 0.3, once: true }}
                className="w-full max-w-4xl lg:max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 p-10 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                    Add Job
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* First Row: Heading and UstarPoints */}
                    <div className="flex space-x-6">
                        {/* Heading Field */}
                        <div className="w-3/4">
                            <label
                                htmlFor="heading"
                                className={`block text-sm font-semibold mb-1 ${errors.heading ? "text-red-500" : "text-gray-700"}`}
                            >
                                Heading
                                {errors.heading && (
                                    <span className="text-red-500 text-xs ml-1">Required</span>
                                )}
                            </label>
                            <Input
                                id="heading"
                                name="heading"
                                value={formData.heading}
                                onChange={handleChange}
                                className={`w-full border rounded-lg p-3 text-sm ${errors.heading ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"}`}
                            />
                        </div>

                        {/* UstarPoints Field */}
                        <div className="w-1/4">
                            <label
                                htmlFor="ustarPoints"
                                className={`block text-sm font-semibold mb-1 ${errors.ustarPoints ? "text-red-500" : "text-gray-700"}`}
                            >
                                Ustar Points
                                {errors.ustarPoints && (
                                    <span className="text-red-500 text-xs ml-1">Required</span>
                                )}
                            </label>
                            <select
                                id="ustarPoints"
                                name="ustarPoints"
                                value={formData.ustarPoints}
                                onChange={handleChange}
                                className={`w-full border rounded-lg p-3 text-sm ${errors.ustarPoints ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"}`}
                            >
                                <option value="1">RisingStar</option>
                                <option value="2">ShiningStar</option>
                                <option value="3">SuperStar</option>
                                <option value="4">NovaStar</option>
                            </select>
                        </div>
                    </div>

                    {/* Second Row: Description and Task */}
                    <div className="flex space-x-6">
                        {/* Description Field */}
                        <div className="w-1/2">
                            <label
                                htmlFor="description"
                                className={`block text-sm font-semibold mb-1 ${errors.description ? "text-red-500" : "text-gray-700"}`}
                            >
                                Description
                                {errors.description && (
                                    <span className="text-red-500 text-xs ml-1">Required</span>
                                )}
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full h-48 border rounded-lg p-3 text-sm resize-none ${errors.description ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"}`}
                            />
                        </div>

                        {/* Task Field */}
                        <div className="w-1/2">
                            <label
                                htmlFor="task"
                                className={`block text-sm font-semibold mb-1 ${errors.task ? "text-red-500" : "text-gray-700"}`}
                            >
                                Task
                                {errors.task && (
                                    <span className="text-red-500 text-xs ml-1">Required</span>
                                )}
                            </label>
                            <textarea
                                id="task"
                                name="task"
                                value={formData.task}
                                onChange={handleChange}
                                className={`w-full h-48 border rounded-lg p-3 text-sm resize-none ${errors.task ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"}`}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            onClick={handleSave}
                            className="bg-gray-100 text-teal-600 border border-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-transform transform hover:scale-105 px-6 py-2 rounded-lg"
                        >
                            Save
                        </Button>
                        <Button
                            type="submit"
                            className="bg-teal-600 text-white hover:bg-teal-700 transition-transform transform hover:scale-105 px-6 py-2 rounded-lg"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </motion.div>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default AddJobs;
