/// <reference path="../modules/DefinitelyTyped/chrome/chrome.d.ts" />

console.log('options');

module CompaitoOption {

    export function init(): void {
        document.addEventListener('DOMContentLoaded', function() {
            var elem = document.getElementById('config');
            new ConfigEditor(elem);
        });
    }

    interface CompaitoConfig {
        hosts: { [key:string]: boolean }
    }
    var DEFAULT_CONFIG: CompaitoConfig  = {
        hosts: { 'github.com': true }
    };

    class ConfigEditor {
        container:  HTMLElement;
        textarea:   HTMLTextAreaElement;
        saveButton: HTMLButtonElement;

        constructor(container: HTMLElement) {
            this.textarea   = <HTMLTextAreaElement> container.querySelector('textarea');
            this.saveButton = <HTMLButtonElement> container.querySelector('button');
            this.restoreConfig();

            this.textarea.addEventListener('input', (e) => this.onInput(e));
            this.saveButton.addEventListener('click', (e) => this.onSaveClick(e));
        }

        onInput(event: Event) {
            this.validateConfig(
                () => this.saveButton.disabled = false,
                () => this.saveButton.disabled = true
            )
        }

        onSaveClick(event: MouseEvent) {
            this.validateConfig((config) => {
                chrome.storage.sync.set(config, () => {
                    this.saveButton.disabled = true;
                    this.saveButton.textContent = 'Saved!';
                });
            });
        }

        validateConfig(ok: (config: CompaitoConfig) => void, ng?: () => void) {
            var jsonString: string = this.textarea.value;
            var isValid = this.isConfigValid(jsonString);
            if (isValid) {
                ok({ hosts: JSON.parse(jsonString) });
            } else if (ng) {
                ng();
            }
        }

        isConfigValid(jsonString: string): boolean {
            try {
                var obj = JSON.parse(jsonString);
                return Object.keys(obj).every((key) => { return typeof obj[key] === 'boolean' });
            } catch(e) {
                return false;
            }
        }

        restoreConfig() {
            chrome.storage.sync.get(DEFAULT_CONFIG, (config: CompaitoConfig) => {
                this.textarea.value = JSON.stringify(config.hosts, null, 2);
            });
        }
    }
}

CompaitoOption.init();
