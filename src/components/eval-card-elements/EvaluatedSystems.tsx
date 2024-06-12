import React, { useContext } from "react";
import DataContext from "../DataContext";
import SearchOnEvalInterface from '../SearchOnEvalInterface';


export const EvaluatedSystems: React.FC<{ evalItemID: string, systemIDs: string[], query?: string, className?: string, skipHeading?: boolean }> = ({ evalItemID, systemIDs, query, className, skipHeading }) => {
    const { data, systems } = useContext(DataContext);
    const evalItem = data ? data.find(item => item.id === evalItemID) : null;
    let systemsEvaluatedSearchLinks;
    if (systemIDs && systemIDs.length > 0) {
        const queryTarget = query || evalItem?.query || ''; // Ensure query is never undefined
        const encodedQuery = encodeURIComponent(queryTarget);
        const filteredSystems = systems.filter(system => systemIDs.includes(system.id));
        systemsEvaluatedSearchLinks = filteredSystems.map((system: any, index: number) => {
            const systemLink = system.search_link; // Directly access the searchLink property of the system object
            return (
                <span key={system.id}> {/* Use system.id for a unique key */}
                    {console.log(system)}
                    <a className="underline arrLinkFlat" target="_blank" rel="noopener noreferrer" href={systemLink.replace('%s', encodedQuery)}>
                        {system.name}
                    </a>
                    {system.limited_release && <span className="text-xs text-red-500 ml-1">(Limited Release)</span>}
                    {index < filteredSystems.length - 1 ? ', ' : ''} {/* Use filteredSystems.length */}
                </span>
            )
        });
    } else {
        if (evalItem) {
            systemsEvaluatedSearchLinks = <span className="ml-1 text-sm text-gray-5000">system was not specified, explore with <SearchOnEvalInterface evalItem={evalItem} type="mini" /></span>;
        }
    }
    const textSizeClass = className ?? "text-sm";
    return (
        <span className={`${textSizeClass}`}>
            {!skipHeading && <span className="font-bold">systems:</span>} 
            {systemsEvaluatedSearchLinks}
        </span>
    )
}