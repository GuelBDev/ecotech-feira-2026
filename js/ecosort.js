/**
 * EcoSort Express - Minigame de Separação Rápida
 * Teste de reflexo e conhecimento ecológico contra o relógio de 30 segundos.
 */

const SORT_ITEMS = [
  { name: 'Painel Solar', icon: '☀️', type: 'clean', desc: 'Gera energia limpa sem emissões' },
  { name: 'Carvão Mineral', icon: '🪨', type: 'polluter', desc: 'Combustível fóssil que emite CO₂ e poluentes' },
  { name: 'Garrafa PET Vazia', icon: '🧴', type: 'clean', desc: 'Plástico 100% reciclável para novos produtos' },
  { name: 'Óleo Usado na Pia', icon: '🛢️', type: 'polluter', desc: '1 litro de óleo contamina milhares de litros de água' },
  { name: 'Turbina Eólica', icon: '💨', type: 'clean', desc: 'Aproveita a força dos ventos' },
  { name: 'Pilha no Lixo Comum', icon: '🔋', type: 'polluter', desc: 'Metais pesados que contaminam o solo e lençol freático' },
  { name: 'Restos de Frutas', icon: '🍎', type: 'clean', desc: 'Matéria orgânica ideal para compostagem e adubo' },
  { name: 'Copo Descartável', icon: '🥤', type: 'polluter', desc: 'Uso de 2 minutos que polui por centenas de anos' },
  { name: 'Lâmpada LED', icon: '💡', type: 'clean', desc: 'Economiza até 80% de energia em relação à incandescente' },
  { name: 'Queima de Pneus', icon: '🔥', type: 'polluter', desc: 'Gera fumaça densa e substâncias altamente tóxicas' },
  { name: 'Caixa de Papelão', icon: '📦', type: 'clean', desc: 'Fibra vegetal que pode ser reciclada múltiplas vezes' },
  { name: 'Sacola Plástica Fina', icon: '🛍️', type: 'polluter', desc: 'Polui oceanos e entope bueiros causando enchentes' },
  { name: 'Bicicleta Elétrica', icon: '🚲', type: 'clean', desc: 'Mobilidade urbana sem emissão direta de gases' },
  { name: 'Esgoto sem Tratamento', icon: '🧪', type: 'polluter', desc: 'Destrói ecossistemas aquáticos e espalha doenças' },
  { name: 'Frasco de Vidro', icon: '🫙', type: 'clean', desc: 'Material infinitamente reciclável sem perder qualidade' }
];

class EcoSortGame {
  constructor() {
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.timeLeft = 30;
    this.timerInterval = null;
    this.isPlaying = false;
    this.currentItem = null;

    // Elementos DOM
    this.startScreen = document.getElementById('ecosort-start-screen');
    this.gameScreen = document.getElementById('ecosort-game-screen');
    this.endScreen = document.getElementById('ecosort-end-screen');

    this.card = document.getElementById('sort-card');
    this.cardIcon = document.getElementById('sort-card-icon');
    this.cardTitle = document.getElementById('sort-card-title');
    this.cardDesc = document.getElementById('sort-card-desc');

    this.timerDisplay = document.getElementById('ecosort-timer');
    this.scoreDisplay = document.getElementById('ecosort-score');
    this.streakDisplay = document.getElementById('ecosort-streak');

    this.leftBtn = document.getElementById('sort-btn-clean');
    this.rightBtn = document.getElementById('sort-btn-polluter');

    this.initEvents();
  }

