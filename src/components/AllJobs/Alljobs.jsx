import React, { useEffect, useState } from 'react';
import './AllJobs.css';
// import TaskPage from '../../utils/TaskPage/TaskPage';
import ViewPage from '../ViewPage/ViewPage';
import axios from 'axios';
import { motion } from 'framer-motion';
import { applicationConfiguration as appConfig } from '../../AppConfig';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { toast, ToastContainer } from 'react-toastify';
import { getUStarPoint } from '../../lib/util';

const AllJobs = ({ searchQuery }) => {

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [view,setView]=useState(false);
  const [jobData, setJobs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);

  const handleView=(jobId)=>{
    setSelectedJobId(jobId)
    setView(true)
  }

  const onBackButtonClick = () => {
    setView(false);
    setSelectedJobId(null);
  }

  const handleTaskUpdate = (updatedJob) => {
        setJobs((prevJobs) => 
          prevJobs.map((job) => 
            job.id === updatedJob.id ? updatedJob : job
          )
        );
  };
  
  const selectedJob = jobData.find((job) => job.id === selectedJobId)

  useEffect(() => {
    axios.get(appConfig.api.BASE_URL + '/gigs', {
      headers: {
        'user_id': '675712e7450aead0d3a404f7',
      },
    }).then((response) => {
      const gigs = response.data.gigs;
      const formattedJobs = gigs.map((gig)=> ({
        id: gig._id,
        heading: gig.topic || 'No Title',
        description: gig.description || 'No description available',
        task: gig.title,
        status: gig.status || 'open',
        ustarPoints: getUStarPoint.get(gig.ustar_category),
        postedBy: gig.manager.name || 'Unknown Manager',
        role: gig.manager.role,
        teamsLink: 'https://teams.microsoft.com/l/chat/7', // dummy , not a field in response
        collaborators: gig.collaborators || [],
      }));

      // Sort the formattedJobs, placing 'revoked' gigs at the end and 'awaiting_admin_approval' at first
      const sortedJobs = formattedJobs.sort((a, b) => {
        const statusOrder = {
          awaiting_admin_approval: 1,
          revoked: 3,
          default: 2, // For all other statuses
        };
      
        const aOrder = statusOrder[a.status] || statusOrder.default;
        const bOrder = statusOrder[b.status] || statusOrder.default;
      
        return aOrder - bOrder;
      });
      setJobs(sortedJobs);
      setFilteredGigs(sortedJobs);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setJobs([]);
    })
  }, []);

  useEffect(() => {
    const filtered = jobData.filter((job) => 
      job.heading.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGigs(filtered);
  }, [searchQuery]);

  const updateGigStatus = async (status, job) => {
    try {
      const response = await axios.patch( appConfig.api.BASE_URL +'/update_gig', {
        "gig_id": job.id,
        "status": status
      });
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleStatusChange = async (status, job) => {
    const response = await updateGigStatus(status, job);
    if (response) {
      setJobs((prevJobs) =>
        prevJobs.map((gig) =>
          gig.id === job.id ? { ...gig, status: status } : gig
        )
      );
      setFilteredGigs((prevJobs) =>
        prevJobs.map((gig) =>
          gig.id === job.id ? { ...gig, status: status } : gig
        )
      );
      toast.success(`Task ${status}!`);
    } else {
      toast.error(`Failed to ${status} the task!`);
    }
  };
 
  return (
    <div>
        {view && selectedJob ? (
          <ViewPage 
            job={selectedJob} 
            onBack={onBackButtonClick} 
            onTaskUpdate={handleTaskUpdate}
          />
        ) : (
          <main className="container mx-auto px-4 py-8 min-h-screen">
            { filteredGigs.length === 0 && (
                <div className="text-center text-gray-500">
                  No jobs found.
                </div>
              )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.map((gig, index) => (
                <motion.div
                  key={gig.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0 ,
                    transition: { duration: 0.5, delay: 0.1 * index }
                  }}
                  whileTap={{ 
                    scale: 0.95, 
                    transition: { duration: 0.5 }
                  }}
                >
                  <Card key={gig.id} className="bg-white flex flex-col h-full shadow-md transition duration-300 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle badge={gig.status} className="text-xl text-teal-900 font-bold">
                      {gig.heading}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="text-yellow-500 bg-transparent">
                      <Star className="h-4 w-4 hover:fill-yellow-500"/>
                      <span className="font-medium text-pretty text-yellow-500 text-center text-base ml-1">{gig.ustarPoints}</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold mb-2 text-teal-900">Description</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {gig.description}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                        onClick={() => handleView(gig.id)}
                      >
                        View
                        <span className="ml-2">→</span>
                      </Button>
                      { gig.status === 'awaiting_admin_approval' && (
                        <>
                          <Button
                            className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handleStatusChange('approved', gig)}
                          >
                            Approve
                          </Button>
                          <Button
                            className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handleStatusChange('revoked', gig)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      { gig.status === 'approved' && (
                        <>
                          <Button
                            className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handleStatusChange('paused',gig)}
                          >
                            Pause
                          </Button>
                          <Button
                          className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                          onClick={() => handleStatusChange('revoked', gig)}
                          >
                          Revoke
                          </Button>
                        </>
                      )}
                      { gig.status === 'paused' && (
                        <>
                          <Button
                          className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                          onClick={() => handleStatusChange('approved', gig)}
                          >
                            Resume
                          </Button>
                          <Button
                            className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handleStatusChange('revoked', gig)}
                          >
                          Revoke
                          </Button>
                        </>
                      )}
                      
                    </div>
                  </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <ToastContainer position="bottom-right" />
          </main>
        )}
  </div>

  );
};
 
export default AllJobs;
 