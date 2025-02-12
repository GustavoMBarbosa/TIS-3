import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from './entity/Usuario';
import { Animal } from './entity/Animal';
import { Gestacao } from './entity/Gestacao';
import { MaoDeObra } from './entity/MaoDeObra';
import { Notificacao } from './entity/Notificacao';
import { Receita } from './entity/Receita';
import { Despesa } from './entity/Despesa';
import 'dotenv/config';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	synchronize: true,
	logging: false,
	entities: [Animal, Despesa, Gestacao, MaoDeObra, Notificacao, Receita, Usuario],
	migrations: [__dirname + '/migration/*.ts'],
	subscribers: [],
	ssl: true,
});
