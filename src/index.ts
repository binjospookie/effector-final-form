import { allSettled, clearNode, createApi, createDomain, createEffect, createEvent, fork, launch } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

const createFormApi = (form: ReturnType<typeof ffCreateForm>) => {
  const change = createEffect<{ name: string; value: string }, void>((x) => form.change(x.name, x.value));

  return {
    change,
  };
};

const createForm = () => {
  const domain = createDomain();

  const form = ffCreateForm({ onSubmit: console.log });

  form.registerField('username', () => {}, { value: true });

  const $values = domain.store({});

  // https://effector.dev/docs/api/effector/scopebind/
  form.subscribe(
    (x) => {
      launch($values, x.values);
    },
    { values: true },
  );

  const api = createFormApi(form);

  return { $values, api, domain };
};

const { $values, api, domain } = createForm();
const { $values: $2, api: api2 } = createForm();

$values.watch((x) => console.log(`$1 ${JSON.stringify(x, undefined)}`));
$2.watch((x) => console.log(`$2 ${JSON.stringify(x, undefined)}`));
api.change({ name: 'username', value: 'biba' });
api.change({ name: 'username', value: 'boba' });

api2.change({ name: 'lol', value: 'kek' });

clearNode(domain, { deep: true });

console.log('clear domain');

api2.change({ name: 'should', value: 'work' });

const scope = fork();

await allSettled(api2.change, { scope, params: { name: 'scope', value: 'works' } });

console.log(scope.getState($2), '$2 with scope');
