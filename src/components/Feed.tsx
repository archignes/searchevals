import React, { useContext, useState, useEffect, useTransition } from 'react';
import DataContext from './DataContext';
import EvalCard from './EvalCard';
import { Button } from './ui/button';

const Feed: React.FC = () => {
  const { data } = useContext(DataContext);
  const [displayedItems, setDisplayedItems] = useState(data.slice(0, 5));
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setDisplayedItems(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));
    });
  }, [data]);

  const handleShowMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default button click behavior
    event.stopPropagation(); // Stop the event from bubbling up
    startTransition(() => {
      const currentLength = displayedItems.length;
      const additionalItems = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(currentLength, currentLength + 5);
      setDisplayedItems(prevItems => [...prevItems, ...additionalItems]);
    });
    return false; // Ensure no part of the default behavior occurs
  };

  return (
    <div
      id="feed"
      className="flex flex-col items-center"
    >
      {isPending ? <p>Loading...</p> : displayedItems.map((evalItem, index) => (
        <div key={index} className="whitespace-normal my-7">
          <EvalCard id={evalItem.id} />
        </div>
      ))}
      <Button
        type="button"
        className="mt-4 p-2 text-white rounded"
        onClick={handleShowMore}
        disabled={isPending}
      >
        Show more evals...
      </Button>
    </div>
  );
};

export default Feed;