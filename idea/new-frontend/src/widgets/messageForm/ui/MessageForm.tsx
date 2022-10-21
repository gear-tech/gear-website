import { Hex, Metadata } from '@gear-js/api';
import { Button, Input, Textarea } from '@gear-js/ui';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';

import sendSVG from 'shared/assets/images/actions/send.svg';
import { FormInput } from 'shared/ui/form';
import { Box } from 'shared/ui/box';
import { BackButton } from 'shared/ui/backButton';
import { GasMethod } from 'shared/config';
import { getValidation } from 'shared/helpers';
import { GasField } from 'features/gasField';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { useGasCalculate, useMessageActions } from 'hooks';
import { Result } from 'hooks/useGasCalculate/types';

import { getValidationSchema, resetPayloadValue } from '../helpers';
import { FormValues, INITIAL_VALUES } from '../model';
import styles from './MessageForm.module.scss';

type Props = {
  id: Hex;
  isReply: boolean;
  isLoading: boolean;
  metadata?: Metadata | undefined;
};

const MessageForm = ({ id, isReply, metadata, isLoading }: Props) => {
  const { api } = useApi();
  const alert = useAlert();

  const calculateGas = useGasCalculate();
  const { sendMessage, replyMessage } = useMessageActions();

  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);
  const [gasInfo, setGasInfo] = useState<Result>();

  const formApi = useRef<FormApi<FormValues>>();

  const deposit = api.existentialDeposit.toNumber();
  const maxGasLimit = api.blockGasLimit.toNumber();
  const method = isReply ? GasMethod.Reply : GasMethod.Handle;
  const encodeType = isReply ? metadata?.async_handle_input : metadata?.handle_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validation = useMemo(
    () => {
      const schema = getValidationSchema({ type: encodeType, deposit, metadata, maxGasLimit });

      return getValidation(schema);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata, encodeType],
  );

  const disableSubmitButton = () => setIsDisabled(true);
  const enableSubmitButton = () => setIsDisabled(false);

  const resetForm = () => {
    if (!formApi.current) return;

    const { values } = formApi.current.getState();

    formApi.current.reset();
    formApi.current.change('payload', resetPayloadValue(values.payload));

    enableSubmitButton();
    setGasInfo(undefined);
  };

  const handleSubmitForm = (values: FormValues) => {
    disableSubmitButton();

    const payloadType = metadata ? undefined : values.payloadType;

    const commonValues = {
      value: values.value.toString(),
      payload: getSubmitPayload(values.payload),
      gasLimit: values.gasLimit.toString(),
    };

    if (isReply) {
      const reply = { ...commonValues, replyToId: id };
      replyMessage({ reply, metadata, payloadType, reject: enableSubmitButton, resolve: resetForm });
    } else {
      const message = { ...commonValues, destination: id };
      sendMessage({ message, metadata, payloadType, reject: enableSubmitButton, resolve: resetForm });
    }
  };

  const handleGasCalculate = () => {
    if (!formApi.current) return;

    setIsGasDisabled(true);

    const { values } = formApi.current.getState();
    const preparedValues = { ...values, payload: getSubmitPayload(values.payload) };

    calculateGas(method, preparedValues, null, metadata, id)
      .then((info) => {
        formApi.current?.change('gasLimit', info.limit);
        setGasInfo(info);
      })
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsGasDisabled(false));
  };

  return (
    <Form validateOnBlur initialValues={INITIAL_VALUES} validate={validation} onSubmit={handleSubmitForm}>
      {({ form, handleSubmit }) => {
        formApi.current = form;

        return (
          <form onSubmit={handleSubmit}>
            <Box className={styles.body}>
              {isLoading ? (
                <Input label="Destination:" gap="1/5" className={styles.loading} value="" readOnly />
              ) : (
                <Input label={isReply ? 'Message Id:' : 'Destination:'} gap="1/5" value={id} readOnly />
              )}

              {isLoading ? (
                <Textarea label="Payload" gap="1/5" className={styles.loading} readOnly />
              ) : (
                <FormPayload name="payload" label="Payload" values={payloadFormValues} gap="1/5" />
              )}

              {isLoading ? (
                <Input label="Gas info" gap="1/5" className={styles.loading} readOnly />
              ) : (
                <GasField
                  info={gasInfo}
                  disabled={isLoading || isGasDisabled}
                  onGasCalculate={handleGasCalculate}
                  gap="1/5"
                />
              )}

              {isLoading ? (
                <Input label="Value" gap="1/5" className={styles.loading} readOnly />
              ) : (
                <FormInput name="value" label="Value" gap="1/5" />
              )}
            </Box>

            <Button
              type="submit"
              text="Send Message"
              icon={sendSVG}
              size="large"
              color="secondary"
              className={styles.button}
              disabled={isLoading || isDisabled}
            />
            <BackButton />
          </form>
        );
      }}
    </Form>
  );
};

export { MessageForm };