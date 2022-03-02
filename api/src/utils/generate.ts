import { isHex } from '@polkadot/util';
import { Hex, Metadata } from '../interfaces';
import { CreateType } from '../create-type/CreateType';
import { blake2AsHex } from '@polkadot/util-crypto';

export function createPayload(createType: CreateType, type: any, data: any, meta?: Metadata): Hex {
  if (data === undefined) {
    return '0x00';
  }
  if (isHex(data)) {
    return data;
  }
  let payload = data;
  if (meta && type) {
    const encoded = createType.create(type, data, meta);
    payload = isHex(encoded) ? encoded : encoded.toHex();
  } else if (type) {
    try {
      const encoded = createType.create(type, data);
      payload = isHex(encoded) ? encoded : encoded.toHex();
    } catch (error) {
      console.error(error.message);
    }
  }
  return payload;
}

export function generateCodeHash(code: Buffer | Uint8Array): Hex {
  return blake2AsHex(code, 256);
}

export function generateProgramId(code: Buffer | Uint8Array, salt: Hex): Hex {
  const codeHashU8a = CreateType.create('Vec<u8>', generateCodeHash(code)).toU8a().slice(1);
  const saltU8a = CreateType.create('Vec<u8>', salt).toU8a();
  const id = new Uint8Array(codeHashU8a.byteLength + saltU8a.byteLength);
  id.set(codeHashU8a);
  id.set(saltU8a, codeHashU8a.byteLength);
  return blake2AsHex(id, 256);
}
