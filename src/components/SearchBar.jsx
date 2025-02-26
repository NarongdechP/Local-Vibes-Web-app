import React, { useState } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleReset = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <form className="form">
          <button>
            <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
              <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-3.5-3.5" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <input 
            className="input" 
            placeholder="ค้นหา" 
            required 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="reset" onClick={handleReset}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </form>
        

        </div>
      </div>
  );
};

export default SearchBar;