import { React, useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs'
import {Button} from '../../ui/button'; 
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

const ViewPage = ({ job, onBack, onTaskUpdate }) => {

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskDetails, setTaskDetails] = useState(job.task);

  const handleTaskEdit = () => {
    setIsEditingTask(true);
  };

  const handleTaskSave = () => {
    const updatedJob = { ...job, task: taskDetails };

    // Call the parent function to update the job list
    if (onTaskUpdate) {
      onTaskUpdate(updatedJob);
    }
    setIsEditingTask(false);
  };

  const handleTaskCancel = () => {
    setTaskDetails(job.task);
    setIsEditingTask(false);
  };

  
  // console.log("Inside ViewPage. Job data: ", job); // Debugging

    if (!job) {
        return <div>No job details to display.</div>;
    }
  const dummyUsers = [
    { id: 1, name: "XYZ1", uid: "XXXXXXXX1", role: "XYZ", status: "Completed", teamsLink: "https://teams.microsoft.com/l/chat/0" },
    { id: 2, name: "XYZ2", uid: "XXXXXXXX2", role: "XYZ", status: "Submitted", teamsLink: "https://teams.microsoft.com/l/chat/1" },
    { id: 3, name: "XYZ3", uid: "XXXXXXXX3", role: "XYZ", status: "Completed", teamsLink: "https://teams.microsoft.com/l/chat/2" }
  ];

  const getStatusColor = (status) => {
    return status === "Completed" ? "text-green-600" : "text-yellow-600";
  };

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
        <div className="bg-white rounded-lg shadow-sm relative">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{job.heading}</h1>
                <h6 className="text-1xl">{job.description}</h6>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Status: {job.status}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">USTAR Points: {job.ustarPoints}</span>
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

      <Tabs defaultValue="users" className="p-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="task">Task</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          {dummyUsers.length > 0 ? (
            <div className="space-y-4">
              {dummyUsers.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Name: {user.name}</p>
                      <p className="text-sm text-gray-500">UID: {user.uid}</p>
                      <p className="text-sm text-gray-500">Role: {user.role}</p>
                      <p className="text-sm">Status: <span className={getStatusColor(user.status)}>{user.status}</span></p>
                      <div className="mt-2">
                        Teams link: <a href={user.teamsLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{user.teamsLink}</a>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-teal hover:bg-teal-400 text-white text-sm px-4 py-1 rounded">Approve</Button>
                      <Button size="sm" variant="outline" className="bg-teal hover:bg-teal-400 text-sm px-4 py-1 rounded border-red-600 text-red-600 hover:bg-red-50">Reject</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No one has shown interest in this job yet.</p>
          )}
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-4">Job Status</h3>
            <p>{job.status}</p>
          </div>
        </TabsContent>

        <TabsContent value="task" className="mt-6">
          <div className="prose max-w-none">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </div>
</div>
  );
};

export default ViewPage;
