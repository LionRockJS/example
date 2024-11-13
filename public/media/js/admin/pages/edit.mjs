import HelperPage from "../helper/Page.mjs";
import MediaPort from "../helper/MediaPort.mjs";

HelperPage.enableAutoSave();
//HelperPage.enablePointers();
//HelperPage.enableBlock();
HelperPage.enablePageTag();

const apiKey = {
  'admin.example.com' : 'api-name',
}

const uploadURL = {
  'admin.example.com' : 'https://mediaport.dappod.com/upload',
}

MediaPort.enableUpload(uploadURL[window.location.hostname] || '/admin/upload', {
  apiKey : apiKey[window.location.hostname] || 'default',
  dir : 'cms',
  previewUrl : window.location.origin + '/'
});


[...document.querySelectorAll('input[data-state-store="true"]')].forEach((input) => {
  const states = new Set(JSON.parse(localStorage.getItem('peer-checkbox-uncheck') || '[]'));
  if(states.has(input.id)) {
    input.checked = false;
  }

  input.addEventListener('change', (e) => {
    const states = new Set(JSON.parse(localStorage.getItem('peer-checkbox-uncheck') || '[]'));
    if(!input.checked) {
      states.add(input.id);
    } else {
      states.delete(input.id);
    }

    localStorage.setItem('peer-checkbox-uncheck', JSON.stringify([...states.values()]));
  })
})

/** commands **/
const inputSelector = document.getElementById('cmd-selector');
const btnCopy = document.getElementById('cmd-copy');
const btnClean = document.getElementById('cmd-clean');
const inputMapping = document.getElementById('field-cmd-mapping');
const inputData = document.getElementById('field-cmd-input');

//get focus element and copy the id to selector
btnCopy.addEventListener('mousedown', (evt) => {
  evt.preventDefault();
  inputSelector.value = document.activeElement.id;
  return false;
});

/** code editor **/
document.querySelectorAll('.input-code-editor').forEach((codeEditor) => {
  const textarea = codeEditor.querySelector('.input-code-editor-textarea');
  const lineCounter = codeEditor.querySelector('.input-code-editor-lines');
  const summary = codeEditor.querySelector('.input-code-editor-summary');

  textarea.addEventListener('scroll', () => {
    lineCounter.scrollTop = textarea.scrollTop;
  });

  textarea.addEventListener('keydown', (e) => {
    let { code } = e;
    let { value, selectionStart, selectionEnd } = textarea;
    if (code === "Tab") {  // TAB = 9
      e.preventDefault();
      textarea.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
      textarea.setSelectionRange(selectionStart+2, selectionStart+2)
    }
  });

  textarea.addEventListener('input', () => {
    let { value, selectionStart, selectionEnd } = textarea;

    const codeLineCount = value.split('\n').length;
    const displayLineCount = lineCounter.value.split('\n').length;
    if(displayLineCount === codeLineCount) return;

    lineCounter.value = Array(codeLineCount)
      .fill(0)
      .map((it , i) => `${i+1}.`)
      .join('\n');

    const groups = value.split('-----')
      .filter(it => !!it )
      .map(it => it.trim().split('\n\n'));

    let summary_fields = (groups.length > 0) ? groups[0].length : 0;
    let valid = true;
    groups.forEach((it, i) => {
      if(it.length !== summary_fields) {
        summary_fields = `mismatch@${i}, got ${it.length} assume ${summary_fields}`;
        valid = false;
      }
    })
    summary.innerHTML = `Selection: ${selectionStart} - ${selectionEnd} | items: ${groups.length} | fields: ${summary_fields}`;
    textarea.dataset.data = (valid === true && groups.length > 0) ? JSON.stringify(groups) : "{}";
  });
});
btnClean.addEventListener('click', () => {
  const codeEditor = document.getElementById('field-cmd-input');
  codeEditor.value = codeEditor.value
    .replace(/\n-----\n/g, '\n\n-----\n\n')
    .replace(/\n\n\n/g, '\n\n');
});

const btnRun = document.getElementById('cmd-run');
btnRun.addEventListener('click', () => {
  if(inputMapping.value.split('\n').length === 0) {
    alert('mapping is empty');
    return;
  }
  if(!inputSelector.value){
    alert('selector is empty');
    return;
  }

  const keys = inputMapping.value.split('\n');
  const groups = JSON.parse(inputData.dataset.data);
  const selector = inputSelector.value;

  groups.forEach((group, i) => {
    keys.forEach((key, j) =>{
      if(!key)return;

      const id = selector.replaceAll("${i}", i).replaceAll("${key}", key);
      document.getElementById(id).value = group[j];
    })
  })
})