import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  data?: T;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
    this.date = new Date();
  }
}
