// MiniEvalCard.tsx
// This component is used to display a miniature evaluation card in the Systems page.
// It is used to display the evaluation item, the evaluator, and the systems evaluated.
// It also displays the temporal difference and query consistency checks.
// If the showConflicts flag is set, it will display the evaluator's conflicts.

import React, { useContext } from 'react';
import DataContext, { System } from './DataContext';
import { EvalItem } from '@/src/types/evalItem';
import { EvaluationTarget } from './eval-card-elements';
import { conflictType } from '@/src/types/';
import SearchBracket from './SearchBracket'
import { InfoCircledIcon, DrawingPinIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { CheckQueryConsistency, CheckTemporalDifference } from './EvalComparisonChecks';
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { ReplicationRerouteCheck } from './eval-card-elements/ReplicationRerouteCheck'

export interface MiniEvalCardProps {
  evalItemId: string;
  textsize?: string;
  checks?: boolean;
  currentEvaluation?: string;
  currentEvaluator?: boolean;
  showConflicts?: boolean;
  maxHeight?: string;
  trimQueryHeight?: boolean;
  ref?: React.ForwardedRef<HTMLDivElement>;
  evalPlacement?: string;
}

export const getSystemsEvaluated = (evalItem: EvalItem, systems: System[]): string => {
  return evalItem?.systems.map((systemId: string) => {
    const system = systems.find(system => system.id === systemId);
    return system ? system.name : null;
  }).filter((name: string | null): name is string => name !== null).join(', ');
}

export const MiniEvalCard: React.FC<MiniEvalCardProps> = ({
  ref,
  evalItemId,
  checks,
  currentEvaluation,
  currentEvaluator,
  textsize,
  showConflicts,
  maxHeight,
  trimQueryHeight,
  evalPlacement
}) => {
  
  const { data, evaluators, systems } = useContext(DataContext);
  const evalItem = data.find(item => item.id === evalItemId) || null;
  const isCurrentEvaluation = currentEvaluation === evalItemId;
  const evalEvaluatorDetails = evaluators.find(evaluator => evaluator.id === evalItem?.evaluator_id);

  let systemsEvaluated = null;
  if (evalItem) {
    systemsEvaluated = getSystemsEvaluated(evalItem, systems);
  } else { return null; }

  const textSizeClass = textsize || 'text-sm';

  let conflicts: conflictType[] = []; 
  if (showConflicts) {
    if (evalEvaluatorDetails && evalEvaluatorDetails.conflict) {
      conflicts = evalEvaluatorDetails.conflict.map(conflictId => {
        const system = systems.find(system => system.id === conflictId);
        let query = `How is ${evalEvaluatorDetails.name} connected to ${system?.name}?`
        return {
          name: system!.name,
          searchLink: system!.search_link,
          query: query,
          queryTooltip: (
            <><span>Click to start a <strong>{system?.name}</strong> search in a new tab:</span><SearchBracket className="not-italic text-sm">{query}</SearchBracket></>
          )
        }
      })
    }
  }

  const images = [
    ...(evalItem?.images || []),
    ...(evalItem?.eval_parts?.flatMap(part => part.images || []) || [])
  ];

  return (
    <Card
      ref={ref}
      id={`mini-eval-card-${evalItemId}`}
      className={`grid grid-cols-4 ${maxHeight ? 'overflow-y-scroll no-scrollbar' : ''}`}
      style={{
        maxHeight: maxHeight || 'auto'
      }}    >
        <div className={`flex flex-col items-start justify-start space-y-1 p-1 pt-0 m-0 ${evalPlacement === 'feed' ? 'col-span-3' : 'col-span-4'}`}>
      <CardHeader className="p-1 space-y-0">
          <CardTitle className={`${textSizeClass}`}>
            {isCurrentEvaluation ? "current: " : ""}
            
            <a href={`/card/${evalItemId}`}>
            <div className={`arrLink w-fit ${trimQueryHeight ? 'two-lines-height-limit' : ''}`}>
              <SearchBracket className={textSizeClass}>
                <span className={`${textSizeClass} font-normal`}>{evalItem.query}</span>
              </SearchBracket>
              </div>
            </a>
          </CardTitle>
        <CardDescription className="p-0 m-0 pl-3">
          <span className={`${textSizeClass}`}><span className="font-bold">date:</span> {evalItem!.date}</span><br></br>
          <span className={`${textSizeClass}`}><span className="font-bold">systems:</span> {systemsEvaluated}</span>
        </CardDescription>
        <EvaluationTarget evalItemID={evalItemId} className={`pl-3 ${textSizeClass}`} />
      </CardHeader>
        {evalItem.likely_fabricated && (
          <span className="border border-red-500 bg-red-100 font-semibold p-2 w-fit ml-4 text-xs text-center"><ExclamationTriangleIcon className="h-4 w-4 text-red-400 inline mr-1" />This image is likely fabricated.</span>
        )}
        <ReplicationRerouteCheck evalItem={evalItem} className="ml-4" />
        <CardContent className='p-1 py-0'>
          {!currentEvaluator && evalEvaluatorDetails && (
            <figcaption className="mt-1 mb-2">
              <div className="flex items-center divide-x rtl:divide-x-reverse divide-gray-300 dark:divide-gray-700">
                <cite id="person-name" className={`pe-3 ml-3 ${textSizeClass} text-gray-900 dark:text-white`}>{evalEvaluatorDetails.name}</cite>
                <cite className={`ps-3 ${textSizeClass} text-gray-500 dark:text-gray-400`}>
                  <span id="person-info-link" className="inline-flex"><a href={evalEvaluatorDetails.URL} target="_blank" rel="noopener noreferrer"><InfoCircledIcon /></a></span>
                  <span id="person-role" className="ml-1">{evalEvaluatorDetails.role}</span>
                  {conflicts && conflicts.length > 0 && (
                    <><br></br>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger><span className="inline-flex"><DrawingPinIcon /></span></TooltipTrigger>
                          <TooltipContent>
                            <p>This evaluator has a potential conflict-of-interest due to their relationship with the entities pinned to the right.</p>
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
            </figcaption>
          )}
        </CardContent>
        {checks && currentEvaluation &&
          (<CardFooter className="flex flex-col space-y-1 p-1 pt-0 w-full">
            {/* <CheckTemporalDifference evalItemId={evalItemId} currentEvaluation={currentEvaluation} /> */}
            {/* <CheckQueryConsistency evalItemId={evalItemId} currentEvaluation={currentEvaluation} /> */}
          </CardFooter>
          )
        }
      </div>
      {evalPlacement === "feed" && images && images.length > 0 && (
        <div
          className="flex flex-col items-start justify-center m-2 border rounded p-2 relative overflow-hidden"
          style={{ height: '150px' }}>
          <Link href={`/card/${evalItemId}`}>
            <img
              src={images[0].url}
              alt={images[0].caption}
              className="cursor-pointer border shadow object-cover object-top w-full h-full"
            />
          </Link>
        </div>
      )}
      
    </Card>
  );
};

export default MiniEvalCard;
