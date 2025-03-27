import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';

import './index.css'; // Import CSS for styling

const SelectionPage = () => {
  const [choices, setChoices] = useState([{ choice: '', reason: '' }, { choice: '', reason: '' }, { choice: '', reason: '' }]);
  const [electives, setElectives] = useState([]);


  useEffect(() => {
    const fetchElectives = async () => {
      try {
        const snapshot = await fetch("http://localhost:5000/api/electives");
        const electivesData = await snapshot.json();
        setElectives(electivesData);
      } catch (error) {
        console.error('Error fetching electives:', error);
      }
    };

    fetchElectives();
  }, []);

  const handleChange = (index, field, value) => {

    const newChoices = [...choices];
    newChoices[index][field] = value;
    setChoices(newChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/request-enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(choices),
      });

      if (response.ok) {
        alert('Requests submitted successfully!');
        setChoices([{ choice: '', reason: '' }, { choice: '', reason: '' }, { choice: '', reason: '' }]);
      } else {
        throw new Error('Failed to submit requests');
      }
    } catch (error) {
      console.error('Error submitting requests:', error);
      alert('Failed to submit requests. Please try again.');
    }
  };

  return (
    <>
    <Navbar/>
      <div className="selection-container">
      <h2>Select Your Preferences</h2>
      <form onSubmit={handleSubmit} className='form-selection'>
        {choices.map((item, index) => (
          <div key={index}>
            <label htmlFor={`choice-${index}`}>Preferred Choice {index + 1}:</label>
            <select
              id={`choice-${index}`}
              value={item.choice}
              onChange={(e) => handleChange(index, 'choice', e.target.value)}
              required
              className='input-reg'
            >
              <option value="" disabled >Select a course</option>
              {electives.map(choice => (
                <option key={choice.id} value={choice.id}>{choice.id} - {choice.name}</option>
              ))}
            </select>

            <label htmlFor={`reason-${index}`}>Reason for Choice {index + 1}:</label>
            <textarea
              id={`reason-${index}`}
              value={item.reason}
              onChange={(e) => handleChange(index, 'reason', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
};

export default SelectionPage;
