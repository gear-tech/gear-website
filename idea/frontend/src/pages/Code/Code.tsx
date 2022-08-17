import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import { Hex } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { Params } from './types';

import { useProgramUpload, useGasCalculate } from 'hooks';
import { GasMethod } from 'consts';
import { getShortName } from 'helpers';
import { getCode } from 'services';
import { CodeModel } from 'types/code';
import { Payload } from 'hooks/useProgramUplaod/types';
import { Box } from 'layout/Box/Box';
import { PageHeader } from 'components/blocks/PageHeader';
import { Spinner } from 'components/common/Spinner/Spinner';
import { ProgramForm, FormValues, PropsToRenderButtons } from 'components/blocks/ProgramForm';

const Code = () => {
  const alert = useAlert();
  const { codeId } = useParams() as Params;

  const [code, setCode] = useState<CodeModel>();

  const calculateGas = useGasCalculate();
  const { createProgram } = useProgramUpload();

  const handleSubmit = (payload: Payload, helpers: FormikHelpers<FormValues>) =>
    createProgram({
      payload,
      codeId: codeId as Hex,
      reject: () => helpers.setSubmitting(false),
      resolve: () => helpers.resetForm(),
    });

  const handleCalculateGas = async ({ values, metadata, setFieldValue }: PropsToRenderButtons) => {
    try {
      // const gasLimit = await calculateGas(GasMethod.Init, values, code, metadata);

      setFieldValue('gasLimit', 0);
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const renderButtons = (props: PropsToRenderButtons) => (
    <>
      <Button type="submit" text="Create program" disabled={props.isDisabled} />
      <Button text="Calculate Gas" onClick={() => handleCalculateGas(props)} disabled={props.isDisabled} />
    </>
  );

  useEffect(() => {
    getCode(codeId)
      .then(({ result }) => setCode(result))
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrapper">
      <PageHeader title="Create program" fileName={codeId} />
      {code ? (
        <Box>
          <ProgramForm
            name={getShortName(codeId)}
            label="Code ID"
            renderButtons={renderButtons}
            onSubmit={handleSubmit}
          />
        </Box>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Code };
