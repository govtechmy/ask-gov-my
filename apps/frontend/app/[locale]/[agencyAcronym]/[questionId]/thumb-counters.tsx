"use client";

import { useEffect, useState, useTransition } from "react";
import ThumbsDown from "@/icons/thumbsdown";
import ThumbsUp from "@/icons/thumbsup";
import { dislikeAnswer, likeAnswer } from "@/actions/public/question";
import { useTranslations } from "next-intl";
import { Button } from "@askgovmy/ui";
import { cn } from "@askgovmy/utils";

interface ThumbsCounterProps {
  answerId: number;
  questionId: string;
  totalLikes: number;
}

type LikeStatus = "liked" | "disliked" | null;

const localStorageKey = "answer_like_status";

function getLocalLikeStatus(answerId: number): LikeStatus {
  const record = JSON.parse(
    localStorage.getItem(localStorageKey) || "{}"
  ) as Record<string, LikeStatus>;
  return record[answerId] || null;
}

function saveLocalLikeStatus(answerId: number, status: LikeStatus): void {
  const record = JSON.parse(
    localStorage.getItem(localStorageKey) || "{}"
  ) as Record<string, LikeStatus>;
  record[answerId] = status;
  localStorage.setItem(localStorageKey, JSON.stringify(record));
}

function useLikeStatus({
  answerId,
  initialLikesCount,
}: {
  answerId: number;
  initialLikesCount: number;
}) {
  const [numLikes, setNumLikes] = useState(initialLikesCount);
  const [status, setStatus] = useState<LikeStatus>(null);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    setStatus(getLocalLikeStatus(answerId));
  }, []);

  const like = async () => {
    if (isLoading || status === "liked") return;
    startTransition(async () => {
      setStatus("liked");
      setNumLikes((prev) => prev + 1);
      await likeAnswer(answerId);
      saveLocalLikeStatus(answerId, "liked");
    });
  };

  const dislike = async () => {
    if (isLoading || status === "disliked") return;
    startTransition(async () => {
      setStatus("disliked");
      setNumLikes((prev) => prev - 1);
      await dislikeAnswer(answerId);
      saveLocalLikeStatus(answerId, "disliked");
    });
  };

  return { status, numLikes, like, dislike, isLoading };
}

const ThumbsCounter: React.FC<ThumbsCounterProps> = ({
  answerId,
  totalLikes,
}) => {
  const t = useTranslations("Questiondetail");
  const { status, numLikes, like, dislike } = useLikeStatus({
    answerId,
    initialLikesCount: totalLikes,
  });

  return (
    <div className="flex items-center gap-2">
      <p>{status ? t("feedback") : t("response")}</p>
      <Button
        onClick={like}
        className={cn(
          "flex p-3 gap-1.5 rounded-[32px] border-askmygovbrand-600 hover:border-askmygovbrand-600",
          status === "liked" &&
            "bg-gradient-to-t from-askmygovbrand-600 to-askmygovbrand-300"
        )}
        variant={"secondary-askmygov"}
      >
        <ThumbsUp
          className={`${status === "liked" ? "stroke-white-forcewhite" : "stroke-askmygovbrand-600"}`}
        />
        <p
          className={cn(
            "text-sm text-askmygovbrand-600",
            status === "liked"
              ? "text-white-forcewhite"
              : "text-askmygovbrand-600"
          )}
        >
          {numLikes}
        </p>
      </Button>
      <Button
        onClick={dislike}
        className={cn(
          "flex p-3 gap-1.5 rounded-[32px] border-askmygovbrand-600 hover:border-askmygovbrand-600",
          status === "disliked" &&
            "bg-gradient-to-t from-askmygovbrand-600 to-askmygovbrand-300"
        )}
        variant={"secondary-askmygov"}
      >
        <ThumbsDown
          className={`${status === "disliked" ? "stroke-white-forcewhite" : "stroke-askmygovbrand-600"}`}
        />
      </Button>
    </div>
  );
};

export default ThumbsCounter;
