#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { seed, clearAll } = require('../Database/seeds');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  adminCount: 5,
  userCount: 20,
  customerCount: 15,
  cartCount: 10,
  orderCount: 15,
  messageCount: 30,
  operationCount: 20,
  otpCount: 10,
  supportMessagesCount: 15,
  clearExisting: false,
  onlyClear: false,
  seedAll: false
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--clear' || arg === '-c') {
    options.clearExisting = true;
  } else if (arg === '--only-clear') {
    options.onlyClear = true;
  } else if (arg === '--seed-all') {
    options.seedAll = true;
  } else if (arg.startsWith('--admin=')) {
    options.adminCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--user=')) {
    options.userCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--customer=')) {
    options.customerCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--cart=')) {
    options.cartCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--order=')) {
    options.orderCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--message=')) {
    options.messageCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--operation=')) {
    options.operationCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--otp=')) {
    options.otpCount = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--support-messages=')) {
    options.supportMessagesCount = parseInt(arg.split('=')[1], 10);
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

function printHelp() {
  console.log(`
Database Seeding Script
=======================

Usage: node seed.js [options]

Core Table Options:
  --admin=N               Set the number of admin records to create (default: 5)
  --user=N                Set the number of user records to create (default: 20)
  --customer=N            Set the number of customer records to create (default: 15)

Operational Table Options (only used with --seed-all):
  --cart=N                Set the number of cart records to create (default: 10)
  --order=N               Set the number of order records to create (default: 15)
  --message=N             Set the number of message records to create (default: 30)
  --operation=N           Set the number of operation records to create (default: 20)
  --otp=N                 Set the number of OTP records to create (default: 10)
  --support-messages=N    Set the number of support message records to create (default: 15)

General Options:
  --seed-all              Seed all tables including operational ones
  --clear, -c             Clear existing data before seeding
  --only-clear            Only clear data, don't seed
  --help, -h              Display this help message

Examples:
  node seed.js --admin=3 --user=10 --customer=8
  node seed.js --seed-all --cart=5 --order=10
  node seed.js --clear --seed-all
  node seed.js --only-clear
  `);
}

// Main execution
async function main() {
  try {
    if (options.onlyClear) {
      // If seed-all was specified, clear all tables
      await clearAll(options.seedAll);
    } else {
      await seed({
        adminCount: options.adminCount,
        userCount: options.userCount,
        customerCount: options.customerCount,
        cartCount: options.cartCount,
        orderCount: options.orderCount,
        messageCount: options.messageCount,
        operationCount: options.operationCount,
        otpCount: options.otpCount,
        supportMessagesCount: options.supportMessagesCount,
        clearExisting: options.clearExisting,
        seedAll: options.seedAll
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
