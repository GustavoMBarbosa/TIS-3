import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDescricaoToCargo1714955890630 implements MigrationInterface {
	name = 'ChangeDescricaoToCargo1714955890630';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "mao_de_obra" RENAME COLUMN "descricao" TO "cargo"`);
		// await queryRunner.query(`ALTER TABLE "mao_de_obra" ADD COLUMN "clt" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`ALTER TABLE "notificacoes" ADD COLUMN "vencimento" DATE NOT NULL`);
		await queryRunner.query(`
        ALTER TABLE "notificacoes" 
        ADD COLUMN "animal_id" integer,
        ADD CONSTRAINT "FK_animal_notificacao" FOREIGN KEY ("animal_id") REFERENCES "animais"("id")
        `);
		await queryRunner.query(`ALTER TABLE "notificacoes" RENAME TO "notificacao"`);
		await queryRunner.query(`ALTER TABLE "gestacoes" RENAME TO "gestacao"`);
		await queryRunner.query(`ALTER TABLE "animais" RENAME TO "animal"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "animal" RENAME TO "animais"`);
		await queryRunner.query(`ALTER TABLE "gestacao" RENAME TO "gestacoes"`);
		await queryRunner.query(`ALTER TABLE "notificacao" RENAME TO "notificacoes"`);
		await queryRunner.query(`ALTER TABLE "notificacoes" DROP CONSTRAINT "FK_animal_notificacao"`);
		await queryRunner.query(`ALTER TABLE "notificacoes" DROP COLUMN "animal_id"`);
		await queryRunner.query(`ALTER TABLE "notificacoes" ALTER COLUMN "vencimento" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "notificacoes" DROP COLUMN "vencimento"`);
		await queryRunner.query(`ALTER TABLE "mao_de_obra" DROP COLUMN "clt"`);
		await queryRunner.query(`ALTER TABLE "mao_de_obra" RENAME COLUMN "cargo" TO "descricao"`);
	}
}
