import { Entity, PrimaryGeneratedColumn, Column, Collection } from 'typeorm';

@Entity()
export class MaoDeObra {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 280, nullable: false })
	nome: string;

	@Column({ type: 'decimal', nullable: false })
	salario: number;

	@Column({ type: 'varchar', length: 280, nullable: true })
	cargo: string;

	@Column({ type: 'boolean', nullable: false, default: true })
	clt: boolean;
}
