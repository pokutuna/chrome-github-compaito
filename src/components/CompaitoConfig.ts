interface CompaitoConfigData {
    hosts: { [key:string]: boolean };
}

class CompaitoConfig {
    private data: CompaitoConfigData;

    // use `CompaitConfig.getConfig()` to keep valid to save.
    constructor(data: CompaitoConfigData) {
        this.data = data;
    }

    save(): void {
        CompaitoConfig.saveConfig(this.data);
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

    static getConfig(): CompaitoConfig {
        let data: CompaitoConfigData;
        try {
            data = JSON.parse(localStorage.getItem('compaito'))
        } catch(e) {
            console.error(e.toString());
        };
        if (!data) data = CompaitoConfig.DEFAULT_CONFIG;
        return new CompaitoConfig(data);
    }

    static saveConfig(data: CompaitoConfigData): void {
        localStorage.setItem('compaito', JSON.stringify(data))
    }

    static isHostsValid(hosts: any): boolean {
        if (typeof hosts !== 'object') return false;
        return Object.keys(hosts).every((key) => {
            return typeof hosts[key] === 'boolean';
        });
    }
}

export { CompaitoConfig };
