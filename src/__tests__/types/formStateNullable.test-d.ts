import { expectTypeOf } from 'vitest';

import { createForm } from '../../index';

import type { AnyObject } from 'final-form';

const subscribeOn = ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'] as const;
const onSubmit = () => {};

test('with initial values', () => {
  const { $formState } = createForm({
    onSubmit,
    initialValues: { firstName: '' },
    subscribeOn,
  });

  expectTypeOf($formState.getState()).toEqualTypeOf<{
    active: 'firstName' | null;
    errors: AnyObject | null;
    modified: { [key: string]: boolean } | null;
    submitErrors: AnyObject | null;
    isValidationPaused: boolean;
    touched: { [key: string]: boolean } | null;
    visited: { [key: string]: boolean } | null;
  }>();
});

test('without initial values', () => {
  const { $formState } = createForm<{ lastName: number }, typeof subscribeOn>({
    onSubmit,
    subscribeOn,
  });

  expectTypeOf($formState.getState()).toEqualTypeOf<{
    active: 'lastName' | null;
    errors: AnyObject | null;
    modified: { [key: string]: boolean } | null;
    submitErrors: AnyObject | null;
    isValidationPaused: boolean;
    touched: { [key: string]: boolean } | null;
    visited: { [key: string]: boolean } | null;
  }>();
});
