import React, { useContext } from "react";
import DataContext from "../DataContext";

export const ContentWarning: React.FC<{ evalItemID: string, className?: string }> = ({ evalItemID, className }) => {
    const { data } = useContext(DataContext);
    const evalItem = data ? data.find(item => item.id === evalItemID) : null;
    const contentWarning = evalItem ? evalItem.content_warning : null;

    return (
        <div className={`text-sm text-gray-500 ${className}`} style={{ marginTop: '0' }}>
            {contentWarning && (
                <div className="text-red-500 font-bold">
                    Content Warning: {contentWarning}
                </div>
            )}
        </div>
    );
}
