import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCltColumnOnWorkers1714738332742 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE mao_de_obra ADD COLUMN clt BOOLEAN NOT NULL DEFAULT TRUE`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE mao_de_obra DROP COLUMN clt`);
	}
}
