/**
 * EcoSort Express - Minigame Arcade de Separação Rápida
 * Teste de reflexo, raciocínio e conhecimento ecológico contra o relógio de 30 segundos.
 * Projeto EcoTech - Feira Escolar 2026
 */

const SORT_ITEMS = [
  // Sustentáveis / Renováveis / Recicláveis (clean)
  { name: 'Painel Solar', icon: '☀️', type: 'clean', desc: 'Gera energia limpa sem emissão de gases' },
  { name: 'Turbina Eólica', icon: '💨', type: 'clean', desc: 'Aproveita a força dos ventos para produzir eletricidade' },
  { name: 'Garrafa PET Vazia', icon: '🧴', type: 'clean', desc: 'Plástico 100% reciclável para novos produtos e tecidos' },
  { name: 'Restos de Frutas', icon: '🍎', type: 'clean', desc: 'Matéria orgânica excelente para adubo e compostagem' },
  { name: 'Lâmpada LED', icon: '💡', type: 'clean', desc: 'Consome até 85% menos eletricidade que lâmpadas antigas' },
  { name: 'Caixa de Papelão', icon: '📦', type: 'clean', desc: 'Fibra celulósica que pode ser reciclada múltiplas vezes' },
  { name: 'Bicicleta Elétrica', icon: '🚲', type: 'clean', desc: 'Mobilidade urbana ágil sem emissão direta de CO₂' },
  { name: 'Frasco de Vidro', icon: '🫙', type: 'clean', desc: 'Vidro é 100% e infinitamente reciclável sem perda' },
  { name: 'Lata de Alumínio', icon: '🥫', type: 'clean', desc: 'Reciclar consome 95% menos energia que extrair bauxita' },
  { name: 'Casca de Banana', icon: '🍌', type: 'clean', desc: 'Fonte orgânica rica em potássio para enriquecer o solo' },
  { name: 'Jornal / Revista', icon: '📰', type: 'clean', desc: 'Papel limpo para desfibramento e nova celulose' },
  { name: 'Telhado Verde', icon: '🌿', type: 'clean', desc: 'Isola térmicamente o edifício e retém água de chuva' },
  { name: 'Pavimento Permeável', icon: '🧱', type: 'clean', desc: 'Evita enchentes e recarrega os lençóis freáticos' },
  { name: 'Bateria Recarregável', icon: '🔋', type: 'clean', desc: 'Substitui centenas de pilhas descartáveis poluentes' },
  { name: 'Aquecedor Solar Térmico', icon: '🚿', type: 'clean', desc: 'Usa a radiação solar para aquecer água do banho' },
  { name: 'Compostagem Doméstica', icon: '🌱', type: 'clean', desc: 'Ciclo biológico que transforma lixo orgânico em vida' },
  { name: 'Biodigestor Rural', icon: '🌾', type: 'clean', desc: 'Gera biogás combustível a partir de esterco e biomassa' },
  { name: 'Sacola de Pano (Ecobag)', icon: '👜', type: 'clean', desc: 'Reutilizável por anos, substitui plásticos descartáveis' },
  { name: 'Carro Elétrico Urbano', icon: '🚗', type: 'clean', desc: 'Zero emissões pelo escapamento e alta eficiência motora' },
  { name: 'Garrafa Térmica Inox', icon: '🥤', type: 'clean', desc: 'Elimina dezenas de copos descartáveis por semana' },

  // Poluentes / Rejeitos / Tóxicos (polluter)
  { name: 'Carvão Mineral', icon: '🪨', type: 'polluter', desc: 'Combustível fóssil que mais emite CO₂ e fuligem tóxica' },
  { name: 'Óleo Usado na Pia', icon: '🛢️', type: 'polluter', desc: '1 litro contamina milhares de litros de água de rios' },
  { name: 'Pilha no Lixo Comum', icon: '🔋', type: 'polluter', desc: 'Metais pesados como cádmio que envenenam o solo' },
  { name: 'Copo Descartável', icon: '🥤', type: 'polluter', desc: 'Uso de 2 minutos que polui o meio ambiente por séculos' },
  { name: 'Queima de Pneus', icon: '🔥', type: 'polluter', desc: 'Fumaça altamente cancerígena e poluente atmosférica' },
  { name: 'Sacola Plástica Fina', icon: '🛍️', type: 'polluter', desc: 'Entope bueiros na cidade e sufoca animais nos oceanos' },
  { name: 'Esgoto sem Tratamento', icon: '🧪', type: 'polluter', desc: 'Transmite doenças graves e mata peixes e rios' },
  { name: 'Canudo Plástico Descartável', icon: '🥤', type: 'polluter', desc: 'Resíduo de uso único que ameaça tartarugas marinhas' },
  { name: 'Bateria Chumbo-Ácido Abandonada', icon: '🚙', type: 'polluter', desc: 'Ácido sulfúrico altamente corrosivo e tóxico' },
  { name: 'Isopor Não Reciclado', icon: '📦', type: 'polluter', desc: 'Fragmenta-se em microplásticos perigosos na natureza' },
  { name: 'Lixo Eletrônico no Rio', icon: '💻', type: 'polluter', desc: 'Placas com mercúrio e chumbo que intoxicam a água' },
  { name: 'Termelétrica a Diesel', icon: '🏭', type: 'polluter', desc: 'Gera energia queimando combustível fóssil poluente' },
  { name: 'Remédio Vencido na Descarga', icon: '💊', type: 'polluter', desc: 'Contamina a fauna aquática com hormônios e antibióticos' },
  { name: 'Agrotóxico Proibido', icon: '☣️', type: 'polluter', desc: 'Mata abelhas polinizadoras e contamina nascentes' },
  { name: 'Garfo Plástico Descartável', icon: '🍴', type: 'polluter', desc: 'Resíduo não biodegradável que sobrecarrega aterros' },
  { name: 'Bituca de Cigarro no Chão', icon: '🚬', type: 'polluter', desc: 'Filtro plástico com mais de 4 mil substâncias tóxicas' },
  { name: 'Embalagem Metalizada (Snacks)', icon: '🍿', type: 'polluter', desc: 'Multicamadas plásticas com difícil reciclabilidade' },
  { name: 'Escova Dental Velha no Mar', icon: '🪥', type: 'polluter', desc: 'Plástico rígido que leva mais de 400 anos para se decompor' },
  { name: 'Lata de Aerossol Tóxico', icon: '🧴', type: 'polluter', desc: 'Embalagem sob pressão com resíduos voláteis nocivos' },
  { name: 'Óleo de Motor na Terra', icon: '🛢️', type: 'polluter', desc: 'Esteriliza o solo e mata a microbiota benéfica' }
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
    this.highScores = this.loadHighScores();

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
    this.renderLeaderboard();
  }

  loadHighScores() {
    const saved = localStorage.getItem('ecotech_ecosort_highscores');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Erro ao ler ranking do EcoSort:', e);
      }
    }
    return [
      { name: 'Equipe EcoTech ⚡', score: 950, accuracy: '96%', rank: 'Engenheiro Ecológico Lendário! 🏆', date: 'Hoje' },
      { name: 'Prof. Avaliador', score: 820, accuracy: '92%', rank: 'Guardião da Reciclagem Rápida ⚡', date: 'Hoje' },
      { name: 'Visitante Ágil', score: 640, accuracy: '88%', rank: 'Agente da Coleta Consciente 🌱', date: 'Hoje' }
    ];
  }

  saveHighScore(name, score, accuracy, rank) {
    const entry = {
      name: name.trim() || 'Reciclador(a) Anônimo(a)',
      score: score,
      accuracy: accuracy,
      rank: rank,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    this.highScores.push(entry);
    this.highScores.sort((a, b) => b.score - a.score);
    this.highScores = this.highScores.slice(0, 10);
    localStorage.setItem('ecotech_ecosort_highscores', JSON.stringify(this.highScores));
    this.renderLeaderboard();
  }

  renderLeaderboard() {
    const list = document.getElementById('ecosort-leaderboard-list');
    if (!list) return;

    list.innerHTML = '';
    if (this.highScores.length === 0) {
      list.innerHTML = '<div class="empty-list" style="text-align: center; color: var(--text-muted); padding: 1rem;">Nenhum recorde registrado ainda. Seja o primeiro a jogar!</div>';
      return;
    }

    this.highScores.forEach((entry, idx) => {
      const row = document.createElement('div');
      row.className = `leaderboard-item rank-${idx + 1}`;
      row.innerHTML = `
        <div class="leaderboard-pos">#${idx + 1}</div>
        <div class="leaderboard-info">
          <span class="leaderboard-name">${entry.name}</span>
          <span class="leaderboard-badge">${entry.rank || 'Reciclador'} • ${entry.accuracy || '100%'}</span>
        </div>
        <div class="leaderboard-score">${entry.score} pts</div>
      `;
      list.appendChild(row);
    });
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

    const saveBtn = document.getElementById('ecosort-save-score-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const input = document.getElementById('ecosort-player-name-input');
        const rank = document.getElementById('ecosort-rank-title')?.textContent || 'Reciclador';
        const total = this.correctCount + this.wrongCount;
        const accuracy = total > 0 ? `${Math.round((this.correctCount / total) * 100)}%` : '100%';
        this.saveHighScore(input?.value || '', this.score, accuracy, rank);
        if (input) input.value = '';
        saveBtn.disabled = true;
        saveBtn.textContent = 'Gravado no Placar! ✨';
        if (window.soundEngine) window.soundEngine.playWin();
      });
    }

    if (this.leftBtn) {
      this.leftBtn.addEventListener('click', () => this.handleChoice('clean'));
    }

    if (this.rightBtn) {
      this.rightBtn.addEventListener('click', () => this.handleChoice('polluter'));
    }

    // Suporte para teclas de seta do teclado (Esquerda / Direita ou A / D)
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.leftBtn?.classList.add('active');
        this.handleChoice('clean');
        setTimeout(() => this.leftBtn?.classList.remove('active'), 150);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.rightBtn?.classList.add('active');
        this.handleChoice('polluter');
        setTimeout(() => this.rightBtn?.classList.remove('active'), 150);
      }
    });

    // Touch / Drag da carta
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
      const rot = Math.max(-25, Math.min(25, diffX * 0.08));
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
      this.card.style.transition = 'transform 0.25s ease-out, opacity 0.2s ease-out';
      const diffX = currentX - startX;

      this.leftBtn?.classList.remove('highlight');
      this.rightBtn?.classList.remove('highlight');

      if (diffX < -75) {
        this.handleChoice('clean');
      } else if (diffX > 75) {
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
    if (window.soundEngine) window.soundEngine.playClick();
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.timeLeft = 30;
    this.isPlaying = true;

    if (this.startScreen) this.startScreen.classList.add('hidden');
    if (this.endScreen) this.endScreen.classList.add('hidden');
    if (this.gameScreen) this.gameScreen.classList.remove('hidden');

    const saveBtn = document.getElementById('ecosort-save-score-btn');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar Placar 📝';
    }

    this.updateStats();
    this.nextItem();

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timerDisplay) this.timerDisplay.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 5 && this.timeLeft > 0) {
        if (window.soundEngine) window.soundEngine.playTick();
        this.timerDisplay?.classList.add('urgent');
      } else {
        this.timerDisplay?.classList.remove('urgent');
      }

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  nextItem() {
    const available = SORT_ITEMS.filter(item => item !== this.currentItem);
    this.currentItem = available[Math.floor(Math.random() * available.length)];

    if (this.card) {
      this.card.style.transform = 'scale(0.85) translateY(15px)';
      this.card.style.opacity = '0';

      setTimeout(() => {
        if (this.cardIcon) this.cardIcon.textContent = this.currentItem.icon;
        if (this.cardTitle) this.cardTitle.textContent = this.currentItem.name;
        if (this.cardDesc) this.cardDesc.textContent = this.currentItem.desc;

        this.card.style.transform = 'scale(1) translateY(0) rotate(0deg)';
        this.card.style.opacity = '1';
      }, 60);
    }
  }

  handleChoice(choice) {
    if (!this.isPlaying || !this.currentItem) return;

    const isCorrect = choice === this.currentItem.type;

    if (isCorrect) {
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.streak++;
      this.correctCount++;
      const multiplier = 1 + Math.min(this.streak - 1, 5) * 0.2;
      const points = Math.round(50 * multiplier);
      this.score += points;
      this.showCardFeedback(true, `+${points}`);
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      this.streak = 0;
      this.wrongCount++;
      this.score = Math.max(0, this.score - 30);
      this.showCardFeedback(false, '-30');
    }

    this.updateStats();
    this.nextItem();
  }

  showCardFeedback(isSuccess, label) {
    const deck = document.querySelector('.sort-deck-area');
    if (!deck) return;

    const feedbackEffect = document.createElement('div');
    feedbackEffect.className = `floating-feedback ${isSuccess ? 'correct' : 'wrong'}`;
    feedbackEffect.textContent = label || (isSuccess ? '+Pontos!' : '-30');
    deck.appendChild(feedbackEffect);

    setTimeout(() => feedbackEffect.remove(), 800);
  }

  updateStats() {
    if (this.scoreDisplay) this.scoreDisplay.textContent = this.score;
    if (this.timerDisplay) this.timerDisplay.textContent = `${this.timeLeft}s`;
    if (this.streakDisplay) {
      if (this.streak > 1) {
        this.streakDisplay.textContent = `🔥 Combo x${(1 + Math.min(this.streak - 1, 5) * 0.2).toFixed(1)} (${this.streak} seguidos)`;
        this.streakDisplay.classList.remove('hidden');
      } else {
        this.streakDisplay.classList.add('hidden');
      }
    }
  }

  endGame() {
    clearInterval(this.timerInterval);
    this.isPlaying = false;
    if (window.soundEngine) window.soundEngine.playWin();

    if (this.gameScreen) this.gameScreen.classList.add('hidden');
    if (this.endScreen) this.endScreen.classList.remove('hidden');

    const total = this.correctCount + this.wrongCount;
    const accuracy = total > 0 ? Math.round((this.correctCount / total) * 100) : 0;

    const finalScoreEl = document.getElementById('ecosort-final-score');
    if (finalScoreEl) finalScoreEl.textContent = this.score;

    const correctValEl = document.getElementById('ecosort-correct-val');
    if (correctValEl) correctValEl.textContent = this.correctCount;

    const wrongValEl = document.getElementById('ecosort-wrong-val');
    if (wrongValEl) wrongValEl.textContent = this.wrongCount;

    const accuracyValEl = document.getElementById('ecosort-accuracy-val');
    if (accuracyValEl) accuracyValEl.textContent = `${accuracy}%`;

    let rankTitle = 'Reciclador Mirim 🌿';
    if (this.score >= 1000) rankTitle = 'Engenheiro Ecológico Lendário! 🏆';
    else if (this.score >= 650) rankTitle = 'Guardião da Reciclagem Rápida ⚡';
    else if (this.score >= 380) rankTitle = 'Agente da Coleta Consciente 🌱';

    const rankTitleEl = document.getElementById('ecosort-rank-title');
    if (rankTitleEl) rankTitleEl.textContent = rankTitle;

    this.renderLeaderboard();
  }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ecoSortGame = new EcoSortGame();
  });
} else {
  window.ecoSortGame = new EcoSortGame();
}
