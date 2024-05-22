import React, { useContext } from "react";
import DataContext from "../DataContext";

export const KeyPhrases: React.FC<{ evalItemID: string, className?: string }> = ({ evalItemID, className }) => {
    const { data } = useContext(DataContext);
    const evalItem = data ? data.find(item => item.id === evalItemID) : null;
    const keyPhrases = evalItem ? evalItem.key_phrases : null;
    return keyPhrases && keyPhrases.length > 0 ? (
        <div className={`text-sm text-gray-500 ${className}`} style={{ marginTop: '0' }}>
            <span className="font-bold">key phrases:</span> {keyPhrases.map((phrase, index) => (
                <span key={phrase.replace(/\s/g, '-')}>
                    "{phrase}"{index < keyPhrases.length - 1 ? ', ' : ''}
                </span>
            ))}
        </div>
    ) : null;
}