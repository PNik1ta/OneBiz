export class BaseResponse<T> {
  message: string;
  date: Date;
  data?: T;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
    this.date = new Date();
  }
}
