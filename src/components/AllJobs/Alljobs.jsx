import React, { useEffect, useState } from 'react';
import './AllJobs.css';
import TaskPage from '../../utils/TaskPage/TaskPage';
import ViewPage from '../ViewPage/ViewPage';
import axios from 'axios';

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
    axios.get('http://localhost:8089/api/v1/gigs', {
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
        postedBy: gig.manager_id || 'Unknown Manager',
        role: 'Manager', // dummy , not a field in response
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
    <div >
      {view && selectedJob?(<ViewPage job = {selectedJob} onBack = {onBackButtonClick} onTaskUpdate={handleTaskUpdate}/>):( <div className="task-page-box">
      {jobData.map((item) => (
        <div key={item.id}>
          <TaskPage onViewButtonClick={() => handleView(item.id)} job = {item}/>
        </div>
      ))}
      </div>)}
       
    </div>
  );
};
 
export default AllJobs;
 