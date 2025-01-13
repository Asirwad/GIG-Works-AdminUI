import {React} from 'react'
import "./Taskpage.css"
import {Button} from '../../ui/button'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

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
      toast.success("Task approved!");
    }else{
      toast.error("Task approval failed!");
    }
  };

  const handlePauseButtonClick=()=>{
    const result = updateGigStatus("paused");
    if(result){
      toast.success("Task paused!");
    }else{
      toast.error("Task pausing failed!");
    }
  };

  const handleRevokeButtonClick=()=>{
    const result = updateGigStatus("revoked");
    if(result){
      toast.success("Task revoked!");
    }else{
      toast.error("Task revoking failed!");
    }
  };
 
  return (
    <div>
      <div className="card-container">
        <div className="card-content">
          <h3 className="card-title">{job.heading}</h3>
          <div className="card-details">
            <p className="card-description">{job.description}</p>
            <p className="card-task">{job.task}</p>
          </div>
          <div className="card-buttons">
            <Button 
              className={`btn ${job.status === 'approved' ? 'btn-disabled' : 'btn-primary'}`} 
              buttonName={job.status === 'approved' ? "Approved" : "Approve"}
              onClick={handleApproveButtonClick}
              disabled={job.status === 'approved'}
            />
            <Button 
              className="btn btn-secondary" 
              buttonName="View" 
              onClick={onViewButtonClick}
            />
            <Button 
              className={`btn ${job.status === 'paused' ? 'btn-disabled' : 'btn-primary'}`} 
              buttonName={job.status === 'paused' ? "Paused" : "Pause"}
              onClick={handlePauseButtonClick}
              disabled={job.status === 'paused'}
            />
            <Button 
              className={`btn ${job.status === 'revoked' ? 'btn-revoked' : 'btn-danger'}`} 
              buttonName={job.status === 'revoked' ? "Revoked" : "Revoke"}
              onClick={handleRevokeButtonClick}
              disabled={job.status === 'revoked'}
            />
          </div>
        </div>
      </div>
      <ToastContainer position='bottom-right'/>
  </div>

  )
}

export default TaskPage;