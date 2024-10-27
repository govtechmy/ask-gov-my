"use client";
import React, { useState } from "react";
import QuestionCircle from "@/icons/questioncircle";
import PlusIcon from "@/icons/plusicon";
import Close from "@/icons/close";
import QuestionMarkWithBox from "@/icons/questionmarkwithbox";
import MailLogo from "@/icons/maillogo";
import Info from "@/icons/info";
import TickCheckCircle from "@/icons/tickcheckcircle";
import { submitQuestion } from "@/actions/questionServices";
import { useTranslations } from "next-intl";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@askgovmy/ui";

const AskQuestion = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const t = useTranslations("Askquestions");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question && email) {
      try {
        await submitQuestion({ question, email });
        console.log("Question submitted:", question, email);
        handleModalCloseOpenModalSubmit();
      } catch (error) {
        console.error("Error submitting question:", error);
      }
    } else {
      console.warn("Form is incomplete");
    }
  };

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
          <Button variant={"primary"} size={"md"} onClick={openModal}>
            <PlusIcon className="stroke-white-forcewhite"></PlusIcon>
            {t("ask_new_question")}
          </Button>
        ) : (
          <Button variant={"secondary-askmygov"} onClick={handleClick}>
            <QuestionCircle />
            {t("cant_find")}
          </Button>
        )}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-full md:h-auto max-w-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="justify-start gap-2">
              <QuestionMarkWithBox />
              <span>{t("ask_new_question")}</span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("ask_new_question")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <div className="text-left">
              <div className="text-base font-medium pb-0 mb-0 text-black-700">
                {t("your_question")}
              </div>
              <textarea
                placeholder={t("type_your_question")}
                className="mt-[6px] h-[120px] text-left pl-3 pt-2 w-full rounded-lg shadow-sm border-[1px] border-outline-200
                     focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]
                     placeholder:text-black-900 placeholder:font-normal placeholder:text-base"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="text-left mt-4">
              {/* this is email input  */}
              <div className="mb-[4px] text-base font-medium pb-0 text-black-700">
                {t("notify_me")}
              </div>
              <div
                className={`flex items-center border-[1px] border-outline-200 shadow-sm rounded-md h-10 w-full ${
                  isFocused
                    ? "shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]"
                    : ""
                }`}
              >
                <div className="pl-3 pr-2">
                  <MailLogo />
                </div>
                <input
                  placeholder={t("your_email")}
                  className="w-full outline-none"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                />
              </div>

              <div className="text-sm font-normal pt-[6px] mb-6 text-dim-500">
                {t("email_updates")}
              </div>

              <div className="flex border-[1px] border-askmygovbrand-200 shadow-sm rounded-md w-full bg-askmygovbrand-50">
                <div className="pl-3 pt-3 pr-[10px]">
                  <Info className="stroke-askmygovbrand-600"></Info>
                </div>
                <div className="items-center text-sm font-normal text-black-700 py-3 pr-3">
                  <div>
                    <div>
                      {t("response_time_p1")}
                      <span className="text-askmygovbrand-600 font-semibold">
                        {" "}
                        {t("response_time_p2")}{" "}
                      </span>
                      {t("response_time_p3")}
                    </div>

                    <div className="pt-3">
                      {t("response_public_p1")}
                      <span className="text-askmygovbrand-600 font-semibold">
                        {" "}
                        {t("response_public_p2")}{" "}
                      </span>
                      {t("response_public_p3")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 md:static flex flex-col items-center pt-9 pb-[18px]">
              <Button type="submit" onClick={handleSubmit} variant={"primary"}>
                {t("submit")}
              </Button>
              <div className="pt-3 text-dim-500 font-normal text-sm text-center">
                {t("terms")}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent
          className="h-full max-w-[600px] md:max-h-fit flex flex-col justify-center"
          hideCloseButton
        >
          <DialogHeader>
            <DialogTitle className="flex-col md:items-start gap-4">
              <TickCheckCircle className="text-success-700 size-8" />
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
              <Close className="stroke-black-700"></Close>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AskQuestion;
