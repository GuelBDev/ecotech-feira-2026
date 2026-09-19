/**
 * EcoTech Luxury Edition - Aplicação Principal
 * Gerenciador de Totem de Fotos (Google Drive), Autenticação com Senha ('mundoverde2'),
 * Editor de Roleta, Documentário e Painel Admin Master.
 */

const THEME_PRESETS = {
  emerald: { primary: '#10b981', hover: '#059669', glow: 'rgba(16, 185, 129, 0.4)' },
  cyan:    { primary: '#06b6d4', hover: '#0891b2', glow: 'rgba(6, 182, 212, 0.4)' },
  gold:    { primary: '#eab308', hover: '#ca8a04', glow: 'rgba(234, 179, 8, 0.4)' },
  violet:  { primary: '#a855f7', hover: '#9333ea', glow: 'rgba(168, 85, 247, 0.4)' },
  blue:    { primary: '#3b82f6', hover: '#2563eb', glow: 'rgba(59, 130, 246, 0.4)' },
  rose:    { primary: '#f43f5e', hover: '#e11d48', glow: 'rgba(244, 63, 94, 0.4)' }
};

const OFFICIAL_SITE_URL = 'https://mundoverdecesc.vercel.app';
const GOOGLE_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1do77ZCHIMN44w1IClJTKcGkkOVFV9eiG';

// Fotos do Totem iniciam vazias para receber apenas fotos reais tiradas no evento
const DEFAULT_TOTEM_PHOTOS = [];

