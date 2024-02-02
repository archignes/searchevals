import React, { useContext, useEffect, useState } from 'react';
import '../styles/globals.css';
import { useSearchParams } from 'react-router-dom';
import DataContext from './DataContext';

const SearchResults: React.FC = () => {
  const { results, query, setQuery } = useContext(DataContext);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [stableResults, setStableResults] = useState<Array<any>>([]);
  const [initialQuery, setInitialQuery] = useState<string | null>('');

  useEffect(() => {
    // Capture the initial query from URL parameter only once
    if (searchQuery !== null && initialQuery === '') {
      setInitialQuery(searchQuery);
      setQuery(searchQuery);
    }

    // Set stableResults only once when the component mounts
    if (stableResults.length === 0 && results.length > 0) {
      setStableResults([...results]);
    }
  }, [searchQuery, setQuery, results, stableResults, initialQuery]);

  return (
    <div>
      <div id='search-results' className="w-2/3 mx-auto">
        <>
          <hr className="mt-10"></hr>
          <h2>Results for <span className="text-xl mx-1">[</span>{initialQuery}<span className="text-xl mx-1">]</span>:</h2>
          {searchQuery && stableResults.length > 0 ? (
            <div className="m-1">
              <ul>
                {stableResults.map((result: any) => (
                  <li key={result.id}>
                    <a href={`/card/${result.id}`}>[{result.query}]</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (<p>No results found.</p>)}
        </>
      </div>
    </div>
  );
};

export default SearchResults;
