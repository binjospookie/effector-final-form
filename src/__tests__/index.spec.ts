import { allSettled, fork } from 'effector';
import { createForm } from '../index';

it('', async () => {
  const scope = fork();
  // <{ a: string }, ['active', 'dirty']>
  const { $formState, api, $fields } = createForm({
    onSubmit: () => {},
    validate: (f) => ({
      ...(f.a === '5' ? null : { a: 'Required' }),
    }),
    initialValues: { a: '1' },
    destroyOnUnregister: true,
    subscribeOn: ['visited', 'active'],
  });

  $formState.map((x) => x.active);

  await allSettled(api.registerField, {
    scope,
    params: { name: 'a', config: { initialValue: '4' } },
  });

  await allSettled(api.focusFx, { scope, params: 'a' });
  await allSettled(api.blurFx, { scope, params: 'a' });
  await allSettled(api.focusFx, { scope, params: 'a' });
  await allSettled(api.changeFx, { scope, params: { name: 'a', value: '5' } });
  await allSettled(api.changeFx, { scope, params: { name: 'a', value: '6' } });

  await allSettled(api.initialize, { scope, params: { a: '1' } });

  expect(1).toBe(1);
});
