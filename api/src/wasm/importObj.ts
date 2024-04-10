import { TypeRegistry, u64 } from '@polkadot/types';
import { BlockNumber } from '@polkadot/types/interfaces';

export default (
  memory: WebAssembly.Memory,
  showDebug?: boolean,
  inputValue?: Uint8Array,
  timestamp?: u64,
  block_height?: BlockNumber,
  replyFn: (payload: number, len: number) => void = () => {},
) => ({
  env: {
    abortStackOverflow: () => {
      throw new Error('overflow');
    },
    table: new WebAssembly.Table({
      initial: 0,
      maximum: 0,
      element: 'anyfunc',
    }),
    tableBase: 0,
    memory: memory,
    memoryBase: 1024,
    STACKTOP: 0,
    STACK_MAX: memory.buffer.byteLength,
    alloc: (pages: number) => {
      return memory.grow(pages);
    },
    free: () => {},
    free_range: () => {},
    gr_env_vars: () => {},
    gr_block_height: () => block_height,
    gr_block_timestamp: () => timestamp,
    gr_create_program_wgas: () => {},
    gr_create_program: () => {},
    gr_reply_deposit: () => {},
    gr_debug: (payload: number, len: number) => {
      if (showDebug) {
        console.debug(
          '[GR_DEBUG]',
          new TypeRegistry()
            .createType('String', new Uint8Array(memory.buffer.slice(payload, payload + len)))
            .toHuman(),
        );
      }
    },
    gr_error: (error: number, len: number) => {
      console.error(
        '[GR_ERROR]',
        new TypeRegistry().createType('String', new Uint8Array(memory.buffer.slice(error, error + len))).toHuman(),
      );
    },
    gr_origin: () => {},
    gr_pay_program_rent: () => {},
    gr_status_code: () => {},
    gr_panic: () => {},
    gr_oom_panic: () => {},
    gr_reply_code: () => {},
    gr_signal_code: () => {},
    gr_exit: () => {},
    gr_gas_available: () => {},
    gr_leave: () => {},
    gr_message_id: () => {},
    gr_program_id: () => {},
    gr_random: () => {},
    gr_read: (at: number, len: number, buffer: number) => {
      if (inputValue === undefined) {
        throw new Error('Input value not found');
      }
      new Uint8Array(memory.buffer).set(inputValue.slice(at, len), buffer);
    },
    gr_reply_commit_wgas: () => {},
    gr_reply_commit: () => {},
    gr_reply_push: () => {},
    gr_reply_push_input: () => {},
    gr_reply_to: () => {},
    gr_signal_from: () => {},
    gr_reply_input_wgas: () => {},
    gr_reply_wgas: () => {},
    gr_reply: replyFn,
    gr_reply_input: () => {},
    gr_reservation_reply_commit: () => {},
    gr_reservation_reply: () => {},
    gr_reservation_send_commit: () => {},
    gr_reservation_send: () => {},
    gr_reserve_gas: () => {},
    gr_send_commit_wgas: () => {},
    gr_send_commit: () => {},
    gr_send_init: () => {},
    gr_send_push: () => {},
    gr_send_push_input: () => {},
    gr_send_input_wgas: () => {},
    gr_send_wgas: () => {},
    gr_send: () => {},
    gr_send_input: () => {},
    gr_size: (size_ptr: number) => {
      if (inputValue === undefined) {
        throw new Error('Input value not found');
      }
      const len = new TypeRegistry().createType('u32', inputValue.byteLength).toU8a();
      for (let i = 0; i < len.length; i++) {
        new Uint8Array(memory.buffer)[size_ptr + i] = len[i];
      }
    },
    gr_source: () => {},
    gr_system_reserve_gas: () => {},
    gr_unreserve_gas: () => {},
    gr_value_available: () => {},
    gr_value: () => {},
    gr_wait_for: () => {},
    gr_wait_up_to: () => {},
    gr_wait: () => {},
    gr_wake: () => {},
  },
});
