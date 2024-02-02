//SearchBar.tsx
"use client"

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/globals.css';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import DataContext from './DataContext'; // Import DataContext

export default function SearchBar(): JSX.Element {
  const navigate = useNavigate();
  const { data, results, query, setQuery } = useContext(DataContext); // Destructure data from DataContext
  const [showResults, setShowResults] = useState(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setShowResults(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search?q=${query}`);
  };


  const handleCloseResults = () => {
    setShowResults(false);
  };


  const goToRandomCard = () => {
    const currentCardId = window.location.pathname.split('/').pop();
    const filteredCardIds = data.map(card => card.id).filter(id => id !== currentCardId);
    const randomIndex = Math.floor(Math.random() * filteredCardIds.length);
    const randomId = filteredCardIds[randomIndex];
    navigate(`/card/${randomId}`);
  };

  

  return (
    <><div className="flex justify-center items-center space-x-2">
      <div className="search-box-container w-full md:w-2/3 mx-2 justify-center items-center flex flex-wrap space-x-2">
        <form className="flex space-x-2 items-center w-full md:w-1/2 input-group justify-center search-bar no-link"
          role="search"
          aria-label="Website Search"
          id="search-form"
          onSubmit={handleSubmit}>
          <Input type="text" className="form-input search-box w-full" id="search-bar"
            placeholder="Search..."
            name="q"
            value={query}
            onChange={handleInputChange} />
          <Button className="btn btn-outline-secondary" type="submit" aria-label="Submit Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </Button>
        </form>
        <Button onClick={goToRandomCard} className="btn mx-auto btn-outline-secondary m-1 w-full md:w-auto">
          {window.location.pathname.includes('/card/') ? 'Go to a different random Eval' : 'Go to a random Eval'}
        </Button>
      </div>
    </div><div className="mt-0 w-full md:w-1/3 ml-0 md:ml-[calc(50%-20rem)] absolute md:mt-0 mt-[-2.6rem]">
    {query && showResults && results.length > 0 && query !== new URLSearchParams(window.location.search).get('q') && (
      <div id="dynamic-results" className="border mt-0 p-2 bg-white relative z-50 left-0">
          <button onClick={handleCloseResults} className="absolute top-0 right-0 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
          <ul>
          {results.map((result: any) => (
            <li key={result.id}>
              <a href={`/card/${result.id}`}>[{result.query}]</a>
            </li>
          ))}
        </ul>
      </div>
      
    )}
    </div>
    </>
  );
};