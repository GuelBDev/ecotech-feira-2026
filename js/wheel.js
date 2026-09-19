/**
 * Roleta Interativa de Desafios e Prêmios da Feira
 * Rotação fluida com Canvas 2D HiDPI, som de catraca, física realista e efeitos visuais.
 * Projeto EcoTech - Feira Escolar 2026
 */

const DEFAULT_WHEEL_SECTORS = [
  { label: '🎁 Ganhou 1 Doce!', color: '#10b981', textColor: '#ffffff', desc: 'Parabéns! Retire um doce delicioso com a nossa equipe no estande!' },
  { label: '🧠 Pergunta Bônus', color: '#0ea5e9', textColor: '#ffffff', desc: 'Responda a uma pergunta rápida feita pelo grupo e mostre seu conhecimento!' },
  { label: '🌱 Hábito Verde', color: '#84cc16', textColor: '#0f172a', desc: 'Compartilhe com a banca: qual hábito sustentável você pratica em casa?' },
  { label: '⚡ Gire Mais Uma Vez', color: '#f59e0b', textColor: '#0f172a', desc: 'A sorte está com você! Gire a roleta novamente para tentar outro prêmio!' },
  { label: '🎯 Desafio 30s', color: '#8b5cf6', textColor: '#ffffff', desc: 'Consiga mais de 500 pontos no minigame EcoSort Express!' },
  { label: '📸 Foto no Totem!', color: '#ec4899', textColor: '#ffffff', desc: 'Tire uma foto oficial no totem do nosso estande para o mural!' },
  { label: '💡 Curiosidade', color: '#14b8a6', textColor: '#ffffff', desc: 'Sabia que reciclar 1 lata de alumínio economiza energia para ligar uma TV por 3 horas?' },
  { label: '🍬 Brinde Especial', color: '#f43f5e', textColor: '#ffffff', desc: 'Você ganhou um brinde especial da equipe Sophia Drumond & Miguel!' }
];

class InteractiveWheel {
  constructor() {
    this.sectors = this.loadSectors();
    this.canvas = document.getElementById('wheel-canvas');
    this.spinBtn = document.getElementById('wheel-spin-btn');
    this.resultModal = document.getElementById('wheel-result-modal');
    this.resultTitle = document.getElementById('wheel-result-title');
    this.resultDesc = document.getElementById('wheel-result-desc');
    this.resultCloseBtn = document.getElementById('wheel-modal-close-btn');

    this.angle = 0;
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastSectorIndex = -1;
    this.baseSize = 440;

    if (this.canvas) {
      this.setupCanvas();
      this.initEvents();
      this.draw();
    }
  }

  setupCanvas() {
    if (!this.canvas) return;
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    this.canvas.width = this.baseSize * dpr;
    this.canvas.height = this.baseSize * dpr;
    this.canvas.style.width = `${this.baseSize}px`;
    this.canvas.style.height = `${this.baseSize}px`;
    this.canvas.style.maxWidth = '100%';
    this.canvas.style.aspectRatio = '1 / 1';

    this.ctx = this.canvas.getContext('2d');
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  loadSectors() {
    const saved = localStorage.getItem('ecotech_wheel_sectors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      } catch (e) {}
    }
    return [...DEFAULT_WHEEL_SECTORS];
  }

  saveSectors(newSectors) {
    this.sectors = newSectors;
    localStorage.setItem('ecotech_wheel_sectors', JSON.stringify(newSectors));
    this.draw();
  }

  resetSectors() {
    this.sectors = [...DEFAULT_WHEEL_SECTORS];
    localStorage.removeItem('ecotech_wheel_sectors');
    this.draw();
  }

  initEvents() {
    if (this.spinBtn) {
      this.spinBtn.addEventListener('click', () => this.spin());
    }

    if (this.resultCloseBtn) {
      this.resultCloseBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        this.resultModal?.classList.add('hidden');
      });
    }

