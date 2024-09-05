import { z } from 'zod';

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
