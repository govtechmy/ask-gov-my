import React from 'react';

const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@gov\.my$/;

export const handleNameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setNameError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value;
  setName(value);
  if (!nameRegex.test(value)) {
    setNameError('Name cannot contain special symbols or numbers');
  } else {
    setNameError(null);
  }
};

export const handleEmailChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setEmailError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value;
  setEmail(value);
  if (!emailRegex.test(value)) {
    setEmailError('Email must end with @gov.my');
  } else {
    setEmailError(null);
  }
};
