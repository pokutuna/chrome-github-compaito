interface IView {
    updateError(): void;
}

abstract class Presenter {
    view: IView;
    lastError: Error;

    constructor(view: IView) {
        this.view = view;
        this.lastError = null;
    }

    setup(): void {}

    setError(error: Error): void {
        this.lastError = error;
        this.view.updateError();
    }

    resetError(): void {
        this.setError(null);
    }
}

abstract class View implements IView {
    presenter: Presenter;

    constructor(...args: any[]) {
        this.initMembers(...args);
        this.presenter = this.createPresenter();
        this.registerEvents();
        this.presenter.setup();
    }

    initMembers(...args: any[]): void {}
    abstract createPresenter(): Presenter;
    registerEvents(): void {}

    updateError(): void {}
}

export { IView, Presenter, View };
