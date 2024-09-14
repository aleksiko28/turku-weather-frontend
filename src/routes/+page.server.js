export const prerender = false;

import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

import { env } from '$env/dynamic/private';

async function getTableClient() {
	const tableName = 'WeatherTurku';
	const accountName = env.AZURE_STORAGE_ACCOUNT_NAME;
	const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY;

	const credential = new AzureNamedKeyCredential(accountName, accountKey);
	const tableClient = new TableClient(
		`https://${accountName}.table.core.windows.net`,
		tableName,
		credential
	);
	return tableClient;
}

async function listEntities() {
	const tableClient = await getTableClient();
	const entities = [];

	for await (const entity of tableClient.listEntities()) {
		entities.push(entity);
	}

	return {
		items: entities
	};
}

export async function load() {
	if (!env.AZURE_STORAGE_ACCOUNT_KEY || !env.AZURE_STORAGE_ACCOUNT_NAME) {
		throw new Error('Azure Storage connection string is not defined');
	}

	try {
		const entities = await listEntities();
		return entities;
	} catch (error) {
		console.error('Error listing entities:', error);
		return { items: [] };
	}
}
