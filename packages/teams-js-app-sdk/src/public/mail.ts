import { ensureInitialized } from '../internal/internalAPIs';
import { FrameContexts } from './constants';
import { runtime } from './runtime';
import { sendAndHandleStatusAndReason as sendAndHandleError } from '../internal/communication';

export namespace mail {
  export function openMailItem(openMailItemParams: OpenMailItemParams): Promise<void> {
    return new Promise<void>(resolve => {
      ensureInitialized(FrameContexts.content);
      if (!isSupported()) throw 'Not Supported';

      resolve(sendAndHandleError('mail.openMailItem', openMailItemParams));
    });
  }

  export function composeMail(composeScenarioParams: ComposeScenarioParams): Promise<void> {
    return new Promise<void>(resolve => {
      ensureInitialized(FrameContexts.content);
      if (!isSupported()) throw 'Not Supported';

      resolve(sendAndHandleError('mail.composeMail', composeScenarioParams));
    });
  }


  export function isSupported(): boolean {
    return runtime.supports.mail ? true : false;
  }

  export interface OpenMailItemParams {
    itemId: string;
  }

/**
* Properties shared between compose scenarios
*/
interface ComposeProps {
  toRecipients?: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];
  subject?: string;
  message?: string;
}

export enum ComposeMailType {
  New = 'new',
  Reply = 'reply',
  ReplyAll = 'replyAll',
  Forward = 'forward',
}

/**
 * Base of a discriminated union between compose scenarios.
 */
 interface ComposeMailBase<T extends ComposeMailType> {
  type: T;
}
/**
 * Interfaces for each type.
 */
export interface ComposeNewParams extends ComposeMailBase<ComposeMailType.New> {
  toRecipients?: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];
  subject?: string;
  message?: string;
}
export interface ComposeReplyOrForwardParams<T extends ComposeMailType> extends ComposeMailBase<T> {
  itemid: string;
}

export type ComposeScenarioParams =
  | ComposeNewParams
  | ComposeReplyOrForwardParams<ComposeMailType.Reply>
  | ComposeReplyOrForwardParams<ComposeMailType.ReplyAll>
  | ComposeReplyOrForwardParams<ComposeMailType.Forward>;

}
