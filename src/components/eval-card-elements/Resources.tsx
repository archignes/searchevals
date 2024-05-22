import React, { useContext } from "react";
import DataContext from "../DataContext";

export const Resources: React.FC<{ evalItemID: string, className?: string }> = ({ evalItemID, className }) => {
    const { data } = useContext(DataContext);
    const evalItem = data ? data.find(item => item.id === evalItemID) : null;
    const resources = evalItem?.resources;

    return resources?.length ? (
        <div className={`text-sm text-gray-500 ml-6 ${className}`} style={{ marginTop: '0' }}>
            <span className="font-bold">resources:</span>
            <ul className="space-y-2 ml-4">
                {resources.map((resource, index) => (
                    <li key={index}>
                        <div className="border p-1 w-fit rounded-md border-gray-200 flex flex-col space-x-1">
                        <a href={resource.url} className="hover:text-gray-700 underline">
                              <span className="font-medium">{resource.title}</span>
                        </a>
                            <span className="text-gray-500">author: {resource.author}</span>
                            <span className="text-gray-500">publisher: {resource.publisher}</span>
                            <span className="text-gray-500">date: {resource.date}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    ) : null;
}
