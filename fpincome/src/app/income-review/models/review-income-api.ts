import { ApiStatusCodes } from 'moh-common-lib';

/**
 * Serves as base for both API requests *and* API responses.
 */
export interface PayloadInterface {
  requestUUID: string;
  applicationUUID: string;

  returnCode: ApiStatusCodes;
  referenceNumber?: string;
}

export class ServerPayload implements PayloadInterface {
  applicationUUID: string;
  requestUUID: string;

  returnCode: ApiStatusCodes;
  referenceNumber?: string;

  constructor(payload: PayloadInterface) {
    this.applicationUUID = payload.applicationUUID;
    this.requestUUID = payload.requestUUID;
    this.returnCode = payload.returnCode;
    this.referenceNumber = payload.referenceNumber;
  }

  get success(): boolean {
    return this.returnCode === ApiStatusCodes.SUCCESS;
  }

  get error(): boolean {
    return this.returnCode === ApiStatusCodes.ERROR;
  }

  get warning(): boolean {
    return this.returnCode === ApiStatusCodes.WARNING;
  }
}
