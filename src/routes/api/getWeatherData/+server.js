// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

import { AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY } from '$env/static/private';

async function getTableClient() {
	const tableName = 'WeatherTurku';
	const accountName = AZURE_STORAGE_ACCOUNT_NAME;
	const accountKey = AZURE_STORAGE_ACCOUNT_KEY;

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

	return entities;
}

export async function GET() {
	if (!AZURE_STORAGE_ACCOUNT_KEY || !AZURE_STORAGE_ACCOUNT_NAME) {
		throw new Error('Azure Storage connection string is not defined');
	}

	try {
		const entities = await listEntities();
		return new Response(JSON.stringify({ entities }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=1800'
			}
		});
	} catch (error) {
		console.error('Error listing entities:', error);
		return new Response(JSON.stringify({ error: 'Failed to list entities' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=1800'
			}
		});
	}
}
