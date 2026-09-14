/**
 * EcoQuiz Show - Jogo de Perguntas Gamificado
 * Gerencia o fluxo do quiz, cronômetro, combos, pontuações e ranking local.
 */

const DEFAULT_QUESTIONS = [
  {
    question: "Qual das seguintes fontes de energia NÃO emite gases de efeito estufa durante sua operação?",
    options: [
      "Energia Solar Fotovoltaica",
      "Termelétrica a Carvão",
      "Gerador a Óleo Diesel",
      "Gás Natural Comprimido"
    ],
    correct: 0,
    explanation: "Os painéis solares convertem a luz do Sol diretamente em eletricidade sem queimar combustíveis nem gerar CO₂."
  },
  {
    question: "O que caracteriza o conceito de 'Economia Circular' na engenharia moderna?",
    options: [
      "Extrair matéria-prima, fabricar, usar e descartar no lixo comum",
      "Reutilizar, reparar, renovar e reciclar materiais para eliminar o desperdício",
      "Vender apenas produtos em embalagens plásticas descartáveis",
      "Aumentar o consumo de recursos fósseis para acelerar a produção"
    ],
    correct: 1,
    explanation: "Diferente da economia linear (extrair-usar-jogar fora), a circular mantém os recursos em ciclos contínuos de valor."
  },
  {
    question: "Qual é a principal vantagem dos edifícios sustentáveis com certificação verde?",
    options: [
      "Maior consumo de ar-condicionado e luz artificial contínua",
      "Uso exclusivo de materiais plásticos não recicláveis",
      "Eficiência energética, captação de água da chuva e conforto térmico natural",
      "Impedir a entrada de luz natural para manter o ambiente escuro"
    ],
    correct: 2,
    explanation: "Construções verdes reduzem em até 40% o consumo de energia e água através de design bioclimático e materiais inteligentes."
  },
  {
    question: "Em uma 'Cidade Inteligente' (Smart City), qual tecnologia ajuda a evitar desperdício de energia na iluminação pública?",
    options: [
      "Postes que ficam acesos 24 horas por dia em potência máxima",
      "Sensores de presença e lâmpadas LED inteligentes dimerizáveis",
      "Lâmpadas incandescentes antigas sem controle",
      "Iluminação a óleo diesel nas praças"
    ],
    correct: 1,
    explanation: "Sensores IoT ajustam o brilho das lâmpadas LED apenas quando há pessoas ou veículos por perto, economizando até 70% de energia."
  },
  {
    question: "Quanto tempo uma garrafa plástica convencional pode levar para se decompor na natureza?",
    options: [
      "Cerca de 6 meses",
      "Aproximadamente 2 anos",
      "Mais de 400 anos",
      "Ela se dissolve na água em 1 semana"
    ],
    correct: 2,
    explanation: "O plástico sintético derivado do petróleo leva mais de quatro séculos para se fragmentar em microplásticos poluentes."
  },
  {
    question: "Qual elemento é fundamental para a transição energética e armazenamento de energia solar e eólica?",
    options: [
      "Baterias avançadas de alta densidade (como as de Íon de Lítio e Sódio)",
      "Motores a combustão de dois tempos",
      "Fornos a lenha industriais",
      "Cabos de cobre sem isolamento"
    ],
    correct: 0,
    explanation: "Como o sol se põe e o vento varia, sistemas de baterias (BESS) armazenam a energia limpa para quando for necessária."
  },
  {
    question: "O que significa 'Pegada de Carbono' (Carbon Footprint)?",
    options: [
      "A marca deixada pelo sapato em uma mina de carvão",
      "O total de emissões de gases de efeito estufa causados direta ou indiretamente por uma atividade ou pessoa",
      "A quantidade de tinta preta usada para imprimir um documento",
      "A profundidade em que o petróleo se encontra no fundo do oceano"
    ],
    correct: 1,
    explanation: "Mede o impacto climático das nossas escolhas: transporte, consumo de energia, alimentação e descarte de produtos."
  },
  {
    question: "Qual alternativa representa um exemplo prático de Engenharia Sustentável no cotidiano?",
    options: [
      "Pavimento permeável que permite a água da chuva infiltrar e recarregar o lençol freático",
      "Canos de esgoto despejados diretamente em lagoas e rios",
      "Queima a céu aberto de pneus usados",
      "Desmatamento de encostas para construção de estacionamentos de asfalto impermeável"
    ],
    correct: 0,
    explanation: "Pisos permeáveis evitam enchentes urbanas e filtram naturalmente a água para alimentar as reservas subterrâneas."
  }
];

