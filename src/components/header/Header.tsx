"use client"

import React, { Suspense } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export const SearchevalTitle: React.FC = () => {
  return (
    <span className="font-bold">Search<span className="text-gray-500">evals</span></span>
  )
}

const DropDownMenu = React.lazy(() => import('../main-menu/DropDownMenu'));


const Header: React.FC = () => {
  const router = useRouter();
  return (
    <>
    <header className="grid grid-cols-12 pt-1 mb-1">
      <div className="col-span-1">
        <Suspense>
          <DropDownMenu />
        </Suspense>
      </div>
      <div className="col-span-10 flex justify-center">
        <a href="/" className="text-4xl text-center block">
          <Image className="inline" src="/logo192.png" alt="Searcheval Logo" width={32} height={32} />
          <SearchevalTitle />
        </a>
      </div>
    </header>
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
      </>
  );
};

export default Header;
