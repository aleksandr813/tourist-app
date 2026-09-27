const crypto = require('crypto');
const BaseManager = require('../BaseManager');

const SECRET_KEY_SALT = 'WebAppData';

class AuthManager extends BaseManager {
    constructor(params) {
        super(params);
        this.botToken = params.botToken;
        this.initDataMaxAge = params.initDataMaxAge;

        this.mediator.set(this.TRIGGERS.GET_USER_ID, (data) => this.triggerGetUserId(data.initData, data.userId));
    }

    triggerGetUserId(initData, userId) {
        if (!this.botToken) {
            return userId ?? null;
        }
        return this.getVerifiedUserId(initData);
    }

    getVerifiedUserId(initData) {
        if (typeof initData !== 'string' || !initData) {
            return null;
        }

        const params = new URLSearchParams(initData);
        const keys = [...params.keys()];
        const hash = params.get('hash');
        if (!hash || new Set(keys).size !== keys.length) {
            return null;
        }
        params.delete('hash');

        if (!this.isValidSignature(params, hash) || !this.isFresh(params.get('auth_date'))) {
            return null;
        }

        const user = JSON.parse(params.get('user') ?? 'null');
        return user?.id == null ? null : String(user.id);
    }

    isValidSignature(params, hash) {
        const launchParams = [...params.entries()]
            .sort(([a], [b]) => (a < b ? -1 : 1))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        const secretKey = crypto.createHmac('sha256', SECRET_KEY_SALT).update(this.botToken).digest();
        const signature = crypto.createHmac('sha256', secretKey).update(launchParams).digest('hex');

        return signature.length === hash.length
            && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hash));
    }

    isFresh(authDate) {
        const seconds = Number(authDate);
        return Number.isFinite(seconds) && Date.now() / 1000 - seconds <= this.initDataMaxAge;
    }
}

module.exports = AuthManager;
