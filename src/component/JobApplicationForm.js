import React, { useEffect, useState } from 'react';
import './JobApplication.css';

const JobApplicationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    resume: null,
    experience: '',
    programmingSkills: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      resume: null,
      experience: '',
      programmingSkills: '',
    });
    onClose(); 
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      resume: null,
      experience: '',
      programmingSkills: '',
    });
    onClose(); 
  };

  useEffect(() => {
    console.log("---------line in jobapplication");
  }, []);

  return (
    <div className="job-application-modal">
        <h4>Application Form</h4>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Phone Number:
          <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </label>

        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Resume:
          <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
        </label>

        <label>
          Experience:
          <textarea name="experience" value={formData.experience} onChange={handleChange} required />
        </label>

        <label>
          Programming Skills:
          <input type="text" name="programmingSkills" value={formData.programmingSkills} onChange={handleChange} required />
        </label>

        <div className="button-group">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
