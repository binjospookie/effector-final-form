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

## Base example

```ts
import { allSettled, fork } from 'effector';
import { createForm } from 'effector-final-form';
import { vi } from 'vitest';

vi.useFakeTimers();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('example', () => {
  test('', async () => {
    const { $formState, $fields, domain, api } = createForm({
      onSubmit: async (f) => {
        await sleep(1000);

        return f.firstName === 'Incorrect' ? { firstName: 'Submit Error' } : undefined;
      },
      validate: (f) => (f.firstName === '' ? { firstName: 'Can not be empty' } : undefined),
      initialValues: { firstName: '' },
      subscribeOn: ['values', 'errors', 'submitting', 'submitSucceeded', 'submitFailed', 'submitErrors'],
    });
    const scope = fork(domain);

    await allSettled(api.registerField, {
      scope,
      params: {
        name: 'firstName',
        subscribeOn: ['value', 'error', 'initial'],
      },
    });

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: '' } });
      expect(scope.getState($fields).firstName.error).toBe('Can not be empty');
      expect(scope.getState($fields).firstName.initial).toBe('');
      expect(scope.getState($fields).firstName.value).toBe('');

      expect(scope.getState($formState).errors).toStrictEqual({ firstName: 'Can not be empty' });
      expect(scope.getState($formState).values).toStrictEqual({ firstName: '' });
      expect(scope.getState($formState).submitting).toBe(false);
      expect(scope.getState($formState).submitSucceeded).toBe(false);
      expect(scope.getState($formState).submitFailed).toBe(false);
      expect(scope.getState($formState).submitErrors).toBe(null);
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Incorrect' } });
      expect(scope.getState($fields).firstName.error).toBe(undefined);
      expect(scope.getState($fields).firstName.value).toBe('Incorrect');
      expect(scope.getState($formState).errors).toStrictEqual({});
    }

    {
      const submitPromise = allSettled(api.submitFx, { scope });
      vi.runOnlyPendingTimers();

      expect(scope.getState($formState).submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'John' } });
      expect(scope.getState($fields).firstName.error).toBe(undefined);
      expect(scope.getState($fields).firstName.value).toBe('John');
      expect(scope.getState($formState).errors).toStrictEqual({});

      const submitPromise = allSettled(api.submitFx, { scope });
      vi.runOnlyPendingTimers();

      expect(scope.getState($formState).submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(true);
      expect($formState.getState().submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
    }
  });
```

## More examples

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/examples)
