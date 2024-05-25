import React, { useContext } from "react";
import DataContext from "../DataContext";

export const ReplyTo: React.FC<{ evalItemID: string, className?: string }> = ({
  evalItemID,
  className,
}) => {
  const { data } = useContext(DataContext);
  const evalItem = data ? data.find((item) => item.id === evalItemID) : null;
  const replyToItem = evalItem
    ? data.find((item) => item.id === evalItem.reply_to)
    : null;

  return replyToItem ? (
    <div className={`text-sm text-gray-500 ${className}`} style={{ marginTop: "0" }}>
      <span className="font-bold">in reply to:</span>{" "}
      <a href={`/card/${replyToItem.id}`} className="underline arrLinkFlat">
        [{replyToItem.query}]
      </a>
    </div>
  ) : null;
};
