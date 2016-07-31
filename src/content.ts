import { CommitPickerView } from './components/CommitPicker';

// guard duplicate picker
if (!document.querySelector('.chrome-extension-compaito'))
    new CommitPickerView(<HTMLBodyElement>document.body);
