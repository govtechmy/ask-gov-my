import React from 'react';

const acronymRegex = /^[A-Za-z]+$/;
const nameRegex = /^[a-zA-Z\s'-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;
const agencyNameRegex = /^[a-zA-Z0-9\s'&(),-]+$/;
const MIN_AGENCY_NAME_LENGTH = 2;
const MAX_AGENCY_NAME_LENGTH = 100;
const MIN_ACRONYM_LENGTH = 2;
const MAX_ACRONYM_LENGTH = 100;

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

//finalized agency name input validation En/Ms

export const handleAgencyNameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setNameError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value.trim();
  setName(value);

  if (value === '') {
    setNameError('Agency name is required');
  } else if (value.length < MIN_AGENCY_NAME_LENGTH) {
    setNameError(
      `Name must be at least ${MIN_AGENCY_NAME_LENGTH} characters long`,
    );
  } else if (value.length > MAX_AGENCY_NAME_LENGTH) {
    setNameError(`Name cannot exceed ${MAX_AGENCY_NAME_LENGTH} characters`);
  } else if (!agencyNameRegex.test(value)) {
    setNameError(
      "Name can only contain letters, numbers, spaces, and the following characters: ' & ( ) , -",
    );
  } else {
    setNameError(null);
  }
};

export const handleAgencyNameChangeMs = (
  e: React.ChangeEvent<HTMLInputElement>,
  setNameMs: React.Dispatch<React.SetStateAction<string>>,
  setNameMsError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value.trim();
  setNameMs(value);

  if (value === '') {
    setNameMsError('Agency name is required');
  } else if (value.length < MIN_AGENCY_NAME_LENGTH) {
    setNameMsError(
      `Name must be at least ${MIN_AGENCY_NAME_LENGTH} characters long`,
    );
  } else if (value.length > MAX_AGENCY_NAME_LENGTH) {
    setNameMsError(`Name cannot exceed ${MAX_AGENCY_NAME_LENGTH} characters`);
  } else if (!agencyNameRegex.test(value)) {
    setNameMsError(
      "Name can only contain letters, numbers, spaces, and the following characters: ' & ( ) , -",
    );
  } else {
    setNameMsError(null);
  }
};

export const handleAgencyAcronymChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setAcronym: React.Dispatch<React.SetStateAction<string>>,
  setAcronymError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value.trim();
  setAcronym(value);

  if (value === '') {
    setAcronymError('Agency acronym is required');
  } else if (value.length < MIN_ACRONYM_LENGTH) {
    setAcronymError(
      `Acronym must be at least ${MIN_ACRONYM_LENGTH} characters long`,
    );
  } else if (value.length > MAX_ACRONYM_LENGTH) {
    setAcronymError(`Acronym cannot exceed ${MAX_ACRONYM_LENGTH} characters`);
  } else if (!acronymRegex.test(value)) {
    setAcronymError('Acronym can only contain letters');
  } else {
    setAcronymError(null);
  }
};
