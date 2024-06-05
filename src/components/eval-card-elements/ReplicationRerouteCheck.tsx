import { useContext } from "react";
import { EvalItem } from "../../types"
import { StackIcon, MinusCircledIcon, CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import DataContext from '../DataContext';


export const getReplicationTarget = (data: any, evaluators: any, evalItem: EvalItem) => {
  const evaluatorId = data.find(
    (item: EvalItem) => item.id === evalItem.replication_attempt?.id
  )?.evaluator_id;

  const evaluatorName = evaluators.find(
    (evaluator: any) => evaluator.id === evaluatorId
  )?.name;

  return evaluatorName;
}

export const ReplicationRerouteCheck = ({ evalItem }: { evalItem: EvalItem }) => {
  const { data, systems, evaluators } = useContext(DataContext);


  const backgroundColor = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? 'bg-green-100' 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? 'bg-yellow-100'
    : 'bg-orange-100';
  
  const borderColor = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? 'border-green-500' 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? 'border-yellow-500'
    : 'border-orange-500';
  
  const textColor = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? 'text-green-600' 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? 'text-yellow-600'
    : 'text-orange-600';
  
  const replicationStatus = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? (
        <>
          Replicates <a href={`/card/${evalItem.replication_attempt.id}`} className="underline">
          {getReplicationTarget(data, evaluators, evalItem)}
          </a>
        </>
      )
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? (
        <>
          Partially replicates <a href={`/card/${evalItem.replication_attempt.id}`} className="underline">
          {getReplicationTarget(data, evaluators, evalItem)}
          </a>
        </>
      )
    : `Failed to replicate (${evalItem.replication_attempt?.replication_status})`;
    const icon = evalItem.replication_attempt?.replication_status === 'replicated' 
    ? <CheckCircledIcon className={`mr-1 ${textColor}`} /> 
    : evalItem.replication_attempt?.replication_status === 'partial'
    ? <MinusCircledIcon className={`mr-1 ${textColor}`} />
    : <CrossCircledIcon className={`mr-1 ${textColor}`} />;    
    
  const rerouteBackgroundColor = evalItem.rerouted?.reroute_status === 'success' ? 'bg-blue-100' : 'bg-orange-100';
  const rerouteBorderColor = evalItem.rerouted?.reroute_status === 'success' ? 'border-blue-500' : 'border-orange-500';
  const rerouteTextColor = evalItem.rerouted?.reroute_status === 'success' ? 'text-blue-600' : 'text-orange-600';
  const rerouteStatus = evalItem.rerouted?.reroute_status === 'success' ? 'Reroute success' : 'Reroute failure';
  const rerouteIcon = evalItem.rerouted?.reroute_status === 'success' 
    ? <CheckCircledIcon className={`mr-1 ${rerouteTextColor}`} /> 
    : <CrossCircledIcon className={`mr-1 ${rerouteTextColor}`} />;

  return (
    <>
    {evalItem.replication_attempt && (
      <div 
        className={`border ${borderColor} ${backgroundColor} flex items-center font-semibold p-2 w-fit ml-4 text-xs text-center`}
          aria-label={`Replication status: ${replicationStatus}`}
      >
        <StackIcon className={`h-4 w-4 ${textColor} inline mr-1`} />
        {icon}
          <span className={textColor}>{replicationStatus}</span>
      </div>
    )}
    {evalItem.rerouted && (
      <div 
        className={`border ${rerouteBorderColor} ${rerouteBackgroundColor} flex items-center font-semibold p-2 w-fit ml-4 text-xs text-center`}
        aria-label={`Reroute status: ${rerouteStatus}`}
      >
        <StackIcon className={`h-4 w-4 ${rerouteTextColor} inline mr-1`} />
        {rerouteIcon}
        <span className={rerouteTextColor}>{rerouteStatus}</span>
      </div>
    )}
    </>
  );
}
