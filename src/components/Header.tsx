import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const SearchEvalTitle: React.FC = () => {
  return (
    <span className="font-bold">Search<span className="text-gray-500">evals</span></span>
  )
}

const Header: React.FC = () => {
  const router = useRouter();
  return (
    <header>
      <a href="/" className="text-4xl text-center mt-2 block"><SearchEvalTitle/></a>
      <div className="flex text-md font-bold justify-center items-center gap-4 mb-2">
        <Link
          href="/systems"
          className={`hover:bg-blue-100 p-1 rounded-md hover:underline ${router.pathname === "/systems" ? "bg-gray-200" : ""}`}>
            Search Systems
        </Link>
        <Link
          href="/evaluators"
          className={`hover:bg-blue-100 p-1 rounded-md hover:underline ${router.pathname === "/evaluators" ? "bg-gray-200" : ""}`}>
            Search Evaluators
        </Link>
      </div>
    </header>
  );
};

export default Header;
