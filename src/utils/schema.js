const schema = {
	1: `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
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

module.exports = { schema };
