function addClasses(elem: HTMLElement, classes: string[]): void {
    elem.classList.add('chrome-extension-compaito');
    classes.forEach((c: string) => elem.classList.add(c));
}

function delegate(
    selector: string,
    handler: (event: Event) => any
): (event: Event) => any {
    return function(event: Event) {
        if (event && event.target) {
            if ((<HTMLElement>event.target).matches(selector)) {
                handler.apply(this, arguments);
            }
        }
    }
}

const Util = {
    addClasses: addClasses,
    delegate:   delegate,
};

export { Util };
