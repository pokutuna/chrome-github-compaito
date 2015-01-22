console.log('content')

interface DelegatedEvent extends Event {
    delegateTarget?: HTMLElement
}

var delegate = function(
    match: (HTMLElement) => boolean,
    listener: (DelegatedEevent) => any
) {
    return function(event) {
        var el = event.target;
        do {
            if (!match(el)) continue;
            event.delegateTarget = el
            listener.apply(this, arguments)
        } while (el = el.parentNode)
    }
}

document.body.addEventListener('mouseover', delegate(function(el) {
    return el.nodeName === 'A' ? true : false
}, function(event) {
    console.log(event.delegateTarget)
}))
