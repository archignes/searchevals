import React, { useContext } from "react";
import DataContext from "../DataContext";

export const EvaluationTarget: React.FC<{ evalItemID: string, className?: string }> = ({ evalItemID, className }) => {
    const { data } = useContext(DataContext);
    const evalItem = data ? data.find(item => item.id === evalItemID) : null;
    const evaluationTarget = evalItem ? evalItem.evaluation_target : null;
    return evaluationTarget ? (
        <div className={`text-sm text-gray-500 ${className}`} style={{ marginTop: '0' }}>
            evaluating: {evaluationTarget.map((target, index) => (
                <span key={target.replace(/\s/g, '-')}>
                    {target}{index < evaluationTarget.length - 1 ? ', ' : ''}
                </span>
            ))}
        </div>
    ) : null;
}