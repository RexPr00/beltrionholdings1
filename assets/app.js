(() => {
  const lockBody = (lock) => document.body.classList.toggle('lock', lock);

  const trapFocus = (container) => {
    const nodes = container.querySelectorAll('button,a,input,[tabindex]:not([tabindex="-1"])');
    if (!nodes.length) return () => {};
    const first = nodes[0], last = nodes[nodes.length - 1];
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
  };

  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = btn.nextElementSibling;
      menu.classList.toggle('open');
    });
  });

  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('burgerOpen');
  const closeBtn = document.getElementById('drawerClose');
  let untrap = () => {};
  const closeDrawer = () => { drawer.classList.remove('open'); backdrop.classList.remove('open'); lockBody(false); untrap(); openBtn.focus(); };
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      drawer.classList.add('open'); backdrop.classList.add('open'); lockBody(true);
      untrap = trapFocus(drawer); drawer.querySelector('a,button')?.focus();
    });
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.lang-menu').forEach((m) => m.classList.remove('open'));
        if (drawer.classList.contains('open')) closeDrawer();
        if (document.getElementById('privacyModal')?.classList.contains('open')) closeModal();
      }
    });
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      document.querySelectorAll('.faq-item.open').forEach((open) => open !== item && open.classList.remove('open'));
      item.classList.toggle('open');
    });
  });

  const modal = document.getElementById('privacyModal');
  const modalOpen = document.querySelectorAll('[data-open-privacy]');
  const modalClose = document.querySelectorAll('[data-close-privacy]');
  let untrapModal = () => {};
  const closeModal = () => { modal.classList.remove('open'); lockBody(false); untrapModal(); };
  modalOpen.forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('open'); lockBody(true); untrapModal = trapFocus(modal); modal.querySelector('button')?.focus(); }));
  modalClose.forEach((el) => el.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('show'); });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
