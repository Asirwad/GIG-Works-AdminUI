import { React, useState } from 'react';
import { Bell } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import "./headder.css";
import Alljobs from '../AllJobs/Alljobs';
import AddJobs from '../AddJobs/AddJobs';
import ViewPage from '../ViewPage/ViewPage';

const Header = () => {
    const [allJobs, setAllJobs] = useState(true);
    const [viewFlag, setViewFlag] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const userName = "John Doe";

    const handleAllJobsClick = () => {
        setAllJobs(true);
        setViewFlag(false);
    };
    const handleAddJobsClick = () => {
        setAllJobs(false);
        setViewFlag(false);
    };
    const handleViewJobClick = (job) => {
        console.log("View button clicked for job:", job);
        setSelectedJob(job);
        setViewFlag(true);
    };
    const toggleLogout = () => {
        setShowLogout(!showLogout);
    };
    const handleLogout = () => {
        alert("Logging out...");
    };

    const handleNotification = () => {
        alert("Notification clicked!");
    };

    return (
        <div>
            <div className="container">
                <div className="inside-container">
                    <div className="label-container">
                        <div onClick={handleAllJobsClick} className="btn-container btn-container-clicked">All Posted Jobs</div>
                        <div onClick={handleAddJobsClick} className="btn-container btn-container-clicked">Add Jobs</div>
                    </div>
                    
                    {/* User Info and Notification Area */}
                    <div className="user-info">
                        <Bell onClick={handleNotification} className="h-5 w-5 text-gray-600" />
                        <div className="flex items-center space-x-2">
                            <span className="user-name">{userName}</span>
                            <div className="user-logo" onClick={toggleLogout}>
                                <FaUserCircle className="user-logo-img" />
                            </div>
                            {showLogout && (
                                <div className="logout-button" onClick={handleLogout}>
                                    Logout
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {viewFlag && selectedJob ? (
                <ViewPage job={selectedJob} />
            ) : allJobs ? (
                <Alljobs onViewJobClick={handleViewJobClick} />
            ) : (
                <AddJobs />
            )}
        </div>
    );
};

export default Header;
