// App.tsx
import React, { useContext } from 'react';
import { Route, Routes, useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResultsPage from './components/SearchResultsPage';
import SearchEvalCard from './components/SearchEvalCard';
import Footer from './components/Footer';
import DataContext from './components/DataContext'; // Import DataContext
import Marquee from './components/Marquee';
import {NewInputForm} from './components/DataInput'

const App: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, systems } = useContext(DataContext); // Destructure data from DataContext
  const query = searchParams.get('q');

  return (
    <div className="App">
      <a href="/" className="text-4xl font-bold text-center mb-3 mt-2 block">Search<span className="text-gray-500">evals</span></a>
      <div className="flex justify-center">
          <p>Search from over <span className='font-bold'>{data.length - 1}</span> public evals!</p>
      </div>
      <SearchBar />

      <Routes>
        <Route path="/" element={<Marquee />} />
        <Route path="/card/:id" element={<SearchEvalCard />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/input" element={<NewInputForm />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
