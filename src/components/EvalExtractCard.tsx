"use client"

import * as React from "react"
import {
    Card,
    CardContent
} from './ui/card';
import ImageDisplay from './ImageDisplay';

import { evalCardItem } from './DataContext';

// Define a type for your component's props
type EvalExtractCardProps = {
    evalCardItem: evalCardItem;
};


const EvalExtractCard: React.FC<EvalExtractCardProps> = ({ evalCardItem }) => {
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
                    <figure className="max-w-screen-md">
                        {skipBlockQuote && (<br></br>)}
                        {!skipBlockQuote && (
                        <blockquote className="my-2">
                            <p className="text-l text-gray-900 dark:text-white before:text-2xl before:text-gray-400 before:content-['“']">{contentWithNewlines.map((line, index) => (<span key={index}>{line}<br></br></span>
                            ))}</p>
                        </blockquote>
                        )}
                    </figure>
                    {evalCardItem.images && evalCardItem.images.length > 0 && (<ImageDisplay images={evalCardItem.images} />)}
                    
                    </CardContent>
            </Card>
        </>
    );
}

export default EvalExtractCard; // Export the component at the end


