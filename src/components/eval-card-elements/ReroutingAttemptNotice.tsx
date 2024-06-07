import { useContext } from 'react';
import { EvalItem } from "../../types"
import { CheckCircledIcon, CrossCircledIcon, StackIcon, ThickArrowRightIcon } from "@radix-ui/react-icons";
import DataContext, { System } from '../DataContext';
import { getTargetEvalEvaluatorAndQuery } from './ReplicationRerouteCheck';
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
        ? 'Reroute success'
        : 'Reroute failure';
    const rerouteIcon = evalItem.rerouting_attempt?.rerouting_status === 'success'
        ? <CheckCircledIcon className={`mr-1 ${rerouteTextColor} flex-shrink-0`} />
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
            <div className="flex flex-row items-center ml-10 text-[10px]">
                <span className={`${rerouteTextColor} mr-1`}>{getTargetEvalEvaluatorAndQuery("rerouting", minimalEvalLookupMap, evalItem)} on</span>
                <span className={`${rerouteTextColor}`}>
                    {reroutedFromSystems.filter((system): system is System => system !== undefined)
                        .map((system: System, index) =>
                            `${index > 0 ? ', ' : ''}${system.name}`
                        ).join('')}
                </span>
                <ThickArrowRightIcon className={`h-3 w-3 ${rerouteTextColor} inline mx-1 flex-shrink-0`} />
                <span className={`${rerouteTextColor}`}>
                    {reroutedToSystems.filter((system): system is System => system !== undefined)
                        .map((system: System, index) =>
                            `${index > 0 ? ', ' : ''}${system.name}`
                        ).join('')}
                </span>
            </div>
        </div>
    )
}
