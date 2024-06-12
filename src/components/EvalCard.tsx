// EvalCard.tsx
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Link2Icon, InfoCircledIcon, DrawingPinIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {ReplicationRerouteCheck} from './eval-card-elements/ReplicationRerouteCheck';
import DataContext from './DataContext';
import { ClaimReview, 
  EvaluationTarget,
  MultipleQueryCheck,
  KeyPhrases,
  Resources,
  ReplyTo,
  ContentWarning,
  AlsoPublished,
  ReferencedAt } from './eval-card-elements';
import SearchOnEvalInterface from './SearchOnEvalInterface';
import ShareCardInterface from './ShareCardInterface';
import SearchBracket from './SearchBracket'
import { EvaluatedSystems } from './eval-card-elements';
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,} from './ui/card';
import EvalExtractCard from './EvalExtractCard'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { conflictType } from "@/src/types";
  
import FeedbackLink from './Feedback';
import MiniEvalCard from './MiniEvalCard';

export interface EvalCardProps {
  evalItemId: string;
}




const ConnectedItemLabel: React.FC<{connection: string, currentEvaluation: string, currentEvaluator: boolean}> = ({ connection, currentEvaluation, currentEvaluator }) => {  
  const { data } = useContext(DataContext);
  const connectedItem = data ? data.find(evalItem => evalItem.id === connection) : null;
  const isCurrentEvaluation = currentEvaluation === connection;
  return connectedItem ? (
    <DropdownMenuItem id="connected-item-label" className={`${isCurrentEvaluation ? "text-gray-4000" : ""}`}>
      <MiniEvalCard evalItemId={connectedItem.id} currentEvaluation={currentEvaluation} currentEvaluator={currentEvaluator} />
      </DropdownMenuItem>
    ) : null;
}

