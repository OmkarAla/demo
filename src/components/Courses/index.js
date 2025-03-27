import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import './index.css';

const Courses = () => {
    const [electives, setElectives] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [facultyData, setFacultyData] = useState({});
    const [expandedElective, setExpandedElective] = useState(null);

    useEffect(() => {
        const fetchElectives = async () => {
            const response = await fetch('http://localhost:5000/api/electives');
            const data = await response.json();
            setElectives(data);
        };

        const fetchFeedbacks = async () => {
            const response = await fetch('http://localhost:5000/api/feedbacks');
            const data = await response.json();
            setFeedbacks(data);
        };

        const fetchFacultyData = async () => {
            const response = await fetch('http://localhost:5000/api/faculty');
            const data = await response.json();
            setFacultyData(data);
        };

        fetchElectives();
        fetchFeedbacks();
        fetchFacultyData();
    }, []);

    const handleElectiveClick = (electiveID) => {
        setExpandedElective(expandedElective === electiveID ? null : electiveID);
    };

    return (
        <>
          <Navbar />
          <div className="courses-container">
            {electives.map((elective) => (
                <div key={elective.electiveID} className="elective-card" onClick={() => handleElectiveClick(elective.electiveID)}>
                    <h3>{elective.electiveName}</h3>
                    {expandedElective === elective.electiveID && (
                        <div className="elective-details">
                            <p>Number of Students: {elective.studentsEnrolled.length}</p>
                            <p>Faculty Name: {facultyData[elective.electiveFaculty]?.name}</p>
                            <p>Faculty Expertise: {facultyData[elective.electiveFaculty]?.expertise}</p>
                            <div className="feedback-carousel">
                                <p>Feedbacks:</p>
                                <ul>
                                    {feedbacks.filter(feedback => feedback.electiveID === elective.electiveID).slice(0, 5).map(feedback => (
                                        <li key={feedback.id}>{feedback.comment}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
        </>
    );
};

export default Courses;
