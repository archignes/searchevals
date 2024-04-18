// DataContext.tsx
"use client"
import React, { createContext, useState, useEffect } from 'react';
import FlexSearch from 'flexsearch';
import { ReactNode } from 'react';
import evals from "src/data/evals.json";
import systems from "src/data/systems.json";
import evaluators from "src/data/evaluators.json";
import MiniEvalCard, { MiniEvalCardProps } from "./MiniEvalCard";
import { EvalItem, evalCardItem } from '@/src/types/evalItem';

export interface evalEvaluator {
    id: string; // twitter handle
    name: string;
    role: string;
    conflict?: string[];
    URL: string;
}








export interface System {
    id: string;
    name: string;
    nondistinct_url?: boolean;
    base_url_for?: string[];
    account_required?: boolean;
    search_link: string;
    mobile_app_breaks_links_warning?: boolean;
}

interface DataContextType {
    data: EvalItem[];
    results: EvalItem[];
    query: string;
    setQuery: (query: string) => void;
    systems: System[];
    evaluators: evalEvaluator[];
    evalItemLabel: React.FC<{ evalItemId: string; currentEvaluation: string; currentEvaluator: boolean }>;
    miniEvalCard: React.FC<MiniEvalCardProps>;
}


const defaultContextValue: DataContextType = {
    data: [],
    results: [],
    query: '',
    setQuery: () => { }, // Dummy function, will be replaced in provider
    systems: [],
    evaluators: [],
    evalItemLabel: (props: { evalItemId: string; currentEvaluation: string; currentEvaluator: boolean }) => <div></div>,
    miniEvalCard: (MiniEvalCardProps) => <div></div>
}


type DataProviderProps = {
    children: ReactNode;
};

const DataContext = createContext<DataContextType>(defaultContextValue);

const index = new FlexSearch.Index({ tokenize: 'forward' });

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<EvalItem[]>(evals as EvalItem[]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<EvalItem[]>([]);


    const EvalItemLabel: React.FC<{evalItemId: string, currentEvaluation: string, currentEvaluator: boolean}> = ({evalItemId, currentEvaluation, currentEvaluator}) => {
        const connectedItem = data ? data.find(evalItem => evalItem.id === evalItemId) : null;
        const evaluator = evaluators ? evaluators.find(evaluator => evaluator.id === connectedItem?.evaluator_id) : null;
        const isCurrentEvaluation = currentEvaluation === evalItemId;
        return (
            <span>
                {isCurrentEvaluation ? "current: " : ""}
                <a href={`/card/${evalItemId}`}>
                    {evaluator?.name}: {connectedItem?.systems?.join(', ')}[{connectedItem?.query}].{connectedItem?.date}
                </a>
            </span>
        );
    };


    useEffect(() => {
        // Initialize your data and add it to the index
        function get_evalString(evalItem: EvalItem) {
            let evalString = evalItem.query + " " + evalItem.content + " ";
            if (evalItem.eval_parts) {
                evalString = evalString + " " + evalItem.eval_parts.forEach(part => {
                    return (part.content);
                });
            }
            if (evalItem.evaluator_id) {
                const evaluatorDetails = evaluators.find(evaluator => evaluator.id === evalItem.evaluator_id);
                if (evaluatorDetails) {
                    evalString = evalString + " " + evaluatorDetails.name + " " + evaluatorDetails.role;
                }
            }
            return evalString
        }

        data.forEach(evalItem => {
            index.add(evalItem.id, get_evalString(evalItem));
            
        });
        setData(data);
    }, [data]);

    useEffect(() => {
        if (query) {
            const searchResults = index.search(query);
            const foundItems = searchResults.map(result => data.find(evalItem => evalItem.id === result)).filter(Boolean) as EvalItem[];
            setResults(foundItems);
        } else {
            setResults([]);
        }
    }, [query, data]);


    // Assuming systems is an array of objects where each object has a 'name' property
    const sortedSystems = systems.sort((a, b) => a.name.localeCompare(b.name));


    useEffect(() => {
        const invalidSystems = data.flatMap(evalItem => 
            evalItem.systems.filter(systemId => 
                !systems.some(system => system.id === systemId)
            ).map(invalidId => ({ evalItemId: evalItem.id, invalidSystemId: invalidId }))
        );

        if (invalidSystems.length > 0) {
            throw new Error(`Validation failed: Some systems in the data do not match the available systems. Invalid systems found in evalItems: ${invalidSystems.map(is => `EvalItem ID: ${is.evalItemId}, Invalid System ID: ${is.invalidSystemId}`).join(', ')}`);
        }

        setData(data); // No changes needed if validation passes
    }, [data]);


    return (
        <DataContext.Provider value={{ data, results, query, setQuery, systems: sortedSystems, evaluators: evaluators, miniEvalCard: MiniEvalCard, evalItemLabel: EvalItemLabel }}>
            {children} {/* Now TypeScript knows about children */}
        </DataContext.Provider>
    );
};

export default DataContext;
