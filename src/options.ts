/// <reference path="../modules/DefinitelyTyped/chrome/chrome.d.ts" />
import common = require('./common');

module CompaitoOptions {

    export function init(): void {
        document.addEventListener('DOMContentLoaded', function() {
            var elem = document.getElementById('config');
            new ConfigEditor(elem);
        });
    }

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
            );
            this.saveButton.textContent = 'Save';
        }

        onSaveClick(event: MouseEvent) {
            this.validateConfig((config) => {
                config.save();
                this.saveButton.disabled = true;
                this.saveButton.textContent = 'Saved!';
            });
        }

        validateConfig(ok: (config: common.CompaitoConfig) => void, ng?: () => void) {
            var jsonString: string = this.textarea.value;
            var isValid = common.CompaitoConfig.isHostConfigJsonValid(jsonString);
            if (isValid) {
                ok(new common.CompaitoConfig({ hosts: JSON.parse(jsonString) }));
            } else if (ng) {
                ng();
            }
        }

        restoreConfig() {
            var config = common.CompaitoConfig.getConfig();
            this.textarea.value = config.hostConfigJson();
            this.saveButton.disabled = true;
        }
    }
}

CompaitoOptions.init();
