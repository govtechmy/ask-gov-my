"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  CloseIcon,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PlusIcon,
  QuestionCircleIcon,
  QuestionMarkBoxIcon,
  TickCheckCircleIcon,
} from "@askgovmy/ui";
import { AskQuestionForm } from "./AskQuestionForm";

const AskQuestion = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const t = useTranslations("Askquestions");

  const handleClick = () => {
    setIsClicked(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSuccessModal = () => {
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleModalCloseOpenModalSubmit = () => {
    closeModal();
    openSuccessModal();
  };

  return (
    <div className="items-center px-4 py-2 text-center border-outline-200 h-[60px]">
      <div className="text-sm items-center flex text-primary-500 justify-center h-full">
        {isClicked ? (
          <Button
            variant={"primary"}
            size={"md"}
            onClick={(e) => {
              e.stopPropagation();
              openModal();
            }}
          >
            <PlusIcon className="stroke-white-forcewhite"></PlusIcon>
            {t("ask_new_question")}
          </Button>
        ) : (
          <Button
            variant={"secondary-askmygov"}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <QuestionCircleIcon />
            {t("cant_find")}
          </Button>
        )}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="h-full md:h-auto max-w-[600px] flex flex-col"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="justify-start gap-2">
              <QuestionMarkBoxIcon />
              <span>{t("ask_new_question")}</span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("ask_new_question")}
            </DialogDescription>
          </DialogHeader>
          <AskQuestionForm onSubmit={handleModalCloseOpenModalSubmit} />
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent
          className="h-full max-w-[600px] md:max-h-fit flex flex-col justify-center"
          hideCloseButton
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="flex-col md:items-start gap-4">
              <TickCheckCircleIcon className="text-success-700 size-8" />
              <span className="text-black-900 font-semibold text-lg pb-2 inline-block">
                {t("submission_received")}
              </span>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <p className="text-black-700 font-normal text-sm text-center md:text-left">
              {t("submission_received_detail")}
            </p>
          </DialogDescription>
          <DialogFooter>
            <Button
              className="w-full text-black-700"
              variant={"secondary"}
              size={"lg"}
              onClick={closeSuccessModal}
            >
              <CloseIcon className="stroke-black-700" />
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AskQuestion;
