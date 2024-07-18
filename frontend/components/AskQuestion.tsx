'use client';
import React, { useState } from 'react';
import QuestionCircle from '@/icons/questioncircle';
import PlusIcon from '@/icons/plusicon';
import Close from '@/icons/close';
import QuestionMarkWithBox from '@/icons/questionmarkwithbox';
import MailLogo from '@/icons/maillogo';
import Info from '@/icons/info';
import TickCheckCircle from '@/icons/tickcheckcircle';
import { submitQuestion } from '@/actions/questionServices';
import { useTranslations } from 'next-intl';

const AskQuestion = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenSubmit, setIsModalOpenSubmit] = useState(false);
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const t = useTranslations('Askquestions');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question && email) {
      try {
        await submitQuestion({ question, email });
        console.log('Question submitted:', question, email);
        handleModalCloseOpenModalSubmit();
      } catch (error) {
        console.error('Error submitting question:', error);
      }
    } else {
      console.warn('Form is incomplete');
    }
  };

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleModalDisplay = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalDisplaySubmit = () => {
    setIsModalOpenSubmit(true);
  };

  const closeModalSubmit = () => {
    setIsModalOpenSubmit(false);
  };

  const handleModalCloseOpenModalSubmit = () => {
    closeModal();
    handleModalDisplaySubmit();
  };

  return (
    <div className="items-center px-4 py-2 text-center border-outline-200 h-[60px] w-[788px]">
      <div className="text-sm items-center flex text-primary-500 justify-center h-full">
        {isClicked ? (
          <div className="h-10 flex items-center text-white-forcewhite font-medium text-base border-[1px] border-[#702FF9] shadow-button bg-gradient-to-b from-[#B379FF] to-[#702FF9] px-4 py-2 rounded-lg hover:cursor-pointer">
            <div className="pr-2">
              <PlusIcon className="stroke-[#FFFFFF] dark:stroke-[#FFFFFF]"></PlusIcon>
            </div>
            <div onClick={handleModalDisplay}>{t('ask_new_question')}</div>
          </div>
        ) : (
          <div className="h-10 flex items-center text-[#702FF9] dark:text-[#9E70FF] font-medium text-base border-[1px] border-[#D4C0FF] dark:border-[#4F1FB4] shadow-button bg-white px-4 py-2 rounded-lg hover:cursor-pointer">
            <div className="pr-2">
              <QuestionCircle />
            </div>
            <div onClick={handleClick}>{t('cant_find')}</div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-card max-h-[750px] w-[600px] border-outline-200 border-[1px]">
            <div className="p-[14px]">
              <div className="flex justify-end">
                <div
                  onClick={closeModal}
                  className="hover:cursor-pointer rounded-lg shadow-button h-8 w-8 flex items-center justify-center border-[1px] border-outline-200"
                >
                  <Close className="stroke-black-900" />
                </div>
              </div>
              <div className="text-lg font-semibold pt-[18px] px-[18px] pb-[24px] text-left -mt-8 flex items-center text-black-900">
                <div className="pr-3">
                  <QuestionMarkWithBox></QuestionMarkWithBox>
                </div>
                <div>{t('ask_new_question')}</div>
              </div>
              <form className="px-[18px]" onSubmit={handleSubmit}>
                <div className="text-left">
                  <div className="text-base font-medium pb-0 mb-0 text-black-700">
                    {t('your_question')}
                  </div>
                  <textarea
                    placeholder={t('type_your_question')}
                    className="mt-[6px] h-[120px] text-left pl-3 pt-2 w-full rounded-lg shadow-sm border-[1px] border-outline-200 focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE] placeholder:text-black-900 placeholder:font-normal placeholder:text-base"
                    name="question"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mt-4 mb-5"></div>

                <div className="text-left">
                  <div className="mb-[4px] text-base font-medium pb-0 text-black-700">
                    {t('notify_me')}
                  </div>
                  <div className="flex items-center border-[1px] border-outline-200 shadow-sm rounded-md h-10 w-full">
                    <div className="pl-3 pr-2">
                      <MailLogo></MailLogo>
                    </div>
                    <input
                      placeholder={t('your_email')}
                      className="w-full outline-none"
                      name="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    ></input>
                  </div>

                  <div className="text-sm font-normal pt-[6px] mb-6 text-dim-500">
                    {t('email_updates')}
                  </div>

                  <div className="flex border-[1px] border-askmygovbrand-200 shadow-sm rounded-md w-full bg-askmygovbrand-50">
                    <div className="pl-3 pt-3 pr-[10px]">
                      <Info className="stroke-askmygovbrand-600"></Info>
                    </div>
                    <div className="items-center text-sm font-normal text-black-700 py-3 pr-3">
                      <div>
                        <div>
                          {t('response_time_p1')}
                          <span className="text-askmygovbrand-600 font-semibold">
                            {' '}
                            {t('response_time_p2')}{' '}
                          </span>
                          {t('response_time_p3')}
                        </div>

                        <div className="pt-3">
                          {t('response_public_p1')}
                          <span className="text-askmygovbrand-600 font-semibold">
                            {' '}
                            {t('response_public_p2')}{' '}
                          </span>
                          {t('response_public_p3')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center pt-9 pb-[18px]">
                  <button
                    type="submit"
                    className="h-10 flex items-center font-medium text-white-forcewhite text-base border-[1px] border-[#702FF9] shadow-button bg-gradient-to-b from-[#B379FF] to-[#702FF9] px-4 py-2 rounded-lg hover:cursor-pointer"
                    onClick={handleSubmit}
                  >
                    {t('submit')}
                  </button>
                  <div className="pt-3 text-dim-500 font-normal text-sm text-center">
                    {t('terms')}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isModalOpenSubmit && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-card h-[248px] w-[400px] border-outline-200 border-[1px]">
            <div className="p-6">
              <div className="pb-4">
                <TickCheckCircle className="stroke-[#15803D]"></TickCheckCircle>
              </div>
              <div className="pb-6 text-left">
                <div className="text-black-900 font-semibold text-lg pb-2">
                  {t('submission_received')}
                </div>
                <div className="text-black-700 font-normal text-sm">
                  {t('submission_received_detail')}
                </div>
              </div>
              <div
                onClick={closeModalSubmit}
                className="bg-white rounded-lg shadow-button h-[44px] w-[352px] border-outline-200 border-[1px] hover:cursor-pointer flex items-center justify-center"
              >
                <Close className="stroke-black-700"></Close>
                <div className="ml-2">{t('close')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
