import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TipoDespesa {
	COMPRA = 'compra',
	DESPESA_TRABALHISTAS = 'despesa_trabalhistas',
	DIVERSOS = 'diversos',
}

@Entity()
export class Despesa {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'decimal', nullable: false })
	valor: number;

	@Column({ type: 'varchar', length: 280, nullable: true })
	descricao: string;

	@Column({ type: 'enum', enum: TipoDespesa, nullable: false })
	tipo: TipoDespesa;

	@Column({ type: 'date' })
	updated_at: Date;
}
