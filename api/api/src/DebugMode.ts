import { ApiPromise } from '@polkadot/api';
import { UnsubscribePromise } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { DebugDataSnapshotEvent, GearApi } from '.';

export class DebugMode {
  api: ApiPromise;
  enabled: any;
  constructor(api: GearApi) {
    this.api = api.api;
  }

  enable() {
    this.enabled = this.api.tx.sudo.sudo(this.api.tx.gear.enableDebugMode(true));
  }

  disable() {
    this.enabled = this.api.tx.sudo.sudo(this.api.tx.gear.enableDebugMode(false));
  }

  signAndSend(keyring: KeyringPair): Promise<{ method: string; data: boolean }> {
    return new Promise((resolve) => {
      this.enabled.signAndSend(keyring, ({ events, status }) => {
        events.forEach(({ event: { method, data } }) => {
          if (status.isFinalized) {
            resolve({ method, data: data[0].toHuman() });
          }
        });
      });
    });
  }

  snapshots(callback: (event: DebugDataSnapshotEvent) => void | Promise<void>): UnsubscribePromise {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => this.api.events.gear.DebugDataSnapshot.is(event))
        .forEach(({ event }) => callback(new DebugDataSnapshotEvent(event)));
    });
  }
}
