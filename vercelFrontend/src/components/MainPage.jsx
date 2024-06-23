import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import logo from "../assets/logo.png";
const MainPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    url: "",
    build: "choose"
  });
  const[borderColor, setBorderColor] = useState("");
  const [message, setMessage] = useState("");
  const [projectAvailability, setProjectAvailability] = useState(null);
  const [redirect, setRedirect] = useState(false); // State to handle redirection

  useEffect(() => {

    const checkProjectAvailability = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/check-project?name=${formData.project}`);
        console.log(response);
        if(response.status ==200) setProjectAvailability(true);
      } catch (error) {
        setProjectAvailability(false);
        console.error("Error checking project availability:", error);
      }
    };
    const timer = setTimeout(() => {
      if(formData.project){

        checkProjectAvailability();
      }
    }, 500);

    return ()=>{
      clearTimeout(timer);
    }
  }, [formData.project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // checkProjectAvailability(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/submit-form', formData);
      console.log("submission response",response);
      setMessage("Successfully submitted.");
      if(response.status==200){
        localStorage.setItem('prjid',formData.project);
        setRedirect(true); // Set redirect to true after successful submission
      }else{
        setMessage(response.data);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error: Project name must be unique.");
    }
  };

  // Redirect to the project status page if redirect state is true
  if (redirect) {
    return <Redirect to="/project-status" />;
  }

  return (

    <div>
      <div id="main">  <h1>     
      <img src={logo} alt="Vercel Logo"  className="logo" />
      Deploy To Vercel.Dev</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="input_box">
          {/* Label for name input */}
        </label>
        <input
          type="text"
          className="custominputbox"
          placeholder="Enter your name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <div className="ack">
          {/* Display project name availability message */}
          {formData.project !== "" && projectAvailability !== null && (
            <p style={{ color: projectAvailability ? "green" : "red" }}>
              {projectAvailability ? "Project name is available" : "Project name is not available"}
            </p>
          )}
        </div>
        <label htmlFor="project" className="input_box">
          {/* Label for project input */}
        </label>
        <input
          type="text" 
          placeholder="Enter your Project name"
          name="project"
          value={formData.project}
          onChange={handleChange}
          className={formData.project !== "" && projectAvailability !== null ? (projectAvailability ? "green-border custominputbox" : "red-border custominputbox") : "custominputbox"}
        />

        <label htmlFor="url" className="input_box">
        </label>
        <input
          className="custominputbox"
          type="text"
          placeholder="Enter your GitHub URL"
          name="url"
          value={formData.url}
          onChange={handleChange}
        />

        <label htmlFor="build" className="input_box">
        </label>
        <select
          className=""
          id="select"
          name="build"
          value={formData.build}
          onChange={handleChange}
        >
          <option value="choose">Framework Preset</option>
          <option value="build">npx-create-reactapp</option>
          <option value="dist">vite</option>
        </select>

        <button type="submit">Deploy</button>
      </form>
    </div>

    </div>
  );
};

export default MainPage;
