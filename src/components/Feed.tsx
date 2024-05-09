'use client';
// Feed.tsx
// Purpose: Render a list of EvalCard components in a scrollable feed

import React, { useContext, useRef, useMemo, useState, useEffect, useCallback } from 'react';
import DataContext, { evalEvaluator, System } from './DataContext';
import { EvalItem } from '../types';
import MiniEvalCard, { getSystemsEvaluated } from './MiniEvalCard';
import { VariableSizeList } from 'react-window';
import { useWindowResize } from "./useWindowResize";

const Row = ({ sortedData, index, style, setSize, windowWidth }: {
  sortedData: any;
  index: number;
  style: any;
  setSize: (index: number, size: number) => void;
  windowWidth: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  React.useEffect(() => {
    if (rowRef.current) {
      setSize(index, rowRef.current.getBoundingClientRect().height);
    }
  }, [setSize, index, windowWidth]);

  return (
    <div
      ref={rowRef}
      className="mx-2 py-1"
      style={{
        marginLeft: "20px",
        marginRight: "20px"
      }}
    >
      <MiniEvalCard
        evalItemId={sortedData[index].id}
        trimQueryHeight={true}
      />
    </div>
  );
};


const Feed: React.FC = () => {
  const { data } = useContext(DataContext);
  const sortedData = useMemo(() =>
    [...data].sort((a, b) => b.date.localeCompare(a.date)),
    [data]
  );
   
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  
  const listRef = useRef<VariableSizeList>(null);
  const sizeMap = useRef<{ [key: number]: number }>({});
  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current?.resetAfterIndex(index);
  }, []);
  const getSize = (index: number) => sizeMap.current[index] || 50;
  const [windowWidth] = useWindowResize();

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full max-w-[900px] mx-auto">
      <div id="feed" className="flex mt-5 flex-col items-center">
        <VariableSizeList
          ref={listRef}
          height={window.innerHeight - 150}
          width="100%"
          itemCount={sortedData.length}
          itemSize={getSize}
          itemData={sortedData}
        >
          {({ data, index, style }) => (
            <div style={style}>
              <Row
                sortedData={data}
                index={index}
                style={style}
                setSize={setSize}
                windowWidth={windowWidth}
              />
            </div>
          )}
        </VariableSizeList>
    </div>
    </div>
  );
};

export default Feed;
