// App.tsx
import React, { useContext } from 'react';
import { Route, Routes, useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResultsPage from './components/SearchResultsPage';
import SearchEvalCard from './components/SearchEvalCard';
import DataContext from './components/DataContext'; // Import DataContext
import { Button } from './components/ui/button';

const App: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, systems } = useContext(DataContext); // Destructure data from DataContext
  const query = searchParams.get('q');

  


  return (
    <div className="App">
      <a href="/" className="text-4xl font-bold text-center mb-3 mt-2 block">Searchevals</a>
      <div className="flex justify-center">
          <p>Search from over <span className='font-bold'>{data.length - 1}</span> public evals!</p>
      </div>
      <SearchBar />
      <Routes>
        <Route path="/" element={<div></div>} />
        <Route path="/card/:id" element={<SearchEvalCard />} />
        <Route path="/search" element={<SearchResultsPage />} />
      </Routes>
    </div>
  );
}

export default App;
