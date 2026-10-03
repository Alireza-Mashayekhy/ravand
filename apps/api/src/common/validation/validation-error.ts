import { ValidationError } from 'class-validator';

export interface ValidationErrorDetail {
  field: string;
  messages: string[];
}

export function formatValidationErrors(errors: ValidationError[]): ValidationErrorDetail[] {
  return errors.flatMap((error) => {
    const messages = error.constraints ? Object.values(error.constraints) : [];

    return [
      {
        field: error.property,
        messages,
      },
    ];
  });
}
