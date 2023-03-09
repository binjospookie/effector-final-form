# effector-final-form

☄️ Effector bindings for Final Form 🏁 

[Demo](https://stackblitz.com/edit/react-ts-xjh6yd?file=index.tsx)

Forms values and validation rules are part of the business logic. This means that you need to be able to work with them without being bound to the UI-framework.

The goal of this project is to combine [Final Form](https://final-form.org/) and [Effector](https://effector.dev/) to achieve the above.

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

## Base example

```ts
import { createForm } from 'effector-final-form';

const form = createForm<{ login: string; password: string }>({
  onSubmit: console.log,
  subscribeOn: ['submitSucceeded', 'submitting'],
});

const loginField = form.api.registerField<string>({
  name: 'login',
  subscribeOn: ['value', 'error', 'validating'],
  validate: (x) => (x?.length >= 3 ? undefined : 'Incorrect login'),
});

loginField.$state.watch(console.log);
// {value: undefined, error: undefined, validating: true}
// {name: "login", error: "Incorrect login", value: undefined, validating: false}

const passwordField = form.api.registerField<string>({
  name: 'password',
  subscribeOn: ['value', 'error', 'validating'],
  validate: (x) => (x?.length >= 3 ? undefined : 'Incorrect password'),
});

passwordField.$state.watch(console.log);
// {value: undefined, error: undefined, validating: true}
// {name: "password", error: "Incorrect password", value: undefined, validating: false}

loginField.api.changeFx('John');
// {name: "login", error: undefined, value: "John", validating: true}
// {name: "login", error: undefined, value: "John", validating: false}
passwordField.api.changeFx('secret');
// {name: "password", error: undefined, value: "secret", validating: true}
// {name: "password", error: undefined, value: "secret", validating: false}
form.api.submitFx();
// {login: "John", password: "secret"}
```

[Try it](https://stackblitz.com/edit/typescript-5fydjc?file=index.ts)

## API

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/api)

## Differences from Final Form

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/differences)

## Limitations

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/limitations)

## More examples

[Documentation link](https://binjospookie.github.io/effector-final-form/docs/examples)
