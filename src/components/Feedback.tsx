// Feedback.tsx
import React from 'react';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

import { Button } from './ui/button'

interface FeedbackLinkProps {
  id: string;
}

const FeedbackLink: React.FC<FeedbackLinkProps> = ({ id }) => {  

  const evalCardLink = `https://www.searchevals.com/card/${id}`

  const feedbackLinkFormattedGitHubIssue = 'https://github.com/archignes/searchevals/issues/new' +
    [`?title=${encodeURIComponent('Feedback on eval card ' + id)}`,
    `&body=${encodeURIComponent('# Comment/Complaint\n\n\n\n\n')}`,
    `${encodeURIComponent('# Recommendation/Request\n\n\n\n\n')}`,
    `${encodeURIComponent('⭐️ Please provide links to documentation, if relevant.\n\n')}`,
    `${encodeURIComponent('Link to the evaluation: ' + evalCardLink)}`,
    ].join('');

  
  return (
    <div
      className="w-1/5 ml-auto mr-5"
    >
      
        <Button asChild variant="ghost" id="feedback-link-button" className="h-7 p-1 rounded-bl-none rounded-br-none" aria-label="Add new issue on GitHub">
        <a href={feedbackLinkFormattedGitHubIssue} target="_blank" rel="noopener noreferrer"><ChatBubbleIcon /></a>
        </Button>
    </div>
  )
}

export default FeedbackLink;

