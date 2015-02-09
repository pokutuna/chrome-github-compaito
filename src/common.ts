interface CompaitoConfigData {
    hosts: { [key:string]: boolean }
}

export class CompaitoConfig {
    data: CompaitoConfigData;

    constructor(data: CompaitoConfigData) {
        this.data = data;
    }

    isHostEnabled(url: string): boolean {
        var match = /^\w+:\/\/([^\/]+)/.exec(url);
        if (!match) return false;
        return this.data.hosts[match[1]] ? true : false;
    }

    hostConfigJson(): string {
        return JSON.stringify(this.data.hosts, null, 2);
    }

    save() {
        CompaitoConfig.setConfig(this.data);
    }

    // statics
    static DEFAULT_CONFIG: CompaitoConfigData = { hosts: { 'github.com': true } }

    static setConfig(data: CompaitoConfigData) {
        localStorage.setItem('compaito', JSON.stringify(data))
    }

    static getConfig(): CompaitoConfig {
        var data;
        try {
            data = JSON.parse(localStorage.getItem('compaito'));
        } catch(e) {}
        if (!data) data = CompaitoConfig.DEFAULT_CONFIG;
        return new CompaitoConfig(data);
    }

    static isHostConfigJsonValid(jsonString: string): boolean {
        try {
            var obj = JSON.parse(jsonString);
            return Object.keys(obj).every((key) => {
                return typeof obj[key] === 'boolean'
            });
        } catch (e) {
            return false;
        }
    }
}
