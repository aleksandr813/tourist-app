const crypto = require('crypto');

const [botToken, userId = '100000001'] = process.argv.slice(2);

if (!botToken) {
    console.error('Использование: node test-data/make-init-data.js <BOT_TOKEN> [user_id]');
    process.exit(1);
}

const fields = {
    auth_date: String(Math.floor(Date.now() / 1000)),
    query_id: crypto.randomUUID(),
    user: JSON.stringify({ id: Number(userId), first_name: 'Тестовый', last_name: 'Пользователь' }),
};
const launchParams = Object.keys(fields).sort().map((key) => `${key}=${fields[key]}`).join('\n');
const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
const hash = crypto.createHmac('sha256', secretKey).update(launchParams).digest('hex');

console.log(new URLSearchParams({ ...fields, hash }).toString());
