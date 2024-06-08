import { useContext } from "react";
import { CounterClockwiseClockIcon, ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import DataContext from "./DataContext";
import DiffMatchPatch from 'diff-match-patch';
import { extractTimestamp, isTimestampFriendly } from '../lib/utils';

import { getHumanFriendlyDifference, getExactDifference } from "../lib/utils";

export const CheckTemporalDifference: React.FC<{ evalItemId: string; currentEvaluation: string; className?: string }> = ({ evalItemId, currentEvaluation, className }) => {
  const { data, systems } = useContext(DataContext);
  
  const currentEvalItem = data ? data.find(evalItem => evalItem.id === currentEvaluation) : null;
  const followingEvalItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;
  
  if (!currentEvalItem || !followingEvalItem) return null;
  
  if (isTimestampFriendly(currentEvalItem) && isTimestampFriendly(followingEvalItem)) {
    
    const currentTimestamp = new Date(currentEvalItem.datetime || extractTimestamp(currentEvalItem.url));
    const followingTimestamp = new Date(followingEvalItem.datetime || extractTimestamp(followingEvalItem.url));
    const timeDifference = currentTimestamp.getTime() - followingTimestamp.getTime();
    
    const humanFriendlyDifference = getHumanFriendlyDifference(followingTimestamp, currentTimestamp);

    const exactDifference = getExactDifference(followingTimestamp, currentTimestamp);

    const combinedSystems = currentEvalItem.systems.map((system: any) => system.name).concat(followingEvalItem.systems.map((system: any) => system.name));
    const randomSystem = combinedSystems[Math.floor(Math.random() * combinedSystems.length)];
    const systemData = systems.find(
      (system: any) => system.name === randomSystem
    );
    const systemSearchLink = systemData?.search_link || `https://www.google.com/search?q=`;
    // create human friendly time stamps in dates and hours
    let currentHumanFriendlyTimestamp = '';
    let followingHumanFriendlyTimestamp = '';
    if (Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7)) > 0) {
      currentHumanFriendlyTimestamp = currentTimestamp.toLocaleDateString();
      followingHumanFriendlyTimestamp = followingTimestamp.toLocaleDateString();
    } else {
      currentHumanFriendlyTimestamp = currentTimestamp.toLocaleString();
      followingHumanFriendlyTimestamp = followingTimestamp.toLocaleString();
    }
    
    const timeDifferenceQuery = `${systemSearchLink}what+is+the+time+difference+between+${followingHumanFriendlyTimestamp}+and+${currentHumanFriendlyTimestamp}`;

    return (
      <div className="flex justify-start ml-5 w-full text-[10px] items-center text-info">
        <CounterClockwiseClockIcon className={`text-grey-500 ${className}`} />
        <a href={timeDifferenceQuery} className={`ml-1 text-grey-500 ${className}`} title={exactDifference}>
          {humanFriendlyDifference} later
        </a>
      </div>
    );
  }
  return null;
};

export const CheckQueryConsistency: React.FC<{ evalItemId: string; currentEvaluation: string }> = ({ evalItemId, currentEvaluation }) => {
  const { data } = useContext(DataContext);
  const currentEvalItem = data ? data.find(evalItem => evalItem.id === currentEvaluation) : null;
  const followingEvalItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;

  if (!currentEvalItem || !followingEvalItem) return null;

  if (currentEvalItem.replication_attempt?.replication_status === 'extended') {
    return null;
  }

  const currentQuery = currentEvalItem.query;
  const followingQuery = followingEvalItem.query;
  

  var dmp = new DiffMatchPatch();
  var diff = dmp.diff_main(currentQuery, followingQuery);
  const diffInsert = () => { return { __html: dmp.diff_prettyHtml(diff) } };

  if (currentQuery !== followingQuery && currentQuery.toLowerCase() === followingQuery.toLowerCase()) {
    return (
      <div className="flex justify-center w-full text-xs items-center text-warning">
        <ExclamationTriangleIcon className="text-blue-500" />
        <span className="ml-1 text-blue-500">Note: Queries differ (in capitalization). </span>
      </div>
    );
  }

  if (currentQuery !== followingQuery) {
    const collectQueries = (item: any): string[] => {
      const queries: string[] = [];
      const findQueries = (obj: any) => {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            findQueries(obj[key]);
          } else if (key === 'query') {
            queries.push(obj[key]);
          }
        }
      };
      findQueries(item);
      return queries;
    };

    const followingQueries = collectQueries(followingEvalItem);
    if (followingQueries.length > 1) {
      const currentQueries = collectQueries(currentEvalItem);
      if (followingQueries.some(fq => currentQueries.includes(fq))) {
        return (
          <>
            <div className="flex justify-center text-gray-500 w-full text-xs items-center text-warning">
              <InfoCircledIcon  />
              <span className="mx-1">Note: There are multiple queries across these evaluations. These queries match: </span>
            <span>
              {followingQueries.filter(fq => currentQueries.includes(fq)).map(q => `[${q}]`).join(', ')}
            </span>
            </div>
          </>
        );
      }
    }
    

    return (
      <>
      <div className="flex justify-center w-full text-xs items-center text-warning">
        <ExclamationTriangleIcon className="text-red-500" />
        <span className="ml-1 text-red-500">Note: Queries differ:</span>
        <div dangerouslySetInnerHTML={diffInsert()}></div>
      </div>
      <span className="ml-1 text-xs text-gray-400">Diff produced with <a className="underline" href="https://github.com/google/diff-match-patch" target="_blank" rel="noopener noreferrer">DiffMatchPatch</a>.</span>
      </>
      
    );
  }

  return null;
};
