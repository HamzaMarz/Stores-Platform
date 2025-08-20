#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { hashSync } = require('bcrypt');
const { Admin, knex } = require('../Database/models');

const DEFAULT_USERNAME = 'abd';
const DEFAULT_PASSWORD = 'asd123456';
const SALT_ROUNDS = 10;

function printHelp() {
  console.log(`
Add Admin Script
================

Usage: node add-admin.js [-u <username>] [-p <password>] [-h]

Flags:
  -u <username>   Username to create. If omitted, uses default: ${DEFAULT_USERNAME}
  -p <password>   Password to set. If omitted, uses default: ${DEFAULT_PASSWORD}
  -h              Show this help message

Behavior:
  - If run without flags, creates the default admin if it does not exist.
  - Passwords are hashed with bcrypt hashSync(salt=10) before storing.

Examples:
  node add-admin.js
  node add-admin.js -u adminUser
  node add-admin.js -u adminUser -p strongPass123
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let username = DEFAULT_USERNAME;
  let password = DEFAULT_PASSWORD;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h') {
      return { help: true };
    }
    if (arg === '-u') {
      const value = args[i + 1];
      if (!value || value.startsWith('-')) return { invalid: true };
      username = value;
      i++;
      continue;
    }
    if (arg === '-p') {
      const value = args[i + 1];
      if (!value || value.startsWith('-')) return { invalid: true };
      password = value;
      i++;
      continue;
    }
    return { invalid: true };
  }

  return { username, password };
}

async function ensureAdmin(username, plainPassword) {
  const existing = await Admin().where({ username }).first();
  if (existing) {
    console.log(`Admin '${username}' already exists. Nothing to do.`);
    return existing.id;
  }

  const hashed = hashSync(plainPassword, SALT_ROUNDS);
  const payload = {
    username,
    password: hashed,
    restricted: false,
    level: 3,
  };

  const [inserted] = await Admin().insert(payload).returning('id');
  const newId = inserted && inserted.id ? inserted.id : inserted; // handle different knex return shapes
  console.log(`Admin '${username}' created with id ${newId}.`);
  return newId;
}

async function main() {
  try {
    const parsed = parseArgs(process.argv);
    if (parsed.help) {
      printHelp();
      process.exit(0);
    }
    if (parsed.invalid) {
      printHelp();
      process.exit(1);
    }

    const { username, password } = parsed;
    await ensureAdmin(username, password);
    process.exitCode = 0;
  } catch (error) {
    console.error('Failed to add admin:', error.message || error);
    process.exitCode = 1;
  } finally {
    try { await knex.destroy(); } catch (_) {}
  }
}

main();


