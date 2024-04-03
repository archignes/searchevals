// evaluators.tsx
"use client"

import React, { useContext } from 'react';
import DataContext from '../src/components/DataContext';
import { EvaluatorDetails } from '../src/components/EvaluatorDetails';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const SearchResults: React.FC = () => {
  
  const { evaluators, data } = useContext(DataContext);

  const evaluatorEvalsMap = evaluators.reduce((acc, evaluator) => {
    const evaluatorEvals = data.filter(evalItem => evalItem.evaluatorId === evaluator.id);
    acc[evaluator.id] = evaluatorEvals;
    return acc;
  }, {});

  return (
    <>
      <div id='evaluators-note' className="w-full md:w-2/5 p-2 text-lg mx-auto rounded-md">
          The evaluators have publicly evaluated search systems, with their evaluations collected and linked on Searchevals.
          To add evaluations or request the removal of your evaluations, please <a className="hover:bg-blue-100 underline" href="mailto:daniel@archignes.com?subject=[searchevals.com]">email the Searchevals team</a> or <a className="hover:bg-blue-100 underline" href="https://github.com/archignes/searchevals/issues/new" target="_blank" rel="noopener noreferrer">add an issue on GitHub</a>.
          <hr className='my-2'></hr>
          Anyone can be an evaluator. The current criteria for adding evaluators and evaluations is the use of a public platform to make public claims about the performance of a search system for a particular query.
      </div>
    <div id='evalutors-list' className="w-90 md:w-2/3 mt-5 mx-3 md:mx-auto">
      <>
        {evaluators.sort((a, b) => a.name.localeCompare(b.name)).map((evaluator: any) => (
          <div key={evaluator.id} className='border shadow-md border-gray-200 rounded-md p-2 mb-2'>
            <EvaluatorDetails conflicts={evaluatorEvalsMap[evaluator.id]} evalEvaluatorDetails={evaluator} />

          </div>
        ))}
      </>
    </div>
    </>
  );
};

export default SearchResults;
