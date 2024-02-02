// SearchEvalCard.tsx
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import DataContext, { evalPart } from './DataContext';
import SearchOnEvalInterface from './SearchOnEvalInterface';
import '../styles/globals.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,} from './ui/card';
import EvalExtractCard from './EvalExtractCard'

  
const SearchEvalCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, systems } = useContext(DataContext); // Destructure data from DataContext

  const evalItem = data ? data.find(evalItem => evalItem.id === id) : null;
  
  if (!evalItem) {
    return <div>No data found for this ID</div>; // Return a valid JSX element
  }

  let systemsEvaluatedSearchLinks;
  if (systems && systems.length > 0 && evalItem.systems) {
    const encodedQuery = encodeURIComponent(evalItem.query);
    systemsEvaluatedSearchLinks = systems
      .filter(system => evalItem.systems!.includes(system.name)) // Filter systems based on evalItem.systems
      .map((system, index, filteredSystems) => { // Use filteredSystems for accurate indexing
        const systemLink = system.search_link; // Directly access the searchLink property of the system object
        return (
          <span key={system.id}> {/* Use system.id for a unique key */}
            <a className="underline" target="_blank" rel="noopener noreferrer" href={systemLink.replace('%s', encodedQuery)}>
              {system.name}
            </a>
            {index < filteredSystems.length - 1 ? ', ' : ''} {/* Use filteredSystems.length */}
          </span>
        );
      });
  } else {
    systemsEvaluatedSearchLinks = "";
  }


  let cardTitle = <div><span className="font-bold text-2xl mx-1">[</span><span className="text-xl">{evalItem.query}</span><span className="text-2xl bold ml-1">]</span><br></br></div>

  return (
    <div className="w-2/3 mx-auto mt-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            <SearchOnEvalInterface evalItem={evalItem} />
            {cardTitle}
            </CardTitle>
          <CardDescription ><a href={evalItem.url} target="_blank">{evalItem.url}</a></CardDescription>
          <p className="font-normal text-sm my-0 py-0">Systems evaluated: {systemsEvaluatedSearchLinks}</p>
          <p className="font-normal text-sm my-0 py-0">Date: {evalItem.date}</p>
        </CardHeader>
        <CardContent>
          {evalItem.person && (
            <figcaption className="mt-1 mb-2">
              <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-300 dark:divide-gray-700">
                <cite className="pe-3 ml-3 font-medium text-gray-900 dark:text-white">{evalItem.person.name}</cite>
                <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">{evalItem.person.role}</cite>
                </div>
                </figcaption>)}
          {evalItem.eval_parts ? (
            evalItem.eval_parts.map((part, index) => (
              <EvalExtractCard key={index} evalCardItem={part}/>
            ))
          ) : (
              <EvalExtractCard evalCardItem={evalItem}/>
          )}
        </CardContent>
        <CardFooter>
          <small>idx#{evalItem!.id}</small>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SearchEvalCard;
