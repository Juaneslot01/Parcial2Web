import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { Repository } from 'typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let repository: Repository<EvaluacionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EvaluacionService],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    repository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a evaluacion', async () => {
    const evaluacion = new EvaluacionEntity();
    evaluacion.calificacion = 5;

    const createdEvaluacion = await service.create(evaluacion);
    expect(createdEvaluacion).toBeDefined();
    expect(createdEvaluacion.calificacion).toBe(evaluacion.calificacion);
  });

  it('should throw an error if evaluacion has invalid calificacion', async () => {
    const evaluacion = new EvaluacionEntity();
    evaluacion.calificacion = 0;

    try {
      await service.create(evaluacion);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'La evaluación no cumple con los requisitos para ser creada',
      );
    }
  });

});