const DropDownConnections: React.FC<EvalCardProps> = ({ evalItemId }) => {
  const { data } = useContext(DataContext);
  const evalItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;

return (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="mb-1" size="sm">
        Connected Evaluations 
        <span className="text-xs border rounded-full px-1 mb-[8px]">
          {evalItem!.connected?.length}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
      {evalItem!.connected?.map((connection) => (
        <ConnectedItemLabel
          key={connection}
          connection={connection}
          currentEvaluation={evalItemId}
          currentEvaluator={false}
        />
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)
}






export const EvaluatorEvaluations: React.FC<{ evalId?: string, evaluatorId?: string }> = ({ evalId, evaluatorId }) => {
  // Accessing the global data context to use the evaluations data across the component.
  const { data } = useContext(DataContext);

  // If an evaluatorId is not explicitly passed to the component, find the evaluation by evalId to extract the evaluator's ID.
  // This is useful in scenarios where the evaluatorId is not readily available but the evaluation ID is.
  if (!evaluatorId) {
    // Finding the specific evaluation item by its ID to access the evaluator's ID.
    const evalItem = data.find(evalItem => evalItem.id === evalId);
    // Assigning the found evaluator's ID to the evaluatorId variable for further use.
    evaluatorId = evalItem?.evaluator_id;
  }
  
  // Filtering the data to get all evaluations conducted by the specific evaluator.
  // This allows us to display all evaluations associated with a particular evaluator.
  const evaluatorEvaluations = data ? data.filter(evalItem => evalItem.evaluator_id === evaluatorId) : null;
  // Calculating the total number of evaluations conducted by the evaluator.
  // This count is used to display the number of evaluations and provide a quick overview.
  const evaluatorEvaluationsCount = evaluatorEvaluations ? evaluatorEvaluations.length : 0;


  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="text-xs border rounded-md  px-1 align-super">{evaluatorEvaluationsCount}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {evaluatorEvaluations!.map((evaluation) => (
          <ConnectedItemLabel key={evaluation.id} connection={evaluation.id} currentEvaluation={evalId || 'none'} currentEvaluator={true} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}




const EvalCard: React.FC<EvalCardProps> = ({ evalItemId }) => {
  const { data, systems, evaluators } = useContext(DataContext);
  const [responseListVisible, setResponseListVisible] = useState(true)
  
  const router = useRouter();
  const { pathname } = router;
  const marqueeOrigin: boolean = (pathname === "/")

  const evalItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;
  
  const evalEvaluatorDetails = evaluators.find(evaluator => evaluator.id === evalItem?.evaluator_id);
  

  if (!evalItem) {
    return <div>No data found for this ID</div>; // Return a valid JSX element
  }

  

  let conflicts: conflictType[] = [];
  if (evalEvaluatorDetails && evalEvaluatorDetails.conflict) {
    conflicts = evalEvaluatorDetails.conflict.map(conflictId => {
      const system = systems.find(system => system.id === conflictId);
      let query= `How is ${evalEvaluatorDetails.name} connected to ${system?.name}?`
      return {
        name: system!.name,
        searchLink: system!.search_link,
        query: query,
        queryTooltip: (         
          <><span>Click to start a <strong>{system?.name}</strong> search in a new tab:</span><SearchBracket className="not-italic text-sm">{query}</SearchBracket></>
          )}
    })
  }


  let cardTitle = <div><SearchBracket><span className="text-xl">{evalItem.query}</span></SearchBracket></div>

  return (
    <>
      <div className="flex justify-end space-x-0 mt-3 mr-14">
        <SearchOnEvalInterface evalItem={evalItem} />
        <ShareCardInterface evalItem={evalItem} />
        <FeedbackLink id={evalItem.id} />
      </div>
      <div id={`search-eval-card-${evalItem.id}`} className={`w-11/12 md:w-2/3 mx-auto mt-0 zIndex: 9999`}>
        <Card>  
        <CardHeader className="pb-2">
          <CardTitle>
            {marqueeOrigin ? (
              <a href={`/card/${evalItem.id}`}>{cardTitle}</a>
            ) : (
              cardTitle
            )}
            </CardTitle>
            <MultipleQueryCheck evalItem={evalItem} />
            {evalItem.query_interpolated && (
              <span className="border border-orange-4000 p-2 w-fit mx-auto text-xs text-center"><ExclamationTriangleIcon className="h-4 w-4 text-orange-400 inline mr-1" />The query was not provided in the source and has been interpolated from context.</span>
            )}
            {evalItem.likely_fabricated && (
              <span className="border border-red-500 bg-red-100 font-semibold p-2 w-fit mx-auto text-xs text-center"><ExclamationTriangleIcon className="h-4 w-4 text-red-400 inline mr-1" />This image is likely fabricated.</span>
            )}
            <ReplicationRerouteCheck evalItem={evalItem} />
          <CardDescription>
            <a href={evalItem.url} target="_blank" rel="noopener noreferrer" className="w-7/8 truncate block arrLinkFlat">{evalItem.url}</a>
              <span className="text-sm"><span className="font-bold">date: </span>{evalItem.date}</span><br></br>
              {evalItem.methodology && (
                <>
                  <span className="text-sm"><span className="font-bold">methodology: </span><a className="underline arrLinkFlat" href={evalItem.methodology.url}>{evalItem.methodology.in_text}</a></span><br></br>
                </>
              )}
              <EvaluatedSystems evalItemID={evalItemId} systemIDs={evalItem.systems} />
              <AlsoPublished evalItem={evalItem} />
          </CardDescription>
            <KeyPhrases evalItemID={evalItemId} />
            <EvaluationTarget evalItemID={evalItemId}/>
            {evalItem.pull_quote && (
                <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-md shadow-md my-4">
                  <blockquote className="text-xl text-gray-800 font-medium">
                    {evalItem.pull_quote}
                  </blockquote>
                </div>
            )}
            <ReplyTo evalItemID={evalItem.id} />
        </CardHeader>
        <ClaimReview evalItem={evalItem} />
        
        <CardContent>
            {evalItem.following && (
              <>             
              <div id="response-to-div" className="w-7/8 pb-1 mx-auto">
                  {responseListVisible ? (
                    <Button id="response-to-toggle-button"
                            className="btn btn-outline-secondary ml-10 mt-1 w-21 h-7 rounded-bl-none rounded-br-none"
                            aria-label="Toggle response list"
                            onClick={() => setResponseListVisible(prev => !prev)}>
                              <span className="mr-2 pr-2">Responding to: </span>
                    </Button>
                  ) : (
                    <Button id="response-to-toggle-button"
                            className="btn btn-outline-secondary ml-10 mt-1 w-21 h-7 rounded-md"
                            aria-label="Toggle response list"
                            onClick={() => setResponseListVisible(prev => !prev)}>
                              <span className="mr-2">Responding to...</span>
                    </Button>
                  )}
                {responseListVisible && (
                  <ol id="response-to-list">
                    {evalItem.following.map((following) => (
                      <li key={following} className="ml-4 text-left px-1 mb-1">
                          <MiniEvalCard
                            evalItemId={following}
                            currentEvaluation={evalItem.id}
                            currentEvaluator={evalItem.evaluator_id === data?.find(item => item.id === following)?.evaluator_id}
                            checks={true}
                          />
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              </>
            )}
            {evalItem.tags && (
              <div className="text-sm m-1">{evalItem.tags.map(tag => <span key={tag} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{tag}</span>)}</div>
            )}
            {evalItem.connected && (
              <DropDownConnections evalItemId={evalItem.id} />
            )}
          {evalEvaluatorDetails && (
            <figcaption className="mt-1 mb-2">
              <div className="flex items-center divide-x rtl:divide-x-reverse divide-gray-300 dark:divide-gray-700">
                  <cite id="person-name" className="pe-3 ml-3 font-medium text-gray-900 dark:text-white">{evalEvaluatorDetails.name}<EvaluatorEvaluations evalId={evalItem.id} /></cite>
                <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
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
                </figcaption>)}
                <ContentWarning evalItemID={evalItem.id} />
            {evalItem.context && (
              <EvalExtractCard evalItem={evalItem} evalCardItem={{id: "context", content: evalItem.context}} evalQuery={evalItem.query} />
            )}
          {evalItem.eval_parts ? (
            evalItem.eval_parts.map((part, index) => (
              <EvalExtractCard key={index} evalItem={evalItem} evalCardItem={part} evalQuery={evalItem.query} />
            ))
          ) : (
              <EvalExtractCard evalItem={evalItem} evalCardItem={evalItem} evalQuery={evalItem.query} />
          )}
        </CardContent>
          <Resources evalItemID={evalItemId} />
          <ReferencedAt evalItemID={evalItemId} />
          {evalItem.methodology && (<div className="text-sm text-gray-700 mx-7">
            <span>References:</span><br></br>
            <div className="ml-3">{evalItem.methodology.full} <a className="underline" href={evalItem.methodology.url}>{evalItem.methodology.url}</a>
            </div></div>)}
        <CardFooter className="mt-1 flex flex-row justify-between">
          <div><Link2Icon className="inline text-gray-500 dark:text-gray-400" /><small className="text-gray-500 dark:text-gray-500">Permalink id: <a className="underline" href={`/card/${evalItem!.id}`}>{evalItem!.id}</a></small></div>
        </CardFooter>
      </Card>
    </div>
    </>
  );
};

export default EvalCard;
