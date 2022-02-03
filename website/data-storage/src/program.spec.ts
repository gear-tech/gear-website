import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Program } from './entities/program.entity';
import { Meta } from './entities/meta.entity';
import { ProgramsService } from './programs/programs.service';

describe('Programs Service', () => {
  let programsService!: ProgramsService;

  const Meta_create = jest.fn(() => ({ id: '0x7357' }));
  const Meta_save = jest.fn(async () => ({ id: '0x7357' }));
  const Meta_findAndCount = jest.fn(async () => [[{ id: '0x7357' }], 1]);
  const Meta_findOne = jest.fn(async () => ({ id: '0x7357' }));

  const Program_create = jest.fn(() => ({ id: '0x7357' }));
  const Program_save = jest.fn(async () => ({ id: '0x7357' }));
  const Program_findAndCount = jest.fn(async (): Promise<[Program[], number]> => [[{ id: '0x7357' } as Program], 1]);
  const Program_findOne = jest.fn(async (): Promise<Program | null> => ({ id: '0x7357' } as Program));

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        // Stub upstream repos:
        {
          provide: getRepositoryToken(Program),
          useValue: {
            create: Program_create,
            save: Program_save,
            findAndCount: Program_findAndCount,
            findOne: Program_findOne,
          },
        },
        {
          provide: getRepositoryToken(Meta),
          useValue: {
            create: Meta_create,
            save: Meta_save,
            findAndCount: Meta_findAndCount,
            findOne: Meta_findOne,
          },
        },
        // And use the default Programs service as it is:
        ProgramsService,
      ],
    }).compile();

    programsService = moduleRef.get(ProgramsService);
  });

  afterEach(() => {
    for (const { mockReset } of [
      Meta_create,
      Meta_save,
      Meta_findAndCount,
      Meta_findOne,
      Program_create,
      Program_save,
      Program_findAndCount,
      Program_findOne,
    ]) {
      mockReset();
    }
  });

  it('should record uploaded program', async () => {
    // Given an initialized Programs Service,
    // when:
    programsService.save({
      id: '0x7357',
      genesis: '0x07357',
      owner: '0x7357',
      blockHash: '0x1234',
      timestamp: 0,
    });

    // then:
    expect(Program_create).toHaveBeenCalled();
    expect(Program_save).toHaveBeenCalled();
  });

  it('should extend an existing program with its name and title', async () => {
    // Given:
    Program_findAndCount.mockReturnValue(Promise.resolve([[{ id: '0x7357' } as Program], 1]));
    Program_findOne.mockReturnValue(Promise.resolve({ id: '0x7357' } as Program));

    const id = '0x7357';
    const genesis = '0x07357';
    await programsService.save({
      id,
      genesis: '0x07357',
      owner: '0x7357',
      timestamp: 0,
      blockHash: '0x0000000000000000',
    });

    // when:
    await programsService.addProgramInfo(`${id}`, genesis, 'guestbook', 'guestbook');

    // then:
    expect(Program_save).toHaveBeenLastCalledWith({ id, meta: void null, name: 'guestbook', title: 'guestbook' });
  });

  it('should set status of an existing program', async () => {
    // Given an initialized Programs Service,
    // when:
    await programsService.save({
      id: '0x7357',
      genesis: '0x07357',
      owner: '0x7357',
      timestamp: 0,
      blockHash: '0x0000000000000000',
    });

    // then:
    expect(Program_create).toHaveBeenCalled();
    expect(Program_save).toHaveBeenCalled();
  });

  it('should throw on an attempt to update an inexistent program', () => {
    // Given:
    Program_findAndCount.mockReturnValueOnce(Promise.resolve([[], 0]));
    Program_findOne.mockReturnValueOnce(Promise.resolve(null));

    // when:
    expect(programsService.addProgramInfo('0x7357', '0x07357', 'guestbook', 'guestbook'))
      // then it should silently fail.
      .resolves.toBeFalsy();
  });
});
