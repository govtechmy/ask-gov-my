import React from 'react';

const nameRegex = /^[a-zA-Z\s'-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

//finalized name input validation
export const handleNameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setNameError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value.trim();
  setName(value);

  if (value === '') {
    setNameError('Name is required');
  } else if (value.length < MIN_NAME_LENGTH) {
    setNameError(`Name must be at least ${MIN_NAME_LENGTH} characters long`);
  } else if (value.length > MAX_NAME_LENGTH) {
    setNameError(`Name cannot exceed ${MAX_NAME_LENGTH} characters`);
  } else if (!nameRegex.test(value)) {
    setNameError(
      'Name can only contain letters, spaces, hyphens, and apostrophes',
    );
  } else {
    setNameError(null);
  }
};

//finalized email input validation
export const handleEmailChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setEmailError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value.trim();
  setEmail(value);

  if (value === '') {
    setEmailError('Email cannot be empty');
  } else if (!emailRegex.test(value)) {
    setEmailError('Please enter a valid email address');
  } else {
    const domain = value.split('@')[1];
    if (domain !== 'gov.my') {
      setEmailError('Email must end with @gov.my');
    } else {
      setEmailError(null);
    }
  }
};
