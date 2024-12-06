"use client";

import { useEffect, useState } from "react";
import { markQuestionAsOpened as markQuestionAsOpenedAction } from "@/actions/admin/question";

const storageKey = (userId: string) => `opened_questions_${userId}`;

function getOpenedQuestionIds(userId: string): number[] {
  return JSON.parse(
    localStorage.getItem(storageKey(userId)) || "[]"
  ) as number[];
}

function saveOpenedQuestionIds(userId: string, questionIds: number[]): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(questionIds));
}

function checkIsQuestionOpened(userId: string, questionId: number): boolean {
  const openedQuestionIds = getOpenedQuestionIds(userId);
  return openedQuestionIds.includes(questionId);
}

async function markQuestionAsOpened(
  userId: string,
  questionId: number
): Promise<void> {
  const openedQuestionIds = getOpenedQuestionIds(userId);
  if (openedQuestionIds.includes(questionId)) {
    return;
  }
  await markQuestionAsOpenedAction(questionId);
  openedQuestionIds.push(questionId);
  saveOpenedQuestionIds(userId, openedQuestionIds);
}

export function useOpenQuestion({
  questionId,
  userId,
}: {
  questionId: number;
  userId: string;
}) {
  const [opened, setOpened] = useState<boolean | null>(null);

  useEffect(() => {
    setOpened(checkIsQuestionOpened(userId, questionId));
  }, [userId, questionId]);

  return {
    markQuestionAsOpened: () => markQuestionAsOpened(userId, questionId),
    opened,
  };
}
