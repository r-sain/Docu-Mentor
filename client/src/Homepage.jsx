import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { FcDocument, FcPlus } from 'react-icons/fc';
import { MdDeleteForever } from 'react-icons/md';
import './homepage.css';
import { useURLContext } from './URLContext';

function Homepage() {
  const { urlHistory, updateURL } = useURLContext();
  console.log(urlHistory);

  const extractUuidFromUrl = url => {
    const segments = url.split('/');
    const uuid = segments[segments.length - 1];
    return uuid.substr(-5); // Extract the last 12 characters
  };

  const handleRemove = (urlToRemove, event) => {
    event.preventDefault();
    const updatedHistory = urlHistory.filter(url => url !== urlToRemove);
    const urlId = extractUuidFromUrl(urlToRemove); 
    // Send the DELETE request with the full _id from the data
    const matchingData = data.find(item => item._id.endsWith(urlId));
    if (matchingData) {
      const fullId = matchingData._id; // Full _id for DELETE request

      fetch(`http://localhost:5000/documents/${fullId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.status === 204) {
            // Update state or context
            updateURL(urlToRemove, false); // Update context without changing local storage
          } else {
            console.error('Failed to delete document:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error deleting document:', error);
        });
    }


    localStorage.setItem('urlHistory', JSON.stringify(updatedHistory));
    updateURL(urlToRemove, false); // Update context without changing local storage
    window.location.reload();
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(data => {
        setData(data);
        const insertDataArray = data.map(item =>
          item.data.ops[0].insert.trim()
        );
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <div id="homepage">
      <Link to={`/`} style={{ textDecoration: 'none' }}>
        <div className="header">
          <div className="logo">
            <FcDocument size={40} />
          </div>
          <div className="appname">Docu Mentor</div>
        </div>
      </Link>
      <div className="newDoc">
        <Link to={`/docs/${uuid()}`}>
          <div className="create">
            <FcPlus size={30} />
          </div>
        </Link>
        <div className="docDispText">
          <span className="heading">Start a new document with Docu Mentor</span>
        </div>
      </div>
      <div className="recents">
        <div className="recentHeading">Recent Documents</div>
        <div className="recentFiles">
          <div className="gridContainer">
          {urlHistory.map((url, index) => {
              const urlId = extractUuidFromUrl(url);
              const matchingData = data.find(
                item => item._id.endsWith(urlId)
              );

              return (
                <Link to={url} key={url} style={{ textDecoration: 'none' }}>
                  <div key={index} className="recentFileItem">
                    <div className="top">
                      <span
                        onClick={event => {
                          handleRemove(url, event);
                        }}
                      >
                        <MdDeleteForever
                          size={20}
                          style={{ color: '#d74a4a', paddingTop: '2px' }}
                        />
                      </span>
                    </div>
                    <div className="middle">
                    {matchingData && (
                        <div className="matchingData">
                          {matchingData.data.ops[0].insert}
                        </div>
                      )}
                    </div>
                    <div className="bottom">
                      <span>Document {urlId}</span>
                      
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
