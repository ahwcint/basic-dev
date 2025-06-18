import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MSG_KEY = 'response_msg_1234';
export const ResponseMsg = (message: string) =>
  SetMetadata(RESPONSE_MSG_KEY, message);
