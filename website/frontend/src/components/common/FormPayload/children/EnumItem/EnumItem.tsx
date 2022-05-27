import { useState, useMemo, ChangeEvent } from 'react';
import { useField } from 'formik';
import { Select } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../types';
import { getNextLevelName, parseTypeStructure } from '../../helpers';

import { useChangeEffect } from 'hooks';
import { Fieldset } from 'components/common/Fieldset';

const EnumItem = ({ levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, value } = typeStructure;

  const options = useMemo(() => Object.keys(value).map((key) => ({ value: key, label: key })), [value]);

  const [, , helpers] = useField(levelName);

  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const nextLevelName = getNextLevelName(levelName, selected);

  useChangeEffect(() => {
    //@ts-ignore
    const parsedStructure = parseTypeStructure(value[selected]);

    helpers.setValue({ [selected]: parsedStructure });
  }, [selected]);

  return (
    <Fieldset legend={name} className={styles.fieldset}>
      <Select options={options} className={styles.select} onChange={handleChange} />
      {renderNextItem({
        levelName: nextLevelName,
        //@ts-ignore
        typeStructure: value[selected],
      })}
    </Fieldset>
  );
};

export { EnumItem };
