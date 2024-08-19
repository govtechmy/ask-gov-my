'use client';

import { useState, useEffect } from 'react';
import ThumbsDown from '@/icons/thumbsdown';
import ThumbsUp from '@/icons/thumbsup';
import { likeQuestion, dislikeQuestion } from '@/actions/questionServices';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';

interface ThumbsCounterProps {
  questionId: string;
  totalLikes: number;
}

const ThumbsCounter: React.FC<ThumbsCounterProps> = ({
  questionId,
  totalLikes,
}) => {
  const [likes, setLikes] = useState(totalLikes);
  const [feedbackLike, setFeedbackLike] = useState(false);
  const [feedbackDislike, setFeedbackDislike] = useState(false);
  const [lastVote, setLastVote] = useState<'like' | 'dislike' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations('Questiondetail');

  useEffect(() => {
    const savedFeedback = Cookies.get(`feedback_${questionId}`);
    if (savedFeedback) {
      const feedback = JSON.parse(savedFeedback);
      setFeedbackLike(feedback.voted_like);
      setFeedbackDislike(feedback.voted_dislike);
      setLastVote(feedback.last_vote);
    }
  }, [questionId]);

  const handleLike = async () => {
    if (isProcessing) return;

    const savedFeedback = Cookies.get(`feedback_${questionId}`);
    const feedback = savedFeedback
      ? JSON.parse(savedFeedback)
      : { voted_like: false, voted_dislike: false };

    setLastVote('like');
    setFeedbackLike(true);
    setFeedbackDislike(false);

    if (feedback.last_vote !== 'like') {
      setLikes(prevLikes => prevLikes + 1);

      Cookies.set(
        `feedback_${questionId}`,
        JSON.stringify({
          voted_like: true,
          voted_dislike: feedback.voted_dislike,
          last_vote: 'like',
        }),
      );

      if (!feedback.voted_like) {
        setIsProcessing(true);
        try {
          await likeQuestion(questionId);
          feedback.voted_like = true;
        } catch (error) {
          console.error('Failed to like question:', error);
          setLikes(prevLikes => prevLikes - 1);
          setFeedbackLike(false);
          setLastVote(null);
          Cookies.remove(`feedback_${questionId}`);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const handleDislike = async () => {
    if (isProcessing) return;

    const savedFeedback = Cookies.get(`feedback_${questionId}`);
    const feedback = savedFeedback
      ? JSON.parse(savedFeedback)
      : { voted_like: false, voted_dislike: false };

    setLastVote('dislike');
    setFeedbackLike(false);
    setFeedbackDislike(true);

    if (feedback.last_vote !== 'dislike' && likes > 0) {
      setLikes(prevLikes => Math.max(prevLikes - 1, 0));

      Cookies.set(
        `feedback_${questionId}`,
        JSON.stringify({
          voted_like: feedback.voted_like,
          voted_dislike: true,
          last_vote: 'dislike',
        }),
      );

      if (!feedback.voted_dislike) {
        setIsProcessing(true);
        try {
          await dislikeQuestion(questionId);
          feedback.voted_dislike = true;
        } catch (error) {
          console.error('Failed to dislike question:', error);
          setLikes(prevLikes => prevLikes + 1);
          setFeedbackDislike(false);
          setLastVote(null);
          Cookies.remove(`feedback_${questionId}`);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  return (
    <div className="flex items-center px-8 py-8 border-t-[1px] border-outline-200">
      <div>
        {feedbackLike || feedbackDislike ? t('feedback') : t('response')}
      </div>
      <div className="flex items-center px-2">
        <div
          onClick={handleLike}
          className={`w-[66px] h-11 rounded-3xl border-[1px] flex items-center justify-center hover:bg-[#F4EFFF] dark:hover:bg-[#201636] cursor-pointer ${lastVote === 'like' ? 'bg-gradient-to-b from-[#B379FF] to-[#702FF9] border-[#702FF9]' : 'border-[#702FF9]'}`}
        >
          <div className="pl-1">
            <ThumbsUp
              className={`${lastVote === 'like' ? 'stroke-[#FFFFFF]' : 'stroke-[#702FF9]'}`}
            />
          </div>
          <div
            className={`text-${lastVote === 'like' ? '[#FFFFFF]' : '[#702FF9]'} px-1`}
          >
            {likes}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div
          onClick={handleDislike}
          className={`w-11 h-11 rounded-full border-[1px] flex items-center justify-center hover:bg-[#F4EFFF] dark:hover:bg-[#201636] cursor-pointer ${lastVote === 'dislike' ? 'bg-gradient-to-b from-[#B379FF] to-[#702FF9] border-[#702FF9]' : 'border-[#702FF9]'}`}
        >
          <div className="flex items-center">
            <ThumbsDown
              className={`${lastVote === 'dislike' ? 'stroke-[#FFFFFF]' : 'stroke-[#702FF9]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbsCounter;
