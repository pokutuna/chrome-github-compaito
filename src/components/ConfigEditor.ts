import { IView, Presenter, View } from './base';
import { CompaitoConfig } from './CompaitoConfig';

interface IConfigEditorView extends IView {
    restoreHostConfigJson(): void;
    updateButton(): void;
}

class ConfigEditorPresenter extends Presenter {
    view: IConfigEditorView;

    config: CompaitoConfig;

    hasDiff:           boolean;
    hasSaved:          boolean;
    isHostConfigValid: boolean;

    constructor(view: IConfigEditorView) {
        super(view);
        this.hasDiff  = false;
        this.hasSaved = false;
    }

    async setup(): Promise<void> {
        this.config = await CompaitoConfig.getConfig();
        this.view.restoreHostConfigJson();
        this.view.updateButton();
    }

    get saveButtonText(): string {
        return !this.hasDiff && this.hasSaved ? 'Saved!' : 'Save';
    }

    get isSaveButtonEnable(): boolean {
        return this.hasDiff && this.isHostConfigValid ? true : false;
    }

    get hostsJson(): string {
        return JSON.stringify(this.config.getHosts(), null, 2);
    }

    handleHostConfigInput(json: string): void {
        this.hasDiff = true;
        try {
            var obj = JSON.parse(json);
            this.config.setHosts(obj); // throws Error if obj is invalid
            this.isHostConfigValid = true;
        } catch(e) {
            this.isHostConfigValid = false;
        }
        this.view.updateButton();
    }

    async handleSave(): Promise<void> {
        await this.config.save();
        this.hasSaved = true;
        this.hasDiff  = false;
        this.view.updateButton();
    }
}

class ConfigEditorView extends View implements IConfigEditorView {
    presenter: ConfigEditorPresenter;

    container:  HTMLElement;
    textarea:   HTMLTextAreaElement;
    saveButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
    }

    initMembers(container: HTMLElement): void {
        this.textarea   = <HTMLTextAreaElement>container.querySelector('textarea');
        this.saveButton = <HTMLButtonElement> container.querySelector('button');
    }

    createPresenter(): ConfigEditorPresenter {
        return new ConfigEditorPresenter(this);
    }

    registerEvents(): void {
        this.textarea.addEventListener('input', (e) => {
            this.presenter.handleHostConfigInput(this.textarea.value);
        });
        this.saveButton.addEventListener('click', async (e) => {
            await this.presenter.handleSave();
        });
    }

    restoreHostConfigJson(): void {
        this.textarea.value = this.presenter.hostsJson;
    }

    updateButton(): void {
        this.saveButton.textContent =  this.presenter.saveButtonText;
        this.saveButton.disabled    = !this.presenter.isSaveButtonEnable;
    }
}

export { IConfigEditorView, ConfigEditorPresenter, ConfigEditorView };
