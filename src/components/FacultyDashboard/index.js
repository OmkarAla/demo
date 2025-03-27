import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar component
import './index.css'; // Import CSS for styling

const FacultyDashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [electives, setElectives] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [classInfo, setClassInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyResponse = await fetch('http://localhost:5000/api/faculty');
        const facultyData = await facultyResponse.json();

        // Assuming facultyData contains schedule and electives
        setSchedule(facultyData.schedule);
        setElectives(facultyData.electives);
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDateClick = (date) => {
    const classOnDate = schedule.find(item => new Date(item.date).toDateString() === date.toDateString());
    setClassInfo(classOnDate ? classOnDate : null);
    setSelectedDate(date);
  };

  const tileContent = ({ date }) => {
    const classOnDate = schedule.find(item => new Date(item.date).toDateString() === date.toDateString());
    return classOnDate ? <div className="dot" /> : null; // Render a dot if there's a class
  };

  return (
    <div className="faculty-dashboard">
      <h2>Faculty Dashboard</h2>
      <div className="calendar">
        <Calendar
          onClickDay={handleDateClick}
          tileContent={tileContent}
        />
      </div>
      {classInfo && (
        <div className="class-info">
          <h3>Class Information</h3>
          <p>{classInfo.event}</p>
          <p>Date: {classInfo.date}</p>
          <p>Elective: {classInfo.elective}</p>
        </div>
      )}
      <div className="electives">
        <h3>Your Electives</h3>
        <ul>
          {electives.map((elective, index) => (
            <li key={index}>{elective.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FacultyDashboard;