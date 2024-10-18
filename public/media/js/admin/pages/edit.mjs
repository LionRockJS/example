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