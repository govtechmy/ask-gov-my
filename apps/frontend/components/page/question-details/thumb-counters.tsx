"use client";

import { useState, useEffect } from "react";
import ThumbsDown from "@/icons/thumbsdown";
import ThumbsUp from "@/icons/thumbsup";
import { likeQuestion, dislikeQuestion } from "@/actions/questionServices";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { Button } from "@askgovmy/ui";
import { cn } from "@askgovmy/utils";

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
  const [lastVote, setLastVote] = useState<"like" | "dislike" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations("Questiondetail");

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

    setLastVote("like");
    setFeedbackLike(true);
    setFeedbackDislike(false);

    if (feedback.last_vote !== "like") {
      setLikes((prevLikes) => prevLikes + 1);

      Cookies.set(
        `feedback_${questionId}`,
        JSON.stringify({
          voted_like: true,
          voted_dislike: feedback.voted_dislike,
          last_vote: "like",
        })
      );

      if (!feedback.voted_like) {
        setIsProcessing(true);
        try {
          await likeQuestion(questionId);
          feedback.voted_like = true;
        } catch (error) {
          console.error("Failed to like question:", error);
          setLikes((prevLikes) => prevLikes - 1);
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

    setLastVote("dislike");
    setFeedbackLike(false);
    setFeedbackDislike(true);

    if (feedback.last_vote !== "dislike" && likes > 0) {
      setLikes((prevLikes) => Math.max(prevLikes - 1, 0));

      Cookies.set(
        `feedback_${questionId}`,
        JSON.stringify({
          voted_like: feedback.voted_like,
          voted_dislike: true,
          last_vote: "dislike",
        })
      );

      if (!feedback.voted_dislike) {
        setIsProcessing(true);
        try {
          await dislikeQuestion(questionId);
          feedback.voted_dislike = true;
        } catch (error) {
          console.error("Failed to dislike question:", error);
          setLikes((prevLikes) => prevLikes + 1);
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
    <div className="flex items-center gap-2">
      <p>{feedbackLike || feedbackDislike ? t("feedback") : t("response")}</p>
      <Button
        onClick={handleLike}
        className="flex p-3 gap-1.5 rounded-[32px] border-askmygovbrand-600 hover:border-askmygovbrand-600"
        variant={"secondary-askmygov"}
      >
        <ThumbsUp
          className={`${lastVote === "like" ? "stroke-white" : "stroke-askmygovbrand-600"}`}
        />
        <p
          className={cn(
            "text-sm",
            lastVote === "like" ? "text-white" : "text-askmygovbrand-600"
          )}
        >
          {likes}
        </p>
      </Button>
      <Button
        onClick={handleDislike}
        className="flex p-3 gap-1.5 rounded-[32px] border-askmygovbrand-600 hover:border-askmygovbrand-600"
        variant={"secondary-askmygov"}
      >
        <ThumbsDown
          className={`${lastVote === "dislike" ? "stroke-white" : "stroke-askmygovbrand-600"}`}
        />
      </Button>
    </div>
  );
};

export default ThumbsCounter;
