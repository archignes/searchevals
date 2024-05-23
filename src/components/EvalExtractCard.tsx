"use client"

import * as React from "react"
import {
    Card,
    CardContent
} from './ui/card';
import ImageDisplay from './ImageDisplay';
import { EvaluatedSystems } from './eval-card-elements/EvaluatedSystems';

import { evalCardItem, EvalItem } from '@/src/types';

type EvalExtractCardProps = {
    evalItem: EvalItem;
    evalCardItem: evalCardItem;
    evalQuery: string;
};


const EvalExtractCard: React.FC<EvalExtractCardProps> = ({ evalItem, evalCardItem, evalQuery }) => {
    const evalItemId = evalItem.id
    let contentWithNewlines: string[] = []
    let skipBlockQuote = false;
    if (evalCardItem && evalCardItem.content) {
        contentWithNewlines = evalCardItem.content.split(/\\n/);
    };
    if (!evalCardItem ) {
        return <p>Item not found</p>;
    }
    if (evalCardItem.content === "" && evalCardItem.images) {
        skipBlockQuote = true
    } else if (!contentWithNewlines) {
        return <p>Item not found</p>;
    }


    return (
        <>
            <Card className="rounded-none mb-2">
                <CardContent>
                    {evalCardItem.query && evalCardItem.query !== evalQuery && (
                        <div className="flex flex-col text-center text-xs">
                            <span className="text-red-500">Note: The query below does not exactly match the base query for this evaluation.</span>
                            <div> Search for this query on <EvaluatedSystems skipHeading={true} evalItemID={evalItemId} systemIDs={evalItem.systems} query={evalCardItem.query} /></div>
                        </div>
                    )}
                    <figure className="max-w-screen-md">
                        {skipBlockQuote && (<br></br>)}
                        {!skipBlockQuote && (
                        <blockquote className="my-2">
                            <p className="text-l text-gray-900 dark:text-white before:text-2xl before:text-gray-400 before:content-['“']">{contentWithNewlines.map((line, index) => (<span key={index}>{line}<br></br></span>
                            ))}</p>
                        </blockquote>
                        )}
                    </figure>
                    {evalCardItem?.media === "video" && (
                        <div className="border shadow-sm  m-2 text-center p-2.5 w-1/2 mx-auto min-h-[200px] flex flex-col justify-center items-center">
                            <p>Video content in evals is currently not supported, click <a className="text-blue-500 underline" href={evalCardItem.url}>here</a> to see the video in context.</p>
                        </div>
                        )
                    }
                    {evalCardItem.images && evalCardItem.images.length > 0 && (<ImageDisplay images={evalCardItem.images} />)}
                    
                    </CardContent>
            </Card>
        </>
    );
}

export default EvalExtractCard; // Export the component at the end


