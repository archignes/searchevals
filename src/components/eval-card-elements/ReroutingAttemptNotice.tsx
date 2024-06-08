import { useContext } from 'react';
import { EvalItem } from "../../types"
import { CheckCircledIcon, CrossCircledIcon, PlusCircledIcon, StackIcon, ThickArrowRightIcon } from "@radix-ui/react-icons";
import DataContext, { System } from '../DataContext';
import { getTargetEvalEvaluatorAndQuery } from './ReplicationRerouteCheck';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { EvalCardProps } from '../EvalCard';
import { MiniEvalCard } from '../MiniEvalCard';


const RerouteAttemptItemLabel: React.FC<{ connection: string, currentEvaluation: string, currentEvaluator: boolean }> = ({ connection, currentEvaluation, currentEvaluator }) => {
  const { data } = useContext(DataContext);
  const connectedItem = data ? data.find(evalItem => evalItem.id === connection) : null;
  return connectedItem ? (
    <DropdownMenuItem id="connected-item-label">
      <MiniEvalCard evalItemId={connectedItem.id} currentEvaluation={currentEvaluation} currentEvaluator={currentEvaluator} />
    </DropdownMenuItem>
  ) : null;
}

export const DropDownRerouteAttempts: React.FC<EvalCardProps & { className?: string }> = ({ evalItemId, className }) => {
    const { reroutedStatusLookupMap } = useContext(DataContext);
  const subjectOfRerouteAttempts = reroutedStatusLookupMap[evalItemId];
  if (!subjectOfRerouteAttempts) return null;

  const subjectOfRerouteAttemptsBackgroundColor = subjectOfRerouteAttempts?.every(attempt =>
    attempt.rerouted_status === 'success' ||
    attempt.rerouted_status === 'extended critique') ? 'bg-blue-100' : 'bg-orange-100';
  const subjectOfRerouteAttemptsBorderColor = subjectOfRerouteAttempts?.every(attempt =>
    attempt.rerouted_status === 'success' ||
    attempt.rerouted_status === 'extended critique') ? 'border-blue-500' : 'border-orange-500';
  const subjectOfRerouteAttemptsTextColor = subjectOfRerouteAttempts?.every(attempt =>
    attempt.rerouted_status === 'success' ||
    attempt.rerouted_status === 'extended critique') ? 'text-blue-600' : 'text-orange-600';
  const subjectOfRerouteAttemptsIcon = subjectOfRerouteAttempts?.every(attempt =>
    attempt.rerouted_status === 'success') ? (
      <CheckCircledIcon className={`mr-1 ${subjectOfRerouteAttemptsTextColor}`} />
    ) : subjectOfRerouteAttempts?.every(attempt =>
      attempt.rerouted_status === 'extended critique') ? (
      <PlusCircledIcon className={`mr-1 ${subjectOfRerouteAttemptsTextColor}`} />
    ) : (
      <CrossCircledIcon className={`mr-1 ${subjectOfRerouteAttemptsTextColor}`} />
    );

  const allSuccess = subjectOfRerouteAttempts?.every(attempt => 
    attempt.rerouted_status === 'success');
  const allExtended = subjectOfRerouteAttempts?.every(attempt => 
    attempt.rerouted_status === 'extended critique');
  const rerouteAndMixedStatus = subjectOfRerouteAttempts?.some(attempt => 
    attempt.rerouted_status === 'success') && subjectOfRerouteAttempts?.some(attempt => 
    attempt.rerouted_status === 'extended critique');

  let subjectOfRerouteAttemptsText = 'Reroute in progress...';
  if (allSuccess) {
    subjectOfRerouteAttemptsText = subjectOfRerouteAttempts.length === 1 
      ? 'Rerouted and improved performance found' 
      : `Rerouted ${subjectOfRerouteAttempts.length} times and improved performance found`;
  } else if (allExtended) {
    subjectOfRerouteAttemptsText = subjectOfRerouteAttempts.length === 1 
      ? 'Rerouted for extended critique' 
      : `Rerouted ${subjectOfRerouteAttempts.length} times for extended critique`;
  } else if (rerouteAndMixedStatus) {
    const successCount = subjectOfRerouteAttempts.filter(attempt => 
      attempt.rerouted_status === 'success').length;
    const extendedCount = subjectOfRerouteAttempts.filter(attempt => 
      attempt.rerouted_status === 'extended critique').length;

    subjectOfRerouteAttemptsText = 'Rerouted';
    if (successCount > 1) {
      subjectOfRerouteAttemptsText += ` ${successCount} times`;
    }
    if (extendedCount > 0) {
      subjectOfRerouteAttemptsText += extendedCount === 1 
        ? ' for extended critique' 
        : ` for extended critique ${extendedCount} times`;
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`hover:border-blue-500 hover:${subjectOfRerouteAttemptsBackgroundColor} rounded-none border ${subjectOfRerouteAttemptsBorderColor} ${subjectOfRerouteAttemptsBackgroundColor} flex items-center font-semibold m-0 p-1 w-fit text-xs text-center ${className}`}
          aria-label={`Reroute status`}
        >
          <>
            {subjectOfRerouteAttemptsIcon}
            <span className={subjectOfRerouteAttemptsTextColor}>{subjectOfRerouteAttemptsText}</span>
          </>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
        <div className="p-2 text-xs text-gray-500">
          <div>
            Reroutes: {subjectOfRerouteAttempts.filter(attempt => attempt.rerouted_status === 'success').length}
          </div>
          {subjectOfRerouteAttempts.filter(attempt => attempt.rerouted_status === 'extended critique').length > 0 && (
            <div>
              Extensions: {subjectOfRerouteAttempts.filter(attempt => attempt.rerouted_status === 'extended critique').length}
            </div>
          )}
        </div>
        {subjectOfRerouteAttempts?.map((attempt) => (
          <RerouteAttemptItemLabel
            key={attempt.rerouted_id}
            connection={attempt.rerouted_id}
            currentEvaluation={evalItemId}
            currentEvaluator={false}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}





export const ReroutingAttemptNotice: React.FC<{ evalItem: EvalItem, className?: string }> = ({ evalItem, className }) => {
    const { evalsToSystemsLookupMap, systems, evaluators, minimalEvalLookupMap } = useContext(DataContext);

    if (!evalItem.rerouting_attempt) {
        return null;
    }

    const rerouteBackgroundColor = evalItem.rerouting_attempt?.rerouting_status === 'success'
        ? 'bg-blue-100'
        : 'bg-orange-100';
    const rerouteBorderColor = evalItem.rerouting_attempt?.rerouting_status === 'success'
        ? 'border-blue-500'
        : 'border-orange-500';
    const rerouteTextColor = evalItem.rerouting_attempt?.rerouting_status === 'success'
        ? 'text-blue-600'
        : 'text-orange-600';
    const rerouteStatus = evalItem.rerouting_attempt?.rerouting_status === 'success'
        ? 'Reroutes: improved performance'
        : evalItem.rerouting_attempt?.rerouting_status === 'extended critique'
        ? 'Reroutes: extended critique'
        : 'Reroute failure';
    const rerouteIcon = evalItem.rerouting_attempt?.rerouting_status === 'success'
        ? <CheckCircledIcon className={`mr-1 ${rerouteTextColor} flex-shrink-0`} />
        : evalItem.rerouting_attempt?.rerouting_status === 'extended critique'
        ? <PlusCircledIcon className={`mr-1 ${rerouteTextColor} flex-shrink-0`} />
        : <CrossCircledIcon className={`mr-1 ${rerouteTextColor} flex-shrink-0`} />;

    // This code retrieves the systems from which rerouting was attempted.
    // It checks if 'rerouting_from_id' matches an eval ID, and if so, maps each system ID
    // from that eval to the corresponding system object from the 'systems' array.
    const reroutingFromId = evalItem.rerouting_attempt?.rerouting_from_id;
    console.log("evalItem", evalItem);
    console.log("reroutingFromId", reroutingFromId);
    const reroutedFromEval = evalsToSystemsLookupMap[reroutingFromId];
    console.log("reroutedFromEval", reroutedFromEval);
    
    const reroutedFromSystems = reroutedFromEval ? reroutedFromEval.map(systemId => 
        systems.find(system => system.id === systemId)).filter(system => system !== undefined) : [];
        
    if (reroutedFromSystems.length === 0) {
        console.log("No rerouted from systems found");
        return null;
    }

    const reroutedToSystems = evalItem.systems.map(systemId => 
        systems.find(system => system.id === systemId)).filter(Boolean);

    return (
        <div
            className={`border ${rerouteBorderColor} ${rerouteBackgroundColor} flex flex-col text-left items-start font-semibold p-2 w-fit text-xs ${className}`}
            aria-label={`Reroute status: ${rerouteStatus}`}
        >
            <div className="flex flex-row items-start">
                <StackIcon className={`h-4 w-4 ${rerouteTextColor} inline mr-1 flex-shrink-0`} />    
                {rerouteIcon}
                <span className={rerouteTextColor}>{rerouteStatus}</span>
            </div>
            <div className="flex flex-col items-center ml-10 text-[10px]">
                <span className={`${rerouteTextColor} mr-1`}><a href={`/eval/${reroutingFromId}`} className={`underline`}>{getTargetEvalEvaluatorAndQuery("rerouting", minimalEvalLookupMap, evalItem)}</a> on</span>
                <div className="flex flex-row items-center ml-10 text-[10px]">
                    <div className={`border ${rerouteBorderColor} rounded ${rerouteTextColor} p-1`}>
                        {reroutedFromSystems.filter((system): system is System => system !== undefined)
                            .map((system: System, index) =>
                                `${index > 0 ? ', ' : ''}${system.name}`
                            ).join('')}
                    </div>
                    <ThickArrowRightIcon className={`h-3 w-3 ${rerouteTextColor} inline mx-1 flex-shrink-0`} />
                    <div className={`border ${rerouteBorderColor} rounded ${rerouteTextColor} p-1`}>
                        {reroutedToSystems.filter((system): system is System => system !== undefined)
                            .map((system: System, index) =>
                                `${index > 0 ? ', ' : ''}${system.name}`
                            ).join('')}
                    </div>
                </div>
            </div>
        </div>
    )
}
