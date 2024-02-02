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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search?q=${query}`);
  };


  const goToRandomCard = () => {
    // Assuming card IDs are numeric and you have a maximum ID of 100
    // Adjust the max ID based on your actual data
    const cardIds = data.map(card => card.id);
    const randomIndex = Math.floor(Math.random() * cardIds.length);
    const randomId = cardIds[randomIndex];
    navigate(`/card/${randomId}`);
  };

  

  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="search-box-container w-2/3 justify-center items-center flex space-x-2">
        <form className="flex space-x-2 items-center w-1/2 input-group justify-center search-bar no-link"
        role="search"
        aria-label="Website Search"
        id="search-form"
        onSubmit={handleSubmit}>
          <Input type="text" className="form-input search-box" id="search-box"
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
        {query && results.length > 0 && query !== new URLSearchParams(window.location.search).get('q') && (
          <div id="dynamic-results" className="w-1/3 border mt-0 mx-2 p-2 mx-auto bg-white absolute z-50">
            <ul>
              {results.map((result: any) => (
                <li key={result.id}>
                  <a href={`/card/${result.id}`}>[{result.query}]</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
      <Button onClick={goToRandomCard} className="btn mx-auto btn-outline-secondary m-1">Go to a random Eval</Button>
    </div>
    </div>
  );
};