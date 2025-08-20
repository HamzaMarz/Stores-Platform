/*
  Patch the operation table CHECK constraints to include latest enum values
  Usage: node backend/scripts/patch-operation-enums.js
*/

const knex = require('../Database/config/knex');
const { OPERATION_NAME, OPERATION_STATUS } = require('../Controllers/utils/enums');

async function ensureCheckConstraint(table, column, constraintName, allowedValues) {
  const valuesSql = allowedValues.map(v => `'${v}'`).join(',');
  // Drop existing constraint if present
  await knex.raw(`ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${constraintName}"`);
  // Recreate with updated values
  await knex.raw(`ALTER TABLE "${table}" ADD CONSTRAINT "${constraintName}" CHECK ("${column}" IN (${valuesSql}))`);
}

(async () => {
  try {
    await ensureCheckConstraint('operation', 'name', 'operation_name_check', Object.values(OPERATION_NAME));
    await ensureCheckConstraint('operation', 'status', 'operation_status_check', Object.values(OPERATION_STATUS));
    console.log('Patched operation table CHECK constraints successfully.');
  } catch (e) {
    console.error('Failed to patch operation table constraints:', e);
    process.exitCode = 1;
  } finally {
    await knex.destroy();
  }
})();


