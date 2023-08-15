import React, { createContext, useContext, useEffect, useState } from 'react';

const URLContext = createContext();

export const URLProvider = ({ children }) => {
  const [urlHistory, setUrlHistory] = useState([]);
  const [documentContents, setDocumentContents] = useState({}); // Add this state

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedData = localStorage.getItem('urlHistory');
    if (storedData) {
      setUrlHistory(JSON.parse(storedData));
    }
  }, []);

  // Update data in localStorage whenever urlHistory changes
  useEffect(() => {
    localStorage.setItem('urlHistory', JSON.stringify(urlHistory));
  }, [urlHistory]);

  const updateURL = (url, content) => { // Update the updateURL function to accept content
    if (!urlHistory.includes(url)) {
      setUrlHistory(prevHistory => [...prevHistory, url]);
      setDocumentContents(prevContents => ({ ...prevContents, [url]: content })); // Store content in state
    }
  };

  // Add a function to get content by URL
  const getContentByUrl = (url) => {
    return documentContents[url] || '';
  };

  return (
    <URLContext.Provider value={{ urlHistory, updateURL, getContentByUrl }}>
      {children}
    </URLContext.Provider>
  );
};

export const useURLContext = () => {
  return useContext(URLContext);
};
