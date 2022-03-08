import * as yup from 'yup';

export const Schema = yup.object().shape({
  payload: yup.string(),
  gasLimit: yup.number().min(0, 'Initial value should be more than 0'),
  value: yup.number().required('This field is required').min(0, 'Initial value should be more than 0'),
});
