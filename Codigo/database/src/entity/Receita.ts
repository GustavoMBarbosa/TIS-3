import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TipoReceita {
	leite = 'leite',
	venda = 'venda',
	diversos = 'diversos',
}

@Entity()
export class Receita {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'decimal', nullable: false })
	valor: number;

	@Column({ type: 'varchar', length: 280, nullable: true })
	descricao: string;

	@Column({ type: 'enum', enum: TipoReceita, nullable: false })
	tipo: TipoReceita;

	@Column({ type: 'date' })
	updated_at: Date;
}
