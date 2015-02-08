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
                chrome.storage.sync.set(config, () => {
                    this.saveButton.disabled = true;
                    this.saveButton.textContent = 'Saved!';
                });
            });
        }

        validateConfig(ok: (data: common.CompaitoConfigData) => void, ng?: () => void) {
            var jsonString: string = this.textarea.value;
            var isValid = common.CompaitoConfig.isHostConfigJsonValid(jsonString);
            if (isValid) {
                ok({ hosts: JSON.parse(jsonString) });
            } else if (ng) {
                ng();
            }
        }

        restoreConfig() {
            chrome.storage.sync.get(
                common.DEFAULT_CONFIG, (data: common.CompaitoConfigData) => {
                    this.textarea.value =
                        (new common.CompaitoConfig(data)).hostConfigJson();
                }
            );
        }
    }
}

CompaitoOptions.init();
