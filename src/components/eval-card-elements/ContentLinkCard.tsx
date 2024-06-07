import React from "react";

interface ContentLinkCardProps {
  url: string;
  imageUrl: string;
  siteName: string;
  title: string;
  description: string;
  className?: string;
}

export const ContentLinkCard: React.FC<ContentLinkCardProps> = ({
  url,
  imageUrl,
  siteName,
  title,
  description,
}) => {
  return (
    <div data-testid="card.wrapper" className="border border-gray-200 rounded-lg h-[160px] overflow-hidden">
        <a
          href={url}
          rel="noopener noreferrer nofollow"
          target="_blank"
          tabIndex={-1}
          className="flex flex-row h-full"
        >
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
         
        </a>
      </div>
  );
};