class QuizManager {
  constructor() {
    this.questions = this.loadQuestions();
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.timer = 15;
    this.timerInterval = null;
    this.isAnswered = false;
    this.highScores = this.loadHighScores();

    // Elementos DOM
    this.container = document.getElementById('quiz-container');
    this.questionText = document.getElementById('quiz-question');
    this.optionsContainer = document.getElementById('quiz-options');
    this.timerBar = document.getElementById('quiz-timer-bar');
    this.timerText = document.getElementById('quiz-timer-text');
    this.scoreText = document.getElementById('quiz-score-val');
    this.streakBadge = document.getElementById('quiz-streak-badge');
    this.feedbackCard = document.getElementById('quiz-feedback');
    this.feedbackTitle = document.getElementById('feedback-title');
    this.feedbackText = document.getElementById('feedback-text');
    this.feedbackBtn = document.getElementById('feedback-btn');
    this.progressIndicator = document.getElementById('quiz-progress');

    // Telas de início e fim
    this.startScreen = document.getElementById('quiz-start-screen');
    this.gameScreen = document.getElementById('quiz-game-screen');
    this.endScreen = document.getElementById('quiz-end-screen');

    this.initEvents();
  }

  loadQuestions() {
    const saved = localStorage.getItem('ecotech_custom_questions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao ler perguntas customizadas:', e);
      }
    }
    return [...DEFAULT_QUESTIONS];
  }

  saveQuestions(newQuestions) {
    this.questions = newQuestions;
    localStorage.setItem('ecotech_custom_questions', JSON.stringify(newQuestions));
  }

  resetToDefaultQuestions() {
    this.questions = [...DEFAULT_QUESTIONS];
    localStorage.removeItem('ecotech_custom_questions');
  }

  loadHighScores() {
    const saved = localStorage.getItem('ecotech_highscores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { name: 'Prof. Avaliador', score: 1450, badge: 'Mestre da Sustentabilidade', date: 'Hoje' },
      { name: 'Grupo 2 - Equipe', score: 1300, badge: 'Inovador Verde', date: 'Hoje' },
      { name: 'Visitante Curioso', score: 980, badge: 'Protetor Ecológico', date: 'Hoje' }
    ];
  }

  saveHighScore(name, score, badge) {
    const entry = {
      name: name.trim() || 'Visitante Anônimo',
      score: score,
      badge: badge,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    this.highScores.push(entry);
    this.highScores.sort((a, b) => b.score - a.score);
    this.highScores = this.highScores.slice(0, 10); // Manter top 10
    localStorage.setItem('ecotech_highscores', JSON.stringify(this.highScores));
    this.renderLeaderboard();
  }

  initEvents() {
    const startBtn = document.getElementById('quiz-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    if (this.feedbackBtn) {
      this.feedbackBtn.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.nextQuestion();
      });
    }

    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
      saveScoreBtn.addEventListener('click', () => {
        const input = document.getElementById('player-name-input');
        const badge = this.getBadge(this.score).title;
        this.saveHighScore(input.value, this.score, badge);
        input.value = '';
        saveScoreBtn.disabled = true;
        saveScoreBtn.textContent = 'Gravado no Placar! ✨';
        window.soundEngine.playWin();
      });
    }

    const restartBtn = document.getElementById('quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.startQuiz());
    }

    this.renderLeaderboard();
  }

  startQuiz() {
    window.soundEngine.playClick();
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.isAnswered = false;

    // Embaralhar perguntas aleatoriamente para cada partida
    this.shuffledQuestions = [...this.questions].sort(() => Math.random() - 0.5);

    this.startScreen.classList.add('hidden');
    this.endScreen.classList.add('hidden');
    this.gameScreen.classList.remove('hidden');

    this.updateStats();
    this.showQuestion();
  }

  showQuestion() {
    this.isAnswered = false;
    this.feedbackCard.classList.add('hidden');
    const q = this.shuffledQuestions[this.currentIndex];

    this.progressIndicator.textContent = `Pergunta ${this.currentIndex + 1} de ${this.shuffledQuestions.length}`;
    this.questionText.textContent = q.question;
    this.optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span class="opt-badge">${letters[idx]}</span>
        <span class="opt-label">${opt}</span>
      `;
      btn.addEventListener('click', () => this.handleAnswer(idx, btn));
      this.optionsContainer.appendChild(btn);
    });

    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timer = 20;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timer--;
      this.updateTimerDisplay();

      if (this.timer <= 4 && this.timer > 0) {
        window.soundEngine.playTick();
      }

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (this.timerText) this.timerText.textContent = `${this.timer}s`;
    if (this.timerBar) {
      const pct = (this.timer / 20) * 100;
      this.timerBar.style.width = `${pct}%`;
      if (this.timer <= 5) {
        this.timerBar.classList.add('urgent');
      } else {
        this.timerBar.classList.remove('urgent');
      }
    }
  }

  handleAnswer(selectedIdx, btnElement) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    clearInterval(this.timerInterval);

    const q = this.shuffledQuestions[this.currentIndex];
    const isCorrect = selectedIdx === q.correct;
    const allButtons = this.optionsContainer.querySelectorAll('.quiz-opt-btn');

    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) {
        b.classList.add('correct');
      } else if (i === selectedIdx) {
        b.classList.add('wrong');
      }
    });

    if (isCorrect) {
      window.soundEngine.playCorrect();
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      // Cálculo de pontos: 100 base + bônus de tempo restante + multiplicador de streak
      const timeBonus = this.timer * 10;
      const multiplier = 1 + (this.streak - 1) * 0.2;
      const points = Math.round((100 + timeBonus) * multiplier);

      this.score += points;
      this.showFeedback(true, `+${points} Pts! Resposta Correta!`, q.explanation);
    } else {
      window.soundEngine.playWrong();
      this.streak = 0;
      this.showFeedback(false, `Que pena! Não foi dessa vez.`, q.explanation);
    }

    this.updateStats();
  }

  handleTimeout() {
    if (this.isAnswered) return;
    this.isAnswered = true;
    window.soundEngine.playWrong();
    this.streak = 0;

    const q = this.shuffledQuestions[this.currentIndex];
    const allButtons = this.optionsContainer.querySelectorAll('.quiz-opt-btn');
    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
    });

    this.showFeedback(false, `Tempo Esgotado! ⏳`, q.explanation);
    this.updateStats();
  }

  showFeedback(isSuccess, title, explanation) {
    this.feedbackCard.className = `quiz-feedback-card ${isSuccess ? 'correct' : 'wrong'}`;
    this.feedbackTitle.textContent = title;
    this.feedbackText.textContent = explanation;
    this.feedbackBtn.textContent = (this.currentIndex + 1 < this.shuffledQuestions.length)
      ? 'Próxima Pergunta →'
      : 'Ver Resultado Final 🏆';
    this.feedbackCard.classList.remove('hidden');
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.shuffledQuestions.length) {
      this.showQuestion();
    } else {
      this.finishQuiz();
    }
  }

  updateStats() {
    if (this.scoreText) this.scoreText.textContent = this.score;
    if (this.streakBadge) {
      if (this.streak > 1) {
        this.streakBadge.textContent = `🔥 Combo x${(1 + (this.streak - 1) * 0.2).toFixed(1)} (${this.streak} seguidas)`;
        this.streakBadge.classList.remove('hidden');
      } else {
        this.streakBadge.classList.add('hidden');
      }
    }
  }

  getBadge(score) {
    if (score >= 1200) {
      return { title: 'Mestre da Sustentabilidade 🌟', desc: 'Conhecimento impecável! Você é um verdadeiro embaixador do futuro verde.' };
    } else if (score >= 800) {
      return { title: 'Inovador EcoTech 🚀', desc: 'Excelente domínio sobre soluções sustentáveis e tecnologia limpa!' };
    } else if (score >= 500) {
      return { title: 'Protetor do Planeta 🌱', desc: 'Bom desempenho! Você conhece as bases para um mundo melhor.' };
    } else {
      return { title: 'Aprendiz Ecológico 💧', desc: 'Vale a pena explorar mais nosso estande e aprender sobre as tecnologias verdes!' };
    }
  }

  finishQuiz() {
    window.soundEngine.playWin();
    this.gameScreen.classList.add('hidden');
    this.endScreen.classList.remove('hidden');

    const badge = this.getBadge(this.score);
    document.getElementById('final-score-val').textContent = this.score;
    document.getElementById('final-badge-title').textContent = badge.title;
    document.getElementById('final-badge-desc').textContent = badge.desc;

    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
      saveScoreBtn.disabled = false;
      saveScoreBtn.textContent = 'Salvar no Ranking da Feira 📝';
    }
  }

  renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    list.innerHTML = '';
    if (this.highScores.length === 0) {
      list.innerHTML = '<div class="empty-list">Nenhum recorde registrado ainda. Seja o primeiro!</div>';
      return;
    }

    this.highScores.forEach((entry, idx) => {
      const row = document.createElement('div');
      row.className = `leaderboard-item rank-${idx + 1}`;
      row.innerHTML = `
        <div class="leaderboard-pos">#${idx + 1}</div>
        <div class="leaderboard-info">
          <span class="leaderboard-name">${entry.name}</span>
          <span class="leaderboard-badge">${entry.badge}</span>
        </div>
        <div class="leaderboard-score">${entry.score} pts</div>
      `;
      list.appendChild(row);
    });
  }
}

window.quizManager = new QuizManager();
