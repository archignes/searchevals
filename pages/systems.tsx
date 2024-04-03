// evaluators.tsx
"use client"

import React, { useContext } from 'react';
import DataContext from '../src/components/DataContext';

import { MiniEvalCard } from '../src/components/MiniEvalCard';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const SearchResults: React.FC = () => {
  
  const { systems, data } = useContext(DataContext);

  const uniqueSystems = new Set(data.flatMap(evalItem => evalItem.systems));
  const systemEvalsMap = Array.from(uniqueSystems).reduce((acc, system) => {
    const evalIds = data.filter(evalItem => evalItem.systems.includes(system)).map(evalItem => evalItem.id);
    acc[system] = evalIds;
    return acc;
  }, {});

  return (
    <>
      <div id='systems-note' className="w-full md:w-2/5 p-2 text-lg mx-auto rounded-md">
          The {uniqueSystems.size} systems listed below have been evaluated publicly by the listed evaluators, with their evaluations collected and linked on Searchevals.
          To add evaluations or request the removal of evaluations related to your system, please <a className="hover:bg-blue-100 underline" href="mailto:daniel@archignes.com?subject=[searchevals.com]">email the Searchevals team</a> or <a className="hover:bg-blue-100 underline" href="https://github.com/archignes/searchevals/issues/new" target="_blank" rel="noopener noreferrer">add an issue on GitHub</a>.
          <hr className='my-2'></hr>
          There are many more search systems not listed here, try a few of them out at <a className="hover:bg-blue-100 underline" href="https://searchjunct.com">Searchjunct.com</a>.
      </div>
    <div id='systems-list' className="w-90 md:w-2/3 mx-3 md:mx-auto">
      <>
          {Object.keys(systemEvalsMap).sort((a, b) => a.localeCompare(b)).map((system) => (
          <div key={system}>
              <a href={systems.find(s => s.id === system)?.search_link}>
                <h2 id="system-name" className="text-2xl mt-2 font-semibold">
                <span className='rounded-md hover:underline p-1 hover:bg-blue-100'>{systems.find(s => s.id === system)?.name || system}</span>
                </h2>
                </a>
            <p className="text-md mt-2">Number of Evaluations: {systemEvalsMap[system].length}</p>
            <div className="mt-2 flex flex-col gap-2">
              {systemEvalsMap[system].map(evalId => (
                <MiniEvalCard showConflicts={true} textsize="text-md" key={evalId} evalItemId={evalId} />
              ))}
            </div>
          </div>
        ))}
      </>
    </div>
    </>
  );
};

export default SearchResults;
