function setupScrollHeader() {
  // header scroll
  const header = document.querySelector('body>header');
  if (header) {
    document.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy > 100) {
        if (header.classList.contains('active')) return;
        header.classList.add('active');
      } else {
        if (!header.classList.contains('active')) return;
        header.classList.remove('active');
      }
    });
  }
}
function setupScheduler() {
  const modalForm = document.querySelector('#scheduleModal form');
  if (!modalForm) return;
  document.querySelectorAll('.btn-schedule').forEach(el => {
    const batchId = el.getAttribute('data-id');
    const targetURL = "/admin/email_batches/".concat(batchId);
    modalForm.setAttribute('action', targetURL);
  });
  document.querySelector('#inputScheduleDate').addEventListener('change', ev => {
    const el = ev.currentTarget;
    const v = el.value.replace('T', ' ');
    modalForm.querySelector('input[name=":date"]').setAttribute('value', "".concat(v, "+08:00"));
  });
}
(fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn))(() => {
  setupScrollHeader();
  setupScheduler();
});