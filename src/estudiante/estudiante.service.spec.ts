import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoEntity } from '../proyecto/proyecto.entity';
import { ProyectoService } from '../proyecto/proyecto.service';

describe('EstudianteService', () => {
  let service: EstudianteService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<EstudianteEntity>;
  let proyectoService: ProyectoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmTestingConfig(),
        TypeOrmModule.forFeature([EstudianteEntity, ProyectoEntity]),
      ],
      providers: [EstudianteService, ProyectoService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    proyectoService = module.get<ProyectoService>(ProyectoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new estudiante', async () => {
    const newEstudiante = new EstudianteEntity();
    newEstudiante.cedula = 1000230932;
    newEstudiante.nombre = 'Juan Torres';
    newEstudiante.semestre = 5;
    newEstudiante.programa = 'Ingenieria de Sistemas';
    newEstudiante.promedio = 3.5;

    const createdEstudiante = await service.create(newEstudiante);
    expect(createdEstudiante).toBeDefined();
    expect(createdEstudiante.id).toBeDefined();
    expect(createdEstudiante.cedula).toEqual(newEstudiante.cedula);
    expect(createdEstudiante.nombre).toEqual(newEstudiante.nombre);
    expect(createdEstudiante.semestre).toEqual(newEstudiante.semestre);
    expect(createdEstudiante.programa).toEqual(newEstudiante.programa);
    expect(createdEstudiante.promedio).toEqual(newEstudiante.promedio);
  });

  it('should not create an estudiante with invalid promedio', async () => {
    const newEstudiante = new EstudianteEntity();
    newEstudiante.cedula = 1000230932;
    newEstudiante.nombre = 'Juan Torres';
    newEstudiante.semestre = 5;
    newEstudiante.programa = 'Ingenieria de Sistemas';
    newEstudiante.promedio = 2.5;

    await expect(service.create(newEstudiante)).rejects.toThrowError(
      'El estudiante no tiene el promedio necesario',
    );
  });

  it('should not create an estudiante with invalid semestre', async () => {
    const newEstudiante = new EstudianteEntity();
    newEstudiante.cedula = 1000230932;
    newEstudiante.nombre = 'Juan Torres';
    newEstudiante.semestre = 2;
    newEstudiante.programa = 'Ingenieria de Sistemas';
    newEstudiante.promedio = 3.5;

    await expect(service.create(newEstudiante)).rejects.toThrowError(
      'El estudiante no tiene el semestre necesario',
    );
  });

  it('should delete an estudiante', async () => {
    const newEstudiante = new EstudianteEntity();
    newEstudiante.cedula = 1000230932;
    newEstudiante.nombre = 'Juan Torres';
    newEstudiante.semestre = 5;
    newEstudiante.programa = 'Ingenieria de Sistemas';
    newEstudiante.promedio = 3.5;
    newEstudiante.proyectos = [];

    const createdEstudiante = await service.create(newEstudiante);
    await service.delete(createdEstudiante.id);
  });

  it('should not delete an estudiante with proyectos', async () => {
    const newEstudiante = new EstudianteEntity();
    newEstudiante.cedula = 1000230932;
    newEstudiante.nombre = 'Juan Torres';
    newEstudiante.semestre = 5;
    newEstudiante.programa = 'Ingenieria de Sistemas';
    newEstudiante.promedio = 3.5;
    newEstudiante.proyectos = [];

    const createdEstudiante = await service.create(newEstudiante);

    const newProyecto = new ProyectoEntity();
    newProyecto.titulo = 'Proyecto de prueba 123';
    newProyecto.area = 'Area';
    newProyecto.presupuesto = 1234;
    newProyecto.estado = 1;
    newProyecto.notaFinal = 5;
    newProyecto.fechaInicio = 'Abril 20 2025';
    newProyecto.fechaFin = 'Septiembre 20 2025';
    newProyecto.estudiante = newEstudiante;

    const createdProyecto = await proyectoService.create(newProyecto);
    expect(createdProyecto).toBeDefined();
    await expect(service.delete(createdEstudiante.id)).rejects.toThrowError(
      'El estudiante no puede ser eliminado porque tiene proyectos asociados',
    );
  });
});
