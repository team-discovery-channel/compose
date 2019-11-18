export class RESTError {
  message: string;
  hint: string;
  status: string;

  constructor(msg: string, hint: string, status: string) {
    this.message = msg;
    this.hint = hint;
    this.status = status;
  }
}
