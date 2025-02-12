import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gestacao } from './Gestacao';
import { Notificacao } from './Notificacao';

@Entity()
export class Animal {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 280 })
	nome: string;

	@Column({ type: 'int', nullable: true })
	crias: number;

	@Column({ type: 'boolean' })
	lactante: boolean;

	@Column({ type: 'int', nullable: true })
	num_insem: number;

	@Column({ type: 'date', nullable: true })
	primeira_ia: Date;

	@OneToMany(() => Gestacao, (gestacao) => gestacao.animal)
	gestacoes: Gestacao[];

	@OneToMany(() => Notificacao, (notificacao) => notificacao.animal)
	notificacoes: Notificacao[];
}
