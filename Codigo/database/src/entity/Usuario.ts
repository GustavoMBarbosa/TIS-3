import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 280 })
	nome: string;

	@Column({ type: 'varchar', length: 280 })
	email: string;

	@Column({ type: 'varchar', length: 280 })
	token: string;

	@Column({ type: 'varchar', length: 480 })
	descricao: string;
}
