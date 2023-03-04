import { allSettled, fork } from 'effector';
import { createForm } from '../index';

it('', async () => {
  const scope = fork();
  const { $formState, api, $fields } = createForm<{ a: string }>({
    onSubmit: () => {},
    validate: (f) => ({
      ...(f.a === '5' ? null : { a: 'Required' }),
    }),
  });

  await allSettled(api.registerField, {
    scope,
    params: { name: 'a', config: { initialValue: '4' } },
  });

  await allSettled(api.focusFx, { scope, params: 'a' });
  await allSettled(api.blurFx, { scope, params: 'a' });
  await allSettled(api.focusFx, { scope, params: 'a' });
  await allSettled(api.changeFx, { scope, params: { name: 'a', value: '5' } });
  await allSettled(api.changeFx, { scope, params: { name: 'a', value: '6' } });
  await allSettled(api.blurFx, { scope, params: 'a' });

  console.log(scope.getState($fields));

  expect(1).toBe(1);
});
