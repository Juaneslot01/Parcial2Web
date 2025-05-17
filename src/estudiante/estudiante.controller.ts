import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';
import { plainToInstance } from 'class-transformer';
import { EstudianteService } from './estudiante.service';
import { BusinessErrorsInterceptor } from '../shared/Interceptors/business-errors.interceptor';

@Controller('estudiante')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get(':estudianteId')
  async findOne(
    @Param('estudianteId') estudianteId: string,
  ): Promise<EstudianteEntity> {
    const id = BigInt(estudianteId);
    return await this.estudianteService.findOne(id);
  }

  @Post()
  async create(
    @Body() estudianteDto: EstudianteDto,
  ) {
    const estudiante = plainToInstance(EstudianteEntity, estudianteDto);
    return await this.estudianteService.create(estudiante);
  }

  @Delete(':estudianteId')
  @HttpCode(204)
  async delete(@Param('estudianteId') estudianteId: string) {
    const id = BigInt(estudianteId);
    return await this.estudianteService.delete(id);
  }
}
