import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoEntity } from '../../proyecto/proyecto.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      EvaluacionEntity,
      ProfesorEntity,
      EstudianteEntity,
      ProyectoEntity,
    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    EvaluacionEntity,
    ProfesorEntity,
    EstudianteEntity,
    ProyectoEntity,
  ]),
];
