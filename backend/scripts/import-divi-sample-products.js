/*
 * Import sample sellers and products from the provided Divi Engine WooCommerce CSV.
 * Usage: node backend/scripts/import-divi-sample-products.js [path-to-csv]
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
// Fallback: also try project root .env
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { knex, User, Store, Merchant, Product } = require('../Database/models');
const { hashPassword, randomFloat } = require('../Database/seeds/utils');

const DEFAULT_CSV = path.join(__dirname, 'Divi-Engine-WooCommerce-Sample-Products.csv');

function parseCSV(text) {
    const rows = [];
    let field = '';
    let row = [];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];
        if (char === '"') {
            if (inQuotes && next === '"') { // escaped quote
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(field);
            field = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (field.length > 0 || row.length > 0) {
                row.push(field);
                rows.push(row);
                row = [];
                field = '';
            }
        } else {
            field += char;
        }
    }
    if (field.length > 0 || row.length > 0) {
        row.push(field);
        rows.push(row);
    }
    return rows;
}

function indexHeaders(headerRow) {
    const idx = {};
    headerRow.forEach((h, i) => {
        idx[h.trim()] = i;
    });
    return idx;
}

function mapCategory(csvCategories) {
    const val = (csvCategories || '').toLowerCase();
    if (val.includes('men') || val.includes('women') || val.includes('shirt') || val.includes('hoodie') || val.includes('accessor')) return 'CLOTHING';
    if (val.includes('food')) return 'FOOD';
    if (val.includes('toy')) return 'TOYS';
    if (val.includes('beauty')) return 'BEAUTY';
    if (val.includes('sport')) return 'SPORTS';
    if (val.includes('home') || val.includes('garden')) return 'HOME_GARDEN';
    return 'CLOTHING';
}

function parseImages(imagesField) {
    if (!imagesField) return [];
    return imagesField
        .split(',')
        .map(s => s.trim())
        .filter(s => s.startsWith('http'));
}

async function ensureSellers(n = 3) {
    const sellers = [];
    for (let i = 1; i <= n; i++) {
        const email = `seller${i}@example.com`;
        const plainPassword = `seller${i}123`;
        let user = await User().where({ email }).first();
        if (!user) {
            const [uid] = await User().insert({
                email,
                password: await hashPassword(plainPassword),
                phone: `+1000000000${i}`,
                first_name: `Seller${i}`,
                last_name: 'Demo',
                verified: true,
                type: 'merchant'
            }).returning('*');
            user = uid;
        } else {
            // Ensure known test password, merchant type, and verified flag
            await User().update({
                password: await hashPassword(plainPassword),
                verified: true,
                type: 'merchant'
            }).where({ id: user.id });
        }
        // Ensure store and merchant rows
        const store = await Store().where({ user_id: user.id }).first();
        if (!store) {
            await Store().insert({ user_id: user.id, store_name: `Demo Store ${i}`, city: 'Demo City', country: 'US', rating: randomFloat(3.5, 4.9), rating_count: Math.floor(Math.random()*200) });
        }
        const merchant = await Merchant().where({ user_id: user.id }).first();
        if (!merchant) {
            await Merchant().insert({ user_id: user.id, alias: `demo_seller_${i}`, rating: randomFloat(3.5, 4.9), rating_count: Math.floor(Math.random()*200) });
        }
        console.log(`Seller ${i}: ${email} / ${plainPassword}`);
        sellers.push({ ...user, plainPassword });
    }
    return sellers;
}

async function run() {
    // Show essential DB envs for debugging (without secrets)
    console.log({
        DB_NAME: process.env.DB_NAME,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PORT: process.env.DB_PORT,
        DB_HOST: process.env.DB_HOST,
    });
    console.log('Database connection established successfully.');
    const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_CSV;
    console.log('Reading CSV:', csvPath);
    const raw = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(raw);
    if (rows.length < 2) {
        console.log('No rows found');
        return;
    }
    const header = rows[0];
    const idx = indexHeaders(header);

    // Build map of variations by Parent id
    const byId = new Map();
    const variationsByParent = new Map();

    for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const id = r[idx['ID']];
        const type = (r[idx['Type']] || '').toLowerCase();
        byId.set(id, r);
        if (type === 'variation') {
            const parent = (r[idx['Parent']] || '').replace('id:', '').trim();
            if (!variationsByParent.has(parent)) variationsByParent.set(parent, []);
            variationsByParent.get(parent).push(r);
        }
    }

    const sellers = await ensureSellers(3);
    let sellerIdx = 0;
    let created = 0;

    for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const type = (r[idx['Type']] || '').toLowerCase();
        if (!['simple', 'variable'].includes(type)) continue;

        const name = r[idx['Name']] || 'Sample Product';
        const description = r[idx['Short description']] || r[idx['Description']] || '';
        const regularPrice = parseFloat(r[idx['Regular price']] || '0') || 0;
        const salePrice = parseFloat(r[idx['Sale price']] || '0') || 0;
        let price = regularPrice || salePrice || randomFloat(5, 50);
        let discount = 0;
        if (regularPrice && salePrice && salePrice < regularPrice) {
            discount = Math.round((1 - (salePrice / regularPrice)) * 100);
            price = salePrice;
        }
        if (type === 'variable') {
            const id = r[idx['ID']];
            const vars = variationsByParent.get(String(id)) || [];
            if (vars.length) {
                const first = vars[0];
                const vReg = parseFloat(first[idx['Regular price']] || '0') || 0;
                const vSale = parseFloat(first[idx['Sale price']] || '0') || 0;
                price = vSale || vReg || price;
                if (vReg && vSale && vSale < vReg) discount = Math.round((1 - (vSale / vReg)) * 100);
            }
        }

        const images = parseImages(r[idx['Images']]);
        const thumbnail_image = images[0] || null;
        const category = mapCategory(r[idx['Categories']] || '');
        const inStockField = String(r[idx['In stock?']] || '').toLowerCase();
        const in_stock = inStockField === '1' || inStockField === 'yes' || inStockField === 'true' || inStockField === 'backorder' || inStockField === 'parent';

        const owner = sellers[sellerIdx % sellers.length];
        sellerIdx++;

        try {
            const payload = {
                user_id: owner.id,
                name: name.slice(0, 120),
                description: description.slice(0, 500),
                thumbnail_image,
                images: JSON.stringify(images),
                category,
                price,
                discount,
                sell_count: Math.floor(Math.random() * 500),
                rating: randomFloat(3.8, 5, 2),
                rating_count: Math.floor(Math.random() * 200),
                in_stock,
                unlisted: false
            };
            await Product().insert(payload);
            created++;
        } catch (e) {
            console.warn('Skip product due to error:', e.message);
        }
    }

    console.log(`Imported ${created} products across ${sellers.length} demo sellers.`);
}

run()
    .then(() => knex.destroy())
    .catch((e) => { console.error(e); knex.destroy(); process.exit(1); });


