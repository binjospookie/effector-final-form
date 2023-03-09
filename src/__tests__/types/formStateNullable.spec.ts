import { expectTypeOf } from 'vitest';

import { createForm } from '../../index';

import type { AnyObject } from 'final-form';

const subscribeOn = ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'] as const;
const onSubmit = () => {};

test('base', () => {
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
