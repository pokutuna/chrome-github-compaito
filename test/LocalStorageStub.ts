export class LocalStorageStub {
    private storage: { [key: string]: any } = {};

    async get(key: string): Promise<{ [key: string]: any }> {
        if (key in this.storage) {
            return { [key]: this.storage[key] };
        }
        return {};
    }

    async set(items: { [key: string]: any }): Promise<void> {
        Object.assign(this.storage, items);
    }

    async clear(): Promise<void> {
        this.storage = {};
    }
}

export function setupLocalStorageStub(): LocalStorageStub {
    const storageStub = new LocalStorageStub();

    beforeEach(() => {
        global.chrome = {
            storage: {
                local: storageStub,
            },
        } as any;
    });

    afterEach(() => {
        storageStub.clear();
    });

    return storageStub;
}
