console.log('content')

var el = document.createElement('div')
el.classList.add('compato-tooltip')
el.textContent = 'hoge'
document.body.insertBefore(el, document.body.firstChild)
