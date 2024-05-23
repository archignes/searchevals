import React, { useContext } from "react";
import DataContext from "../DataContext";
import { DocumentList } from "./documentList";

export const ReferencedAt: React.FC<{ evalItemID: string; className?: string }> = ({
    evalItemID,
    className,
}) => {
    const { data } = useContext(DataContext);
    const evalItem = data ? data.find((item) => item.id === evalItemID) : null;
    const referenced_at = evalItem?.referenced_at;

    return referenced_at ? (
        <DocumentList documents={referenced_at} documents_type="Referenced at" className={className} />
    ) : null;
};
