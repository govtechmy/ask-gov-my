import React from 'react';
import { z } from 'zod';

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

// Zod schemas
export const agencyNameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters long' })
  .max(100, { message: 'Name cannot exceed 100 characters' })
  .regex(/^[a-zA-Z0-9\s'&(),-]+$/, {
    message:
      "Name can only contain letters, numbers, spaces, and the following characters: ' & ( ) , -",
  });

export const acronymSchema = z
  .string()
  .min(2, { message: 'Acronym must be at least 2 characters long' })
  .max(100, { message: 'Acronym cannot exceed 100 characters' })
  .regex(/^[A-Za-z]+$/, {
    message: 'Acronym can only contain letters',
  });

// Helper function for validation
export const validateInput = (schema: z.ZodType<any, any>, value: string) => {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return 'An unexpected error occurred';
  }
};

// Input handlers
export const handleAgencyNameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setNameError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value;
  setName(value);
  setNameError(validateInput(agencyNameSchema, value));
};

export const handleAgencyNameChangeMs = (
  e: React.ChangeEvent<HTMLInputElement>,
  setNameMs: React.Dispatch<React.SetStateAction<string>>,
  setNameMsError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value;
  setNameMs(value);
  setNameMsError(validateInput(agencyNameSchema, value));
};

export const handleAgencyAcronymChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setAcronym: React.Dispatch<React.SetStateAction<string>>,
  setAcronymError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const value = e.target.value.trim();
  setAcronym(value);
  setAcronymError(validateInput(acronymSchema, value));
};
