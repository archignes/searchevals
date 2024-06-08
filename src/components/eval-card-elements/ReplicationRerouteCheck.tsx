import { useContext } from "react";
import { EvalItem } from "../../types"
import { StarIcon, StackIcon, MinusCircledIcon, CheckCircledIcon, CrossCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import DataContext from '../DataContext';
import { IconTelescope } from '@tabler/icons-react';
import { EvalCardProps } from '../EvalCard';
import { MiniEvalCard } from '../MiniEvalCard';
import { CheckTemporalDifference, CheckQueryConsistency } from '../EvalComparisonChecks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { text } from "stream/consumers";
import { ReroutingAttemptNotice, DropDownRerouteAttempts } from "./ReroutingAttemptNotice";

const ReplicationEvaluationTargetCheck = ({ evalItem, className }: { evalItem: EvalItem, className?: string }) => {
  const { data } = useContext(DataContext); 
  const replicatedEvalItem = data?.find(
    item => item.id === evalItem.replication_attempt?.replication_of_id
  ) || null;

  const droppedEvaluationTargets = replicatedEvalItem?.evaluation_target?.filter(
    (target) => !evalItem.evaluation_target?.includes(target)
  );

  const addedEvaluationTargets = evalItem.evaluation_target?.filter(
    (target) => !replicatedEvalItem?.evaluation_target?.includes(target)
  );

  if (
    (!addedEvaluationTargets || addedEvaluationTargets.length === 0) &&
    (!droppedEvaluationTargets || droppedEvaluationTargets.length === 0)
  ) {
    return null;
  }
  const addedEvaluationTargetsString = addedEvaluationTargets
    ?.map(target => target || '')
    .join(', ') || '';
  const droppedEvaluationTargetsString = droppedEvaluationTargets
    ?.map(target => target || '')
    .join(', ') || '';

  return (
    <div className="ml-10 text-xs text-left">
      {addedEvaluationTargetsString && (
        <span className={`${className} text-[10px]`}>
          Added evaluation target: {addedEvaluationTargetsString}
        </span>
      )}
      {droppedEvaluationTargetsString && (
        <span className={`${className} text-[10px]`}>
          Dropped evaluation target: {droppedEvaluationTargetsString}
        </span>
      )}
    </div>
  );
}



const ReplicationAttemptItemLabel: React.FC<{ connection: string, currentEvaluation: string, currentEvaluator: boolean }> = ({ connection, currentEvaluation, currentEvaluator }) => {
  const { data } = useContext(DataContext);
  const connectedItem = data ? data.find(evalItem => evalItem.id === connection) : null;
  return connectedItem ? (
    <DropdownMenuItem id="connected-item-label">
      <MiniEvalCard evalItemId={connectedItem.id} currentEvaluation={currentEvaluation} currentEvaluator={currentEvaluator} />
    </DropdownMenuItem>
  ) : null;
}

const DropDownReplicationAttempts: React.FC<EvalCardProps & { className?: string }> = ({ evalItemId, className }) => {
  const { replicatedStatusLookupMap } = useContext(DataContext);
  const subjectOfReplicationAttempts = replicatedStatusLookupMap[evalItemId];
  if (!subjectOfReplicationAttempts) return null;

  console.log('Replicated status lookup map:', replicatedStatusLookupMap[evalItemId]);

  const subjectOfReplicationAttemptsBackgroundColor = replicatedStatusLookupMap[evalItemId]?.every(attempt =>
    attempt.replication_status === 'extended' ||
    attempt.replication_status === 'replicated' ||
    attempt.replication_status === 'partial' ||
    attempt.replication_status === 'explored') ? 'bg-green-100' : 'bg-yellow-100';
  const subjectOfReplicationAttemptsBorderColor = replicatedStatusLookupMap[evalItemId]?.every(attempt =>
    attempt.replication_status === 'extended' ||
    attempt.replication_status === 'replicated' ||
    attempt.replication_status === 'partial' ||
    attempt.replication_status === 'explored') ? 'border-green-500' : 'border-yellow-500';
  const subjectOfReplicationAttemptsTextColor = replicatedStatusLookupMap[evalItemId]?.every(attempt =>
    attempt.replication_status === 'extended' ||
    attempt.replication_status === 'replicated' ||
    attempt.replication_status === 'partial' ||
    attempt.replication_status === 'explored') ? 'text-green-600' : 'text-yellow-600';
  const subjectOfReplicationAttemptsIcon = replicatedStatusLookupMap[evalItemId]?.every(attempt =>
    attempt.replication_status === 'extended' ||
    attempt.replication_status === 'replicated' ||
    attempt.replication_status === 'partial') ? (
      <StarIcon className={`mr-1 ${subjectOfReplicationAttemptsTextColor}`} />
    ) : replicatedStatusLookupMap[evalItemId]?.every(attempt =>
      attempt.replication_status === 'explored') ? (
      <IconTelescope stroke={1.5} className={`mr-1 h-4 w-4 ${subjectOfReplicationAttemptsTextColor}`} />
    ) : (
      <MinusCircledIcon className={`mr-1 ${subjectOfReplicationAttemptsTextColor}`} />
    );
  const allReplicated = subjectOfReplicationAttempts?.every(attempt => 
    attempt.replication_status === 'replicated');
  const allExtended = subjectOfReplicationAttempts?.every(attempt => 
    attempt.replication_status === 'extended');
  const allPartial = subjectOfReplicationAttempts?.every(attempt => 
    attempt.replication_status === 'partial');
  const replicationAndMixedStatus = subjectOfReplicationAttempts?.some(attempt => 
    attempt.replication_status === 'replicated') && 
    (subjectOfReplicationAttempts.some(attempt => 
      attempt.replication_status === 'extended') || 
    subjectOfReplicationAttempts.some(attempt => 
      attempt.replication_status === 'partial'));

  console.log('Subject of replication attempts:', subjectOfReplicationAttempts);
  console.log('All replicated:', allReplicated);
  console.log('All extended:', allExtended);
  console.log('All partial:', allPartial);
  console.log('Replication and mixed status:', replicationAndMixedStatus);


  const allExplored = subjectOfReplicationAttempts?.every(attempt => 
    attempt.replication_status === 'explored');

  let subjectOfReplicationAttemptsText = 'Replication in progress...';
  if (allReplicated) {
    subjectOfReplicationAttemptsText = subjectOfReplicationAttempts.length === 1 
      ? 'Replicated' 
      : `Replicated ${subjectOfReplicationAttempts.length} times`;
  } else if (allExtended) {
    subjectOfReplicationAttemptsText = subjectOfReplicationAttempts.length === 1 
      ? 'Extended' 
      : `Extended ${subjectOfReplicationAttempts.length} times`;
  } else if (allExplored) {
    subjectOfReplicationAttemptsText = subjectOfReplicationAttempts.length === 1 
      ? 'Explored' 
      : `Explored ${subjectOfReplicationAttempts.length} times`;
  } else if (allPartial) {
    subjectOfReplicationAttemptsText = subjectOfReplicationAttempts.length === 1 
      ? 'Partially Replicated' 
      : `Partially Replicated ${subjectOfReplicationAttempts.length} times`;
  } else if (replicationAndMixedStatus) {
    const replicatedCount = subjectOfReplicationAttempts.filter(attempt => 
      attempt.replication_status === 'replicated').length;
    const extendedCount = subjectOfReplicationAttempts.filter(attempt => 
      attempt.replication_status === 'extended').length;
    const partialCount = subjectOfReplicationAttempts.filter(attempt => 
      attempt.replication_status === 'partial').length;

    subjectOfReplicationAttemptsText = 'Replicated';
    if (replicatedCount > 1) {
      subjectOfReplicationAttemptsText += ` ${replicatedCount} times`;
    }
    if (extendedCount > 0) {
      subjectOfReplicationAttemptsText += extendedCount === 1 
        ? ' and extended' 
        : ` and extended ${extendedCount} times`;
    }
    if (partialCount > 0) {
      subjectOfReplicationAttemptsText += partialCount === 1 
        ? ' and partially replicated' 
        : ` and partially replicated ${partialCount} times`;
    }
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`hover:border-blue-500 hover:bg-green-100 rounded-none border ${subjectOfReplicationAttemptsBorderColor} ${subjectOfReplicationAttemptsBackgroundColor} flex items-center font-semibold m-0 p-1 w-fit text-xs text-center ${className}`}
          aria-label={`Replication status`}
        >
          <>
            {subjectOfReplicationAttemptsIcon}
            <span className={subjectOfReplicationAttemptsTextColor}>{subjectOfReplicationAttemptsText}</span>
          </>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
        <div className="p-2 text-xs text-gray-500">
          <div>
            Replications: {subjectOfReplicationAttempts.filter(attempt => attempt.replication_status === 'replicated').length}
          </div>
          {subjectOfReplicationAttempts.filter(attempt => attempt.replication_status === 'extended').length > 0 && (
            <div>
              Extensions: {subjectOfReplicationAttempts.filter(attempt => attempt.replication_status === 'extended').length}
            </div>
          )}
          {subjectOfReplicationAttempts.filter(attempt => attempt.replication_status === 'partial').length > 0 && (
              <div>
                  Partial Replications: {subjectOfReplicationAttempts.filter(attempt => attempt.replication_status === 'partial').length}
              </div>
          )}
        </div>
        {subjectOfReplicationAttempts?.map((attempt) => (
          <ReplicationAttemptItemLabel
            key={attempt.replication_id}
            connection={attempt.replication_id}
            currentEvaluation={evalItemId}
            currentEvaluator={false}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const getTargetEvalEvaluatorAndQuery = (
  type: string,
  minimalEvalLookupMap: Record<string, any>,
  evalItem: EvalItem
) => {
  console.log('getTargetEvalEvaluatorAndQuery called with type:', type);
  let targetId = '';
  if (type === 'replication') {
    targetId = evalItem.replication_attempt?.replication_of_id || '';
    console.log('Replication targetId:', targetId);
  } else if (type === 'rerouting') {
    targetId = evalItem.rerouting_attempt?.rerouting_from_id || '';
    console.log('Rerouting targetId:', targetId);
  }

  if (!targetId) {
    console.log('No targetId found, returning empty string');
    return '';
  }

  const targetDetails = minimalEvalLookupMap[targetId];
  if (!targetDetails) {
    console.log('No details found for targetId:', targetId);
    return '';
  }

  console.log('Found target details:', targetDetails);
  return `${targetDetails.evaluatorName.trim()}'s [${targetDetails.evalQuery.trim()}]`;
};


export const ReplicationRerouteCheck = ({ evalItem, className }: { evalItem: EvalItem, className?: string }) => {
    const { minimalEvalLookupMap, evaluators } = useContext(DataContext);


  const backgroundColor = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? 'bg-green-100' 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? 'bg-yellow-100'
    : evalItem.replication_attempt?.replication_status === 'extended'
    ? 'bg-blue-100'
    : evalItem.replication_attempt?.replication_status === 'explored'
    ? 'bg-green-100'
    : 'bg-orange-100';
  
  const borderColor = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? 'border-green-500' 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? 'border-yellow-500'
    : evalItem.replication_attempt?.replication_status === 'extended'
    ? 'border-blue-500'
    : evalItem.replication_attempt?.replication_status === 'explored'
    ? 'border-green-500'
    : 'border-orange-500';
  
  const textColor = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? 'text-green-600' 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? 'text-yellow-600'
    : evalItem.replication_attempt?.replication_status === 'extended'
    ? 'text-blue-600'
    : evalItem.replication_attempt?.replication_status === 'explored'
    ? 'text-green-600'
    : 'text-orange-600';
  
  const replicationStatus = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? (
        <>
          Replicates <a href={`/card/${evalItem.replication_attempt.replication_of_id}`} className="underline">
                  {getTargetEvalEvaluatorAndQuery('replication', minimalEvalLookupMap, evalItem)}
          </a> eval
        </>
      )
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? (
        <>
          Partially replicates <a href={`/card/${evalItem.replication_attempt.replication_of_id}`} className="underline">
                      {getTargetEvalEvaluatorAndQuery('replication', minimalEvalLookupMap, evalItem)}
          </a>
        </>
      )
    : evalItem.replication_attempt?.replication_status === 'extended'
    ? (
        <>
          Extends <a href={`/card/${evalItem.replication_attempt.replication_of_id}`} className="underline">
                          {getTargetEvalEvaluatorAndQuery('replication', minimalEvalLookupMap, evalItem)}
          </a> eval
        </>
      )
    : evalItem.replication_attempt?.replication_status === 'explored'
    ? (
        <>
          Explores <a href={`/card/${evalItem.replication_attempt.replication_of_id}`} className="underline">
                          {getTargetEvalEvaluatorAndQuery('replication', minimalEvalLookupMap, evalItem)}
          </a> eval
        </>
      )
    : `Failed to replicate (${evalItem.replication_attempt?.replication_status})`;
  
  const icon = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? <CheckCircledIcon className={`mr-1 ${textColor} flex-shrink-0`} /> 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? <MinusCircledIcon className={`mr-1 ${textColor} flex-shrink-0`} />
    : evalItem.replication_attempt?.replication_status === 'extended'
    ? <PlusCircledIcon className={`mr-1 ${textColor} flex-shrink-0`} />
    : evalItem.replication_attempt?.replication_status === 'explored'
    ? <IconTelescope stroke={1.5} className={`mr-1 h-4 w-4 ${textColor} flex-shrink-0`} />
    : <CrossCircledIcon className={`mr-1 ${textColor} flex-shrink-0`} />;    
    
  
  return (
    <>
      <DropDownReplicationAttempts evalItemId={evalItem.id} className={className} />
    {evalItem.replication_attempt && (
      <div 
        className={`border ${borderColor} ${backgroundColor} hover:${backgroundColor} flex flex-col items-start font-semibold p-2 w-fit text-xs ${className}`}
        aria-label={`Replicating status: ${replicationStatus}`}
      >
        <div className="flex items-start">
          <StackIcon className={`h-4 w-4 ${textColor} inline mr-1 flex-shrink-0`} />
          {icon}
          <span className={textColor}>{replicationStatus}</span>
        </div>
        <ReplicationEvaluationTargetCheck evalItem={evalItem} className={textColor} />
        <CheckTemporalDifference evalItemId={evalItem.replication_attempt.replication_of_id} currentEvaluation={evalItem.id} className={`${textColor}`} />
        {/* <CheckQueryConsistency evalItemId={evalItem.replication_attempt.replication_of_id} currentEvaluation={evalItem.id} /> */}
      </div>
    )}
      <DropDownRerouteAttempts evalItemId={evalItem.id} className={className} />
      <ReroutingAttemptNotice evalItem={evalItem} className={className} />
    </>
  );
}
