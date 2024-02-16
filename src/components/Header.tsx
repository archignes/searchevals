import React from 'react';


export const SearchEvalTitle: React.FC = () => {
  return (
    <span className="font-bold">Search<span className="text-gray-500">evals</span></span>
  )
}

const Header: React.FC = () => {
  return (
    <header>
      <a href="/" className="text-4xl text-center mb-3 mt-2 block"><SearchEvalTitle/></a>
    </header>
  );
};

export default Header;
