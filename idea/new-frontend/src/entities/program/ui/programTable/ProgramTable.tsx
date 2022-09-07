import { Table, TableRow } from 'shared/ui/table';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';

import { getBulbStatus } from '../../helpers';
import { IProgram } from '../../model/types';

type Props = {
  program: IProgram;
};

const ProgramTable = ({ program }: Props) => {
  const { id, timestamp, initStatus } = program;

  return (
    <Table>
      <TableRow name="Progran ID">
        <IdBlock id={id} size="large" />
      </TableRow>
      <TableRow name="Status">
        <BulbBlock size="large" text={initStatus} status={getBulbStatus(initStatus)} />
      </TableRow>
      <TableRow name="Created at">
        <TimestampBlock size="large" timestamp={timestamp} />
      </TableRow>
    </Table>
  );
};

export { ProgramTable };
