import {React} from 'react'
import "./Taskpage.css"
import {Button} from '../../ui/button'
const TaskPage = ({onViewButtonClick, job}) => {
 
    const handleApproveButtonClick=()=>{
    alert("Task approved!")
  };

  const handlePauseButtonClick=()=>{
    alert("Task paused!")
  };

  const handleRevokeButtonClick=()=>{
    alert("Task revoked!")
  };
 
  return (
    <div>
      <div className="outer-box">
        <div className="box">
          <h3>{job.heading}</h3>
          <div><p>{job.description}</p>
          <p>{job.task}</p></div>
          <div className="btn-container">
          <div><Button className = 'bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded' buttonName="Approve" onClick={handleApproveButtonClick}></Button></div>
          <div><Button className = 'bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded' buttonName="View" onClick={onViewButtonClick}></Button></div>
          <div><Button className = 'bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded' buttonName="Pause" onClick={handlePauseButtonClick}></Button></div>
          <div><Button className = 'bg-teal hover:bg-teal-400 text-white text-sm px-3 py-1 rounded' buttonName="Revoke" onClick={handleRevokeButtonClick}></Button></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskPage;