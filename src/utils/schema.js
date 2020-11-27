/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
const db = require('./database');

const schema = {
	1: `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name TEXT,
		email TEXT NOT NULL,
		password TEXT NOT NULL,
		deleted BOOL DEFAULT FALSE
	)
	`,
	2: `
	CREATE TABLE IF NOT EXISTS clients (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		cpf TEXT NOT NULL,
		email TEXT NOT NULL,
		tel TEXT NOT NULL,
		user_id INTEGER NOT NULL,
		deleted BOOL DEFAULT FALSE
	)
	`,
	3: `
	CREATE TABLE IF NOT EXISTS payments (
		id SERIAL PRIMARY KEY,
		value INTEGER NOT NULL,
		due_date DATE NOT NULL,
		payment_date DATE,
		client_id INTEGER NOT NULL,
		description TEXT NOT NULL,
		payment_slip_link TEXT NOT NULL,
		codebar TEXT NOT NULL,
		deleted BOOL DEFAULT FALSE
	)
	`,
};

const drop = async (tableName) => {
	if (tableName) {
		await db.query(`DROP TABLE ${tableName}`);
		console.log('Tabela dropada!');
	}
};

const up = async (number = null) => {
	if (!number) {
		for (const value in schema) {
			await db.query({ text: schema[value] });
		}
	} else {
		await db.query({ text: schema[number] });
	}
	console.log('Migração rodada!');
};

// drop('users');
// up();

module.exports = { schema };
