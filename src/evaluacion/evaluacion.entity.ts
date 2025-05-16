import {
  Entity,
  Long,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ProyectoEntity } from 'src/proyecto/proyecto.entity';
import { ProfesorEntity } from 'src/profesor/profesor.entity';

@Entity()
export class EvaluacionEntity {
  @PrimaryGeneratedColumn()
  id: Long;

  @Column()
  calificacion: number;

  @ManyToOne(() => ProyectoEntity, (proyecto) => proyecto.evaluaciones)
  proyecto: ProyectoEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.evaluaciones)
  profesor: ProfesorEntity;
}
