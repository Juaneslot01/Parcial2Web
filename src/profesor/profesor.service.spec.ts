import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorService } from './profesor.service';
import { Repository } from 'typeorm';
import { ProfesorEntity } from './profesor.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let repository: Repository<ProfesorEntity>;
  let evaluacionRepository: Repository<EvaluacionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    repository = module.get<Repository<ProfesorEntity>>(
      getRepositoryToken(ProfesorEntity),
    );
    evaluacionRepository = module.get<Repository<EvaluacionEntity>>(
      getRepositoryToken(EvaluacionEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a profesor', async () => {
    const newProfesor = new ProfesorEntity();
    newProfesor.cedula = 12334124;
    newProfesor.nombre = 'Juan Lopez';
    newProfesor.departamento = 'Bogota';
    newProfesor.extension = 12342;
    newProfesor.esParEvaluador = true;

    const createdProfesor = await service.create(newProfesor);
    expect(createdProfesor).toBeDefined();
    expect(createdProfesor.id).toBeDefined();
    expect(createdProfesor.cedula).toEqual(newProfesor.cedula);
    expect(createdProfesor.nombre).toEqual(newProfesor.nombre);
    expect(createdProfesor.departamento).toEqual(newProfesor.departamento);
    expect(createdProfesor.extension).toEqual(newProfesor.extension);
    expect(createdProfesor.esParEvaluador).toEqual(newProfesor.esParEvaluador);
  });

  it('should not create a profesor with invalid extension', async () => {
    const newProfesor = new ProfesorEntity();
    newProfesor.cedula = 12334124;
    newProfesor.nombre = 'Juan Lopez';
    newProfesor.departamento = 'Bogota';
    newProfesor.extension = 123324242;
    newProfesor.esParEvaluador = true;

    await expect(service.create(newProfesor)).rejects.toThrowError(
      'El profesor no cumple con los requisitos para ser creado',
    );
  });

  it('should asignar evaluador', async () => {
    const newProfesor = new ProfesorEntity();
    newProfesor.cedula = 12334124;
    newProfesor.nombre = 'Juan Lopez';
    newProfesor.departamento = 'Bogota';
    newProfesor.extension = 12332;
    newProfesor.esParEvaluador = false;
    newProfesor.evaluaciones = [];

    const newEvaluacion = new EvaluacionEntity();
    newEvaluacion.calificacion = 5;
    newEvaluacion.profesor = newProfesor;

    jest.spyOn(repository, 'findOne').mockResolvedValue(newProfesor);
    jest
      .spyOn(evaluacionRepository, 'findOne')
      .mockResolvedValue(newEvaluacion);
    jest.spyOn(repository, 'save').mockResolvedValue(newProfesor);
    jest.spyOn(evaluacionRepository, 'save').mockResolvedValue(newEvaluacion);

    await service.asignarEvaluador(newProfesor.id, newEvaluacion.id);
    expect(newProfesor.evaluaciones).toContain(newEvaluacion);
    expect(newProfesor.esParEvaluador).toBe(true);
  });

  it('should not asignarEvaluador because has invalid number of evaluaciones', async () => {
    const newProfesor = new ProfesorEntity();
    newProfesor.cedula = 12334124;
    newProfesor.nombre = 'Juan Lopez';
    newProfesor.departamento = 'Bogota';
    newProfesor.extension = 12332;
    newProfesor.esParEvaluador = false;
    newProfesor.evaluaciones = [
      {
        id: BigInt(1),
        calificacion: 4,
        profesor: newProfesor,
      } as unknown as EvaluacionEntity,
      {
        id: BigInt(2),
        calificacion: 3,
        profesor: newProfesor,
      } as unknown as EvaluacionEntity,
      {
        id: BigInt(3),
        calificacion: 5,
        profesor: newProfesor,
      } as unknown as EvaluacionEntity,
    ];

    const newEvaluacion = new EvaluacionEntity();
    newEvaluacion.calificacion = 5;
    newEvaluacion.profesor = newProfesor;

    jest.spyOn(repository, 'findOne').mockResolvedValue(newProfesor);
    jest
      .spyOn(evaluacionRepository, 'findOne')
      .mockResolvedValue(newEvaluacion);
    await expect(
      service.asignarEvaluador(newProfesor.id, newEvaluacion.id),
    ).rejects.toThrow(
      'El profesor no puede ser asignado a más de 3 evaluaciones',
    );
  });
});
