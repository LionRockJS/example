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