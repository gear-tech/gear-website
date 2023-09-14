import '@polkadot/api-base/types/events';

import type { ApiTypes, AugmentedEvent } from '@polkadot/api-base/types';
import type { BTreeMap, BTreeSet, Option, u128, u32 } from '@polkadot/types-codec';
import {
  GearCommonEventCodeChangeKind,
  GearCommonEventDispatchStatus,
  GearCommonEventMessageEntry,
  GearCommonEventProgramChangeKind,
  GearCommonEventReasonMessageWaitedRuntimeReason,
  GearCommonEventReasonMessageWokenRuntimeReason,
  GearCommonEventReasonUserMessageReadRuntimeReason,
  GearCommonGasProviderNodeGasNodeId,
  GearCoreIdsCodeId,
  GearCoreIdsMessageId,
  GearCoreIdsProgramId,
  GearCoreMessageUserUserMessage,
} from '@polkadot/types/lookup';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';

export type __AugmentedEvent<ApiType extends ApiTypes> = AugmentedEvent<ApiType>;

declare module '@polkadot/api-base/types/events' {
  interface AugmentedEvents<ApiType extends ApiTypes> {
    gear: {
      /**
       * Any data related to program codes changed.
       **/
      CodeChanged: AugmentedEvent<
        ApiType,
        [id: GearCoreIdsCodeId, change: GearCommonEventCodeChangeKind],
        { id: GearCoreIdsCodeId; change: GearCommonEventCodeChangeKind }
      >;
      /**
       * User sends message to program, which was successfully
       * added to the Gear message queue.
       **/
      MessageQueued: AugmentedEvent<
        ApiType,
        [
          id: GearCoreIdsMessageId,
          source: AccountId32,
          destination: GearCoreIdsProgramId,
          entry: GearCommonEventMessageEntry,
        ],
        {
          id: GearCoreIdsMessageId;
          source: AccountId32;
          destination: GearCoreIdsProgramId;
          entry: GearCommonEventMessageEntry;
        }
      >;
      /**
       * The result of processing the messages within the block.
       **/
      MessagesDispatched: AugmentedEvent<
        ApiType,
        [
          total: u32,
          statuses: BTreeMap<GearCoreIdsMessageId, GearCommonEventDispatchStatus>,
          stateChanges: BTreeSet<GearCoreIdsProgramId>,
        ],
        {
          total: u32;
          statuses: BTreeMap<GearCoreIdsMessageId, GearCommonEventDispatchStatus>;
          stateChanges: BTreeSet<GearCoreIdsProgramId>;
        }
      >;
      /**
       * Messages execution delayed (waited) and successfully
       * added to gear waitlist.
       **/
      MessageWaited: AugmentedEvent<
        ApiType,
        [
          id: GearCoreIdsMessageId,
          origin: Option<GearCommonGasProviderNodeGasNodeId>,
          reason: GearCommonEventReasonMessageWaitedRuntimeReason,
          expiration: u32,
        ],
        {
          id: GearCoreIdsMessageId;
          origin: Option<GearCommonGasProviderNodeGasNodeId>;
          reason: GearCommonEventReasonMessageWaitedRuntimeReason;
          expiration: u32;
        }
      >;
      /**
       * Message is ready to continue its execution
       * and was removed from `Waitlist`.
       **/
      MessageWoken: AugmentedEvent<
        ApiType,
        [id: GearCoreIdsMessageId, reason: GearCommonEventReasonMessageWokenRuntimeReason],
        { id: GearCoreIdsMessageId; reason: GearCommonEventReasonMessageWokenRuntimeReason }
      >;
      /**
       * Any data related to programs changed.
       **/
      ProgramChanged: AugmentedEvent<
        ApiType,
        [id: GearCoreIdsProgramId, change: GearCommonEventProgramChangeKind],
        { id: GearCoreIdsProgramId; change: GearCommonEventProgramChangeKind }
      >;
      /**
       * Program resume session has been started.
       **/
      ProgramResumeSessionStarted: AugmentedEvent<
        ApiType,
        [sessionId: u128, accountId: AccountId32, programId: GearCoreIdsProgramId, sessionEndBlock: u32],
        { sessionId: u128; accountId: AccountId32; programId: GearCoreIdsProgramId; sessionEndBlock: u32 }
      >;
      /**
       * The pseudo-inherent extrinsic that runs queue processing rolled back or not executed.
       **/
      QueueNotProcessed: AugmentedEvent<ApiType, []>;
      /**
       * Message marked as "read" and removes it from `Mailbox`.
       * This event only affects messages that were
       * already inserted in `Mailbox`.
       **/
      UserMessageRead: AugmentedEvent<
        ApiType,
        [id: GearCoreIdsMessageId, reason: GearCommonEventReasonUserMessageReadRuntimeReason],
        { id: GearCoreIdsMessageId; reason: GearCommonEventReasonUserMessageReadRuntimeReason }
      >;
      /**
       * Somebody sent a message to the user.
       **/
      UserMessageSent: AugmentedEvent<
        ApiType,
        [message: GearCoreMessageUserUserMessage, expiration: Option<u32>],
        { message: GearCoreMessageUserUserMessage; expiration: Option<u32> }
      >;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    gearVoucher: {
      /**
       * A new voucher issued.
       **/
      VoucherIssued: AugmentedEvent<
        ApiType,
        [holder: AccountId32, program: GearCoreIdsProgramId, value: u128],
        { holder: AccountId32; program: GearCoreIdsProgramId; value: u128 }
      >;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
  }
}