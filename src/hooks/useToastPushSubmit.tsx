import React, { ReactNode, useCallback } from 'react';

import { message } from 'antd';

import { HttpErrorCode } from 'utils/enums';

function useToastPushSubmit(errorMessageOverride: object = {}) {
  const pushMessage = (content: ReactNode) => {
    message.error(content, 1.5);
  };

  const pushError = useCallback(
    (errorCode: HttpErrorCode) => {
      if (errorMessageOverride[errorCode] !== undefined) {
        pushMessage(errorMessageOverride[errorCode]);
        return;
      }

      switch (errorCode) {
        case HttpErrorCode.NoError:
          return;
        case HttpErrorCode.BadRequestError:
          pushMessage(
            'Bad request parameters, please check your parameters again.'
          );
          return;
        case HttpErrorCode.AuthenticationFailed:
          pushMessage(
            <>
              Either your account is not available, or you entered wrong
              credentials.
              <br />
              Please try to re-log, or contact admin if this issue persists.
            </>
          );
          return;
        case HttpErrorCode.PermissionDenied:
          pushMessage('You are not allowed to do this action');
          return;
        case HttpErrorCode.AutomaticPairingError:
          pushMessage(
            <>
              Some unexpected error happens during pairing.
              <br />
              Please proceed with manual pairing, and please report this to
              admin.
            </>
          );
          return;
        case HttpErrorCode.DatabaseError:
          pushMessage(
            <>
              Network error, this app cannot access the database.
              <br />
              Please contact admin.
            </>
          );
          return;
        case HttpErrorCode.TokenExpired:
          pushMessage('Your session has expired, please re-log to continue.');
          return;
        case HttpErrorCode.ExternalConnectionError:
          pushMessage(
            <>
              Network error, this app cannot access external sources.
              <br />
              Please contact admin.
            </>
          );
          return;
        default:
          pushMessage('Unknown error, please contact admin.');
          return;
      }
    },
    [errorMessageOverride]
  );

  const pushSuccess = useCallback(
    (content: string) => message.info(content, 1.5),
    []
  );

  return { pushError, pushSuccess };
}

export default useToastPushSubmit;
