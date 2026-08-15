/* global document, window, IntersectionObserver */

/**
 * CodeChat — Visual Operational Brain Dashboard (Graphfy Style)
 * Lógica leve, 100% autônoma (zero dependências externas)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos DOM ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.graph-node-section');
  const btnPrint = document.getElementById('btnPrintReport');
  const btnExecView = document.getElementById('btnExecutiveView');
  const btnTechView = document.getElementById('btnTechnicalView');
  const viewModeBadge = document.getElementById('viewModeBadge');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('mainSidebar');

  // --- 1. Navegação Suave e Destaque da Seção Ativa (ScrollSpy) ---
  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -70% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // --- 2. Controle do Menu Lateral no Mobile ---
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 960) {
          sidebar.classList.remove('open');
        }
      });
    });
  }

  // --- 3. Alternância entre Modo Executivo e Técnico ---
  function setViewMode(mode) {
    if (mode === 'executive') {
      btnExecView?.classList.add('active');
      btnTechView?.classList.remove('active');
      document.body.classList.remove('technical-mode');
      document.body.classList.add('executive-mode');
      if (viewModeBadge) {
        viewModeBadge.textContent = 'Executivo';
        viewModeBadge.className = 'view-indicator-pill';
      }
    } else {
      btnTechView?.classList.add('active');
      btnExecView?.classList.remove('active');
      document.body.classList.remove('executive-mode');
      document.body.classList.add('technical-mode');
      if (viewModeBadge) {
        viewModeBadge.textContent = 'Técnico';
        viewModeBadge.className = 'view-indicator-pill text-blue';
      }
    }
  }

  btnExecView?.addEventListener('click', () => setViewMode('executive'));
  btnTechView?.addEventListener('click', () => setViewMode('technical'));

  // --- 4. Impressão / Exportação para PDF via window.print() ---
  btnPrint?.addEventListener('click', () => {
    window.print();
  });
});
