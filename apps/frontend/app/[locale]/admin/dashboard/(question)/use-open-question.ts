"use client";

import { useEffect, useState } from "react";
import { markQuestionAsOpened as markQuestionAsOpenedAction } from "@/actions/admin/question";

const storageKey = "opened_questions";

function getOpenedQuestionIds(): number[] {
  return JSON.parse(localStorage.getItem(storageKey) || "[]") as number[];
}

function saveOpenedQuestionIds(questionIds: number[]): void {
  localStorage.setItem(storageKey, JSON.stringify(questionIds));
}

function checkIsQuestionOpened(questionId: number): boolean {
  const openedQuestionIds = getOpenedQuestionIds();
  return openedQuestionIds.includes(questionId);
}

async function markQuestionAsOpened(questionId: number): Promise<void> {
  const openedQuestionIds = getOpenedQuestionIds();
  if (openedQuestionIds.includes(questionId)) {
    return;
  }
  await markQuestionAsOpenedAction(questionId);
  openedQuestionIds.push(questionId);
  saveOpenedQuestionIds(openedQuestionIds);
}

export function useOpenQuestion({ questionId }: { questionId: number }) {
  const [opened, setOpened] = useState<null | boolean>(null);

  useEffect(() => {
    setOpened(checkIsQuestionOpened(questionId));
  }, []);

  return {
    markQuestionAsOpened: () => markQuestionAsOpened(questionId),
    opened,
  };
}
