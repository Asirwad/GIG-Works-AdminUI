import { React, useEffect, useState } from 'react';
import { ArrowLeft, PlusCircle, Trash } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs'
import {Button} from '../../ui/button'; 
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import axios from 'axios';
import { motion } from 'framer-motion';
import { applicationConfiguration as appConfig, applicationConfiguration } from '../../AppConfig';
import { toast, ToastContainer } from 'react-toastify';
import { getStatusColor, getUStarName } from '../../lib/util';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';

const ViewPage = ({ job, onBack, onTaskUpdate }) => {

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskDetails, setTaskDetails] = useState(job.task);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [currentTab, setCurrentTab] = useState('usersStatus');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    confirmText: "",
    cancelText: "",
  });
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  const handleCollaboratorRemoveClick = (collaborator) => {
    setDialogContent({
      title: "Remove Collaborator",
      description: `Are you sure you want to remove ${collaborator.name} from the collaborators list?`,
      confirmText: "Yes, Remove",
      cancelText: "Cancel",
    });
    setSelectedCollaborator(collaborator);
    setDialogOpen(true);
  };

  const handleConfirmCollaboratorRemove = async () => {
    if (selectedCollaborator) {
      try {
        const response =  await axios.delete(applicationConfiguration.api.BASE_URL + `/gigs/${job.id}/collaborators/${selectedCollaborator._id}`);
        console.log(response);
        if (response.status === 200) {
          toast.success("Collaborator removed successfully");
        } else {
          toast.error("Failed to remove collaborator");
        }
      } catch (error) {
        toast.error("Failed to remove collaborator");
      }
    }
    setDialogOpen(false);
    setDialogContent([]);
  };

  const handleCancelCollaboratorRemove = () => {
    setSelectedCollaborator(null);
    setDialogOpen(false);
    setDialogContent([]);
  };

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
    const payload = {
      gig_id: job_id,
      user_id: user_id,
      status: status
    }
    console.log(payload);
    axios.patch(appConfig.api.BASE_URL + `/update_gig_engagement`, payload)
    .then((response) => {
      console.log(response.data);
      toast.success("Status updated successfully");
      setInterestedUsers((prevUsers) => 
        prevUsers.map((user) => 
          user.user_id === user_id ? { ...user, status: status } : user
        )
      );
    }).catch((error) => {
      toast.error("Failed to update status");
    });
  }

  const handleInterestedUserApproval = (job, user_id) => {
    updateGigEngagementStatus(job.id, user_id, "approved");
  }

  const handleInterestedUserRejection = (job, user_id) => {
    updateGigEngagementStatus(job.id, user_id, "rejected");
  }

  const [formData, setFormData] = useState({
    collaborator_id: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
  };

  const resetForm = () => {
    setFormData({ collaborator_id: '' });
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.patch(appConfig.api.BASE_URL + `/gigs/${job.id}/collaborators`, {
        "collaborator_id": formData.collaborator_id
      });
      job.collaborators = response.data.gig.collaborators;
      toast.success('Collaborator added successfully');
      resetForm();
    }catch(error){
      console.log(error);
      toast.error('Failed to add collaborator');
    }
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
      <TabsTrigger 
        value="usersStatus" 
        onClick={() => setCurrentTab('usersStatus')}
        className={`${
          currentTab === 'usersStatus' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
        } ${currentTab !== 'usersStatus' && 'hover:bg-teal-100 hover:text-teal-800'} transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
      >
        Users Status
      </TabsTrigger>
      <TabsTrigger 
        value="task" 
        onClick={() => setCurrentTab('task')}
        className={`${
          currentTab === 'task' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
        } hover:bg-teal-100 hover:text-teal-800 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
      >
        Task
      </TabsTrigger>
      <TabsTrigger 
        value="collaborators" 
        onClick={() => setCurrentTab('collaborators')}
        className={`${
          currentTab === 'collaborators' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
        } hover:bg-teal-100 hover:text-teal-800 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
      >
        Collaborators
      </TabsTrigger>
      <TabsTrigger 
        value="addCollaborator" 
        onClick={() => setCurrentTab('addCollaborator')}
        className={`${
          currentTab === 'addCollaborator' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
        } hover:bg-teal-100 hover:text-teal-800 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
      >
        Add Collaborator
      </TabsTrigger>
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
                      <p className="text-sm text-gray-500">ID: {user.user_id}</p>
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
                            variant="destructive" 
                            className="bg-red-50 border-red-600 text-red-700 hover:bg-red-600 hover:text-white hover:border-collapse transition-colors"
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

        <TabsContent value="collaborators" className="mt-6">
          {job.collaborators.length > 0 ? (
              <>
                <h2 className='mb-4 ml-5'>Total Collaborators: {job.collaborators.length}</h2>
                <div className="space-y-4">
                  {job.collaborators.map((user, index) => (
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
                          <div className="mt-2">
                            Teams link: <a href={user.teamsLink || 'https://teams.microsoft.com/l/chat/2'} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{user.teamsLink || 'https://teams.microsoft.com/l/chat/'}</a>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                                size="sm" 
                                className="flex items-center bg-teal hover:bg-teal-400 text-white text-sm px-4 py-1 rounded transition-colors"
                                onClick={() => handleCollaboratorRemoveClick(user)}
                          >
                                Remove
                                <Trash className='ml-2' size={16}/>
                          </Button>
                        </div>
                      </div>
                    </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">No collaborator in this job yet.</p>
            )}
        </TabsContent>

        <TabsContent value="addCollaborator" className="mt-6">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            viewport={{ amount: 0.3, once: true }}
            className="w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Collaborator</h2>
            <form onSubmit={handleAddCollaborator} className="flex items-center space-x-4">
              <div className="flex-1">
                <Input 
                  type="text" 
                  id="collaborator_id" 
                  name="collaborator_id" 
                  required 
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter Collaborator ID"
                />
              </div>
              <Button 
                type="submit" 
                className="flex items-center bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Add
                <PlusCircle className="ml-2" size={18} />
              </Button>
            </form>
          </motion.div>
        </TabsContent>

      </Tabs>
      </motion.div>
    </div>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <p>{dialogContent.description}</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCollaboratorRemove}>
              {dialogContent.cancelText}
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-500 transition-colors" onClick={handleConfirmCollaboratorRemove}>
              {dialogContent.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    <ToastContainer position="bottom-right" />
</div>
  );
};

export default ViewPage;
