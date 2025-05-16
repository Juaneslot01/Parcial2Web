import { EvaluacionEntity } from 'src/evaluacion/evaluacion.entity';
import { ProyectoEntity } from 'src/proyecto/proyecto.entity';
import {
  Column,
  Entity,
  Long,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProfesorEntity {
  @PrimaryGeneratedColumn()
  id: Long;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esParEvaluador: boolean;

  @OneToMany(() => ProyectoEntity, (proyecto) => proyecto.profesor)
  proyectos: ProyectoEntity[];

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.profesor)
  evaluaciones: EvaluacionEntity[];
}
