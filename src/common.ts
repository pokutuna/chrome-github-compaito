export interface CompaitoConfig {
    hosts: { [key:string]: boolean }
}

export var DEFAULT_CONFIG: CompaitoConfig  = {
    hosts: { 'github.com': true }
}
