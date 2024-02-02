"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card';
import ImageDisplay from './ImageDisplay';
import '../styles/globals.css';
import DataContext, { evalCardItem } from './DataContext';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "./ui/hover-card"

// Define a type for your component's props
type EvalExtractCardProps = {
    evalCardItem: evalCardItem;
};


const EvalExtractCard: React.FC<EvalExtractCardProps> = ({ evalCardItem }) => {
    let contentWithNewlines;
    if (evalCardItem && evalCardItem.content) {
        contentWithNewlines = evalCardItem.content.split(/\\n/);
    };
    if (!evalCardItem || !contentWithNewlines ) {
        return <p>Item not found</p>;
    }



    return (
        <>
            <Card className="rounded-none mb-2">
                <CardContent>

                    <figure className="max-w-screen-md">
                        <blockquote className="my-2">
                            <p className="text-l text-gray-900 dark:text-white before:text-2xl before:text-gray-400 before:content-['“']">{contentWithNewlines.map((line, index) => (<span key={index}>{line}<br></br></span>
                            ))}</p>
                        </blockquote>
                    </figure>
                    {evalCardItem.images && evalCardItem.images.length > 0 && (<ImageDisplay images={evalCardItem.images} />)}
                    
                    </CardContent>
            </Card>
        </>
    );
}

export default EvalExtractCard; // Export the component at the end


