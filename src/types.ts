type FieldId = string;
type FieldValue = string;

type Field = {
  readonly id: FieldId;
  readonly value?: FieldValue;
};

export type { Field, FieldId, FieldValue };
