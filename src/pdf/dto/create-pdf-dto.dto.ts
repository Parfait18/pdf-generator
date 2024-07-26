import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreatePdfDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  templatePath: string;

  @ApiProperty({ type: Object })
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  data: Record<any, any>;
}
