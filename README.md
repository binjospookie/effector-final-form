# eff-form

[sandbox](https://stackblitz.com/edit/react-ts-xjh6yd?file=effector-final-form%2FcreateFields.ts)

## Limitations

- can't achieve scope because of subscribe on form
- not allowed to create dynamic subscription (only `subscribeOn`)
- no `form.batching` :c

## Differences

- `isValidationPaused` is store
- `registerField` signature
- `undefined` replaced with `null` in `$formState`

- no `form.getFieldState`
- no `form.getRegisteredFields`
- no `form.getState`
- no `form.subscribe`
