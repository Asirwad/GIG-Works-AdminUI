import { React, useState } from 'react';
import { Bell } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import Alljobs from '../AllJobs/Alljobs';
import AddJobs from '../AddJobs/AddJobs';
import ViewPage from '../ViewPage/ViewPage';
import { applicationConfiguration as appConfig } from '../../AppConfig';

const Header = () => {
    const [allJobs, setAllJobs] = useState(true);
    const [viewFlag, setViewFlag] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const userName = appConfig.admin.name;

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
        <div className="bg-white p-4 border-b-2 border-gray-200">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <a href="/" className="text-lg font-semibold text-teal-600 uppercase">
                        GIG WORKS
                    </a>
                    <input
                        type="text"
                        placeholder="Search Jobs..."
                        value={null}
                        onChange={() => {}}
                        className="py-2 px-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-4">
                        <button
                            onClick={handleAllJobsClick}
                            className={`py-2 px-4 text-sm rounded border ${allJobs ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700' : 'bg-gray-100 text-teal-600 border-gray-200'} transition-all duration-300`}
                        >
                            All Posted Jobs
                        </button>
                        <button
                            onClick={handleAddJobsClick}
                            className={`py-2 px-4 text-sm rounded border ${!allJobs && !viewFlag ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700' : 'bg-gray-100 text-teal-600 border-gray-200'} transition-all duration-300`}
                        >
                            Add Jobs
                        </button>
                    </div>
                    <div className="relative flex items-center gap-2">
                        <Bell
                            onClick={handleNotification}
                            className="text-teal-600 text-xl cursor-pointer hover:text-teal-700 transition-colors"
                        />
                        <span className="text-sm text-gray-700">{userName}</span>
                        <FaUserCircle
                            className="text-teal-600 text-2xl cursor-pointer hover:text-teal-700 transition-colors"
                            onClick={toggleLogout}
                        />
                        {showLogout && (
                            <div
                                className="absolute top-9 right-0 bg-white shadow-lg p-2 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                onClick={handleLogout}
                            >
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
