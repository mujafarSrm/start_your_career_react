import React, { useEffect, useState } from "react";
import "./JobPostComponent.css";
import JobApplicationForm from "./JobApplicationForm";

const JobPostComponent = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    Title: "",
    DESCRIPTION: "",
    Requirements: "",
  });
  const [searchTerminput, setSearchTerminput] = useState();

  const [jobApplied, setJobApplied] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [searchTerm, setSearchTerm] = useState("");
  const [applicationForm, setApplicationForm] = useState();
  // const [subjectToSendmail, setSubjectToSendMail] = useState();
  // const [messageToSendMail, setMessageToSendMail] = useState();
  var subjectToSendmail;
  var messageToSendMail;

  var token = localStorage.getItem("userToken");
  const yourAuthToken = token;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isUserAdmin = currentUser.role;

  useEffect(() => {
    const fetchSometrhing = async () => {
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

        const response1 = await response.json();

        if (response1) {
          const appliedJobIds = response1.map((job) => job.jobId);
          setJobApplied(appliedJobIds);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSometrhing();

    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/JobPost/allJobs", {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAllJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();

    // sendMail();
  }, [userId, yourAuthToken]);

  const sendMail = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/Email/sendmail?subject=${subjectToSendmail}&message=${messageToSendMail}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch(error) {
      console.log("failed sending mail", error)
    }
  };

  const fetchSearchJobs = async (searchTerm) => {
    try {
      const response = await fetch(
        `http://localhost:5000/search?SearchTerm=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFilteredJobs(data);
    } catch (error) {
      console.log("error catch while fetching jobs", error);
    }
  };

  const applyJobs = async (jobId, jobTitle, jobDescription) => {
    try {
      if (jobApplied.includes(jobId)) {
        alert(`You have already applied for this job: ${jobTitle}`);
        return console.log("-----line 79 you have alredy applied this job");
      }

      const response = await fetch("http://localhost:5000/JobApplied/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          JobId: jobId,
          UserId: userId,
        }),
      });

      if (response.ok) {
        setJobApplied((prevJobApplied) => [...prevJobApplied, jobId]);
        localStorage.setItem(`applied_${jobId}`, true);
        setApplicationForm(true);
        alert(`You applied for the job: ${jobTitle}`);
        subjectToSendmail="You Applied to the "+jobTitle+ " in SYC Job Portal";
        messageToSendMail ="You Applied to the "+jobTitle+ " in SYC Job Portal\n " + ", Description : "+ jobDescription ;
        sendMail();
      } else {
        console.error("Failed to apply job");
      }
    } catch (error) {
      console.error("Error applying job:", error);
    }
  };

  const addJob = async () => {
    try {
      if (!newJob.Title || !newJob.DESCRIPTION || !newJob.Requirements) {
        alert("Please fill in all the fields");
        return;
      }
      const addResponse = await fetch("http://localhost:5000/JobPost", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      if(addResponse.ok){
        subjectToSendmail="You HavE Posted A Job "+ newJob.Title +" In SYC portal"
        messageToSendMail= "DETAILS \n  "+"Job Title : "+newJob.Title+"\n, Description : "+newJob.DESCRIPTION+"\n, Reqirements : "+newJob.Requirements;
        sendMail();
      }

      if (!addResponse.ok) {
        throw new Error(`HTTP error! Status: ${addResponse.status}`);
      }

      const refreshResponse = await fetch(
        "http://localhost:5000/JobPost/allJobs",
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!refreshResponse.ok) {
        throw new Error(`HTTP error! Status: ${refreshResponse.status}`);
      }

      const data = await refreshResponse.json();
      setAllJobs(data);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleSearch = () => {
    fetchSearchJobs(searchTerm);
    setSearchTerminput(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredJobs([]);
    setSearchTerminput(false);
  };

  const handleCloseAlert = () => {
    setApplicationForm(false);
  };

  return (
    <div className="job-display">
      {applicationForm && (
        <div className="form-background">
          <JobApplicationForm onClose={handleCloseAlert} />{" "}
        </div>
      )}
      <div className="job-content">
        <div className="job-header">
          <h2>Job Posts</h2>
          <div className="search-bar">
            <div>
              <input
                placeholder="Search......."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {!searchTerminput ? (
                <button className="search-button" onClick={handleSearch}>
                  Search
                </button>
              ) : (
                <button className="search-button" onClick={handleClearSearch}>
                  Clear
                </button>
              )}
            </div>
            {/* <button onClick={handleClearSearch}>Clear Search</button> */}
          </div>
        </div>
        <ul className="job-post">
          {(filteredJobs.length > 0 ? filteredJobs : allJobs).map((job) => (
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
                    {!isUserAdmin && (
                      <div className="apply-button">
                        <button
                          className={
                            jobApplied.includes(job.jobId) ? "applied" : ""
                          }
                          onClick={() => applyJobs(job.jobId, job.title, job.description)}
                        >
                          {jobApplied.includes(job.jobId) ? "Applied" : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
      {isUserAdmin && (
        <div className="add-new-job">
          <div className="add-new-job-h2">
            <h2>Add New Job</h2>
          </div>
          <div className="add-new-job-content">
            <div>
              <label>Title:</label>
              <input
                type="text"
                onChange={(e) =>
                  setNewJob({ ...newJob, Title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                onChange={(e) =>
                  setNewJob({ ...newJob, DESCRIPTION: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Requirements:</label>
              <input
                type="text"
                onChange={(e) =>
                  setNewJob({ ...newJob, Requirements: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button onClick={addJob} className="add-job-button">
            Add Job
          </button>
        </div>
      )}
    </div>
  );
};

export default JobPostComponent;
