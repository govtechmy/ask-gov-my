'use client';

import { submitAnswer, saveQuestionAsDraft } from '@/actions/userServices';
import { Question } from '@/types/types';
import Close from '@/icons/close';
import IconQuestionSmile2 from '@/icons/iconquestionsmile2';
import DateComponent from '../common/Date';
import LineVerticalForSmile from '@/icons/lineverticalforsmile';
import AgencyLogoImporter from '../common/AgencyLogoImporter';
import UploadIcon from '@/icons/upload';
import AttachmentDownload from './AttachmentDownload';
import AttachmentUpload from './AttachmentUpload';
import React, { useEffect, useRef, useState } from 'react';
import TipTap from '../Editor/TipTap';
import { fetchFileSizes, formatDate } from '@/actions/utils';
import { getPresignUrl, uploadFile } from '@/lib/uploadUtils';
import { ToUploadItem, UploadItem } from '@/lib/types/uploadFile';

interface AnswerQuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

const AnswerQuestionModal = ({
  question,
  isOpen,
  onClose,
}: AnswerQuestionModalProps) => {
  const [answer, setAnswer] = useState(question.answer || '');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadItem, setUploadItem] = useState<UploadItem[] | []>([]);
  const questionTextRef = useRef<HTMLDivElement>(null);
  const svgHeight = 15;

  // logo url for sample
  const logo_url =
    'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/1721638339654-images.jpeg';
  // TODO: sample logo url should be serve as static file in Next instead of through s3

  useEffect(() => {
    setAnswer(question.answer || '');
  }, [question.answer]);

  useEffect(() => {
    const fetchSizes = async () => {
      if (isOpen) {
        try {
          if (question.attachments && question.attachments.length > 0) {
            const fileSize = await fetchFileSizes(question.attachments);
            const fileData = fileSize.map(file => ({
              file: null,
              fileName: file.fileName,
              fileSize: file.fileSize,
              isUploaded: true,
            }));
            setUploadItem(fileData);
          }
        } catch (error) {
          console.log('error on fileSize', error);
        }
      }
      fetchSizes();
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const newUploadItems: UploadItem[] = files.map(file => {
      let renamedFile = `${Date.now()}-${file.name}`;
      return {
        file: file,
        fileName: renamedFile,
        fileSize: file.size,
        isUploaded: false,
      };
    });
    setUploadItem((prev: UploadItem[]) => [...prev, ...newUploadItems]);
  };

  const handleRemoveAttachment = (fileName: string) => {
    setUploadItem(uploadItem =>
      uploadItem.filter(item => item.fileName !== fileName),
    );
  };

  const handleRemoveUploadedAttachment = (fileName: string) => {
    setUploadItem(uploadItem =>
      uploadItem.filter(item => item.fileName !== fileName),
    );
  };

  const handleSubmit = async () => {
    try {
      const filesToUpload = [...uploadItem];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        if (file.file && !file.isUploaded) {
          const uploadSuccess = await uploadFile(file.file, file.fileName);
          if (uploadSuccess) {
            filesToUpload[i] = { ...file, isUploaded: true, file: null };
          }
        }
      }
      setUploadItem(filesToUpload);
      const attachmentArr = filesToUpload.map(file => file.fileName);
      const res = await submitAnswer(question.id, answer, attachmentArr);
      setSuccess('Answer submitted successfully');
      setError(null);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSuccess(null);
    } finally {
      setSuccess(null);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const filesToUpload = [...uploadItem];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        if (file.file && !file.isUploaded) {
          const uploadSuccess = await uploadFile(file.file, file.fileName);
          if (uploadSuccess) {
            filesToUpload[i] = { ...file, isUploaded: true, file: null };
          }
        }
      }
      setUploadItem(filesToUpload);
      const attachmentArr = filesToUpload.map(file => file.fileName);

      await saveQuestionAsDraft(question.id, answer, attachmentArr);
      setSuccess('Draft saved successfully');
      setError(null);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSuccess(null);
    } finally {
      setSuccess(null);
    }
  };

  const handleCancel = () => {
    const files = uploadItem.filter(file => file.isUploaded);
    setUploadItem(files);
  };

  if (!isOpen) return null;

  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg w-[720px] h-[700px] relative p-6 flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-[14px] right-[14px] hover:cursor-pointer rounded-lg shadow-button h-8 w-8 flex items-center justify-center border-[1px] border-outline-200"
        >
          <Close className="stroke-black-900" />
        </button>

        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="max-h-[180px] min-h-[80px] overflow-scroll">
            <div className="text-sm text-black-700 font-medium flex">
              <div className="pr-1">Question posted</div>
              <div className="pr-2">
                <DateComponent date={formatDate(question.date)} locale={''} />
              </div>
              <div className="bg-washed-100 h-[22px] px-2 rounded-full text-xs leading-[18px] items-center flex text-dim-500">
                ID: {question.id}
              </div>
            </div>

            <div className="flex pt-[9px]">
              <div className="pr-3 flex flex-col items-center">
                <IconQuestionSmile2 />
                <div className="h-2"></div>
                <LineVerticalForSmile height={svgHeight} />
              </div>

              <div
                className="text-mydstextbrand-600 text-base font-medium"
                ref={questionTextRef}
              >
                {question.question}
              </div>
            </div>
          </div>

          <div className="flex-grow mt-[9px] overflow-y-scroll overflow-x-hidden">
            <div className="flex">
              <div className="flex">
                <div className="flex w-6 h-6 relative flex-shrink-0">
                  <AgencyLogoImporter
                    currentAgency={{}}
                    logo_url={logo_url}
                  ></AgencyLogoImporter>
                </div>
              </div>
              <div className="pl-3 flex flex-col flex-grow">
                <TipTap
                  editorText={answer}
                  setEditorText={setAnswer}
                  className="flex flex-col divide-y rounded-lg w-[616px] h-[300px] border-[1px] shadow-button overflow-y-auto relative"
                />
                <div className="w-[616px] border-[1px] border-outline-200 rounded-lg my-3 items-center flex-shrink-0 shadow-button">
                  <div className="h-[68px] w-full m-4 items-center flex">
                    <div className="text-dim-500 w-[431px] h-[68px] text-sm flex-shrink-0 ">
                      <div className="h-6 text-black-700 text-base font-medium">
                        Supporting attachments
                      </div>
                      <div>Supported formats: JPG, PNG, PDF</div>
                      <div> Maximum size: 25MB per file</div>
                    </div>
                    <div
                      className="h-10 w-[141px] border-[1px] border-outline-200 rounded-lg items-center justify-between 
                      flex px-3 shadow-button ml-3 cursor-pointer"
                      onClick={() =>
                        document.getElementById('hidden-file-input')?.click()
                      }
                    >
                      <UploadIcon className="stroke-black-700" />
                      <div className="text-black-700">Upload files</div>
                      <input
                        type="file"
                        id="hidden-file-input"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div>
                    {uploadItem.filter(item => !item.isUploaded).length > 0 && (
                      <div className="m-4">
                        <AttachmentUpload
                          attachments={
                            uploadItem.filter(
                              // pass in the attachments that is not yet uploaded
                              item => !item.isUploaded,
                            ) as ToUploadItem[]
                          }
                          handleRemoveAttachment={handleRemoveAttachment}
                        />
                      </div>
                    )}

                    {uploadItem.filter(item => item.isUploaded).length > 0 && (
                      <>
                        <div className="border-b-[1px] border-outline-200 m-4"></div>
                        <div className="text-sm text-dim-500 font-normal ml-4 mt-4">
                          Previously Uploaded
                        </div>
                        <div className="m-4">
                          <AttachmentDownload
                            attachments={uploadItem.filter(
                              item => item.isUploaded,
                            )}
                            handleRemoveUploadedAttachment={
                              handleRemoveUploadedAttachment
                            }
                          />
                        </div>
                      </>
                    )}

                    {uploadItem.filter(item => item.isUploaded).length == 0 && (
                      <div className="m-4"></div>
                    )}
                  </div>
                </div>
                <div className="w-[616px] h-[86px]">
                  <div className="text-black-700 text-base font-medium mb-[6px]">
                    Topics
                  </div>
                  <div className="w-[616px] h-10 border-[1px] border-outline-200 rounded-lg items-center pl-2 flex text-dim-500 text-base shadow-button">
                    Add or search for existing topic
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 bg-white pt-4 border-t-[1px] border-outline-200 flex justify-end items-center">
          <button
            className="mr-3 h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-lg 
              text-base items-center justify-center flex hover:cursor-pointer"
            onClick={() => {
              handleCancel();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="mr-3 h-[44px] w-[125px] border-[1px] border-outline-200 shadow-button rounded-lg 
              text-base items-center justify-center flex hover:cursor-pointer"
            onClick={handleSaveDraft}
          >
            Save as draft
          </button>
          <button
            className="w-[117px] h-[44px] rounded-lg items-center justify-center flex text-base font-normal text-white-forcewhite 
             bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF]
              border-[1px] border-[#702FF9] hover:cursor-pointer shadow-button"
            onClick={handleSubmit}
          >
            Publish now
          </button>
        </div>

        {success && (
          <div className="mt-2 text-[#15803D] dark:text-[#16A34A]">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerQuestionModal;
