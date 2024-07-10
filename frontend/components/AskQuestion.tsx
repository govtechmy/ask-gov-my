'use client';
import React, { useState } from 'react';
import QuestionCircle from '@/icons/questioncircle';
import PlusIcon from '@/icons/plusicon';

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
          <div className="h-10 flex items-center text-white font-medium text-base border-[1px] border-[#702FF9] shadow-button bg-gradient-to-b from-[#B379FF] to-[#702FF9] px-4 py-2 rounded-lg">
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <div
              onClick={closeModal}
              className="bg-black-800 rounded-lg shadow-button"
            >
              X
            </div>
            <h2 className="text-xl font-semibold mb-4">Ask a new question</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="question"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your question
                </label>
                <textarea
                  id="question"
                  name="question"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="notify"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notify me
                </label>
                <input
                  type="email"
                  id="notify"
                  name="notify"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="text-xs text-gray-500 mb-4">
                We usually respond within 3 to 15 working days, but it may take
                longer if your question requires collaboration with other
                parties. Once we've responded, the question and answer may be
                published publicly on AskGovMY to assist other Rakyat.
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
