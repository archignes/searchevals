// DataContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import FlexSearch from 'flexsearch';
import { ReactNode } from 'react';
import evals from "src/data/evals.json";
import systems from "src/data/systems.json";
import evaluators from "src/data/evaluators.json";

export interface evalEvaluator {
    id: string; // twitter handle
    name: string;
    role: string;
    conflict?: string[];
    URL: string;
}

export interface evalPart {
    id: string;
    content: string;
    images?: string[]
}

export interface EvalItem {
    id: string;
    date: string;
    query: string;
    url: string;
    key_phrases?: string[];
    context?: string;
    systems: string[];
    eval_parts?: evalPart[];
    content?: string; // Make content optional
    images?: string[]
    evaluator_id: string;
}



export type evalCardItem = EvalItem | evalPart

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
}


const defaultContextValue: DataContextType = {
    data: [],
    results: [],
    query: '',
    setQuery: () => { }, // Dummy function, will be replaced in provider
    systems: systems,
    evaluators: evaluators,
};





type DataProviderProps = {
    children: ReactNode;
};

const DataContext = createContext<DataContextType>(defaultContextValue);

const index = new FlexSearch.Index({ tokenize: 'forward' });

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<EvalItem[]>(evals);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<EvalItem[]>([]);

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
            console.log(`searchResults: ${foundItems}`)
        } else {
            setResults([]);
        }
    }, [query, data]);


    // Assuming systems is an array of objects where each object has a 'name' property
    const sortedSystems = systems.sort((a, b) => a.name.localeCompare(b.name));


    return (
        <DataContext.Provider value={{ data, results, query, setQuery, systems: sortedSystems, evaluators: evaluators }}>
            {children} {/* Now TypeScript knows about children */}
        </DataContext.Provider>
    );
};

export default DataContext;
