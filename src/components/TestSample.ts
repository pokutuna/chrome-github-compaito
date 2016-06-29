class TestSampleTarget {

    name: string;

    constructor(name: string) {
        this.name = name;
    }

    greet(): string {
        return `My name is ${this.name}`
    }
}

class TestSampleWithHtml {
    elem: Element;

    constructor(elem: Element) {
        this.elem = elem;
    }

    addAttr() {
        this.elem.setAttribute('data-test', 'true');
    }
}

export { TestSampleTarget, TestSampleWithHtml };
