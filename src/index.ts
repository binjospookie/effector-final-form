import { createForm } from 'createForm';

const { $formState, ffForm } = createForm({
  onSubmit: () => {},
  initialValues: { a: '1' },
});

console.log($formState.getState().initialValues);
