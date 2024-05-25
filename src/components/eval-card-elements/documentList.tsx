import React from "react";

interface DocumentListProps {
  documents_type: string;
  documents: Array<{
    url: string;
    title: string;
    author: string;
    publisher?: string;
    date: string;
  }>;
  className?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, documents_type, className }) => {
  return documents.length ? (
    <div className={`ml-6 mb-4 ${className}`}>
      <span className="text-lg font-semibold">{documents_type}:</span>
      <ul className={`ml-1 list-none flex flex-col gap-1 ${className}`}>
        {documents.map((resource, index) => (
          <li key={index} className="w-full">
            <div className="p-2 w-full flex flex-col space-y-0">
                <a href={resource.url}
                className="break-words font-medium hover:bg-blue-100 rounded-md p-2 underline w-fit">
                {resource.title}</a>
              <span className="ml-4 text-gray-500">author: {resource.author}</span>
            {resource.platform && (
                <span className="ml-4 text-gray-500">platform: {resource.platform}</span>
            )}
              {resource.publisher && (
                <span className="ml-4 text-gray-500">publisher: {resource.publisher}</span>
              )}
              <span className="ml-4 text-gray-500">date: {resource.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};
