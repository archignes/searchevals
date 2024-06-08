import React, { useState, useEffect } from "react";
import { ContentLinkCardProps } from "../../types/evalItem";

export const ContentLinkCard: React.FC<ContentLinkCardProps> = ({
  type,
  url,
  imageUrl,
  siteName,
  title,
  description,
  content,
  content_link
}) => {
  const twitter_name = type === "tweet" ? "@" + url.split("/")[3] : "";
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server and initial client render
    }

    return type === "tweet" ? (
        <div data-testid="card.wrapper" 
            className="border border-gray-200 rounded-lg overflow-hidden">
        <a
            href={url}
            rel="noopener noreferrer nofollow"
            target="_blank"
            tabIndex={-1}
            className="flex flex-row h-full"
            >
                <div className="flex flex-col mx-3 my-5">
                    <span className="text-sm text-gray-500">{twitter_name}</span>
                    <span className="text-sm">{content}</span>
                    {content_link && (
                        <>
                        <div className="my-2"></div>
                        <ContentLinkCard
                            type={content_link.type}
                            url={content_link.url}
                            imageUrl={content_link.imageUrl}
                            siteName={content_link.siteName}
                            title={content_link.title}
                            description={content_link.description}
                        />
                        </>                        
                    )}
                </div>
                </a>
            </div>
    ) : (description ? (
            <div data-testid="card.wrapper"
                className="border border-gray-200 rounded-lg overflow-hidden h-[160px]"
            >
            <a
                href={url}
                rel="noopener noreferrer nofollow"
                target="_blank"
                tabIndex={-1}
                className="flex flex-row h-full"
            >
                    <>
                        <img
                            alt=""
                            draggable="true"
                            src={imageUrl}
                            className="rounded-l-lg object-contain max-h-full"
                        />
                        <div className="flex flex-col ml-3 my-5">
                            <span className="text-sm text-gray-500">{siteName}</span>
                            <span className="text-sm">{title}</span>
                            <span className="text-sm text-gray-500">{description}</span>
                        </div>
                    </>
        </a>
        </div >
            ) : (
            <div data-testid="card.wrapper"
                className="border border-gray-200 rounded-lg h-auto">
                <a
                    href={url}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    tabIndex={-1}
                    className="flex flex-row h-full"
                >
                    <div className="relative w-full h-full">
                        <img
                            alt=""
                            draggable="true"
                            src={imageUrl}
                            className="object-contain w-full h-full"
                        />
                        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 w-full p-2">
                            <span className="text-sm text-white">{title}</span>
                        </div>
                    </div>
                </a>
                <a href={url} target="_blank" rel="noopener noreferrer nofollow">
                    <span className="text-xs underline">{new URL(url).hostname}</span>
                </a>
            </div>
            )
    );
};
