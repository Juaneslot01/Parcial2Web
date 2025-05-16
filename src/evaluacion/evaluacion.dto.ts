import { IsNotEmpty, IsNumber } from 'class-validator';

export class EvaluacionDto {
  @IsNumber()
  @IsNotEmpty()
  readonly calificacion: number;
}
