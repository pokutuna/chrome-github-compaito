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
    createPresenter(): Presenter {
        throw new Error('You must implement createPresenter');
    }
    registerEvents(): void {}
    updateError(): void {}
}

export { IView, Presenter, View };
