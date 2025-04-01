import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import './index.css'; // Import CSS for styling

const SelectionPage = () => {
  const [choices, setChoices] = useState([
    { choice: '', reason: '' },
    { choice: '', reason: '' },
    { choice: '', reason: '' }
  ]);
  const [electives, setElectives] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchElectives = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/electives");
        const electivesData = await response.json();
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

    // Check for duplicate selections
    const selectedChoices = newChoices.map(choice => choice.choice);
    const uniqueChoices = new Set(selectedChoices);
    
    if (uniqueChoices.size !== selectedChoices.length) {
      setError(`You have selected the same course more than once. Please choose different electives.`);
    } else {
      setError(''); // Clear error if selection is valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate selections before submitting
    const selectedChoices = choices.map(choice => choice.choice);
    const uniqueChoices = new Set(selectedChoices);
    
    if (uniqueChoices.size !== selectedChoices.length) {
      setError('You cannot select the same course multiple times.');
      return; // Prevent form submission
    }

    console.log(choices);

    try {
      await Promise.all(
        choices.map(async (each) => {
          const response = await fetch("http://localhost:5000/api/request-enroll", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(each),
          });

          if (!response.ok) {
            throw new Error("Failed to submit a request");
          }
        })
      );

      alert("Requests submitted successfully!");
      setChoices([{ choice: "", reason: "" }, { choice: "", reason: "" }, { choice: "", reason: "" }]);
      setError('');
    } catch (error) {
      console.error("Error submitting requests:", error);
      alert("Failed to submit requests. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="selection-container">
        <h2>Select Your Preferences</h2>
        {error && <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
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
                <option value="" disabled>Select a course</option>
                {electives.map(choice => (
                  <option key={choice.id} value={choice.id}>
                    {choice.id} - {choice.name}
                  </option>
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
          <button type="submit" disabled={!!error}>Submit</button>
        </form>
      </div>
    </>
  );
};

export default SelectionPage;
