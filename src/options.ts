import { ConfigEditorView } from './components/ConfigEditor';

document.addEventListener('DOMContentLoaded', function() {
    var elem = document.getElementById('config');
    new ConfigEditorView(elem);
});
