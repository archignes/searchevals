import React from "react";
import { EvalItem } from '@/src/types/evalItem';

type evalItemProps = {
    evalItem: EvalItem;
}

export const ReferencedAt: React.FC<evalItemProps> = ({ evalItem }) => {
    const { referenced_at } = evalItem;
    if (!referenced_at) {
        return null;
    }

    return (
        <>
            <br />
            <span className="text-sm font-semibold">referenced at:</span>
            <span className="ml-1">
                {referenced_at.map((ref, index) => (
                    <React.Fragment key={index}>
                        <a className="underline" href={ref.link_url}>
                            {ref.link_text}
                        </a>
                        {index < referenced_at.length - 1 && ", "}
                    </React.Fragment>
                ))}
            </span>
            </>
    );
}
