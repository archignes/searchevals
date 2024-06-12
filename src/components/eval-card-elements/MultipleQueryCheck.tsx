import React from 'react';
import { EvalItem } from '../../types/evalItem';
import { getQueries } from '../../lib/utils';

interface MultipleQueryCheckProps {
    evalItem: EvalItem;
}

export const MultipleQueryCheck: React.FC<MultipleQueryCheckProps> = ({ evalItem }) => {
    const allQueries = getQueries(evalItem);
    allQueries.delete(evalItem.query);

    if (allQueries.size === 0) {
        return null;
    }

    const wrappedQueries = Array.from(allQueries).map((q) => `[${q}]`).join(', ');

    return (
        <div className="text-sm text-gray-600">
            Additional queries in eval: {wrappedQueries}
        </div>
    );
};