import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Meta, Program } from '../../../src/database/entities';

const metadata = new Meta();

function getProgramDBMock(): Program[] {
  const pathPrograms = '/programs.mock.yaml';
  let result: Program[] = [];

  try {
    const programs = load(readFileSync(__dirname + pathPrograms, 'utf8')) as Program[];
    result = programs.map((program) => ({ ...program, meta: metadata }));
  } catch (err) {
    console.error(err);
  }

  return result;
}

const PROGRAM_DB_MOCK = getProgramDBMock();

export { PROGRAM_DB_MOCK };
