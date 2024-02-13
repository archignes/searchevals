// SearchEvalCard.tsx
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import DataContext from './DataContext';
import { Link2Icon, InfoCircledIcon, DrawingPinIcon } from '@radix-ui/react-icons';
import SearchOnEvalInterface from './SearchOnEvalInterface';
import SearchBracket from './SearchBracket'
import '../styles/globals.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,} from './ui/card';
import EvalExtractCard from './EvalExtractCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
  
interface SearchEvalCardProps {
  idFromProp?: string;
}

const SearchEvalCard: React.FC<SearchEvalCardProps> = ({ idFromProp }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = idFromProp || paramId;
  const { data, systems, evaluators } = useContext(DataContext);

  const evalItem = data ? data.find(evalItem => evalItem.id === id) : null;
  
  const evalEvaluatorDetails = evaluators.find(evaluator => evaluator.id === evalItem?.evaluator_id);
  

  if (!evalItem) {
    return <div>No data found for this ID</div>; // Return a valid JSX element
  }

  type conflictType = {
    name: string;
    searchLink: string;
    query: string;
    queryTooltip: JSX.Element
  };

  let conflicts: conflictType[] = [];
  if (evalEvaluatorDetails && evalEvaluatorDetails.conflict) {
    conflicts = evalEvaluatorDetails.conflict.map(conflictId => {
      const system = systems.find(system => system.id === conflictId);
      let query= `How is ${evalEvaluatorDetails.name} connected to ${system?.name}?`
      return {
        name: system!.name,
        searchLink: system!.search_link,
        query: query,
        queryTooltip: (         
          <><span>Click to start a <strong>{system?.name}</strong> search in a new tab:</span><SearchBracket className="not-italic text-sm">{query}</SearchBracket></>
          )};
    });
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

  const marqueeOrigin:boolean = (window.location.pathname === "/")

  let cardTitle = <div><SearchBracket><span className="text-xl">{evalItem.query}</span></SearchBracket></div>

  return (
    <div className={`w-11/12 ${marqueeOrigin ? 'md:w-11/12' : 'md:w-2/3'} mx-auto mt-4`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            <SearchOnEvalInterface evalItem={evalItem} />
            {marqueeOrigin ? (
              <a href={`/card/${evalItem.id}`}>{cardTitle}</a>
            ) : (
              cardTitle
            )}
            </CardTitle>
          <CardDescription>
            <a href={evalItem.url} target="_blank" rel="noopener noreferrer" className="w-7/8 truncate block">{evalItem.url}</a>
            <span className="text-sm">systems: {systemsEvaluatedSearchLinks}</span>
            <span className="text-sm">date: {evalItem.date}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evalEvaluatorDetails && (
            <figcaption className="mt-1 mb-2">
              <div className="flex items-center divide-x rtl:divide-x-reverse divide-gray-300 dark:divide-gray-700">
                <cite id="person-name" className="pe-3 ml-3 font-medium text-gray-900 dark:text-white">{evalEvaluatorDetails.name}</cite>
                <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
                  <span id="person-info-link" className="inline-flex"><a href={evalEvaluatorDetails.URL} target="_blank" rel="noopener noreferrer"><InfoCircledIcon /></a></span>
                  <span id="person-role" className="ml-1">{evalEvaluatorDetails.role}</span>
                  {conflicts && conflicts.length > 0 && (
                    <><br></br>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger><span className="inline-flex"><DrawingPinIcon /></span></TooltipTrigger>
                          <TooltipContent>
                            <p>This evaluator person has a potential conflict-of-interest due to their relationship with the entities pinned to the right.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {conflicts.map((conflict, index) => (
                        <React.Fragment key={index}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger><a className="underline ml-1" href={conflict.searchLink.replace('%s', encodeURIComponent(conflict.query).replace(/%20/g, '+'))} target="_blank" rel="noopener noreferrer">
                                {conflict.name}
                              </a>
                                {index < conflicts.length - 1 ? ', ' : ''}</TooltipTrigger>
                              <TooltipContent >
                                {conflict.queryTooltip}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </React.Fragment>
                      ))}
                    </>)}
                  </cite>
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
          <Link2Icon className="text-gray-500 dark:text-gray-400" /><small className="text-gray-500 dark:text-gray-500">Permalink id: <a className="underline" href={`/${evalItem!.id}`}>{evalItem!.id}</a></small>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SearchEvalCard;
