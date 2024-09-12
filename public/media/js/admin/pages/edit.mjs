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


document.addEventListener("trix-before-initialize", (it) => {
  // Change Trix.config if you need
  Trix.config.blockAttributes.default.tagName = "p"
  Trix.config.blockAttributes.default.breakOnReturn = true;

  Trix.config.blockAttributes.heading2 = {
    tagName: 'h2',
    terminal: true,
    breakOnReturn: true,
    group: false
  }

  const { toolbarElement } = event.target
  const h1Button = toolbarElement.querySelector("[data-trix-attribute=heading1]")
  h1Button.insertAdjacentHTML("afterend", `<button type="button" class="trix-button" data-trix-attribute="heading2" title="Heading 2" tabindex="-1" data-trix-active="">H2</button>`)

  Trix.getBlockConfig = (attr) => Trix.config.blockAttributes[attr];

  Trix.Block.prototype.breaksOnReturn = function(){
    const attr = this.getLastAttribute();
    const config = Trix.getBlockConfig(attr ? attr : "default");
    return config ? config.breakOnReturn : false;
  };
  Trix.LineBreakInsertion.prototype.shouldInsertBlockBreak = function(){
    if(this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty()) {
      return this.startLocation.offset > 0
    } else {
      return !this.shouldBreakFormattedBlock() ? this.breaksOnReturn : false;
    }
  };
})

Mousetrap.bind('ctrl+l', (e) => {
  const active = document.activeElement;
  if(!active?.value) return;
  active.value = active.value.replaceAll(' ', '-').replaceAll('_', '-').toLowerCase();
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