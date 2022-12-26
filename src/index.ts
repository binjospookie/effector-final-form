// // todo: form meta
// // todo: fields validation
// // todo: form validation
// // todo: form sending

// import { combine } from 'effector';
// import { every } from 'patronum';
// import { mergeRight } from 'rambda';

// import { createFormField } from 'field';

// import type { Field } from 'field';

// export const createForm = (fields: Field[]) => {
//   const fieldsList = fields.map((x) => createFormField(x).$field);

//   // true if the form values are different from the values it was initialized with.
//   const $dirty = every({ stores: fieldsList, predicate: (f) => f.meta.dirty });

//   const $errorTexts = combine(fieldsList, (list) =>
//     list.reduce((acc, f) => mergeRight(acc, { [f.name]: f.meta.errorText }), {}),
//   );

//   // an object full of booleans, with a boolean value for each field name denoting whether that field is modified or not.
//   const $modified = combine(fieldsList, (list) =>
//     list.reduce((acc, f) => mergeRight(acc, { [f.name]: f.meta.modified }), {}),
//   );

//   // true if neither the form nor any of its fields has a validation or submission error.
//   const $valid = every({ stores: fieldsList, predicate: (f) => f.meta.valid });

//   return {
//     $dirty,
//     $errorTexts,
//     $modified,
//     $valid,
//   };
// };

export const T = () => true;
