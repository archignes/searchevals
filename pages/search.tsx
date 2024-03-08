//search.tsx
"use client"

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import DataContext from '../src/components/DataContext';

const SearchResults: React.FC = () => {
  const { results, miniEvalCard, setQuery } = useContext(DataContext);
  const router = useRouter();
  const searchQuery = router.query.q as string | null;
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
    <>
    <Header/>
    <div id='search-results' className="w-2/3 mx-auto">
      <>
        <hr className="mt-10"></hr>
        <h2>Results for <span className="text-xl mx-1">[</span>{initialQuery}<span className="text-xl mx-1">]</span>:</h2>
        {searchQuery && stableResults.length > 0 ? (
          <div className="m-1">
              <ul className='mt-2'>
                {results.map((result: any) => (
                  <li key={result.id} className='p-1'>
                    <a href={`/card/${result.id}`}>
                      {miniEvalCard && React.createElement(miniEvalCard, { evalItemId: result.id })}
                    </a>
                  </li>
                ))}
              </ul>
          </div>
        ) : (<p>No results found.</p>)}
      </>
    </div>
    </>
  );
};

export default SearchResults;
