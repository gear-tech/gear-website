import { io, Socket } from 'socket.io-client';
import { emitEvents, GEAR_LOCAL_WS_URI, GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';
import { UploadProgramModel } from 'types/program';

export interface ISocketService {
  uploadProgram(file: File, opts: UploadProgramModel): void
}

export class SocketService implements ISocketService{
  private readonly socket: Socket;

  private readonly key: string | null;

  constructor() {
    this.key = localStorage.getItem(GEAR_STORAGE_KEY);
    this.socket = io(GEAR_LOCAL_WS_URI, {
      transports: ['websocket'],
      query: { Authorization: this.key || "" },
    });
  }
  
  public uploadProgram(file: File, opts: UploadProgramModel) {
    const { gasLimit, value, initPayload } = opts;
    const filename = file.name;
    const mnemonic = localStorage.getItem(GEAR_MNEMONIC_KEY) || '';

    return this.socket.emit(emitEvents.uploadProgram, {
      file,
      filename,
      gasLimit,
      value,
      initPayload,
      mnemonic,
    });
  }
}