import React from "react";
import { EvalItem } from '@/src/types/evalItem';
import { LinkedInLogoIcon, TwitterLogoIcon, InstagramLogoIcon } from '@radix-ui/react-icons';

type evalItemProps = {
    evalItem: EvalItem;
}

export const AlsoPublished: React.FC<evalItemProps> = ({ evalItem }) => {
    const venueLogos = {
        "linkedin.com": <LinkedInLogoIcon className="inline pb-1 h-4 w-4" />,
        "twitter.com": <TwitterLogoIcon className="inline ml-1 pb-1" />,
        "instagram.com": <InstagramLogoIcon className="inline ml-1 pb-1" />
    };

    const venueNames = {
        "linkedin.com": "LinkedIn",
        "twitter.com": "Twitter",
        "instagram.com": "Instagram"
    };

    let alsoPublishedAtShortened = evalItem.also_published_at ? new URL(evalItem.also_published_at).hostname.replace(/^www\./, '') : "";

    let alsoPublishedAtLogo = venueLogos[alsoPublishedAtShortened as keyof typeof venueLogos] || "";
    let alsoPublishedAtName = venueNames[alsoPublishedAtShortened as keyof typeof venueNames] || alsoPublishedAtShortened;

    return (
        <>
            <br></br>
            <span className="text-sm font-semibold">also published {alsoPublishedAtLogo ? "on" : "at"}:
            </span>
            <span>
                <a
                    className="underline ml-1"
                    href={evalItem.also_published_at}>
                    <span>
                        {alsoPublishedAtName}
                    </span>
                    {alsoPublishedAtLogo}
                </a>
            </span>
        </>
    );
}