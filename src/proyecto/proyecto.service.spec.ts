/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { EstudianteService } from '../estudiante/estudiante.service';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let repository: Repository<ProyectoEntity>;
  let serviceEstudiante: EstudianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService, EstudianteService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    repository = module.get<Repository<ProyectoEntity>>(
      getRepositoryToken(ProyectoEntity),
    );
    serviceEstudiante = module.get<EstudianteService>(EstudianteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a proyecto', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'Titulo titulo titulo titulo';
    proyecto.area = 'Area';
    proyecto.presupuesto = 1000;
    proyecto.notaFinal = 5;
    proyecto.estado = 1;
    proyecto.fechaInicio = '2020-01-01';
    proyecto.fechaFin = '2020-01-01';
    
    const createdProyectoawait = await service.create(proyecto);
    expect(createdProyectoawait).toBeDefined();
    expect(createdProyectoawait.titulo).toBe('Titulo titulo titulo titulo');
    expect(createdProyectoawait.area).toBe('Area');
    expect(createdProyectoawait.presupuesto).toBe(1000);
    expect(createdProyectoawait.notaFinal).toBe(5);
    expect(createdProyectoawait.estado).toBe(1);
    expect(createdProyectoawait.fechaInicio).toBe('2020-01-01');
    expect(createdProyectoawait.fechaFin).toBe('2020-01-01');
  });

  it('should throw an error if proyecto has invalid presupuesto', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'Titulo titulo titulo titulo';
    proyecto.area = 'Area';
    proyecto.presupuesto = 0;
    proyecto.notaFinal = 5;
    proyecto.estado = 1;
    proyecto.fechaInicio = '2020-01-01';
    proyecto.fechaFin = '2020-01-01';

    try {
      await service.create(proyecto);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('El proyecto no cumple con el presupuesto requerido');
    }
  });
  
  it('should throw an error if proyecto has invalid title', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'Titulo';
    proyecto.area = 'Area';
    proyecto.presupuesto = 1000;
    proyecto.notaFinal = 5;
    proyecto.estado = 1;
    proyecto.fechaInicio = '2020-01-01';
    proyecto.fechaFin = '2020-01-01';

    try {
      await service.create(proyecto);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('El titulo del proyecto no cumple con el requisito');
    }
  });

  it('should avanzar proyecto', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'Titulo titulo titulo titulo';
    proyecto.area = 'Area';
    proyecto.presupuesto = 1000;
    proyecto.notaFinal = 5;
    proyecto.estado = 1;
    proyecto.fechaInicio = '2020-01-01';
    proyecto.fechaFin = '2020-01-01';
    
    const createdProyecto = await service.create(proyecto);

    const avanzadoProyecto = await service.avanzarProyecto(createdProyecto.id);
    expect(avanzadoProyecto).toBeDefined();
    expect(avanzadoProyecto.titulo).toBe('Titulo titulo titulo titulo');
    expect(avanzadoProyecto.area).toBe('Area');
    expect(avanzadoProyecto.presupuesto).toBe(1000);
    expect(avanzadoProyecto.notaFinal).toBe(5);
    expect(avanzadoProyecto.estado).toBe(2);
    expect(avanzadoProyecto.fechaInicio).toBe('2020-01-01');
    expect(avanzadoProyecto.fechaFin).toBe('2020-01-01');
  });

  it('should throw an error if proyecto no puede avanzar', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'Titulo titulo titulo titulo';
    proyecto.area = 'Area';
    proyecto.presupuesto = 1000;
    proyecto.notaFinal = 5;
    proyecto.estado = 4;
    proyecto.fechaInicio = '2020-01-01';
    proyecto.fechaFin = '2020-01-01';

    const createdProyecto = await service.create(proyecto);

    try {
      await service.avanzarProyecto(createdProyecto.id);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('El proyecto ya ha sido terminado');
    }
  });

  it('should find estudiantes', async () => {
    const newEstudiante = new EstudianteEntity();
    newEstudiante.cedula = 1000230932;
    newEstudiante.nombre = 'Juan Torres';
    newEstudiante.semestre = 5;
    newEstudiante.programa = 'Ingenieria de Sistemas';
    newEstudiante.promedio = 3.5;

    const createdEstudiante = await serviceEstudiante.create(newEstudiante);
    expect(createdEstudiante).toBeDefined();
    
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'Titulo titulo titulo titulo';
    proyecto.area = 'Area';
    proyecto.presupuesto = 1000;
    proyecto.notaFinal = 5;
    proyecto.estado = 1;
    proyecto.fechaInicio = '2020-01-01';
    proyecto.fechaFin = '2020-01-01';
    proyecto.estudiante = createdEstudiante;

    const createdProyecto = await service.create(proyecto);

    const estudiantes = await service.findEstudiantes(createdProyecto.id);
    expect(estudiantes).toBeDefined();
    expect(estudiantes?.id).toBeDefined();
    expect(estudiantes?.cedula).toEqual(newEstudiante.cedula);
    expect(estudiantes?.nombre).toEqual(newEstudiante.nombre);
    expect(estudiantes?.semestre).toEqual(newEstudiante.semestre);
    expect(estudiantes?.programa).toEqual(newEstudiante.programa);
    expect(estudiantes?.promedio).toEqual(newEstudiante.promedio);
  });

  it('should not find estudiantes', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'Titulo titulo titulo titulo';
    proyecto.area = 'Area';
    proyecto.presupuesto = 1000;
    proyecto.notaFinal = 5;
    proyecto.estado = 1;
    proyecto.fechaInicio = '2020-01-01';
    proyecto.fechaFin = '2020-01-01';

    const createdProyecto = await service.create(proyecto);

    try {
      await service.findEstudiantes(createdProyecto.id);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('El proyecto no existe');
    }
  });
});
