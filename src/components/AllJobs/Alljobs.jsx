import React, { useEffect, useState } from 'react';
import './AllJobs.css';
import TaskPage from '../../utils/TaskPage/TaskPage';
import ViewPage from '../ViewPage/ViewPage';
import axios from 'axios';
import { motion } from 'framer-motion';
import { applicationConfiguration as appConfig } from '../../AppConfig';

const AllJobs = () => {

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [view,setView]=useState(false);
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
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setJobs([]);
    })
  })
 
  return (
    <div>
        {view && selectedJob ? (
          <ViewPage 
            job={selectedJob} 
            onBack={onBackButtonClick} 
            onTaskUpdate={handleTaskUpdate}
          />
        ) : (
          <div className="task-page-box">
            {jobData.map((item, index) => (
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
            ))}
          </div>
        )}
  </div>

  );
};
 
export default AllJobs;
 