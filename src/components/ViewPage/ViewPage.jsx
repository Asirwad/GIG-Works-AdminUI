import { React, useEffect, useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs'
import {Button} from '../../ui/button'; 
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import axios from 'axios';
import { motion } from 'framer-motion';
import { applicationConfiguration as appConfig } from '../../AppConfig';
import { toast, ToastContainer } from 'react-toastify';
import { getStatusColor, getUStarName } from '../../lib/util';

const ViewPage = ({ job, onBack, onTaskUpdate }) => {

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskDetails, setTaskDetails] = useState(job.task);
  const [interestedUsers, setInterestedUsers] = useState([]);

  const handleTaskEdit = () => {
    setIsEditingTask(true);
  };

  const handleTaskSave = () => {
    const updatedJob = { ...job, title: taskDetails };
    console.log(updatedJob);
    axios.patch(appConfig.api.BASE_URL + `/gigs/${job.id}`, updatedJob)
    .then((response) => {
      console.log(response.data);
      if(onTaskUpdate){
        onTaskUpdate(updatedJob);
      }
      setIsEditingTask(false);
      toast.success("Task updated successfully");
    })
    .catch((error) => {
      toast.error("Failed to update task");
    })
  };

  const handleTaskCancel = () => {
    setTaskDetails(job.task);
    setIsEditingTask(false);
  };

  useEffect(() => {
    axios.get(appConfig.api.BASE_URL + `/gig/${job.id}/interested`, {
      headers: {
        'user_id': '674df6a4aed3d7ff4a423727',
      },
    }).then((response) => {
      if(response.data.interestedUsers){

        // sorting the users
        const statusOrder = ['interested', 'approved', 'rejected'];
        const sortedUsers = response.data.interestedUsers.sort(
          (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        );
        setInterestedUsers(sortedUsers);
      }else{
        setInterestedUsers([]);
      }
    }).catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log("No users found who showed interest in this gig.");
            setInterestedUsers([]);
          } else {
            console.error('Error:', error.response.data.message);
        }
        } else {
          console.error('Network error or no response from the server.');
        }
    });
  }, [job.id]);

  const updateGigEngagementStatus = (job_id, user_id, status) => {
    // need to implement after getting api
  }

  const handleInterestedUserApproval = (job, user_id) => {
    updateGigEngagementStatus(job.id, user_id, "approved");
  }

  const handleInterestedUserRejection = (job, user_id) => {
    updateGigEngagementStatus(job.id, user_id, "rejected");
  }
  return (
    
    <div className="min-h-screen bg-[#f5f3ef] p-6">
      <div className="max-w-4xl mx-auto">
      <button
          onClick={onBack}
          className="back-button flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
      </button>
      <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ amount: 0.3, once: true }}
                className="bg-white rounded-lg relative shadow-sm"
        >
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{job.heading}</h1>
                <h6 className="text-1xl">{job.description}</h6>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Status: {job.status}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">USTAR Points: {job.ustarPoints} ({getUStarName.get(job.ustarPoints)})</span>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Posted by:</span> {job.postedBy}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Role:</span> {job.role}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Teams link:</span>{' '}
                  
                  < a href={job.teamsLink}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {job.teamsLink}
                  </a>
                </p>
              </div>
            </div>
          </div>

      <Tabs defaultValue="usersStatus" className="p-6">
        <TabsList>
          <TabsTrigger value="usersStatus">Users Status</TabsTrigger>
          <TabsTrigger value="task">Task</TabsTrigger>
        </TabsList>

        <TabsContent value="usersStatus" className="mt-6">
          {interestedUsers.length > 0 ? (
            <div className="space-y-4">
              {interestedUsers.map((user, index) => (
                <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 * (index + 1) }}
                viewport={{ amount: 0.3, once: true }}
                >
                <div key={user.id} className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Name: {user.name}</p>
                      <p className="text-sm text-gray-500">Email: {user.email}</p>
                      {user.role && (<p className="text-sm text-gray-500">Role: {user.role}</p>)}
                      <p className="text-sm">Status: <span className={getStatusColor(user.status) + " font-semibold"}>{user.status}</span></p>
                      <div className="mt-2">
                        Teams link: <a href={user.teamsLink || 'https://teams.microsoft.com/l/chat/2'} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{user.teamsLink || 'https://teams.microsoft.com/l/chat/'}</a>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {user.status === 'interested' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-teal hover:bg-teal-400 text-white text-sm px-4 py-1 rounded transition-colors"
                            onClick={() => handleInterestedUserApproval(job, user.user_id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-teal text-sm px-4 py-1 rounded border-red-600 text-white hover:bg-red-50 hover:text-red-500 transition-colors"
                            onClick={() => handleInterestedUserRejection(job, user.user_id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No one has shown interest in this job yet.</p>
          )}
        </TabsContent>

        <TabsContent value="task" className="mt-6">
          <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                viewport={{ amount: 0.3, once: true }}
                className="prose max-w-none"
            >
            <h3 className="text-lg font-semibold mb-4">Task Details </h3> 
            {isEditingTask ? (
                  <div>
                    <Label htmlFor="task-details">Task Details</Label>
                    <Input
                      id="task-details"
                      value={taskDetails}
                      onChange={(e) => setTaskDetails(e.target.value)}
                      className="mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleTaskCancel}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleTaskSave}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative pb-6">
                    <p className="whitespace-pre-line">{job.task}</p>
                    <button
                      onClick={handleTaskEdit}
                      className="absolute bottom-0 right-0 bg-teal hover:bg-teal-400 text-white text-sm px-4 py-1.5 rounded"
                    >
                      Edit
                    </button>
                  </div>
                )}
          </motion.div>
        </TabsContent>
      </Tabs>
      </motion.div>
    </div>
    <ToastContainer position="bottom-right" />
</div>
  );
};

export default ViewPage;
