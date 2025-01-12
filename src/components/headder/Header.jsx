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
        <div className="header-container">
            <div className="header-content">
                <a href="/" className="app-logo">
                    <img src="UST logo.jpeg" alt="GIG WORKS Logo" className="logo-image" />
                    <span className="app-name">GIG WORKS</span>
                </a>
                <div className="nav-buttons">
                    <button onClick={handleAllJobsClick} className={`nav-btn ${allJobs ? 'active' : ''}`}>All Posted Jobs</button>
                    <button onClick={handleAddJobsClick} className={`nav-btn ${!allJobs && !viewFlag ? 'active' : ''}`}>Add Jobs</button>
                </div>

                <div className="user-section">
                    <Bell onClick={handleNotification} className="notification-icon" />
                    <div className="user-details">
                        <span className="user-name">{userName}</span>
                        <FaUserCircle className="user-icon" onClick={toggleLogout} />
                        {showLogout && (
                            <div className="logout-dropdown" onClick={handleLogout}>
                                Logout
                            </div>
                        )}
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
