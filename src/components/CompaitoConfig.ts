interface CompaitoConfigData {
    hosts: { [key:string]: boolean };
}

class CompaitoConfig {
    private data: CompaitoConfigData;

    // use `CompaitConfig.getConfig()` to keep valid to save.
    constructor(data: CompaitoConfigData) {
        this.data = data;
    }

    save(): Promise<void> {
        return CompaitoConfig.saveConfig(this.data);
    }

    // hosts
    getHosts(): { [key:string]: boolean } {
        return this.data.hosts;
    }

    setHosts(hosts: any): void {
        if (CompaitoConfig.isHostsValid(hosts)) {
            this.data.hosts = hosts;
        } else {
            throw new Error('Invalid hosts');
        }
    }

    isHostEnabled(url: string): boolean {
        const match = /^\w+:\/\/([^\/]+)/.exec(url);
        if (!match) return false;
        return this.data.hosts[match[1]] ? true : false;
    }

    // statics
    static get DEFAULT_CONFIG(): CompaitoConfigData {
        return { hosts: { 'github.com': true } };
    }

    static async getConfig(): Promise<CompaitoConfig> {
        let data: CompaitoConfigData;
        try {
            const result = await chrome.storage.local.get('compaito');
            data = result.compaito;
        } catch(e) {
            console.error(e.toString());
        };
        if (!data) data = CompaitoConfig.DEFAULT_CONFIG;
        return new CompaitoConfig(data);
    }

    static saveConfig(data: CompaitoConfigData): Promise<void> {
        return chrome.storage.local.set({ compaito: data });
    }

    static isHostsValid(hosts: any): boolean {
        if (!hosts || typeof hosts !== 'object') return false;
        return Object.keys(hosts).every((key) => {
            return typeof hosts[key] === 'boolean';
        });
    }
}

export { CompaitoConfig };
