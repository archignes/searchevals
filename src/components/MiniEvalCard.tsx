import { useContext } from 'react';
import DataContext from './DataContext';
import { CheckQueryConsistency, CheckTemporalDifference } from './EvalComparisonChecks';
import SearchBracket from './SearchBracket'
import { InfoCircledIcon } from "@radix-ui/react-icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

export interface MiniEvalCardProps {
  evalItemId: string;
  checks?: boolean;
  currentEvaluation?: string;
  currentEvaluator?: boolean;
}

const MiniEvalCard: React.FC<{ evalItemId: string, checks?: boolean, currentEvaluation?: string, currentEvaluator?: boolean }> = ({ evalItemId, checks, currentEvaluation, currentEvaluator }) => {
  const { data, evaluators, systems } = useContext(DataContext);
  const evalItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;
  const isCurrentEvaluation = currentEvaluation === evalItemId;
  const evalEvaluatorDetails = evaluators.find(evaluator => evaluator.id === evalItem?.evaluator_id);
  const systemsEvaluated = evalItem?.systems.map(systemId => {
    const system = systems.find(system => system.id === systemId);
    return system ? system.name : null;
  }).join(', ');
  return (
    <Card>
      <CardHeader className="p-1 space-y-0">
          <CardTitle className="text-sm">
            {isCurrentEvaluation ? "current: " : ""}
            <a href={`/card/${evalItemId}`}>
              <div>
              <SearchBracket className="text-sm">
                <span className="text-sm font-normal">{evalItem!.query}</span>
                  </SearchBracket>
                  </div>
            </a>
          </CardTitle>
        <CardDescription className="p-0 m-0 pl-3">
          <span className="text-sm">date: {evalItem!.date}</span><br></br>
          <span className="text-sm">systems: {systemsEvaluated}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='p-1 py-0'>
        {!currentEvaluator && evalEvaluatorDetails && (
          <figcaption className="mt-1 mb-2">
            <div className="flex items-center divide-x rtl:divide-x-reverse divide-gray-300 dark:divide-gray-700">
              <cite id="person-name" className="pe-3 ml-3 text-sm text-gray-900 dark:text-white">{evalEvaluatorDetails.name}</cite>
              <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
                <span id="person-info-link" className="inline-flex"><a href={evalEvaluatorDetails.URL} target="_blank" rel="noopener noreferrer"><InfoCircledIcon /></a></span>
                <span id="person-role" className="ml-1">{evalEvaluatorDetails.role}</span>
              </cite>
            </div>
          </figcaption>
        )}
      </CardContent>
        {checks && currentEvaluation && 
        (<CardFooter className="flex flex-col space-y-1 p-1 pt-0 m-0">
          <CheckTemporalDifference evalItemId={evalItemId} currentEvaluation={currentEvaluation} />
          <CheckQueryConsistency evalItemId={evalItemId} currentEvaluation={currentEvaluation} />
        </CardFooter>
        )
        }
      
    </Card>
  );
};

export default MiniEvalCard;
