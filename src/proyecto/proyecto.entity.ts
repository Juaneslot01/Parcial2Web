import {
  Column,
  Entity,
  Long,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ProfesorEntity } from '../profesor/profesor.entity';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';

@Entity()
export class ProyectoEntity {
  @PrimaryGeneratedColumn()
  id: Long;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notaFinal: number;

  @Column()
  estado: number;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.proyectos)
  estudiante: EstudianteEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.proyectos)
  profesor: ProfesorEntity;

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.proyecto)
  evaluaciones: EvaluacionEntity[];
}
