/**
 * Roleta Interativa de Desafios e Prêmios da Feira
 * Rotação fluida com Canvas 2D, som de catraca e física realista.
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
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.spinBtn = document.getElementById('wheel-spin-btn');
    this.resultModal = document.getElementById('wheel-result-modal');
    this.resultTitle = document.getElementById('wheel-result-title');
    this.resultDesc = document.getElementById('wheel-result-desc');
    this.resultCloseBtn = document.getElementById('wheel-modal-close-btn');

    this.angle = 0;
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastSectorIndex = -1;

    if (this.canvas) {
      this.initEvents();
      this.draw();
    }
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
        window.soundEngine.playClick();
        this.resultModal?.classList.add('hidden');
      });
    }
  }

  draw() {
    if (!this.ctx) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 15;
    const numSectors = this.sectors.length;
    const arc = (2 * Math.PI) / numSectors;

    this.ctx.clearRect(0, 0, width, height);

    // Borda externa brilhante
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 6;
    this.ctx.shadowColor = '#10b981';
    this.ctx.shadowBlur = 15;
    this.ctx.stroke();
    this.ctx.restore();

    // Desenho dos setores
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

      // Texto do setor
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(startAngle + arc / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = sector.textColor || '#ffffff';
      this.ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      this.ctx.shadowColor = 'rgba(0,0,0,0.6)';
      this.ctx.shadowBlur = 4;
      this.ctx.fillText(sector.label, radius - 25, 5);
      this.ctx.restore();
    }

    // Pino central cromado
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fill();
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#10b981';
    this.ctx.fill();
    this.ctx.restore();
  }

  spin() {
    if (this.isSpinning) return;
    window.soundEngine.playPop();
    this.isSpinning = true;
    if (this.spinBtn) this.spinBtn.disabled = true;

    // Velocidade inicial alta aleatória (entre 0.35 e 0.5 radianos/frame)
    this.angularVelocity = 0.35 + Math.random() * 0.2;
    this.deceleration = 0.988 + Math.random() * 0.003; // Fricção suave

    this.animateSpin();
  }

  animateSpin() {
    this.angle += this.angularVelocity;
    this.angularVelocity *= this.deceleration;

    // Identificar setor apontado pelo pino superior (ângulo de 270° ou -PI/2)
    const numSectors = this.sectors.length;
    const arc = (2 * Math.PI) / numSectors;
    const normalizedAngle = (2 * Math.PI - (this.angle % (2 * Math.PI))) % (2 * Math.PI);
    // Pino fica no topo (3 * Math.PI / 2)
    const pointerAngle = (normalizedAngle + 3 * Math.PI / 2) % (2 * Math.PI);
    const currentSectorIdx = Math.floor(pointerAngle / arc) % numSectors;

    if (currentSectorIdx !== this.lastSectorIndex) {
      window.soundEngine.playWheelTick();
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
    window.soundEngine.playWin();

    if (this.resultTitle) this.resultTitle.textContent = sector.label;
    if (this.resultDesc) this.resultDesc.textContent = sector.desc;

    if (this.resultModal) {
      this.resultModal.classList.remove('hidden');
    }

    // Efeito de confetes visuais simples
    this.triggerConfetti();
  }

  triggerConfetti() {
    const container = document.querySelector('.wheel-container');
    if (!container) return;

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

window.interactiveWheel = new InteractiveWheel();
