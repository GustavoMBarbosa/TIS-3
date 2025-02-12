import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeWorkerNameColumn1714137004929 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.renameColumn("mao_de_obra", "nnome", "nome");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.renameColumn("mao_de_obra", "nome", "nnome");
	}
}
