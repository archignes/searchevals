// EvaluatorDetails.tsx

import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip"


import { EvaluatorEvaluations } from "./SearchEvalCard";
import { conflictType } from "@/src/types";
import { evalEvaluator } from "./DataContext";
import { DrawingPinIcon, InfoCircledIcon } from "@radix-ui/react-icons";

interface EvaluatorDetailsProps {
    evalEvaluatorDetails: evalEvaluator;
    conflicts: conflictType[];
}

export const EvaluatorDetails: React.FC<EvaluatorDetailsProps> = ({ evalEvaluatorDetails, conflicts }) => {
  return (
    evalEvaluatorDetails && (
      <figcaption className="mt-1 mb-2">
        <div className="flex items-center divide-x rtl:divide-x-reverse divide-gray-300 dark:divide-gray-700">
          <cite id="person-name" className="pe-3 ml-3 font-medium text-gray-900 dark:text-white">
            {evalEvaluatorDetails.name}
            <EvaluatorEvaluations evaluatorId={evalEvaluatorDetails.id} />
          </cite>
          <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
            <span id="person-info-link" className="inline-flex">
              <a href={evalEvaluatorDetails.URL} target="_blank" rel="noopener noreferrer">
                <InfoCircledIcon />
              </a>
            </span>
            <span id="person-role" className="ml-1">{evalEvaluatorDetails.role}</span>
            {conflicts && conflicts.length > 0 && (
              <>
                <br></br>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="inline-flex"><DrawingPinIcon /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This evaluator has a potential conflict-of-interest due to their relationship with the entities pinned to the right.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {conflicts.map((conflict, index) => (
                  <React.Fragment key={index}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <a className="underline ml-1" href={conflict.searchLink.replace('%s', encodeURIComponent(conflict.query).replace(/%20/g, '+'))} target="_blank" rel="noopener noreferrer">
                            {conflict.name}
                          </a>
                          {index < conflicts.length - 1 ? ', ' : ''}
                        </TooltipTrigger>
                        <TooltipContent>
                          {conflict.queryTooltip}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </React.Fragment>
                ))}
              </>
            )}
          </cite>
        </div>
      </figcaption>
    )
  );
};
