import React, { useContext, useRef, useState } from 'react';
import DataContext from './DataContext';
import EvalCard from './EvalCard';

const Marquee: React.FC = () => {
  const { data } = useContext(DataContext);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  const onDragEnd = () => {
    setIsDragging(false);
  };

  const onDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.clientX;
    setStartX(pageX);
    e.preventDefault();
  };

  const onDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const x = 'touches' in e ? e.touches[0].pageX : e.clientX;
    const scrollSpeed = x - startX;
    if (marqueeRef.current) {
      marqueeRef.current.scrollLeft -= scrollSpeed;
    }
    setStartX(x);
  };

  return (
    <div
      id="marquee"
      className="overflow-x-hidden"
      ref={marqueeRef}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseLeave={onDragEnd}
      onMouseUp={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}
    >
      <div className="py-12 flex animate-marquee whitespace-nowrap hover:pause-animation">
        {data.map((evalItem, index) => (
          <div key={index} className="whitespace-normal">
            <EvalCard id={evalItem.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;