  initEvents() {
    const startBtn = document.getElementById('ecosort-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }

    const restartBtn = document.getElementById('ecosort-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.startGame());
    }

    if (this.leftBtn) {
      this.leftBtn.addEventListener('click', () => this.handleChoice('clean'));
    }

    if (this.rightBtn) {
      this.rightBtn.addEventListener('click', () => this.handleChoice('polluter'));
    }

    // Suporte para teclas de seta do teclado (Esquerda / Direita)
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === 'ArrowLeft') {
        this.leftBtn?.classList.add('active');
        this.handleChoice('clean');
        setTimeout(() => this.leftBtn?.classList.remove('active'), 150);
      } else if (e.key === 'ArrowRight') {
        this.rightBtn?.classList.add('active');
        this.handleChoice('polluter');
        setTimeout(() => this.rightBtn?.classList.remove('active'), 150);
      }
    });

    // Touch / Drag simples
    this.initDragEvents();
  }

  initDragEvents() {
    if (!this.card) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const onStart = (clientX) => {
      if (!this.isPlaying) return;
      startX = clientX;
      currentX = clientX;
      isDragging = true;
      this.card.style.transition = 'none';
    };

    const onMove = (clientX) => {
      if (!isDragging) return;
      currentX = clientX;
      const diffX = currentX - startX;
      const rot = diffX * 0.08;
      this.card.style.transform = `translateX(${diffX}px) rotate(${rot}deg)`;

      if (diffX < -50) {
        this.leftBtn?.classList.add('highlight');
        this.rightBtn?.classList.remove('highlight');
      } else if (diffX > 50) {
        this.rightBtn?.classList.add('highlight');
        this.leftBtn?.classList.remove('highlight');
      } else {
        this.leftBtn?.classList.remove('highlight');
        this.rightBtn?.classList.remove('highlight');
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      this.card.style.transition = 'transform 0.25s ease-out';
      const diffX = currentX - startX;

      this.leftBtn?.classList.remove('highlight');
      this.rightBtn?.classList.remove('highlight');

      if (diffX < -80) {
        this.handleChoice('clean');
      } else if (diffX > 80) {
        this.handleChoice('polluter');
      } else {
        this.card.style.transform = 'translateX(0) rotate(0deg)';
      }
    };

    this.card.addEventListener('mousedown', (e) => onStart(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', () => onEnd());

    this.card.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', () => onEnd());
  }

  startGame() {
    window.soundEngine.playClick();
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.timeLeft = 30;
    this.isPlaying = true;

    this.startScreen.classList.add('hidden');
    this.endScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');

    this.updateStats();
    this.nextItem();

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timerDisplay) this.timerDisplay.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 5 && this.timeLeft > 0) {
        window.soundEngine.playTick();
        this.timerDisplay?.classList.add('urgent');
      }

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  nextItem() {
    // Escolhe um item aleatório diferente do atual
    const available = SORT_ITEMS.filter(item => item !== this.currentItem);
    this.currentItem = available[Math.floor(Math.random() * available.length)];

    if (this.card) {
      this.card.style.transform = 'scale(0.8) translateY(20px)';
      this.card.style.opacity = '0';

      setTimeout(() => {
        if (this.cardIcon) this.cardIcon.textContent = this.currentItem.icon;
        if (this.cardTitle) this.cardTitle.textContent = this.currentItem.name;
        if (this.cardDesc) this.cardDesc.textContent = this.currentItem.desc;

        this.card.style.transform = 'scale(1) translateY(0) rotate(0deg)';
        this.card.style.opacity = '1';
      }, 50);
    }
  }

  handleChoice(choice) {
    if (!this.isPlaying || !this.currentItem) return;

    const isCorrect = choice === this.currentItem.type;

    if (isCorrect) {
      window.soundEngine.playCorrect();
      this.streak++;
      this.correctCount++;
      const multiplier = 1 + Math.min(this.streak - 1, 5) * 0.2;
      this.score += Math.round(50 * multiplier);
      this.showCardFeedback(true);
    } else {
      window.soundEngine.playWrong();
      this.streak = 0;
      this.wrongCount++;
      this.score = Math.max(0, this.score - 30);
      this.showCardFeedback(false);
    }

    this.updateStats();
    this.nextItem();
  }

  showCardFeedback(isSuccess) {
    const feedbackEffect = document.createElement('div');
    feedbackEffect.className = `floating-feedback ${isSuccess ? 'correct' : 'wrong'}`;
    feedbackEffect.textContent = isSuccess ? '+Pontos!' : '-30';
    document.querySelector('.sort-deck-area')?.appendChild(feedbackEffect);

    setTimeout(() => feedbackEffect.remove(), 800);
  }

  updateStats() {
    if (this.scoreDisplay) this.scoreDisplay.textContent = this.score;
    if (this.timerDisplay) this.timerDisplay.textContent = `${this.timeLeft}s`;
    if (this.streakDisplay) {
      if (this.streak > 1) {
        this.streakDisplay.textContent = `🔥 Combo x${(1 + Math.min(this.streak - 1, 5) * 0.2).toFixed(1)}`;
        this.streakDisplay.classList.remove('hidden');
      } else {
        this.streakDisplay.classList.add('hidden');
      }
    }
  }

  endGame() {
    clearInterval(this.timerInterval);
    this.isPlaying = false;
    window.soundEngine.playWin();

    this.gameScreen.classList.add('hidden');
    this.endScreen.classList.remove('hidden');

    const total = this.correctCount + this.wrongCount;
    const accuracy = total > 0 ? Math.round((this.correctCount / total) * 100) : 0;

    document.getElementById('ecosort-final-score').textContent = this.score;
    document.getElementById('ecosort-correct-val').textContent = this.correctCount;
    document.getElementById('ecosort-wrong-val').textContent = this.wrongCount;
    document.getElementById('ecosort-accuracy-val').textContent = `${accuracy}%`;

    let rankTitle = 'Reciclador Mirim 🌿';
    if (this.score >= 1000) rankTitle = 'Engenheiro Ecológico Lendário! 🏆';
    else if (this.score >= 600) rankTitle = 'Guardião da Reciclagem Rápida ⚡';
    else if (this.score >= 350) rankTitle = 'Agente da Coleta Consciente 🌱';

    document.getElementById('ecosort-rank-title').textContent = rankTitle;
  }
}

window.ecoSortGame = new EcoSortGame();
