import React from "react";
import { EvalItem } from '@/src/types/evalItem';
import { Popover, PopoverContent, PopoverTrigger  } from '@/src/components/ui/popover';
import { Button } from '@/src/components/ui/button';

type evalItemProps = {
    evalItem: EvalItem;
}


export const claimReviewJsonLD = ({ evalItem }: evalItemProps) => {
    const claimReview = evalItem.claimReview;
    if (!claimReview) {
        return null;
    }
    const jsonLdMarkup = {
        "@context": "http://schema.org",
        "@type": "ClaimReview",
        "author": {
            "@type": "Organization",
            "name": claimReview.author?.name || "",
            "url": claimReview.author?.url || ""
        },
        "claimReviewed": claimReview.claimReviewed || "",
        "datePublished": claimReview.datePublished || "",
        "itemReviewed": {
            "@type": "Claim",
            "appearance": claimReview.itemReviewed?.appearance?.map((appearance: any) => ({
                "@type": "CreativeWork",
                "url": appearance.url || ""
            })) || [],
            "author": {
                "@type": "Person",
                "name": claimReview.itemReviewed?.author?.name || ""
            },
            "datePublished": claimReview.itemReviewed?.datePublished || "",
            "firstAppearance": {
                "@type": "CreativeWork",
                "url": claimReview.itemReviewed?.firstAppearance?.url || ""
            }
        },
        "reviewRating": {
            "@type": "Rating",
            "author": {
                "@type": "Organization",
                "name": claimReview.reviewRating?.author?.name || "",
                "url": claimReview.reviewRating?.author?.url || ""
            },
            "bestRating": claimReview.reviewRating?.bestRating || "",
            "ratingExplanation": claimReview.reviewRating?.ratingExplanation || "",
            "ratingValue": claimReview.reviewRating?.ratingValue || "",
            "reviewAspect": claimReview.reviewRating?.reviewAspect || "",
            "worstRating": claimReview.reviewRating?.worstRating || ""
        },
        "url": claimReview.url || ""
    };

    return (
        JSON.stringify(jsonLdMarkup, null, 2)
    );
}





export const ClaimReview: React.FC<evalItemProps> = ({ evalItem }) => {
    console.log(evalItem);
    if (!evalItem.claimReview) {
        return null;
    }
   
    return (
        <div className="flex flex-row">
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="border-2 border-red-600 bg-orange-300 hover:bg-blue-100 ml-6">Claim Review</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] ml-[5vw]">
                    <div className="flex flex-col w-full">
                    <div className="flex flex-col h-96 overflow-y-auto">
                        <h3 className="text-lg font-bold">Claim Review</h3>
                            <p className="text-sm">
                                Here is a structured <a href="https://schema.org/ClaimReview" className="underline text-blue-600 hover:text-blue-800">
                                     ClaimReview (a Schema.org type)
                                </a> for the claim.
                            </p>
                            <p className="text-xs">
                                This reviews the claim reported by the evaluator, not the evaluation.
                            </p>
                            <p className="text-xs">Format: JSON-LD</p>
                            <pre className="text-sm border border-gray-200 p-4 rounded-md bg-gray-50 w-full overflow-auto">
                                {claimReviewJsonLD({ evalItem })}
                            </pre>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        <div className="text-xs flex items-center ml-2">
            {evalItem.claimReview.reviewRating.alternateName}: {evalItem.claimReview.reviewRating.ratingExplanation}
        </div>
        </div>
    );
}
