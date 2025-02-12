import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLactante1713806282540 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE animais ALTER COLUMN lactante SET DEFAULT false');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE animais ALTER COLUMN lactante DROP DEFAULT');
	}
}
