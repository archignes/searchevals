import { useContext } from "react";
import { ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import DataContext from "./DataContext";
import DiffMatchPatch from 'diff-match-patch';



export const CheckTemporalDifference: React.FC<{ evalItemId: string; currentEvaluation: string }> = ({ evalItemId, currentEvaluation }) => {
  const { data } = useContext(DataContext);
  const currentEvalItem = data ? data.find(evalItem => evalItem.id === currentEvaluation) : null;
  const followingEvalItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;

  if (!currentEvalItem || !followingEvalItem) return null;

  if (currentEvalItem.url.includes('twitter.com') && followingEvalItem.url.includes('twitter.com')) {
    const extractTimestamp = (statusId: string) => {
      const tweetId = BigInt(statusId);
      const timestampMs = tweetId / BigInt(2 ** 22) + BigInt(1288834974657);
      return new Date(Number(timestampMs));
    };

    const currentStatusId = currentEvalItem.url.split('/').pop();
    const followingStatusId = followingEvalItem.url.split('/').pop();
    if (currentStatusId && followingStatusId) {
      const currentTimestamp = extractTimestamp(currentStatusId);
      const followingTimestamp = extractTimestamp(followingStatusId);
      const timeDifference = currentTimestamp.getTime() - followingTimestamp.getTime();
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const humanFriendlyDifference = `${hoursDifference} hours and ${minutesDifference} minutes`;
      if (hoursDifference === 0) {
        return (
          <div className="flex justify-center w-full text-xs items-center text-info">
            <InfoCircledIcon className="text-grey-500" />
            <span className="ml-1 text-grey-500">Temporal difference: {minutesDifference} minutes</span>
          </div>
        );
      }
      return (
        <div className="flex justify-center w-full text-xs items-center text-info">
          <InfoCircledIcon className="text-grey-500" />
          <span className="ml-1 text-grey-500">Temporal difference: {humanFriendlyDifference}</span>
        </div>
      );
    }
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

  if (currentQuery.toLowerCase() === followingQuery.toLowerCase()) {
    return (
      <div className="flex justify-center w-full text-xs items-center text-warning">
        <ExclamationTriangleIcon className="text-blue-500" />
        <span className="ml-1 text-blue-500">Note: Queries differ (in capitalization). </span>
      </div>
    );
  }

  if (currentQuery !== followingQuery) {
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
