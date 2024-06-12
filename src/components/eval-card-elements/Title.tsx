import React from 'react';
import SearchBracket from '../SearchBracket';
import { EvalItem } from '../../types';

interface EvalTitleProps {
  evalItem: EvalItem;
  type?: string;
  trimQueryHeight?: boolean;
  textSizeClass?: string;
}

export const EvalTitle: React.FC<EvalTitleProps> = ({ evalItem, type, trimQueryHeight, textSizeClass }) => {
  const titleContent = evalItem.query ? (
    <SearchBracket className={textSizeClass}>
      {type === 'mini' ? (
        <span className={`${textSizeClass} font-normal`}>{evalItem.query}</span>
      ) : (
        evalItem.query
      )}
    </SearchBracket>
  ) : evalItem.snippet ? (
    <span className={`${textSizeClass} font-normal`}>{`"${evalItem.snippet}"`}</span>
  ) : (
    <span className={`${textSizeClass} font-normal`}>{`"${evalItem.content}"`}</span>
  );




  return (
    <div>
      <span className={`${type === 'mini' ? 'text-xl' : textSizeClass}`}>
        {type === 'mini' ? (
          <a href={`/card/${evalItem.id}`} className="underline">
            <div className={`arrLink w-fit ${trimQueryHeight ? 'two-lines-height-limit' : ''}`}>
              {titleContent}
            </div>
          </a>
        ) : (
          titleContent
        )}
      </span>
    </div>
  );
};