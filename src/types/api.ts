import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export class ApiException extends Error {
  constructor(public error: ApiError, public originalError?: AxiosError) {
    super(error.message);
    this.name = "ApiException";
  }
}
