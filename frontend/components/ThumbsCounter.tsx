'use client';

import { useState } from 'react';
import ThumbsDown from '@/icons/thumbsdown';
import ThumbsUp from '@/icons/thumbsup';

const ThumbsCounter = () => {
  const [feedbackLike, setFeedbackLike] = useState(false);
  const [feedbackDislike, setFeedbackDislike] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);

  const handleLike = () => {
    setFeedbackLike(true);
    setFeedbackDislike(false);
    setThumbsUp(true);
  };

  const handleDislike = () => {
    setFeedbackDislike(true);
    setFeedbackLike(false);
    setThumbsUp(false);
  };

  return (
    <div className="flex items-center px-8 py-8 border-t-[1px] border-outline-200">
      <div>
        {feedbackLike || feedbackDislike
          ? 'Thank you for your feedback!'
          : 'Was this response helpful?'}
      </div>
      <div className="flex items-center px-2">
        <div
          onClick={handleLike}
          className={`w-[66px] h-11 rounded-3xl border-[1px] flex items-center justify-center hover:bg-[#F4EFFF] dark:hover:bg-[#201636] cursor-pointer ${feedbackLike ? 'bg-gradient-to-b from-[#B379FF] to-[#702FF9] border-[#702FF9]' : 'border-[#702FF9]'} `}
        >
          <div className="pl-1">
            <ThumbsUp
              className={`${feedbackLike && thumbsUp ? 'stroke-[#FFFFFF]' : 'stroke-[#702FF9]'}`}
            />
          </div>
          <div
            className={`text-${feedbackLike && thumbsUp ? '[#FFFFFF]' : '[#702FF9]'} px-1`}
          >
            42 {/* Placeholder for actual count */}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div
          onClick={handleDislike}
          className={`w-11 h-11 rounded-full border-[1px] flex items-center justify-center hover:bg-[#F4EFFF] dark:hover:bg-[#201636] cursor-pointer ${feedbackDislike ? 'bg-gradient-to-b from-[#B379FF] to-[#702FF9] border-[#702FF9]' : 'border-[#702FF9]'} `}
        >
          <div className="flex items-center">
            <ThumbsDown
              className={`${feedbackDislike && !thumbsUp ? 'stroke-[#FFFFFF]' : 'stroke-[#702FF9]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbsCounter;
