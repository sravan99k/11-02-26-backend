import * as functions from 'firebase-functions';

export const logger = {
    info: (msg: string, data?: any) => functions.logger.info(msg, data),
    error: (msg: string, data?: any) => functions.logger.error(msg, data),
    warn: (msg: string, data?: any) => functions.logger.warn(msg, data),
};
