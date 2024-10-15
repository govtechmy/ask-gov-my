import YikeCode from "../constants/error-code";
import HttpStatusCode from "../constants/http-code";

/**
 * OK - For valid & successful requests.
 */
export type OK<T extends object> = {
  status: HttpStatusCode;
  code?: never;
  error?: never;
  message?: string;
  data?: T;
};

/**
 * Yikes - For failed requests/operations. Gracefully handle it
 */
export type YikeType = {
  status: HttpStatusCode;
  code: `E_${number}`;
  error: string;
  message: string;
  data?: never;
};

export class Yikes {
  private yike: YikeType;
  constructor(error: keyof typeof YikeCode, message?: string) {
    this.yike = YikeCode[error];

    if (!message) return;
    this.yike.message = message;
  }

  get message() {
    return this.yike.message;
  }

  toJSON() {
    return this.yike;
  }
}

export const withResponse = <T extends object>(
  fn: (...args: (object | null)[]) => Promise<OK<T> | YikeType>
) => {
  return async (...args: (object | null)[]) => {
    try {
      const resp = await fn(...args);
      return resp;
    } catch (error: unknown) {
      if (!(error instanceof Yikes)) throw error;
      else if (error instanceof Yikes) return error.toJSON();
      return new Yikes("E_305_INTERNAL_SERVER_ERROR").toJSON();
    }
  };
};
