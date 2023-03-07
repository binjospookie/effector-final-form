# effector-final-form

☄️ Effector bindings for Final Form 🏁 

[Demo](https://stackblitz.com/edit/react-ts-xjh6yd?file=index.tsx)

Forms values and validation rules are part of the business logic. This means that you need to be able to work with them without being bound to the UI-framework.

The goal of this project is to combine [Final Form](https://final-form.org/) and [Effector](https://effector.dev/) to achieve the goal described above.

## Installation

```bash
yarn add effector-final-form
# or
npm add effector-final-form
# or
pnpm add effector-final-form
```

## Usage

Just import from the root module:

```ts
import { createForm } from 'effector-final-form';
```

## API

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/api)

## Differences from Final Form

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/differences)

## Limitations

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/limitations)

## Base example

```ts
import { vi } from 'vitest';
import waitForExpect from 'wait-for-expect';

// import { createForm } from 'effector-final-form';
import { createForm } from '../../index';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('example', () => {
  test('', async () => {
    const { $formState, $fields, api } = createForm({
      onSubmit: async (f) => {
        await sleep(1000);

        return f.firstName === 'Incorrect' ? { firstName: 'Submit Error' } : undefined;
      },
      validate: (f) => (f.firstName === '' ? { firstName: 'Can not be empty' } : undefined),
      initialValues: { firstName: '' },
      subscribeOn: ['values', 'errors', 'submitting', 'submitSucceeded', 'submitFailed', 'submitErrors'],
    });

    await api.registerField({
      name: 'firstName',
      subscribeOn: ['value', 'error', 'initial'],
    });

    api.changeFx({ name: 'firstName', value: '' });

    await waitForExpect(() => {
      expect($fields.getState().firstName.error).toBe('Can not be empty');
    });
    expect($fields.getState().firstName.initial).toBe('');
    expect($fields.getState().firstName.value).toBe('');

    expect($formState.getState().errors).toStrictEqual({ firstName: 'Can not be empty' });
    expect($formState.getState().values).toStrictEqual({ firstName: '' });
    expect($formState.getState().submitting).toBe(false);
    expect($formState.getState().submitSucceeded).toBe(false);
    expect($formState.getState().submitFailed).toBe(false);
    expect($formState.getState().submitErrors).toBe(null);

    {
      await api.changeFx({ name: 'firstName', value: 'Incorrect' });

      await waitForExpect(() => {
        expect($fields.getState().firstName.error).toBe(undefined);
        expect($fields.getState().firstName.value).toBe('Incorrect');
        expect($formState.getState().errors).toStrictEqual({});
      });
    }

    {
      const submitPromise = api.submitFx();

      expect($formState.getState().submitting).toBe(true);

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
    }

    {
      await api.changeFx({ name: 'firstName', value: 'John' });

      expect($fields.getState().firstName.error).toBe(undefined);
      expect($fields.getState().firstName.value).toBe('John');
      expect($formState.getState().errors).toStrictEqual({});

      const submitPromise = api.submitFx();

      await waitForExpect(() => {
        expect($formState.getState().submitting).toBe(true);
      });

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      await waitForExpect(() => {
        expect($formState.getState().submitting).toBe(false);
      });
      expect($formState.getState().submitSucceeded).toBe(true);
      expect($formState.getState().submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
    }
  });
});
```

## More examples

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/examples)
