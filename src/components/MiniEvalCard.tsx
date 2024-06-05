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
import { InfoCircledIcon, DrawingPinIcon, ExclamationTriangleIcon, StackIcon } from "@radix-ui/react-icons"
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

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
        <ReplicationRerouteCheck evalItem={evalItem} />
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
