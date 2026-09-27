const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Bot {
    constructor({ token, apiUrl, appLink, pollingTimeout, retryDelay, updateTypes, welcomeText, openAppText }) {
        this.token = token;
        this.apiUrl = apiUrl;
        this.appLink = appLink;
        this.pollingTimeout = pollingTimeout;
        this.retryDelay = retryDelay;
        this.updateTypes = updateTypes;
        this.welcomeText = welcomeText;
        this.openAppText = openAppText;
    }

    async request(method, path, { query = {}, body } = {}) {
        const url = new URL(path, this.apiUrl);
        Object.entries(query)
            .filter(([, value]) => value != null)
            .forEach(([key, value]) => url.searchParams.set(key, value));

        const response = await fetch(url, {
            method,
            headers: { Authorization: this.token, 'Content-Type': 'application/json' },
            body: body && JSON.stringify(body),
        });

        if (!response.ok) {
            console.error(`${method} ${path}: ${response.status} ${await response.text()}`);
            return null;
        }
        return response.json();
    }

    async start() {
        let marker = null;
        console.log('Bot started');

        while (true) {
            const result = await this.request('GET', '/updates', {
                query: { marker, timeout: this.pollingTimeout, types: this.updateTypes },
            });

            if (!result) {
                await wait(this.retryDelay);
                continue;
            }

            marker = result.marker ?? marker;
            await Promise.all(result.updates.map((update) => this.handleUpdate(update)));
        }
    }

    handleUpdate(update) {
        if (update.update_type === 'bot_started') {
            return this.sendWelcome(update.chat_id);
        }
        if (update.update_type === 'message_created' && !update.message.sender?.is_bot) {
            return this.sendWelcome(update.message.recipient.chat_id);
        }
        return null;
    }

    sendWelcome(chatId) {
        return this.request('POST', '/messages', {
            query: { chat_id: chatId },
            body: {
                text: this.welcomeText,
                attachments: [{
                    type: 'inline_keyboard',
                    payload: {
                        buttons: [[{ type: 'link', text: this.openAppText, url: this.appLink }]],
                    },
                }],
            },
        });
    }
}

module.exports = Bot;