class AppMasterController {
  constructor() {
    this.currentTab = 'totem';
    this.currentGameSubtab = 'quiz';
    this.currentTheme = localStorage.getItem('ecotech_theme') || 'emerald';
    this.projectInfo = this.loadProjectInfo();
    this.docInfo = this.loadDocInfo ? this.loadDocInfo() : null;
    this.totemPhotos = this.loadTotemPhotos();
    this.muralMessages = this.loadMuralMessages();

    this.applyTheme(this.currentTheme);
    this.initNavigation();
    this.initGameSubnav();
    this.initTotemPhotos();
    this.initPosterManager();
    if (this.initDocPlayer) this.initDocPlayer();
    this.initMural();
    this.initAdminSecurity();
    this.initAdmin();
    this.initControls();
    this.applyProjectInfo();

    // Checar se abriu com hash #admin
    if (window.location.hash === '#admin') {
      this.promptAdminPassword();
    }
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#admin') this.promptAdminPassword();
    });
  }

  // --- Sistema de Cores em Tempo Real ---
  applyTheme(themeKey) {
    const preset = THEME_PRESETS[themeKey] || THEME_PRESETS.emerald;
    this.currentTheme = themeKey;
    localStorage.setItem('ecotech_theme', themeKey);

    document.documentElement.style.setProperty('--accent-primary', preset.primary);
    document.documentElement.style.setProperty('--accent-primary-hover', preset.hover);
    document.documentElement.style.setProperty('--accent-glow', preset.glow);
    document.documentElement.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${preset.primary}, #06b6d4)`);

    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.color === themeKey);
    });
  }

  // --- Informações Gerais do Projeto ---
  loadProjectInfo() {
    const saved = localStorage.getItem('ecotech_project_info');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      title: 'EcoTech: Engenharia & Sustentabilidade',
      subtitle: 'Feira Multidisciplinar Escolar 2026',
      groupName: 'Grupo 2',
      team: 'Sophia Drumond, Miguel e Equipe'
    };
  }

  applyProjectInfo() {
    const titleEl = document.getElementById('project-title');
    const subEl = document.getElementById('project-subtitle');
    const teamEl = document.getElementById('project-team-badge');

    if (titleEl) {
      const parts = this.projectInfo.title.split(':');
      titleEl.innerHTML = `${parts[0]}: <span class="highlight">${parts[1] || 'Sustentabilidade'}</span>`;
    }
    if (subEl) subEl.textContent = this.projectInfo.subtitle;
    if (teamEl) teamEl.textContent = `${this.projectInfo.groupName} • ${this.projectInfo.team}`;
  }

  // --- Módulo do Totem de Fotos (Google Drive) ---
  loadTotemPhotos() {
    const saved = localStorage.getItem('ecotech_totem_photos');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          return list.filter(p => p && p.id && !p.id.startsWith('totem-00'));
        }
      } catch (e) {}
    }
    return [];
  }

  initTotemPhotos() {
    this.renderTotemGallery();

    // Link para abrir o Google Drive oficial
    const driveLinkBtn = document.getElementById('btn-open-google-drive');
    if (driveLinkBtn) {
      driveLinkBtn.addEventListener('click', () => {
        window.soundEngine.playPop();
        window.open(GOOGLE_DRIVE_FOLDER_URL, '_blank');
      });
    }

    // Compartilhar Site via Native Share ou WhatsApp
    const shareSiteBtn = document.getElementById('btn-share-site-whatsapp');
    if (shareSiteBtn) {
      shareSiteBtn.addEventListener('click', () => {
        window.soundEngine.playPop();
        this.shareContent(
          'EcoTech - Estande da Feira Escolar 2026',
          'Confira as fotos do nosso Totem e os jogos do nosso estande na Feira Escolar (Grupo 2: Sophia Drumond & Miguel)',
          this.getPublicUrl()
        );
      });
    }

    // Copiar Link do Site
    const copyLinkBtn = document.getElementById('btn-copy-site-link');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        window.soundEngine.playCorrect();
        navigator.clipboard.writeText(this.getPublicUrl());
        const originalText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<span>✅ Link Copiado!</span>';
        setTimeout(() => copyLinkBtn.innerHTML = originalText, 2000);
      });
    }

    // Fechar Lightbox
    document.getElementById('lightbox-close-btn')?.addEventListener('click', () => {
      document.getElementById('gallery-lightbox-modal')?.classList.add('hidden');
    });
  }

  // URL Oficial de Produção (https://mundoverdecesc.vercel.app)
  getPublicUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.location.origin) {
      return OFFICIAL_SITE_URL;
    }
    return window.location.origin + window.location.pathname;
  }

  // Compartilhamento Universal (Nativo no Celular com Fallback WhatsApp)
  async shareContent(title, text, url) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    const shareText = encodeURIComponent(`${text}: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  }

  renderTotemGallery() {
    const grid = document.getElementById('totem-photos-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (this.totemPhotos.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
          <h3 style="color: #fff; font-size: 1.4rem; margin-bottom: 0.5rem;">Aguardando fotos do Totem!</h3>
          <p style="max-width: 500px; margin: 0 auto 1.5rem auto;">
            As fotos tiradas no totem de papelão serão enviadas para o Google Drive e aparecerão automaticamente aqui.
          </p>
          <a href="${GOOGLE_DRIVE_FOLDER_URL}" target="_blank" class="btn-primary-glow" style="display: inline-flex; text-decoration: none;">
            Abrir Pasta do Google Drive 📂
          </a>
        </div>
      `;
      return;
    }

    this.totemPhotos.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'totem-photo-card';
      card.innerHTML = `
        <div class="totem-img-wrap">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <div class="totem-img-overlay">
            <button class="totem-action-icon-btn btn-inspect" title="Inspecionar Foto em Tela Cheia">🔍</button>
            <button class="totem-action-icon-btn btn-download" title="Baixar na Máxima Qualidade">⬇️</button>
            <button class="totem-action-icon-btn btn-share" title="Compartilhar no WhatsApp/Redes">🔗</button>
          </div>
        </div>
        <div class="totem-card-info">
          <div class="totem-photo-name">${item.name}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.35rem;">
            <span style="font-size: 0.78rem; color: var(--text-subtle);">${item.date || 'Hoje'}</span>
            <button class="btn-download-pill">Baixar HD 📥</button>
          </div>
        </div>
      `;

      // Eventos
      card.querySelector('.btn-inspect')?.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.openLightbox(item);
      });

      card.querySelector('.totem-img-wrap img')?.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.openLightbox(item);
      });

      const doDownload = () => {
        window.soundEngine.playCorrect();
        this.downloadPhoto(item);
      };

      card.querySelector('.btn-download')?.addEventListener('click', doDownload);
      card.querySelector('.btn-download-pill')?.addEventListener('click', doDownload);

      card.querySelector('.btn-share')?.addEventListener('click', () => {
        window.soundEngine.playPop();
        this.shareContent(
          `Foto Oficial do Totem: ${item.name}`,
          `Veja a foto tirada no totem de papelão do nosso estande na feira escolar: ${item.name}! Acesse o site`,
          this.getPublicUrl()
        );
      });

      grid.appendChild(card);
    });
  }

  downloadPhoto(item) {
    const a = document.createElement('a');
    a.href = item.img;
    a.download = `${item.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_HD.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  openLightbox(item) {
    const modal = document.getElementById('gallery-lightbox-modal');
    const img = document.getElementById('lightbox-target-img');
    const cap = document.getElementById('lightbox-caption-text');
    const dlBtn = document.getElementById('lightbox-dl-btn');

    if (modal && img) {
      img.src = item.img;
      if (cap) cap.textContent = `${item.name} • ${item.date || 'Feira Multidisciplinar'}`;
      if (dlBtn) {
        dlBtn.onclick = () => this.downloadPhoto(item);
      }
      modal.classList.remove('hidden');
    }
  }

  // --- Documentário & Apresentação Geral ---
  loadDocInfo() {
    const saved = localStorage.getItem('ecotech_doc_info');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      title: 'Engenharia, Cidade & Clima: O Documentário',
      synopsis: 'Apresentação audiovisual do Grupo 2 explorando os pilares da sustentabilidade, os impactos das escolhas energéticas e a conscientização por meio do registro visual na feira escolar.',
      videoUrl: '',
      leadResearcher: 'Grupo 2 - Feira Multidisciplinar',
      coordinator: 'Coordenação Pedagógica',
      institution: 'Sophia Drumond',
      year: '2026'
    };
  }

  initDocPlayer() {
    const placeholder = document.getElementById('doc-placeholder');
    const videoContainer = document.getElementById('doc-player-inner');

    const titleEl = document.getElementById('doc-title-display');
    const synEl = document.getElementById('doc-synopsis-display');
    const teamEl = document.getElementById('doc-credit-team');
    const orientEl = document.getElementById('doc-credit-orient');
    const schoolEl = document.getElementById('doc-credit-school');
    const yearEl = document.getElementById('doc-credit-year');

    if (titleEl) titleEl.textContent = this.docInfo.title;
    if (synEl) synEl.textContent = this.docInfo.synopsis;
    if (teamEl) teamEl.textContent = this.docInfo.leadResearcher;
    if (orientEl) orientEl.textContent = this.docInfo.coordinator;
    if (schoolEl) schoolEl.textContent = this.docInfo.institution;
    if (yearEl) yearEl.textContent = this.docInfo.year;

    if (placeholder && videoContainer) {
      placeholder.addEventListener('click', () => {
        window.soundEngine.playPop();
        if (this.docInfo.videoUrl) {
          placeholder.classList.add('hidden');
          videoContainer.innerHTML = `
            <iframe width="100%" height="100%" src="${this.docInfo.videoUrl}?autoplay=1" 
              title="Documentário da Feira" frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen style="position: absolute; inset: 0; border: none; border-radius: var(--radius-lg);">
            </iframe>
          `;
        } else {
          alert('Vídeo institucional em edição pelo grupo! O link do YouTube pode ser inserido no Painel Admin (/admin com senha: mundoverde2).');
        }
      });
    }
  }

  // --- Navegação Principal de Abas ---
  initNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
  }

  switchTab(tabId) {
    if (this.currentTab === tabId) return;
    window.soundEngine.playClick();
    this.currentTab = tabId;

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.app-section').forEach(sec => {
      if (sec.id === `section-${tabId}`) {
        sec.classList.remove('hidden');
        sec.classList.add('active');
      } else {
        sec.classList.add('hidden');
        sec.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'games' && this.currentGameSubtab === 'wheel' && window.interactiveWheel) {
      window.interactiveWheel.draw();
    }
  }

  initGameSubnav() {
    const subnavBtns = document.querySelectorAll('.games-subnav-btn');
    const subnavContainer = document.getElementById('games-subnav');
    const hintPill = document.getElementById('games-nav-hint');

    subnavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playClick();
        const target = btn.dataset.gametab;
        this.currentGameSubtab = target;

        subnavBtns.forEach(b => b.classList.toggle('active', b.dataset.gametab === target));
        document.querySelectorAll('.game-subtab-pane').forEach(pane => {
          pane.classList.toggle('active', pane.id === `game-subtab-${target}`);
        });

        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

        if (target === 'wheel' && window.interactiveWheel) {
          setTimeout(() => window.interactiveWheel.draw(), 50);
        }
      });
    });

    if (subnavContainer && hintPill) {
      hintPill.addEventListener('click', () => {
        window.soundEngine.playPop();
        const maxScroll = subnavContainer.scrollWidth - subnavContainer.clientWidth;
        if (subnavContainer.scrollLeft >= maxScroll - 20) {
          subnavContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          subnavContainer.scrollBy({ left: 160, behavior: 'smooth' });
        }
      });

      subnavContainer.addEventListener('scroll', () => {
        const maxScroll = subnavContainer.scrollWidth - subnavContainer.clientWidth;
        if (subnavContainer.scrollLeft >= maxScroll - 20) {
          hintPill.innerHTML = '<span>Início</span> <span class="hint-arrow-anim">⬅️</span>';
        } else {
          hintPill.innerHTML = '<span>Mais jogos</span> <span class="hint-arrow-anim">➡️</span>';
        }
      }, { passive: true });
    }
  }

  // --- Mural de Visitantes ---
  loadMuralMessages() {
    const saved = localStorage.getItem('ecotech_mural_msgs');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          return list.filter(m => m && m.author !== 'Profª. Avaliadora' && m.author !== 'Lucas (Turma 201)');
        }
      } catch (e) {}
    }
    return [];
  }

  initMural() {
    this.renderMural();

    document.getElementById('mural-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('mural-name');
      const msgInput = document.getElementById('mural-msg');
      const submitBtn = document.getElementById('mural-submit-btn');

      const author = nameInput.value.trim() || 'Visitante';
      const text = msgInput.value.trim();
      if (!text) return;

      window.soundEngine.playCorrect();

      this.muralMessages.unshift({
        author: author,
        text: text,
        date: `Hoje, ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      });

      localStorage.setItem('ecotech_mural_msgs', JSON.stringify(this.muralMessages));
      nameInput.value = '';
      msgInput.value = '';

      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Depoimento Publicado! ✅</span>';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;
        }, 2000);
      }

      this.renderMural();
    });
  }

  renderMural() {
    const container = document.getElementById('mural-cards-container');
    if (!container) return;

    container.innerHTML = '';

    if (this.muralMessages.length === 0) {
      container.innerHTML = `
        <div class="mural-empty-card">
          <div style="font-size: 2.25rem; margin-bottom: 0.6rem;">💬</div>
          <h4 style="color: #ffffff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.35rem;">Seja o primeiro a assinar o mural!</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 460px; margin: 0 auto;">
            Preencha o formulário acima com seu nome e deixe um recado ou compromisso sustentável para a turma.
          </p>
        </div>
      `;
      return;
    }

    this.muralMessages.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'mural-card';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
          <span style="font-weight: 700; color: #fff; font-size: 0.95rem;">${msg.author}</span>
          <span style="font-size: 0.75rem; color: var(--text-subtle); white-space: nowrap;">${msg.date}</span>
        </div>
        <p style="color: #cbd5e1; font-style: italic; font-size: 0.92rem; line-height: 1.45;">"${msg.text}"</p>
      `;
      container.appendChild(card);
    });
  }

  // --- Controles de Topo (Som & Totem) ---
  initControls() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        audioBtn.innerHTML = isMuted
          ? '<span>🔇</span><span class="ctrl-label">Mudo</span>'
          : '<span>🔊</span><span class="ctrl-label">Som</span>';
        if (!isMuted) window.soundEngine.playPop();
      });
    }

    const fullscreenBtn = document.getElementById('fullscreen-toggle-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          fullscreenBtn.innerHTML = '<span>🗗</span><span class="ctrl-label">Sair</span>';
        } else {
          document.exitFullscreen();
          fullscreenBtn.innerHTML = '<span>⛶</span><span class="ctrl-label">Totem</span>';
        }
      });
    }
  }

  // --- Segurança & Proteção por Senha ('mundoverde2') ---
  initAdminSecurity() {
    // Gatilho secreto no rodapé
    document.getElementById('secret-admin-trigger')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.promptAdminPassword();
    });

    // Atalho de teclado Ctrl + Shift + A
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.promptAdminPassword();
      }
    });

    // Formulário de senha
    const authModal = document.getElementById('admin-auth-modal');
    const authForm = document.getElementById('admin-auth-form');
    const pwdInput = document.getElementById('admin-password-input');
    const authError = document.getElementById('admin-auth-error');

    document.getElementById('admin-auth-close-btn')?.addEventListener('click', () => {
      authModal?.classList.add('hidden');
      if (window.location.hash === '#admin') history.pushState('', document.title, window.location.pathname);
    });

    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = pwdInput.value.trim();

        if (pwd === 'mundoverde2') {
          window.soundEngine.playCorrect();
          authModal.classList.add('hidden');
          pwdInput.value = '';
          authError.classList.add('hidden');
          this.openAdminPanel();
        } else {
          window.soundEngine.playWrong();
          authError.textContent = 'Senha incorreta! Tente novamente.';
          authError.classList.remove('hidden');
          pwdInput.classList.add('shake');
          setTimeout(() => pwdInput.classList.remove('shake'), 400);
        }
      });
    }
  }

  promptAdminPassword() {
    window.soundEngine.playPop();
    const authModal = document.getElementById('admin-auth-modal');
    const pwdInput = document.getElementById('admin-password-input');
    const authError = document.getElementById('admin-auth-error');

    if (authModal) {
      authModal.classList.remove('hidden');
      if (authError) authError.classList.add('hidden');
      if (pwdInput) {
        pwdInput.value = '';
        setTimeout(() => pwdInput.focus(), 100);
      }
    }
  }

  openAdminPanel() {
    const adminModal = document.getElementById('admin-modal');
    if (adminModal) {
      this.populateAdmin();
      adminModal.classList.remove('hidden');
    }
  }

  // --- Painel Admin Master Completo ---
  initAdmin() {
    const adminModal = document.getElementById('admin-modal');
    const closeBtn = document.getElementById('admin-modal-close-btn');

    if (closeBtn && adminModal) {
      closeBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        adminModal.classList.add('hidden');
        if (window.location.hash === '#admin') history.pushState('', document.title, window.location.pathname);
      });
    }

    // Sub-abas do Painel Admin
    const subtabBtns = document.querySelectorAll('.admin-subtab-btn');
    subtabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playClick();
        const tab = btn.dataset.admintab;
        subtabBtns.forEach(b => b.classList.toggle('active', b.dataset.admintab === tab));
        document.querySelectorAll('.admin-subtab-pane').forEach(p => {
          p.classList.toggle('active', p.id === `admin-tab-${tab}`);
        });
      });
    });

    // Seletor de Cores
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundEngine.playPop();
        this.applyTheme(btn.dataset.color);
      });
    });

    // Salvar Informações Gerais
    document.getElementById('admin-save-info-btn')?.addEventListener('click', () => {
      window.soundEngine.playCorrect();
      this.projectInfo = {
        title: document.getElementById('admin-input-title').value.trim(),
        subtitle: document.getElementById('admin-input-subtitle').value.trim(),
        groupName: document.getElementById('admin-input-group').value.trim(),
        team: document.getElementById('admin-input-team').value.trim()
      };
      localStorage.setItem('ecotech_project_info', JSON.stringify(this.projectInfo));
      this.applyProjectInfo();
      alert('Dados do projeto atualizados!');
    });

    // Salvar Documentário
    document.getElementById('admin-save-doc-btn')?.addEventListener('click', () => {
      window.soundEngine.playCorrect();
      this.docInfo = {
        title: document.getElementById('admin-doc-title').value.trim(),
        synopsis: document.getElementById('admin-doc-synopsis').value.trim(),
        videoUrl: document.getElementById('admin-doc-url').value.trim(),
        leadResearcher: document.getElementById('admin-doc-team').value.trim(),
        coordinator: document.getElementById('admin-doc-orient').value.trim(),
        institution: document.getElementById('admin-doc-school').value.trim(),
        year: document.getElementById('admin-doc-year').value.trim()
      };
      localStorage.setItem('ecotech_doc_info', JSON.stringify(this.docInfo));
      this.initDocPlayer();
      alert('Informações do documentário salvas!');
    });

    // Adicionar Foto do Totem
    document.getElementById('admin-add-totem-photo-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('admin-totem-name').value.trim();
      const urlInput = document.getElementById('admin-totem-url').value.trim();
      const fileInput = document.getElementById('admin-totem-file');

      const savePhoto = (imgSrc) => {
        this.totemPhotos.unshift({
          id: `totem-${Date.now()}`,
          name: name || `Foto Oficial #${this.totemPhotos.length + 1}`,
          img: imgSrc || 'assets/hero.jpg',
          date: new Date().toLocaleDateString('pt-BR'),
          author: 'Visitante'
        });
        localStorage.setItem('ecotech_totem_photos', JSON.stringify(this.totemPhotos));
        this.renderTotemGallery();
        this.renderAdminTotemList();
        document.getElementById('admin-add-totem-photo-form').reset();
        window.soundEngine.playCorrect();
        alert('Foto adicionada ao Totem com sucesso!');
      };

      if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (re) => savePhoto(re.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        savePhoto(urlInput || 'assets/hero.jpg');
      }
    });

    // Adicionar Setor na Roleta
    document.getElementById('admin-add-wheel-sector-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const label = document.getElementById('admin-wheel-label').value.trim();
      const color = document.getElementById('admin-wheel-color').value;
      const desc = document.getElementById('admin-wheel-desc').value.trim();

      if (!label || !desc) {
        alert('Preencha o prêmio/desafio e a descrição!');
        return;
      }

      if (window.interactiveWheel) {
        window.interactiveWheel.sectors.push({
          label: label,
          color: color,
          textColor: '#ffffff',
          desc: desc
        });
        window.interactiveWheel.saveSectors(window.interactiveWheel.sectors);
        this.renderAdminWheelList();
        document.getElementById('admin-add-wheel-sector-form').reset();
        window.soundEngine.playCorrect();
        alert('Setor adicionado à Roleta!');
      }
    });

    document.getElementById('admin-reset-wheel-btn')?.addEventListener('click', () => {
      if (confirm('Restaurar os setores originais da Roleta?')) {
        window.interactiveWheel?.resetSectors();
        this.renderAdminWheelList();
        window.soundEngine.playCorrect();
        alert('Roleta restaurada para os prêmios padrão!');
      }
    });

    // Zerar Placar e Restaurar Perguntas
    document.getElementById('admin-clear-rank-btn')?.addEventListener('click', () => {
      if (confirm('Zerar o ranking de pontuações do Quiz?')) {
        localStorage.removeItem('ecotech_highscores');
        if (window.quizManager) {
          window.quizManager.highScores = [];
          window.quizManager.renderLeaderboard();
        }
        window.soundEngine.playWrong();
        alert('Ranking do Quiz zerado!');
      }
    });

    document.getElementById('admin-clear-ecosort-rank-btn')?.addEventListener('click', () => {
      if (confirm('Zerar o ranking do minigame EcoSort Express?')) {
        localStorage.removeItem('ecotech_ecosort_highscores');
        if (window.ecoSortGame) {
          window.ecoSortGame.highScores = [];
          window.ecoSortGame.renderLeaderboard();
        }
        window.soundEngine?.playWrong();
        alert('Ranking do EcoSort zerado!');
      }
    });

    document.getElementById('admin-reset-questions-btn')?.addEventListener('click', () => {
      if (confirm('Restaurar perguntas padrão do quiz?')) {
        if (window.quizManager) {
          window.quizManager.resetToDefaultQuestions();
          this.renderAdminQuestionsList();
        }
        window.soundEngine.playCorrect();
        alert('Perguntas restauradas!');
      }
    });

    // Adicionar Nova Pergunta ao Quiz
    document.getElementById('admin-add-question-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('admin-q-title')?.value.trim();
      const opt0 = document.getElementById('admin-q-opt-0')?.value.trim();
      const opt1 = document.getElementById('admin-q-opt-1')?.value.trim();
      const opt2 = document.getElementById('admin-q-opt-2')?.value.trim();
      const opt3 = document.getElementById('admin-q-opt-3')?.value.trim();
      const correctIdx = parseInt(document.getElementById('admin-q-correct')?.value || '0', 10);
      const explanation = document.getElementById('admin-q-explanation')?.value.trim();

      if (!title || !opt0 || !opt1 || !opt2 || !opt3 || !explanation) {
        alert('Preencha todos os campos da pergunta!');
        return;
      }

      if (window.quizManager) {
        const newQ = {
          question: title,
          options: [opt0, opt1, opt2, opt3],
          correct: correctIdx,
          explanation: explanation
        };
        window.quizManager.questions.push(newQ);
        window.quizManager.saveQuestions(window.quizManager.questions);
        this.renderAdminQuestionsList();
        document.getElementById('admin-add-question-form')?.reset();
        window.soundEngine?.playCorrect();
        alert('Pergunta cadastrada com sucesso no Quiz!');
      }
    });
  }

  populateAdmin() {
    document.getElementById('admin-input-title').value = this.projectInfo.title;
    document.getElementById('admin-input-subtitle').value = this.projectInfo.subtitle;
    document.getElementById('admin-input-group').value = this.projectInfo.groupName;
    document.getElementById('admin-input-team').value = this.projectInfo.team;

    document.getElementById('admin-doc-title').value = this.docInfo.title;
    document.getElementById('admin-doc-synopsis').value = this.docInfo.synopsis;
    document.getElementById('admin-doc-url').value = this.docInfo.videoUrl;
    document.getElementById('admin-doc-team').value = this.docInfo.leadResearcher;
    document.getElementById('admin-doc-orient').value = this.docInfo.coordinator;
    document.getElementById('admin-doc-school').value = this.docInfo.institution;
    document.getElementById('admin-doc-year').value = this.docInfo.year;

    this.renderAdminTotemList();
    this.renderAdminWheelList();
    this.renderAdminQuestionsList();
  }

  renderAdminTotemList() {
    const list = document.getElementById('admin-totem-list');
    if (!list) return;

    list.innerHTML = '';
    this.totemPhotos.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-q-item';
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.img}" style="width: 44px; height: 44px; object-fit: cover; border-radius: var(--radius-sm);">
          <div>
            <strong style="color: #fff; font-size: 0.9rem;">${item.name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${item.date || 'Hoje'}</div>
          </div>
        </div>
        <button type="button" class="btn-delete-q" data-idx="${idx}">Excluir</button>
      `;

      row.querySelector('.btn-delete-q')?.addEventListener('click', () => {
        if (confirm(`Remover "${item.name}"?`)) {
          this.totemPhotos.splice(idx, 1);
          localStorage.setItem('ecotech_totem_photos', JSON.stringify(this.totemPhotos));
          this.renderTotemGallery();
          this.renderAdminTotemList();
          window.soundEngine.playPop();
        }
      });

      list.appendChild(row);
    });
  }

  renderAdminWheelList() {
    const list = document.getElementById('admin-wheel-list');
    if (!list || !window.interactiveWheel) return;

    list.innerHTML = '';
    window.interactiveWheel.sectors.forEach((sec, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-q-item';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="width: 16px; height: 16px; border-radius: 50%; background: ${sec.color}; display: inline-block;"></span>
          <div>
            <strong style="color: #fff; font-size: 0.9rem;">${sec.label}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${sec.desc}</div>
          </div>
        </div>
        <button type="button" class="btn-delete-q" data-idx="${idx}">Excluir</button>
      `;

      item.querySelector('.btn-delete-q')?.addEventListener('click', () => {
        if (window.interactiveWheel.sectors.length <= 2) {
          alert('A roleta precisa de pelo menos 2 setores!');
          return;
        }
        if (confirm(`Excluir o prêmio "${sec.label}"?`)) {
          window.interactiveWheel.sectors.splice(idx, 1);
          window.interactiveWheel.saveSectors(window.interactiveWheel.sectors);
          this.renderAdminWheelList();
          window.soundEngine.playPop();
        }
      });

      list.appendChild(item);
    });
  }

  renderAdminQuestionsList() {
    const list = document.getElementById('admin-questions-list');
    if (!list || !window.quizManager) return;

    list.innerHTML = '';
    window.quizManager.questions.forEach((q, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-q-item';
      item.innerHTML = `
        <div class="admin-q-header">
          <strong>#${idx + 1}. ${q.question}</strong>
          <button type="button" class="btn-delete-q" data-idx="${idx}">Excluir</button>
        </div>
        <div class="admin-q-options-preview">
          ${q.options.map((opt, i) => `<span class="${i === q.correct ? 'opt-correct' : ''}">${i === q.correct ? '✅ ' : '• '}${opt}</span>`).join(' | ')}
        </div>
      `;

      item.querySelector('.btn-delete-q')?.addEventListener('click', () => {
        if (confirm(`Excluir pergunta #${idx + 1}?`)) {
          window.quizManager.questions.splice(idx, 1);
          window.quizManager.saveQuestions(window.quizManager.questions);
          this.renderAdminQuestionsList();
          window.soundEngine.playPop();
        }
      });

      list.appendChild(item);
    });
  }

  // --- Gerador do Cartaz de QR Code da Feira (1 Folha A4 ou 2 Folhas A4 Gigante) ---
  initPosterManager() {
    const posterModal = document.getElementById('poster-modal');
    const closeBtn = document.getElementById('poster-modal-close-btn');
    const headerPosterBtn = document.getElementById('btn-header-poster');
    const totemPosterBtn = document.getElementById('btn-open-poster-modal');
    const modeSingleBtn = document.getElementById('poster-mode-single-btn');
    const modeSplitBtn = document.getElementById('poster-mode-split-btn');
    const urlInput = document.getElementById('poster-url-input');
    const updateUrlBtn = document.getElementById('poster-update-url-btn');
    const printBtn = document.getElementById('btn-print-poster-action');
    const downloadQrBtn = document.getElementById('btn-download-qr-img');

    this.posterMode = 'single'; // 'single' ou 'split'
    this.posterTargetUrl = this.getPublicUrl();

    if (urlInput) urlInput.value = this.posterTargetUrl;

    const openModal = () => {
      window.soundEngine.playPop();
      if (urlInput) urlInput.value = this.posterTargetUrl;
      posterModal?.classList.remove('hidden');
      this.renderPosterPreview();
    };

    headerPosterBtn?.addEventListener('click', openModal);
    totemPosterBtn?.addEventListener('click', openModal);

    closeBtn?.addEventListener('click', () => {
      window.soundEngine.playClick();
      posterModal?.classList.add('hidden');
    });

    modeSingleBtn?.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.posterMode = 'single';
      modeSingleBtn.classList.add('active');
      modeSplitBtn?.classList.remove('active');
      this.renderPosterPreview();
    });

    modeSplitBtn?.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.posterMode = 'split';
      modeSplitBtn?.classList.add('active');
      modeSingleBtn?.classList.remove('active');
      this.renderPosterPreview();
    });

    updateUrlBtn?.addEventListener('click', () => {
      window.soundEngine.playClick();
      const val = urlInput?.value.trim();
      if (val) {
        this.posterTargetUrl = val;
        this.renderPosterPreview();
      }
    });

    printBtn?.addEventListener('click', async () => {
      window.soundEngine.playCorrect();
      await this.preparePrintPoster();
      window.print();
    });

    downloadQrBtn?.addEventListener('click', async () => {
      window.soundEngine.playCorrect();
      if (typeof QRCode !== 'undefined') {
        const dataUrl = await QRCode.toDataURL(this.posterTargetUrl, {
          width: 1024,
          margin: 2,
          color: { dark: '#022c22', light: '#ffffff' }
        });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'QRCode_Oficial_EcoTech.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

  async renderPosterPreview() {
    const preview = document.getElementById('poster-preview-container');
    if (!preview || typeof QRCode === 'undefined') return;

    preview.innerHTML = '<div style="padding: 1.5rem; color: #64748b;">Gerando pré-visualização do QR Code...</div>';

    try {
      const qrDataUrl = await QRCode.toDataURL(this.posterTargetUrl, {
        width: 800,
        margin: 2,
        color: { dark: '#042f2e', light: '#ffffff' }
      });

      if (this.posterMode === 'single') {
        preview.innerHTML = `
          <div class="poster-sheet-preview">
            <div style="font-size: 0.8rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              🌱 Feira Multidisciplinar Escolar 2026
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">
              EcoTech: Engenharia & Sustentabilidade
            </h3>
            <p style="font-size: 0.78rem; color: #475569; margin-bottom: 0.75rem;">
              Aponte a câmera do seu celular (iPhone, Samsung ou Motorola) para abrir o site do estande!
            </p>
            <img src="${qrDataUrl}" style="width: 200px; height: 200px; margin: 0 auto; display: block; border: 3px solid #0f172a; border-radius: 8px;">
            <div style="margin-top: 0.75rem; font-size: 0.75rem; font-weight: 700; color: #0f172a;">
              Grupo 2 &bull; Sophia Drumond, Miguel e Equipe
            </div>
            <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.2rem;">
              Fotos do Totem • Quiz 20s • Simulador em Tempo Real • Roleta
            </div>
          </div>
        `;
      } else {
        preview.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
            <div class="poster-sheet-preview" style="border-color: #0284c7;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #0284c7; text-transform: uppercase;">
                📄 FOLHA 1 (SUPERIOR) &bull; A4
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0.35rem 0;">
                🌱 EcoTech: Estande da Feira Escolar
              </h4>
              <div style="font-size: 0.75rem; color: #475569; margin-bottom: 0.5rem;">
                Aponte a câmera do celular para abrir!
              </div>
              <div style="width: 200px; height: 100px; overflow: hidden; margin: 0 auto; border: 2px solid #0f172a; border-bottom: 2px dashed #dc2626;">
                <img src="${qrDataUrl}" style="width: 200px; height: 200px; margin-top: 0;">
              </div>
              <div style="font-size: 0.7rem; color: #dc2626; font-weight: 700; margin-top: 0.35rem;">
                ✂️ Linha de Corte e União com a Folha 2
              </div>
            </div>

            <div class="poster-sheet-preview" style="border-color: #10b981;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase;">
                📄 FOLHA 2 (INFERIOR) &bull; A4
              </div>
              <div style="background: #e0f2fe; color: #0369a1; padding: 0.2rem; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.4rem; border-radius: 3px;">
                ⬆️ Fita adesiva: cole a borda da Folha 1 aqui
              </div>
              <div style="width: 200px; height: 100px; overflow: hidden; margin: 0 auto; border: 2px solid #0f172a; border-top: none;">
                <img src="${qrDataUrl}" style="width: 200px; height: 200px; margin-top: -100px;">
              </div>
              <div style="margin-top: 0.4rem; font-size: 0.75rem; font-weight: 700; color: #0f172a;">
                Sophia Drumond, Miguel e Equipe &bull; Grupo 2
              </div>
            </div>
          </div>
        `;
      }
    } catch (e) {
      preview.innerHTML = `<div style="color: #f43f5e; padding: 1rem;">Erro ao gerar QR Code: ${e.message}</div>`;
    }
  }

  async preparePrintPoster() {
    const printContainer = document.getElementById('print-poster-container');
    if (!printContainer || typeof QRCode === 'undefined') return;

    const qrDataUrl = await QRCode.toDataURL(this.posterTargetUrl, {
      width: 1400,
      margin: 2,
      color: { dark: '#022c22', light: '#ffffff' }
    });

    if (this.posterMode === 'single') {
      printContainer.innerHTML = `
        <div class="print-page-a4">
          <div>
            <div style="font-size: 14pt; font-weight: 900; color: #047857; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
              🌱 FEIRA MULTIDISCIPLINAR ESCOLAR 2026
            </div>
            <h1 style="font-size: 26pt; font-weight: 900; color: #0f172a; margin: 0; line-height: 1.1;">
              EcoTech: Engenharia Sustentável
            </h1>
            <p style="font-size: 13pt; font-weight: 600; color: #334155; margin-top: 8px;">
              📱 Aponte a câmera do seu celular para abrir o site do estande!
            </p>
          </div>

          <div style="margin: 15px 0;">
            <img src="${qrDataUrl}" class="print-qr-img" style="width: 140mm; height: 140mm;">
          </div>

          <div>
            <div style="font-size: 14pt; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              Grupo 2 &bull; Sophia Drumond, Miguel e Equipe
            </div>
            <div style="font-size: 11pt; color: #475569;">
              Fotos no Totem de Papelão &bull; Quiz de Sustentabilidade &bull; Simulador da Cidade &bull; Roleta de Prêmios
            </div>
            <div style="font-size: 9pt; color: #94a3b8; margin-top: 6px;">
              Compatível com iPhone, Samsung, Motorola e todos os smartphones.
            </div>
          </div>
        </div>
      `;
    } else {
      // 2 FOLHAS GIGANTE
      printContainer.innerHTML = `
        <!-- FOLHA 1: PARTE SUPERIOR -->
        <div class="print-page-a4">
          <div>
            <div style="font-size: 14pt; font-weight: 900; color: #047857; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
              🌱 ECOTECH &bull; FEIRA ESCOLAR 2026 (FOLHA 1 DE 2)
            </div>
            <h1 style="font-size: 28pt; font-weight: 900; color: #0f172a; margin: 0; line-height: 1.1;">
              APONTE A CÂMERA DO CELULAR
            </h1>
            <p style="font-size: 14pt; font-weight: 700; color: #0369a1; margin-top: 8px;">
              Acesse fotos, quiz interativo de 20s e simulador do estande!
            </p>
          </div>

          <div style="width: 170mm; height: 85mm; overflow: hidden; margin: 10px auto; border: 4px solid #000; border-bottom: none;">
            <img src="${qrDataUrl}" style="width: 170mm; height: 170mm; display: block; margin-top: 0;">
          </div>

          <div class="print-cut-line">
            ✂️ CORTE EXATAMENTE NESTA LINHA E COLE COM FITA ADESIVA NA FOLHA 2
          </div>
        </div>

        <!-- FOLHA 2: PARTE INFERIOR -->
        <div class="print-page-a4">
          <div class="print-glue-tab">
            ⬆️ ÁREA DE COLAGEM: SOBROPONHA A FOLHA 1 AQUI E FIXE COM FITA
          </div>

          <div style="width: 170mm; height: 85mm; overflow: hidden; margin: 10px auto; border: 4px solid #000; border-top: none;">
            <img src="${qrDataUrl}" style="width: 170mm; height: 170mm; display: block; margin-top: -85mm;">
          </div>

          <div>
            <h2 style="font-size: 20pt; font-weight: 900; color: #0f172a; margin: 0 0 6px 0;">
              Grupo 2 &bull; Sophia Drumond, Miguel e Equipe
            </h2>
            <div style="font-size: 12pt; font-weight: 600; color: #334155;">
              Tire sua foto no nosso Totem de Papelão e participe da Roleta de Prêmios!
            </div>
            <div style="font-size: 9pt; color: #64748b; margin-top: 6px;">
              Feira Multidisciplinar Escolar 2026 &bull; Projeto Estande Interativo
            </div>
          </div>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appMaster = new AppMasterController();
});
