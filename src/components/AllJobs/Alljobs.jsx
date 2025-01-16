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

const AllJobs = () => {

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [view,setView]=useState(false);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleView=(jobId)=>{
    setSelectedJobId(jobId)
    setView(true)
  }

  const uStarPointsMapping = new Map();
  uStarPointsMapping.set("RisingStar", "1");
  uStarPointsMapping.set("ShiningStar", "2");
  uStarPointsMapping.set("SuperStar", "3");
  uStarPointsMapping.set("NovaStar", "4");

  const [jobData, setJobs] = useState([]);

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
        ustarPoints: uStarPointsMapping.get(gig.ustar_category),
        postedBy: gig.manager.name || 'Unknown Manager',
        role: gig.manager.role,
        teamsLink: 'https://teams.microsoft.com/l/chat/7', // dummy , not a field in response
      }));
      setJobs(formattedJobs);
      setFilteredGigs(formattedJobs);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setJobs([]);
    })
  });

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = jobData.filter(
      (gig) =>
        gig.title.toLowerCase().includes(term.toLowerCase()) ||
        gig.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGigs(filtered);
  };

  const updateGigStatus = async (status, job) => {
    try {
      const response = await axios.patch( appConfig.api.BASE_URL +'/update_gig', {
        "gig_id": job.id,
        "status": status
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveButtonClick=(job)=>{
    const result = updateGigStatus("approved", job);
    if(result){
      toast.success("Task approved!");
    }else{
      toast.error("Task approval failed!");
    }
  };

  const handlePauseButtonClick=(job)=>{
    const result = updateGigStatus("paused", job);
    if(result){
      toast.success("Task paused!");
    }else{
      toast.error("Task pausing failed!");
    }
  };

  const handleRevokeButtonClick=(job)=>{
    const result = updateGigStatus("revoked", job);
    if(result){
      toast.success("Task revoked!");
    }else{
      toast.error("Task revoking failed!");
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
          <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* {jobData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.15 }}
                >
                  <TaskPage 
                    job={item} 
                    onViewButtonClick={() => handleView(item.id)}
                  />
                </motion.div>
              ))} */}

              {filteredGigs.map((gig, index) => (
                <motion.div
                  key={gig.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.15 }}
                >
                  <Card key={gig.id} className="bg-white flex flex-col h-full shadow-md transition duration-300 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">
                      {highlightText(gig.heading, searchTerm)}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="text-yellow-500 bg-transparent">
                      <Star className="h-4 w-4 hover:fill-yellow-500"/>
                      <span className="font-medium text-pretty text-yellow-500 text-center text-base ml-1">{gig.ustarPoints}</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {highlightText(gig.description, searchTerm)}
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
                            className="w-full bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handleApproveButtonClick(gig)}
                          >
                            Approve
                          </Button>
                          <Button
                            className="w-full bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handleRevokeButtonClick(gig)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      { gig.status === 'approved' && (
                        <>
                          <Button
                            className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handlePauseButtonClick(gig)}
                          >
                            Pause
                          </Button>
                          <Button
                          className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                          onClick={() => handleRevokeButtonClick(gig)}
                          >
                          Revoke
                          </Button>
                        </>
                      )}
                      { gig.status === 'paused' && (
                        <>
                          <Button
                          className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                          onClick={() => handleApproveButtonClick(gig)}
                          >
                            Unpause
                          </Button>
                          <Button
                            className="w-1/3 bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                            onClick={() => handleRevokeButtonClick(gig)}
                          >
                          Revoke
                          </Button>
                        </>
                      )}
                      { gig.status === 'revoked' && (
                        <Button
                          className="w-1/3 bg-red-600 mt-auto text-white"
                          disabled={true}
                        >
                        Deleted
                      </Button>
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
 