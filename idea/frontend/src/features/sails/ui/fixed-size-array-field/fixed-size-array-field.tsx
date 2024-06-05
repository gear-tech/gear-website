import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';
import { getLabel, getNestedName, getType } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  label: string;
  renderField: (def: TypeDef, name: string, label: string) => JSX.Element | undefined;
};

function FixedSizeArrayField({ def, name, label, renderField }: Props) {
  const arrayDef = def.asFixedSizeArray;

  const renderFields = () =>
    new Array<typeof arrayDef>(arrayDef.len)
      .fill(arrayDef)
      .map((field, index) => renderField(field.def, '', getNestedName(name, index.toString())));

  return <Fieldset legend={getLabel(label, getType(def))}>{renderFields()}</Fieldset>;
}

export { FixedSizeArrayField };
