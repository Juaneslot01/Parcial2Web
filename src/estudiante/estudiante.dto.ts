/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';


export class EstudianteDto {

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly cedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly semestre: number;

  @IsString()
  @IsNotEmpty()
  readonly programa: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly promedio: number;
}
