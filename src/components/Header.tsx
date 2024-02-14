import React, { useContext } from 'react';
import DataContext from './DataContext';

const Header: React.FC = () => {
  const { data } = useContext(DataContext)
  return (
    <header>
      <a href="/" className="text-4xl font-bold text-center mb-3 mt-2 block">Search<span className="text-gray-500">evals</span></a>
      <div className="flex justify-center">
        <p>Search from over <span className='font-bold'>{data.length - 1}</span> public evals!</p>
      </div>
    </header>
  );
};

export default Header;
