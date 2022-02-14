import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import NumberFormat from 'react-number-format';
import { Metadata } from '@gear-js/api';
import { ErrorBoundary } from 'react-error-boundary';
import { SendMessageToProgram } from 'services/ApiService';
import { InitialValues } from './types';
import { MessageModel } from 'types/program';
import { RootState } from 'store/reducers';
import { EventTypes } from 'types/alerts';
import { AddAlert } from 'store/actions/actions';
import { fileNameHandler, getPreformattedText, calculateGas } from 'helpers';
import MessageIllustration from 'assets/images/message.svg';
import { useApi } from 'hooks/useApi';
import { MetaParam, ParsedShape, parseMeta } from 'utils/meta-parser';
import { FormItem } from 'components/FormItem';
import { Switch } from 'common/components/Switch';
import { Schema } from './Schema';
import { LOCAL_STORAGE } from 'consts';

import './MessageForm.scss';
import { MetaErrorMessage } from './styles';

type Props = {
  programId: string;
  programName: string;
  meta?: Metadata;
  types: MetaParam | null;
};

export const MessageForm: VFC<Props> = ({ programId, programName, meta, types }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);
  const [metaForm, setMetaForm] = useState<ParsedShape | null>();
  const [isManualInput, setIsManualInput] = useState(Boolean(!types));

  const [initialValues] = useState<InitialValues>({
    gasLimit: 20000000,
    value: 0,
    payload: types ? getPreformattedText(types) : '',
    destination: programId,
    fields: {},
  });

  useEffect(() => {
    if (types) {
      const parsedMeta = parseMeta(types);
      setMetaForm(parsedMeta);
      setIsManualInput(false);
    }
  }, [types]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values, { resetForm }) => {
        if (currentAccount) {
          const pl = isManualInput ? values.payload : values.fields;

          const message: MessageModel = {
            gasLimit: values.gasLimit,
            destination: values.destination,
            value: values.value,
            payload: pl,
          };

          if (api) {
            SendMessageToProgram(api, currentAccount, message, dispatch, resetForm, meta);
          }
        } else {
          dispatch(AddAlert({ type: EventTypes.ERROR, message: `WALLET NOT CONNECTED` }));
        }
      }}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form id="message-form">
          <div className="message-form--wrapper">
            <div className="message-form--col">
              <div className="message-form--info">
                <span>File:</span>
                <span>{fileNameHandler(programName)}</span>
              </div>
              <div className="message-form--info">
                <label htmlFor="destination" className="message-form__field">
                  Destination:
                </label>
                <div className="message-form__field-wrapper">
                  <Field
                    id="destination"
                    name="destination"
                    type="text"
                    className={clsx('', errors.destination && touched.destination && 'message-form__input-error')}
                  />
                  {errors.destination && touched.destination ? (
                    <div className="message-form__error">{errors.destination}</div>
                  ) : null}
                </div>
              </div>

              <div className="message-form--info">
                <label htmlFor="payload" className="message-form__field">
                  Payload:
                </label>
                <div className="message-form__field-wrapper">
                  {metaForm && (
                    <Switch
                      onChange={() => {
                        setIsManualInput(!isManualInput);
                      }}
                      label="Manual input"
                      checked={isManualInput}
                    />
                  )}
                  <ErrorBoundary
                    fallback={
                      <>
                        <MetaErrorMessage>
                          Sorry, something went wrong. Unfortunately we can't parse metadata, you could use manual
                          input.
                        </MetaErrorMessage>
                        <br />
                      </>
                    }
                    onError={(error) => {
                      setIsManualInput(true);
                      console.error(error);
                    }}
                  >
                    {!isManualInput && metaForm ? <FormItem data={metaForm} /> : <></>}
                  </ErrorBoundary>
                  {!metaForm && <MetaErrorMessage>Can't parse metadata, try to use manual input.</MetaErrorMessage>}
                  {isManualInput && (
                    <div>
                      <p className="message-form__manual-input-notice">JSON or hex</p>
                      <Field
                        id="payload"
                        name="payload"
                        as="textarea"
                        type="text"
                        className={clsx('', errors.payload && touched.payload && 'message-form__input-error')}
                        placeholder="// Enter your payload here"
                        rows={15}
                      />
                      {errors.payload && touched.payload ? (
                        <div className="message-form__error">{errors.payload}</div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="message-form--info">
                <label htmlFor="gasLimit" className="message-form__field">
                  Gas limit:
                </label>
                <div className="message-form__field-wrapper">
                  <NumberFormat
                    name="gasLimit"
                    placeholder="20,000,000"
                    value={values.gasLimit}
                    thousandSeparator
                    allowNegative={false}
                    className={clsx('', errors.gasLimit && touched.gasLimit && 'message-form__input-error')}
                    onValueChange={(val) => {
                      const { floatValue } = val;
                      setFieldValue('gasLimit', floatValue);
                    }}
                  />
                  {errors.gasLimit && touched.gasLimit ? (
                    <div className="message-form__error">{errors.gasLimit}</div>
                  ) : null}
                </div>
              </div>

              <div className="message-form--info">
                <label htmlFor="value" className="message-form__field">
                  Value:
                </label>
                <div className="message-form__field-wrapper">
                  <Field
                    id="value"
                    name="value"
                    placeholder="20000"
                    type="number"
                    className={clsx('', errors.value && touched.value && 'message-form__input-error')}
                  />
                  {errors.value && touched.value ? <div className="message-form__error">{errors.value}</div> : null}
                </div>
              </div>
              <div className="message-form--btns">
                <>
                  <button
                    className="message-form__button"
                    type="button"
                    onClick={() => {
                      calculateGas(
                        'handle',
                        api,
                        isManualInput,
                        values,
                        setFieldValue,
                        dispatch,
                        meta,
                        null,
                        programId
                      );
                    }}
                  >
                    Calculate Gas
                  </button>
                  <button className="message-form__button" type="submit">
                    <>
                      <img src={MessageIllustration} alt="message" />
                      Send message
                    </>
                  </button>
                </>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
