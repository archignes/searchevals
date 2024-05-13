import React, { useContext } from "react";
import DataContext from "../DataContext";
import { System } from '../DataContext';
import { EvalItem } from '@/src/types/evalItem';

export const EvaluatedSystems: React.FC<{ evalItemID: string, systemIDs: string[], className?: string }> = ({ evalItemID, systemIDs, className }) => {
    const { data, systems } = useContext(DataContext);
    const evalItem = data ? data.find(item => item.id === evalItemID) : null;
    let systemsEvaluatedSearchLinks;
    console.log(systemIDs);
    if (systemIDs && systemIDs.length > 0) {
        const query = evalItem?.query ?? ''; // Ensure query is never undefined
        const encodedQuery = encodeURIComponent(query);
        const filteredSystems = systems.filter(system => systemIDs.includes(system.id));
        systemsEvaluatedSearchLinks = filteredSystems.map((system: any, index: number) => {
            const systemLink = system.search_link; // Directly access the searchLink property of the system object
            return (
                <span key={system.id}> {/* Use system.id for a unique key */}
                    <a className="underline" target="_blank" rel="noopener noreferrer" href={systemLink.replace('%s', encodedQuery)}>
                        {system.name}
                    </a>
                    {index < filteredSystems.length - 1 ? ', ' : ''} {/* Use filteredSystems.length */}
                </span>
            )
        });
    } else {
        systemsEvaluatedSearchLinks = "";
    }
    const textSizeClass = className ?? "text-sm";
    return (
        <span className={`${textSizeClass}`}><span className="font-bold">systems:</span> {systemsEvaluatedSearchLinks}</span>
    )
}