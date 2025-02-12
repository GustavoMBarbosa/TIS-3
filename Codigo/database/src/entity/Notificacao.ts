import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Animal } from './Animal';

@Entity()
export class Notificacao {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	titulo: string;

	@Column()
	descricao: string;

	@Column({ type: 'date', nullable: false })
	vencimento: Date;

	@ManyToOne(() => Animal, (animal) => animal.notificacoes)
	@JoinColumn({ name: 'animal_id' })
	animal: Animal;
}
