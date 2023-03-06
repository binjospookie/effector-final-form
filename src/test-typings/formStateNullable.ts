import { expectType } from 'tsd';

import { createForm } from '../index';

import type { AnyObject } from 'final-form';

const subscribeOn = ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'] as const;
const onSubmit = () => {};

{
  const { $formState } = createForm({
    onSubmit,
    initialValues: { firstName: '' },
    subscribeOn,
  });

  expectType<{
    active: 'firstName' | null;
    errors: AnyObject | null;
    modified: { [key: string]: boolean } | null;
    submitErrors: AnyObject | null;
    isValidationPaused: boolean;
    touched: { [key: string]: boolean } | null;
    visited: { [key: string]: boolean } | null;
  }>($formState.getState());
}

{
  const { $formState } = createForm<{ lastName: number }, typeof subscribeOn>({
    onSubmit,
    subscribeOn,
  });

  expectType<{
    active: 'lastName' | null;
    errors: AnyObject | null;
    modified: { [key: string]: boolean } | null;
    submitErrors: AnyObject | null;
    isValidationPaused: boolean;
    touched: { [key: string]: boolean } | null;
    visited: { [key: string]: boolean } | null;
  }>($formState.getState());
}
