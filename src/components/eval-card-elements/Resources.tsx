import React, { useContext } from "react";
import DataContext from "../DataContext";
import { DocumentList } from "./documentList";

export const Resources: React.FC<{ evalItemID: string; className?: string }> = ({
    evalItemID,
    className,
}) => {
    const { data } = useContext(DataContext);
    const evalItem = data ? data.find((item) => item.id === evalItemID) : null;
    const resources = evalItem?.resources;

    return resources?.length ? (
        <DocumentList documents={resources} documents_type="Resources" className={className} />
    ) : null;
};
