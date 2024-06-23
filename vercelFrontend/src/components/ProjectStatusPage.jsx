import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import './prjstatus.css';

export default function ProjectStatusPage() {
    const [status , setStatus]  = useState('');
    const [logs , setLogs] = useState([]);

    useEffect(()=>{
        setInterval(()=>{
            updateStatus();
            updateLogs();
        },1000);
    },[]);

    const updateStatus = async ()=>{
        const prjid = localStorage.getItem('prjid');
        const response = await fetch(`http://localhost:3001/project-status/${prjid}`);
        const data = await response.json();
        setStatus(data.prjstatus);
    }

    const updateLogs = async ()=>{
        const prjid = localStorage.getItem('prjid');
        const response = await fetch(`http://localhost:3001/project-logs/${prjid}`);
        const data = await response.json();
        setLogs(data.prjlogs);
    }

    return (
    <div>
        <div className="heading">Deployment Logs</div>
        <div className="heading">Project Status: {status}</div>
        <div className="logcontainer">
            <div className="logbox">
            {logs.map((value, key) => (
                    <div key={key}>{value}</div>
                ))}
            </div>
        </div>
    </div>
    );
}