    // Fechar ao clicar no fundo do modal
    if (this.resultModal) {
      this.resultModal.addEventListener('click', (e) => {
        if (e.target === this.resultModal) {
          this.resultModal.classList.add('hidden');
        }
      });
    }

    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.draw();
    });
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const size = this.baseSize;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 16;
    const numSectors = this.sectors.length;
    const arc = (2 * Math.PI) / numSectors;

    this.ctx.clearRect(0, 0, size, size);

    // Borda externa com neon glow
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 6;
    this.ctx.shadowColor = '#10b981';
    this.ctx.shadowBlur = 15;
    this.ctx.stroke();
    this.ctx.restore();

    // Setores da roleta
    for (let i = 0; i < numSectors; i++) {
      const sector = this.sectors[i];
      const startAngle = this.angle + i * arc;
      const endAngle = startAngle + arc;

      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      this.ctx.fillStyle = sector.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Rótulos nos setores
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(startAngle + arc / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = sector.textColor || '#ffffff';
      this.ctx.font = 'bold 13.5px "Plus Jakarta Sans", sans-serif';
      this.ctx.shadowColor = 'rgba(0,0,0,0.6)';
      this.ctx.shadowBlur = 4;
      this.ctx.fillText(sector.label, radius - 22, 5);
      this.ctx.restore();
    }

    // Pino central cromado
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fill();
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 14, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#10b981';
    this.ctx.fill();
    this.ctx.restore();
  }

  spin() {
    if (this.isSpinning) return;
    if (window.soundEngine) window.soundEngine.playPop();
    this.isSpinning = true;
    if (this.spinBtn) this.spinBtn.disabled = true;

    // Velocidade inicial (entre 0.38 e 0.55 radianos/frame)
    this.angularVelocity = 0.38 + Math.random() * 0.17;
    this.deceleration = 0.988 + Math.random() * 0.003;

    this.animateSpin();
  }

  animateSpin() {
    this.angle += this.angularVelocity;
    this.angularVelocity *= this.deceleration;

    // Identificar setor apontado pelo pino superior (270° ou -PI/2)
    const numSectors = this.sectors.length;
    const arc = (2 * Math.PI) / numSectors;
    const normalizedAngle = (2 * Math.PI - (this.angle % (2 * Math.PI))) % (2 * Math.PI);
    const pointerAngle = (normalizedAngle + (3 * Math.PI) / 2) % (2 * Math.PI);
    const currentSectorIdx = Math.floor(pointerAngle / arc) % numSectors;

    if (currentSectorIdx !== this.lastSectorIndex) {
      if (window.soundEngine) window.soundEngine.playWheelTick();
      this.lastSectorIndex = currentSectorIdx;
    }

    this.draw();

    if (this.angularVelocity > 0.002) {
      requestAnimationFrame(() => this.animateSpin());
    } else {
      this.isSpinning = false;
      if (this.spinBtn) this.spinBtn.disabled = false;
      this.showResult(this.sectors[currentSectorIdx]);
    }
  }

  showResult(sector) {
    if (window.soundEngine) window.soundEngine.playWin();

    if (this.resultTitle) this.resultTitle.textContent = sector.label;
    if (this.resultDesc) this.resultDesc.textContent = sector.desc;

    if (this.resultModal) {
      this.resultModal.classList.remove('hidden');
    }

    this.triggerConfetti();
  }

  triggerConfetti() {
    const container = document.querySelector('.wheel-container') || document.body;

    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.left = `${50 + (Math.random() - 0.5) * 60}%`;
      p.style.top = '40%';
      p.style.backgroundColor = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)];
      p.style.setProperty('--tx', `${(Math.random() - 0.5) * 260}px`);
      p.style.setProperty('--ty', `${(Math.random() - 0.7) * 260}px`);
      container.appendChild(p);

      setTimeout(() => p.remove(), 1200);
    }
  }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.interactiveWheel = new InteractiveWheel();
  });
} else {
  window.interactiveWheel = new InteractiveWheel();
}
