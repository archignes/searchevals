// SearchBracket.tsx
"use client"

import React from 'react';
import '../styles/globals.css';

type SearchBracketProps = {
  children: React.ReactNode;
  className?: string; // Add className as an optional prop
};

const SearchBracket: React.FC<SearchBracketProps> = ({ children, className }) => {
  className = className || "text-2xl";
  return (
    <div className={className}>
      <span className="mx-1">[</span>
      {children}
      <span className="ml-1">]</span>
    </div>
  );
};

export default SearchBracket;
