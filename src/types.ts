type FieldId = string;
type FieldValue = string;

type FailedValidation = {
  isValid: false;
  errorText: string;
};
type SuccessedValidation = {
  isValid: true;
};

type ValidationResult = FailedValidation | SuccessedValidation;

type Validator = (value: FieldValue) => ValidationResult;

type Field = {
  id: FieldId;
  initialValue?: FieldValue;
  validator: Validator;
};

export type { Field, FieldId, FieldValue, ValidationResult, FailedValidation };
