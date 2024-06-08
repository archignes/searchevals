"use client"
import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import FlexSearch from 'flexsearch';
import evals from "src/data/evals.json";
import systems from "src/data/systems.json";
import evaluators from "src/data/evaluators.json";
import MiniEvalCard, { MiniEvalCardProps } from "./MiniEvalCard";
import { EvalItem } from '@/src/types/evalItem';

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
    limited_release?: boolean;
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
    replicatedStatusLookupMap: { [key: string]: { replication_id: string; replication_status: string }[] };
    reroutedStatusLookupMap: { [key: string]: { rerouted_id: string; rerouted_status: string }[] };
    evalsToSystemsLookupMap: { [key: string]: string[] };
    minimalEvalLookupMap: { [key: string]: { evalQuery: string; evalSystems: string[]; evaluatorName: string } };
}

const defaultContextValue: DataContextType = {
    data: [],
    results: [],
    query: '',
    setQuery: () => { }, // Dummy function, will be replaced in provider
    systems: [],
    evaluators: [],
    evalItemLabel: () => <div></div>,
    miniEvalCard: () => <div></div>,
    replicatedStatusLookupMap: {},
    reroutedStatusLookupMap: {},
    evalsToSystemsLookupMap: {},
    minimalEvalLookupMap: {},
    
}

type DataProviderProps = {
    children: ReactNode;
};

const DataContext = createContext<DataContextType>(defaultContextValue);

const index = new FlexSearch.Index({ tokenize: 'forward' });

const createLookupMap = (data: EvalItem[]): { [key: string]: { replication_id: string; replication_status: string }[] } => {
    const map: { [key: string]: { replication_id: string; replication_status: string }[] } = {};
    data.forEach(evalItem => {
        if (evalItem.replication_attempt) {
            const { replication_of_id, replication_status } = evalItem.replication_attempt;
            if (!map[replication_of_id]) {
                map[replication_of_id] = [];
            }
            map[replication_of_id].push({ replication_id: evalItem.id, replication_status });
        }
    });
    return map;
};

const createEvalsToSystemsLookupMap = (data: EvalItem[]): { [key: string]: string[] } => {
    const map: { [key: string]: string[] } = {};
    data.forEach(evalItem => {
        map[evalItem.id] = evalItem.systems;
    });
    return map;
};

const createRerouteStatusLookupMap = (
    data: EvalItem[]
): { [key: string]: { rerouted_id: string; rerouted_status: string }[] } => {
    const map: { [key: string]: { rerouted_id: string; rerouted_status: string }[] } = {};
    data.forEach(evalItem => {
        if (evalItem.rerouting_attempt) {
            const { rerouting_from_id, rerouting_status } = evalItem.rerouting_attempt;
            if (!map[rerouting_from_id]) {
                map[rerouting_from_id] = [];
            }
            map[rerouting_from_id].push({
                rerouted_id: evalItem.id,
                rerouted_status: rerouting_status
            });
        }
    });
    return map;
};

const createMinimalEvalLookupMap = (data: EvalItem[]): { [key: string]: { evalQuery: string; evalSystems: string[]; evaluatorName: string } } => {
    const map: { [key: string]: { evalQuery: string; evalSystems: string[]; evaluatorName: string } } = {};
    data.forEach(evalItem => {
        const evaluator = evaluators.find(evaluator => evaluator.id === evalItem.evaluator_id);
        map[evalItem.id] = {
            evalQuery: evalItem.query,
            evalSystems: evalItem.systems.map(systemId => 
                systems.find(system => system.id === systemId)?.name || 'Unknown'),
            evaluatorName: evaluator ? evaluator.name : 'Unknown'
        };
    });
    return map;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<EvalItem[]>(evals as EvalItem[]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<EvalItem[]>([]);

    const replicatedStatusLookupMap = useMemo(() => createLookupMap(data), [data]);
    const evalsToSystemsLookupMap = useMemo(() => createEvalsToSystemsLookupMap(data), [data]);
    const minimalEvalLookupMap = useMemo(() => createMinimalEvalLookupMap(data), [data]);
    const reroutedStatusLookupMap = useMemo(() => createRerouteStatusLookupMap(data), [data]);

    const EvalItemLabel: React.FC<{ evalItemId: string, currentEvaluation: string, currentEvaluator: boolean }> = ({ evalItemId, currentEvaluation, currentEvaluator }) => {
        const connectedItem = data.find(evalItem => evalItem.id === evalItemId) || null;
        const evaluator = evaluators.find(evaluator => evaluator.id === connectedItem?.evaluator_id) || null;
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
                evalString += evalItem.eval_parts.map(part => part.content).join(' ');
            }
            if (evalItem.evaluator_id) {
                const evaluatorDetails = evaluators.find(evaluator => evaluator.id === evalItem.evaluator_id);
                if (evaluatorDetails) {
                    evalString += " " + evaluatorDetails.name + " " + evaluatorDetails.role;
                }
            }
            return evalString;
        }

        data.forEach(evalItem => {
            index.add(evalItem.id, get_evalString(evalItem));
        });
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

    const sortedSystems = useMemo(() => systems.sort((a, b) => a.name.localeCompare(b.name)), [systems]);

    useEffect(() => {
        const invalidSystems = data.flatMap(evalItem =>
            evalItem.systems.filter(systemId =>
                !systems.some(system => system.id === systemId)
            ).map(invalidId => ({ evalItemId: evalItem.id, invalidSystemId: invalidId }))
        );

        if (invalidSystems.length > 0) {
            throw new Error(`Validation failed: Some systems in the data do not match the available systems. Invalid systems found in evalItems: ${invalidSystems.map(is => `EvalItem ID: ${is.evalItemId}, Invalid System ID: ${is.invalidSystemId}`).join(', ')}`);
        }
    }, [data]);

    return (
        <DataContext.Provider value={{ data, results, query, setQuery, systems: sortedSystems, evaluators, miniEvalCard: MiniEvalCard, evalItemLabel: EvalItemLabel, replicatedStatusLookupMap, reroutedStatusLookupMap, evalsToSystemsLookupMap, minimalEvalLookupMap }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
