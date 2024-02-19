import { useEffect, useState } from "react";
import "./JobPostComponent.css";

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [postJobs, setPostJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [appliedUsers, setAppliedUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isUserAdmin = currentUser.role;

  const handleEdit = (jobId) => {
    const jobToEdit = postJobs.find((job) => job.jobId === jobId);
    setEditingJob(jobToEdit);
  };

  const handleUpdate = async () => {
    try {
      const yourAuthToken = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:5000/JobPost/Job?UserId=${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            JobId: editingJob.jobId,
            Title: editingJob.title,
            DESCRIPTION: editingJob.description,
            Requirements: editingJob.requirements,
          }),
        }
      );

      if (response.ok) {
        const updatedJobs = postJobs.map((job) =>
          job.jobId === editingJob.jobId ? editingJob : job
        );
        setPostJobs(updatedJobs);
        setEditingJob(null);
        alert("Job updated successfully");
      } else {
        console.error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  useEffect(() => {
    const yourAuthToken = localStorage.getItem("userToken");
    const userId = localStorage.getItem("userId");
    console.log("-----------line 11", currentUser.role, currentUser);

    if (!yourAuthToken || !userId) {
      console.error(
        "Missing authentication or job information",
        yourAuthToken,
        userId
      );
      alert("Missing authentication");
      return;
    }

    const fectchPostedJobs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/JobPost/myJobs?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${yourAuthToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPostJobs(data);
        console.log("---------------line 36 for posted jobs", data, postJobs);
      } catch (error) {
        console.log("----------------failed while fetching posted jobs", error);
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/JobApplied/getJobs?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${yourAuthToken}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        const appliedJobsData = await response.json();
        console.log("Applied Jobs Data:", appliedJobsData);
    
        const jobIds = appliedJobsData.map((job) => job.jobId);

        const jobDetails = await Promise.all(
          jobIds.map(async (jobId) => {
            try {
              const jobDetailsResponse = await fetch(
                `http://localhost:5000/JobPost/jobDetails/${jobId}`,
                {
                  headers: {
                    Authorization: `Bearer ${yourAuthToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!jobDetailsResponse.ok) {
                throw new Error(
                  `HTTP error! Status: ${jobDetailsResponse.status}`
                );
              }

              const data = await jobDetailsResponse.json();
              return data;
            } catch (error) {
              console.error(`Error fetching job details for job ID ${jobId}:`, error);
              return null;
            }
          })
        );

        console.log("Job Details for Applied Jobs:", jobDetails);

        const filteredJobDetails = jobDetails.filter((job) => job !== null);

        setJobs(filteredJobDetails);
      } catch (error) {
        console.log("Error in fetchAppliedJobs:", error);
      }
    };

    const getAppliedUser = async () => {
      try {
        const yourAuthToken = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");
        
        const response = await fetch(
          `http://localhost:5000/JobApplied/getappliedusers?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${yourAuthToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const response1 = await response.json();
        setAppliedUsers(response1);
        console.log(
          "-----------------got job applied users",
          response1,
          appliedUsers
        );
      } catch (error) {
        console.log("-------------failed while getting applied users", error);
      }
    };

    fetchAppliedJobs();
    getAppliedUser();
    fectchPostedJobs();
    console.log(
      "---------------line 90 for posted jobs",
      postJobs,
      appliedUsers
    );
  }, []);

  console.log("Applied Users:", appliedUsers);

  const removePostedJob = async (jobId) => {
    try {
      const yourAuthToken = localStorage.getItem("userToken");
      const response = await fetch(
        `http://localhost:5000/JobPost/deleteJob/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        
        setPostJobs((prevJobs) =>
          prevJobs.filter((job) => job.jobId !== jobId)
        );
        console.log(`Job ${jobId} deleted from posted list`);
      } else {
        console.error(`Failed to deleted job ${jobId} from applied list`);
      }
    } catch (error) {
      console.log("failed to delete posted job", error);
    }
  };

  const removeAppliedJob = async (jobId) => {
    try {
      const yourAuthToken = localStorage.getItem("userToken");

      const response = await fetch(
        `http://localhost:5000/JobApplied?jobId=${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        
        setJobs((prevJobs) => prevJobs.filter((job) => job.jobId !== jobId));
        console.log(`Job ${jobId} removed from applied list`);
      } else {
        console.error(`Failed to remove job ${jobId} from applied list`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isUserAdmin ? (
        <div>
          {postJobs.length > 0 ? (
            <div className="job-display">
              <div className="job-content">
                <h2>Posted Job By Admin</h2>
                <ul className="job-post">
                  {postJobs.map((job) => (
                    <div className="" key={job.jobId}>
                      <li>
                        <div className="job-post-li">
                          <br />
                          <strong>Title:</strong>{" "}
                          <div className="add-padding">{job.title} </div>
                          <br />
                          <strong>Description:</strong>{" "}
                          <div className="add-padding">{job.description}</div>
                          <br />
                          <strong>Requirements:</strong>{" "}
                          <div className="add-padding">{job.requirements}</div>
                          <br />
                          <div className="apply">
                            <div>
                              <strong>Posted On:</strong>{" "}
                              <div className="add-padding">
                                {new Date(job.postedAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="apply-button">
                              <button
                                className="apply-button delete"
                                onClick={() => removePostedJob(job.jobId)}
                              >
                                DELETE
                              </button>

                              <button
                                className="apply-button edit"
                                onClick={() => handleEdit(job.jobId)}
                              >
                                EDIT JOB
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <h2>No jobs posted by admin</h2>
            </div>
          )}
          {editingJob ? (
            <div className="overlay editing-overlay">
              <div className="edit-job-content">
                <h2 className="edit-job-heading">Edit Job</h2>
                <div className="edit-job-input">
                  <label className="edit-job-label">Title:</label>
                  <input
                    type="text"
                    value={editingJob.title}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="edit-job-input">
                  <label className="edit-job-label">Description:</label>
                  <textarea
                    value={editingJob.description}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="edit-job-input">
                  <label className="edit-job-label">Requirements:</label>
                  <input
                    type="text"
                    value={editingJob.requirements}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        requirements: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="edit-pop-up-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setEditingJob(null)}
                  >
                    Cancel
                  </button>
                  <button className="edit-job-button" onClick={handleUpdate}>
                    Update Job
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {appliedUsers && appliedUsers.length > 0 && (
            <div className="tr-content">
              <h3>Job Applied Users</h3>
              <table>
                <thead>
                  <tr className="tr-header">
                    <th>Job ID</th>
                    <th>Job Title</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedUsers.map((user) => (
                    <tr key={`${user.jobId}-${user.userId}`}>
                      <td>{user.jobId}</td>
                      <td>{user.title}</td>
                      <td>{user.userId}</td>
                      <td>{user.firstName}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="job-display">
          <div className="job-content">
            <h2>Applied Job List</h2>
            <ul className="job-post">
              {jobs.map((job) => (
                <div className="" key={job.jobId}>
                  <li>
                    <div className="job-post-li">
                      <br></br>
                      <strong>Title:</strong>{" "}
                      <div className="add-padding">{job.title} </div>
                      <br></br>
                      <strong>Description:</strong>{" "}
                      <div className="add-padding">{job.description}</div>
                      <br></br>
                      <strong>Requirements:</strong>{" "}
                      <div className="add-padding">{job.requirements}</div>
                      <br></br>
                      <div className="apply">
                        <div>
                          <strong>Posted On:</strong>{" "}
                          <div className="add-padding">
                            {new Date(job.postedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="apply-button">
                          {/* <button
                      className={localStorage.getItem(`applied_${job.jobId}`) ? 'applied' : ''}
                      disabled={jobApplied.includes(job.jobId)}
                      onClick={() => applyJobs(job.jobId, job.title)}
                    >
                      {localStorage.getItem(`applied_${job.jobId}`) ? "Applied" : "Apply"}
                    </button> */}

                          <button onClick={() => removeAppliedJob(job.jobId)}>
                            Remove from Applied
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
