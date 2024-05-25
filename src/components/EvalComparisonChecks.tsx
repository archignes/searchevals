import { useContext } from "react";
import { ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import DataContext from "./DataContext";
import DiffMatchPatch from 'diff-match-patch';
import { extractTimestamp, isTimestampFriendly } from '../lib/utils';


export const CheckTemporalDifference: React.FC<{ evalItemId: string; currentEvaluation: string }> = ({ evalItemId, currentEvaluation }) => {
  const { data, systems } = useContext(DataContext);
  const currentEvalItem = data ? data.find(evalItem => evalItem.id === currentEvaluation) : null;
  const followingEvalItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;

  if (!currentEvalItem || !followingEvalItem) return null;

  if (isTimestampFriendly(currentEvalItem.url) && isTimestampFriendly(followingEvalItem.url)) {
    
    const currentTimestamp = extractTimestamp(currentEvalItem.url);
    const followingTimestamp = extractTimestamp(followingEvalItem.url);
    const timeDifference = currentTimestamp.getTime() - followingTimestamp.getTime();

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let humanFriendlyDifference = '';
    if (years > 0) {
      humanFriendlyDifference = `${years} year${years > 1 ? 's' : ''} and ${months % 12} month${months > 1 ? 's' : ''}`;
    } else if (months > 0) {
      humanFriendlyDifference = `${months} month${months > 1 ? 's' : ''} and ${weeks % 4} week${weeks > 1 ? 's' : ''}`;
    } else if (weeks > 0) {
      humanFriendlyDifference = `${weeks} week${weeks > 1 ? 's' : ''} and ${days % 7} day${days > 1 ? 's' : ''}`;
    } else if (days > 0) {
      humanFriendlyDifference = `${days} day${days > 1 ? 's' : ''} and ${hours % 24} hour${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      humanFriendlyDifference = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes % 60} minute${minutes > 1 ? 's' : ''}`;
    } else {
      humanFriendlyDifference = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    const exactDifference = `${years} year${years !== 1 ? 's' : ''}, ${months % 12} month${months % 12 !== 1 ? 's' : ''}, ${weeks % 4} week${weeks % 4 !== 1 ? 's' : ''}, ${days % 7} day${days % 7 !== 1 ? 's' : ''}, ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}, ${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`;

    const combinedSystems = currentEvalItem.systems.map((system: any) => system.name).concat(followingEvalItem.systems.map((system: any) => system.name));
    const randomSystem = combinedSystems[Math.floor(Math.random() * combinedSystems.length)];
    const systemData = systems.find(
      (system: any) => system.name === randomSystem
    );
    const systemSearchLink = systemData?.search_link || `https://www.google.com/search?q=`;
    // create human friendly time stamps in dates and hours
    let currentHumanFriendlyTimestamp = '';
    let followingHumanFriendlyTimestamp = '';
    if (weeks > 0) {
      currentHumanFriendlyTimestamp = currentTimestamp.toLocaleDateString();
      followingHumanFriendlyTimestamp = followingTimestamp.toLocaleDateString();
    } else {
      currentHumanFriendlyTimestamp = currentTimestamp.toLocaleString();
      followingHumanFriendlyTimestamp = followingTimestamp.toLocaleString();
    }
    
    const timeDifferenceQuery = `${systemSearchLink}what+is+the+time+difference+between+${followingHumanFriendlyTimestamp}+and+${currentHumanFriendlyTimestamp}`;

    return (
      <div className="flex justify-center w-full text-xs items-center text-info">
        <InfoCircledIcon className="text-grey-500" />
        <a href={timeDifferenceQuery} className="ml-1 text-grey-500" title={exactDifference}>
          Temporal difference: {humanFriendlyDifference}
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
