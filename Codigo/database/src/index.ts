import { AppDataSource } from './data-source';

AppDataSource.initialize()
	.then(async () => {
		console.log('Connected to the database');
	})
	.catch((error) => console.log(error));
