
export class StatusError extends Error {
    statusCode: number | undefined;
    data?: any;
  }