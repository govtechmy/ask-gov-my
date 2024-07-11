'use client';
import React, { useState } from 'react';
import QuestionCircle from '@/icons/questioncircle';
import PlusIcon from '@/icons/plusicon';
import Close from '@/icons/close';
import QuestionMarkWithBox from '@/icons/questionmarkwithbox';
import MailLogo from '@/icons/maillogo';
import Info from '@/icons/info';

const AskQuestion = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleModalDisplay = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="items-center px-4 py-2 text-center border-outline-200 h-[60px] w-[788px]">
      <div className="text-sm items-center flex text-primary-500 justify-center h-full">
        {isClicked ? (
          <div className="h-10 flex items-center text-white font-medium text-base border-[1px] border-[#702FF9] shadow-button bg-gradient-to-b from-[#B379FF] to-[#702FF9] px-4 py-2 rounded-lg hover:cursor-pointer">
            <div className="pr-2">
              <PlusIcon className="stroke-[#FFFFFF] dark:stroke-[#FFFFFF]"></PlusIcon>
            </div>
            <div onClick={handleModalDisplay}>Ask a new question</div>
          </div>
        ) : (
          <div className="h-10 flex items-center text-[#702FF9] font-medium text-base border-[1px] border-[#D4C0FF] dark:border-[#4F1FB4] shadow-button bg-white px-4 py-2 rounded-lg hover:cursor-pointer">
            <div className="pr-2">
              <QuestionCircle />
            </div>
            <div onClick={handleClick}>I can't find what I am looking for.</div>
          </div>
        )}
      </div>
      {isModalOpen && (
        //edit below
        //under here background no color
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          {/* under here big white background */}
          <div className="bg-white rounded-xl shadow-card h-[750px] w-[600px] border-outline-200 border-[1px]">
            <div className="p-[14px]">
              <div className="flex justify-end">
                <div
                  onClick={closeModal}
                  className="hover:cursor-pointer rounded-lg shadow-button h-8 w-8 flex items-center justify-center border-[1px] border-outline-200"
                >
                  <Close />
                </div>
              </div>
              <div className="text-lg font-semibold pt-[18px] px-[18px] pb-[24px] text-left -mt-8 flex items-center text-black-900">
                <div className="pr-3">
                  <QuestionMarkWithBox></QuestionMarkWithBox>
                </div>
                <div>Ask a new question</div>
              </div>
              <form className="px-[18px]">
                <div className="text-left">
                  <div className="text-base font-medium pb-0 mb-0 text-black-700">
                    Your question
                  </div>
                  <textarea
                    placeholder="Type your question.."
                    className="mt-[6px] h-[120px] text-left pl-3 pt-2
                    w-full rounded-lg shadow-sm border-[1px] border-outline-200
                    focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE]
                    placeholder:text-black-900 placeholder:font-normal placeholder:text-base"
                  ></textarea>
                </div>

                <div className="text-left mt-4 mb-5">
                  <div className="text-base font-medium pb-0 mb-0 text-black-700">
                    Your name
                  </div>
                  <input
                    className="h-10 pl-3
                    w-full rounded-md shadow-sm border-[1px] border-outline-200
                    focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE]"
                  />
                  <div className="text-sm font-normal pt-[6px] mb-0 text-dim-500">
                    This will not be displayed publicly.
                  </div>
                </div>

                <div className="text-left">
                  <div className="mb-[4px] text-base font-medium pb-0 text-black-700">
                    Notify me
                  </div>
                  <div className="flex items-center border-[1px] border-outline-200 shadow-sm rounded-md h-10 w-full">
                    <div className="pl-3 pr-2">
                      <MailLogo></MailLogo>
                    </div>
                    <input
                      placeholder="yourname@example.com"
                      className="w-full outline-none"
                    ></input>
                  </div>

                  <div className="text-sm font-normal pt-[6px] mb-6 text-dim-500">
                    We'll send updates regarding your question.
                  </div>

                  <div className="flex border-[1px] border-[#D4C0FF] shadow-sm rounded-md w-full bg-[#F4EFFF]">
                    <div className="pl-3 pt-3 pr-[10px]">
                      <Info></Info>
                    </div>
                    <div className="items-center text-sm text-black-700 py-3 pr-3">
                      <div className="flex ">
                        <div className="">
                          We usually respond within&nbsp;
                          <span className="font-semibold text-[#702FF9]">
                            3 to 15 working days
                          </span>
                          , but it may take longer if your question requires
                          collaboration with other parties.
                        </div>
                      </div>
                      <div className="pt-3">
                        Once we've responded, the question and answer&nbsp;
                        <span className="font-semibold text-[#702FF9]">
                          may be published publicly on AskMyGov&nbsp;
                        </span>
                        to assist other rakyats.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-9">
                  <button
                    type="submit"
                    className="h-10 flex items-center text-white font-medium text-base border-[1px] border-[#702FF9]
                    shadow-button bg-gradient-to-b from-[#B379FF] to-[#702FF9] px-4 py-2 rounded-lg hover:cursor-pointer"
                  >
                    Submit
                  </button>
                  <div className="pt-3 text-dim-500 font-normal text-sm text-center">
                    By submitting, you agree to AskMyGov's&nbsp;
                    <span className="text-[#702FF9]">Terms of Use&nbsp;</span>
                    and&nbsp;
                    <span className="text-[#702FF9]">Privacy Policy</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
