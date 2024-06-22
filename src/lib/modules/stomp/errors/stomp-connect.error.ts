export class StompConnectError extends Error {
  constructor(message: string, details: string) {
    super(`Error occured: ${message}\n\nDetails: ${details}`);
  }
}
