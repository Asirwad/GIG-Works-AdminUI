import {React} from 'react'
import "./Taskpage.css"
import {Button} from '../../ui/button'
import axios from 'axios';
const TaskPage = ({onViewButtonClick, job}) => {
 
  const updateGigStatus = async (status) => {
    try {
      const response = await axios.patch('http://localhost:8089/api/v1/update_gig', {
        "gig_id": job.id,
        "status": status
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveButtonClick=()=>{
    const result = updateGigStatus("approved");
    if(result){
      alert("Task approved!")
    }else{
      alert("Task approval failed!")
    }
  };

  const handlePauseButtonClick=()=>{
    const result = updateGigStatus("paused");
    if(result){
      alert("Task paused!")
    }else{
      alert("Task pause failed!")
    }
  };

  const handleRevokeButtonClick=()=>{
    const result = updateGigStatus("revoked");
    if(result){
      alert("Task revoked!")
    }else{
      alert("Task revokation failed!")
    }
  };
 
  return (
    <div>
      <div className="outer-box">
        <div className="box">
          <h3>{job.heading}</h3>
          <div><p>{job.description}</p>
          <p>{job.task}</p></div>
          <div className="btn-container">
            <div>
              <Button 
                className = 'bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded' 
                buttonName={job.status==='approved'? "Approved" : "Approve"}
                onClick={handleApproveButtonClick}
                disabled={job.status==='approved'}
              />
            </div>
            <div>
              <Button 
                className = 'bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded' 
                buttonName="View" 
                onClick={onViewButtonClick}
              />
            </div>
            <div>
              <Button 
                className = 'bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded' 
                buttonName={job.status==='paused'? "Paused" : "Pause"}
                onClick={handlePauseButtonClick}
                disabled={job.status==='paused'}
              />
            </div>
            <div>
              <Button 
                className =  {job.status==='revoked'? 'bg-red-600 ' : 'bg-teal '+'hover:bg-red-500 hover:text-white text-white text-sm px-3 py-1 rounded'}
                buttonName={job.status==='revoked'? "Revoked" : "Revoke"}
                onClick={handleRevokeButtonClick}
                disabled={job.status==='revoked'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskPage;