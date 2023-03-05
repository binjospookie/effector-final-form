# eff-form

[sandbox](https://stackblitz.com/edit/react-ts-xjh6yd?file=effector-final-form%2FcreateFields.ts)

## Limitations

- can't achieve scope because of subscribe on form
- not allowed to create dynamic subscription (only `subscribeOn`)

## Differences

- `isValidationPaused` is store
- `registerField` signature

- no `form.getFieldState`
- no `form.getRegisteredFields`
- no `form.batching` :c
- no `form.getState`
- no `form.subscribe`
