/**
 * EcoQuiz Show - Jogo de Perguntas Gamificado
 * Gerencia o fluxo do quiz, cronômetro dinâmico, combos multiplicadores, pontuações e ranking local.
 * Projeto EcoTech - Feira Escolar 2026
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
    explanation: "Diferente da economia linear (extrair-usar-jogar fora), a circular mantém os recursos em ciclos contínuos de valor e regeneração."
  },
  {
    question: "Qual é a principal vantagem dos edifícios sustentáveis com certificação verde (Green Buildings)?",
    options: [
      "Maior consumo de ar-condicionado e luz artificial contínua",
      "Uso exclusivo de materiais sintéticos não recicláveis",
      "Eficiência energética, captação de água da chuva e conforto térmico natural",
      "Impedir a entrada de luz solar para manter o interior sempre escuro"
    ],
    correct: 2,
    explanation: "Construções verdes reduzem em até 40% o consumo de energia e água através de design bioclimático, ventilação cruzada e materiais ecológicos."
  },
  {
    question: "Em uma 'Cidade Inteligente' (Smart City), qual tecnologia ajuda a evitar desperdício de energia na iluminação pública?",
    options: [
      "Postes que ficam acesos 24 horas por dia em potência máxima",
      "Sensores de presença IoT e lâmpadas LED dimerizáveis",
      "Lâmpadas incandescentes antigas de alto consumo",
      "Iluminação a querosene nas praças públicas"
    ],
    correct: 1,
    explanation: "Sensores IoT ajustam o fluxo luminoso dos LEDs apenas quando há tráfego de pessoas ou veículos, economizando até 70% de energia pública."
  },
  {
    question: "Quanto tempo uma garrafa plástica convencional pode levar para se decompor na natureza?",
    options: [
      "Cerca de 6 meses",
      "Aproximadamente 2 anos",
      "Mais de 400 anos",
      "Ela se dissolve na água em apenas 1 semana"
    ],
    correct: 2,
    explanation: "O plástico sintético derivado do petróleo leva mais de quatro séculos para se fragmentar em microplásticos perigosos para a fauna."
  },
  {
    question: "Qual elemento é fundamental para a transição energética e o armazenamento de energia solar e eólica?",
    options: [
      "Baterias avançadas de alta densidade (como Íon de Lítio e Sódio)",
      "Motores a combustão fóssil de dois tempos",
      "Fornos a lenha industriais sem filtro",
      "Cabos elétricos sem isolamento térmico"
    ],
    correct: 0,
    explanation: "Como a geração solar e eólica varia ao longo do dia, sistemas de baterias (BESS) armazenam a energia limpa para fornecimento ininterrupto."
  },
  {
    question: "O que significa o termo 'Pegada de Carbono' (Carbon Footprint)?",
    options: [
      "A marca deixada pelo sapato em uma mina de carvão vegetal",
      "O total de emissões de gases de efeito estufa causados direta ou indiretamente por uma atividade ou pessoa",
      "A quantidade de tinta preta usada para imprimir um documento",
      "A profundidade em que o petróleo se encontra no leito marinho"
    ],
    correct: 1,
    explanation: "Mede o impacto climático das escolhas humanas: meios de transporte, consumo de energia, alimentação e padrões de descarte."
  },
  {
    question: "Qual alternativa representa um exemplo prático de Engenharia Sustentável no cotidiano urbano?",
    options: [
      "Pavimento permeável que permite a água da chuva infiltrar e recarregar o lençol freático",
      "Canos de esgoto despejados diretamente em lagoas urbanas",
      "Queima a céu aberto de pneus usados e entulho de obras",
      "Desmatamento de encostas para criar estacionamentos asfaltados impermeáveis"
    ],
    correct: 0,
    explanation: "Pisos permeáveis evitam enchentes urbanas ao permitir a drenagem natural da água, filtrando impurezas antes de alimentar os aquíferos."
  },
  {
    question: "O que é o chamado 'Hidrogênio Verde'?",
    options: [
      "Hidrogênio tingido artificialmente com corante verde para venda",
      "Gás hidrogênio produzido pela eletrólise da água alimentada exclusivamente por fontes renováveis",
      "Um gás extraído diretamente do petróleo e do carvão mineral",
      "Um tipo de adubo líquido para plantas ornamentais"
    ],
    correct: 1,
    explanation: "O Hidrogênio Verde é produzido quebrando moléculas de água (H₂O) com eletricidade solar ou eólica, liberando apenas oxigênio no processo."
  },
  {
    question: "O que preconiza o princípio da 'Logística Reversa' na gestão de resíduos sólidos?",
    options: [
      "Enviar todo o lixo recolhido de volta para o fundo dos oceanos",
      "Responsabilizar fabricantes, distribuidores e consumidores pelo recolhimento e reciclagem de produtos pós-consumo",
      "Proibir o transporte rodoviário de qualquer tipo de mercadoria",
      "Descartar embalagens em terrenos baldios fora do perímetro urbano"
    ],
    correct: 1,
    explanation: "A logística reversa garante que pilhas, baterias, eletrônicos e pneus voltem às fábricas para descarte seguro ou reinserção produtiva."
  },
  {
    question: "Como os 'Telhados Verdes' (coberturas vegetadas) contribuem para a climatização das cidades?",
    options: [
      "Eles aumentam drasticamente a temperatura interna dos edifícios",
      "Reduzem as ilhas de calor urbanas através da evapotranspiração das plantas e isolam termicamente o imóvel",
      "Substituem completamente a necessidade de janelas nos prédios",
      "Atraem tempestades elétricas perigosas para os centros urbanos"
    ],
    correct: 1,
    explanation: "As plantas absorvem a radiação solar em vez de acumulá-la como o concreto, amenizando o calor urbano e reduzindo o uso de ar-condicionado."
  },
  {
    question: "Por que a reciclagem do alumínio é considerada um dos maiores sucessos ambientais do Brasil?",
    options: [
      "Porque o alumínio é descartável e não pode ser derretido",
      "Porque reciclar uma lata consome 95% menos energia do que produzir alumínio primário a partir da bauxita",
      "Porque o alumínio se dissolve sozinho na chuva em 24 horas",
      "Porque a bauxita é um recurso mineral infinito e sem impactos ambientais"
    ],
    correct: 1,
    explanation: "A lata de alumínio pode ser reciclada infinitas vezes sem perder pureza, economizando imensas quantidades de água e energia elétrica."
  },
  {
    question: "Qual é a principal função da camada de ozônio (O₃) na atmosfera terrestre?",
    options: [
      "Prender o calor do solo para aumentar a temperatura média",
      "Filtrar a radiação ultravioleta prejudicial (UV-B) emitida pelo Sol",
      "Produzir oxigênio medicinal para os seres humanos",
      "Servir de barreira contra meteoros e cometas no espaço"
    ],
    correct: 1,
    explanation: "O ozônio estratosférico absorve os raios UV-B nocivos, prevenindo câncer de pele, mutações genéticas e danos aos ecossistemas terrestres."
  },
  {
    question: "Qual a diferença entre 'Efeito Estufa Natural' e 'Aquecimento Global Antropogênico'?",
    options: [
      "Não há diferença, ambos são causados exclusivamente por fábricas modernas",
      "O efeito estufa natural é vital para manter a Terra aquecida; o agravado pelas atividades humanas retém calor excessivo",
      "O efeito natural é tóxico e o antropogênico é saudável para o clima",
      "O efeito estufa natural resfria os polos e o aquecimento global congela os oceanos"
    ],
    correct: 1,
    explanation: "Sem o efeito estufa natural, a Terra seria congelada a -18°C. A queima desmedida de carvão e petróleo aumentou os gases a níveis perigosos."
  },
  {
    question: "O que é 'Compostagem' e qual é o seu principal benefício ambiental?",
    options: [
      "Queimar restos de alimentos em fornos para produzir fumaça aromática",
      "Processo biológico de decomposição de matéria orgânica que gera adubo rico em nutrientes e evita gases em aterros",
      "Triturar plásticos e descartá-los na rede pública de esgoto",
      "Enterrar pilhas e baterias velhas junto com restos de comida"
    ],
    correct: 1,
    explanation: "A compostagem desvia restos de frutas e vegetais dos lixões, evitando a produção descontrolada de gás metano e gerando biofertilizante natural."
  },
  {
    question: "Como o descarte inadequado de óleo de cozinha usado na pia prejudica o saneamento básico?",
    options: [
      "Ele limpa os canos e remove impurezas da tubulação",
      "Ele encarece o tratamento de água, entope redes de esgoto formando blocos de gordura e polui rios",
      "O óleo na pia evapora imediatamente sem tocar na água",
      "Ele ajuda os peixes a respirarem melhor nos rios urbanos"
    ],
    correct: 1,
    explanation: "1 litro de óleo contamina milhares de litros de água potável e forma camadas que impedem a oxigenação da vida aquática."
  },
  {
    question: "Qual destes materiais possui reciclabilidade INFINITA sem qualquer perda de propriedades físico-químicas?",
    options: [
      "Papel sulfite comum",
      "Garrafa de Vidro",
      "Plástico filme PVC",
      "Tecido de algodão cru"
    ],
    correct: 1,
    explanation: "O vidro pode ser fundido e remodelado infinitas vezes sem perder transparência, dureza ou resistência mecânica."
  },
  {
    question: "O que é 'Energia Biomassa' e como ela pode ser aproveitada sustentavelmente?",
    options: [
      "Queimar plásticos industriais pesados em fogueiras públicas",
      "Gerar eletricidade e calor através do reaproveitamento de resíduos agrícolas como bagaço de cana e casca de arroz",
      "Eletricidade obtida através de relâmpagos captados em antenas",
      "Energia produzida pelo consumo de combustível fóssil puro"
    ],
    correct: 1,
    explanation: "A biomassa reaproveita resíduos agrícolas que seriam descartados, gerando energia limpa e vapor para processos industriais."
  },
  {
    question: "O que são 'Microplásticos' e por que causam tanta preocupação na comunidade científica?",
    options: [
      "Partículas plásticas menores que 5mm que contaminam a água, peixes e entram na cadeia alimentar humana",
      "Pequenos robôs ecológicos criados para despoluir rios",
      "Bactérias benéficas que devoram matéria orgânica",
      "Pequenos chips eletrônicos utilizados em painéis solares modernos"
    ],
    correct: 0,
    explanation: "Originados da quebra de garrafas e tecidos sintéticos, os microplásticos já foram encontrados em águas minerais, peixes e até no sangue humano."
  },
  {
    question: "Em Mobilidade Urbana, qual é o conceito de 'Mobilidade Ativa'?",
    options: [
      "Utilizar exclusivamente carros particulares potentes para trajetos curtos",
      "Deslocamentos que utilizam a força motriz humana, como caminhar, andar de bicicleta ou patins",
      "Acelerar veículos esportivos em vias urbanas congestionadas",
      "Viajar apenas de avião e helicóptero em curtas distâncias"
    ],
    correct: 1,
    explanation: "A mobilidade ativa melhora a saúde pública, desobstrui as ruas e emite zero poluentes no ar da cidade."
  },
  {
    question: "O que mede o índice AQI (Índice de Qualidade do Ar)?",
    options: [
      "A velocidade do vento nas tempestades de verão",
      "O nível de poluentes atmosféricos (como PM2.5, ozônio superficial e CO) e o impacto na saúde da população",
      "A quantidade de nuvens de chuva presentes no céu",
      "A umidade do solo em áreas agrícolas distantes"
    ],
    correct: 1,
    explanation: "O AQI categoriza a qualidade do ar de 'Boa' a 'Perigosa', indicando riscos respiratórios para idosos, crianças e a comunidade geral."
  },
  {
    question: "O que significa 'Consumo em Modo Standby' (energia vampiro) nos aparelhos domésticos?",
    options: [
      "Aparelhos que funcionam exclusivamente com energia solar fotovoltaica",
      "A eletricidade gasta por aparelhos conectados à tomada mesmo quando aparentemente desligados",
      "Um modo de economia que zera a conta de luz da residência",
      "O som emitido por televisores modernos quando fora de sincronia"
    ],
    correct: 1,
    explanation: "Luzes de led, relógios digitais e fontes conectadas podem representar até 12% do consumo total da conta de luz residencial."
  },
  {
    question: "Qual é a proposta do 'Concreto Sustentável' ou Ecológico na construção civil?",
    options: [
      "Substituir agregados naturais por cinzas industriais e resíduos reciclados para reduzir a pegada de carbono do cimento",
      "Construir edifícios sem estrutura de sustentação ou vigas",
      "Usar areia retirada ilegalmente de manguezais e reservas ambientais",
      "Pintar paredes com tinta verde para simular grama"
    ],
    correct: 0,
    explanation: "A indústria do cimento tradicional responde por cerca de 8% do CO₂ global; agregados ecológicos reduzem drasticamente essas emissões."
  },
  {
    question: "O que é 'Energia Maremotriz' (ou energia das marés)?",
    options: [
      "Eletricidade gerada pela força cinética e potencial do movimento das marés oceânicas",
      "Calor emitido por vulcões submarinos em águas profundas",
      "Queima de óleo diesel em navios cargueiros no alto mar",
      "Pesca intensiva de peixes elétricos em estuários"
    ],
    correct: 0,
    explanation: "A movimentação previsível das marés impulsiona turbinas submersas, fornecendo energia limpa e renovável de forma contínua."
  }
];

class QuizManager {
  constructor() {
    this.questions = this.loadQuestions();
    this.roundQuestions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.timer = 20;
    this.timerInterval = null;
    this.isAnswered = false;
    this.highScores = this.loadHighScores();

    // Elementos DOM
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
        if (Array.isArray(parsed) && parsed.length >= 5) {
          // Mesclar perguntas padrão caso o banco salvo tenha poucas perguntas antigas
          if (parsed.length < DEFAULT_QUESTIONS.length) {
            const merged = [...parsed];
            DEFAULT_QUESTIONS.forEach(defQ => {
              if (!merged.some(m => m.question === defQ.question)) {
                merged.push(defQ);
              }
            });
            return merged;
          }
          return parsed;
        }
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [];
      }
    }
    return [
      { name: 'Prof. Avaliador', score: 1650, badge: 'Mestre da Sustentabilidade 🌟', date: 'Hoje' },
      { name: 'Grupo 2 - Sophia & Miguel', score: 1480, badge: 'Inovador EcoTech 🚀', date: 'Hoje' },
      { name: 'Visitante Curioso', score: 1120, badge: 'Protetor do Planeta 🌱', date: 'Hoje' }
    ];
  }

  saveHighScore(name, score, badge) {
    const entry = {
      name: name.trim() || 'Visitante Anônimo(a)',
      score: score,
      badge: badge,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    this.highScores.push(entry);
    this.highScores.sort((a, b) => b.score - a.score);
    this.highScores = this.highScores.slice(0, 10);
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
        if (window.soundEngine) window.soundEngine.playClick();
        this.nextQuestion();
      });
    }

    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
      saveScoreBtn.addEventListener('click', () => {
        const input = document.getElementById('player-name-input');
        const badge = this.getBadge(this.score).title;
        this.saveHighScore(input?.value || '', this.score, badge);
        if (input) input.value = '';
        saveScoreBtn.disabled = true;
        saveScoreBtn.textContent = 'Gravado no Placar! ✨';
        if (window.soundEngine) window.soundEngine.playWin();
      });
    }

    const restartBtn = document.getElementById('quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.startQuiz());
    }

    this.renderLeaderboard();
  }

  startQuiz() {
    if (window.soundEngine) window.soundEngine.playClick();
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.isAnswered = false;

    // Selecionar 8 a 10 perguntas aleatórias do banco para cada partida
    const pool = [...this.questions].sort(() => Math.random() - 0.5);
    const roundCount = Math.min(10, pool.length);
    this.roundQuestions = pool.slice(0, roundCount);

    if (this.startScreen) this.startScreen.classList.add('hidden');
    if (this.endScreen) this.endScreen.classList.add('hidden');
    if (this.gameScreen) this.gameScreen.classList.remove('hidden');

    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
      saveScoreBtn.disabled = false;
      saveScoreBtn.textContent = 'Salvar no Ranking da Feira 📝';
    }

    this.updateStats();
    this.showQuestion();
  }

  showQuestion() {
    this.isAnswered = false;
    if (this.feedbackCard) this.feedbackCard.classList.add('hidden');
    const q = this.roundQuestions[this.currentIndex];
    if (!q) {
      this.finishQuiz();
      return;
    }

    if (this.progressIndicator) {
      this.progressIndicator.textContent = `Pergunta ${this.currentIndex + 1} de ${this.roundQuestions.length}`;
    }
    if (this.questionText) {
      this.questionText.textContent = q.question;
    }
    if (this.optionsContainer) {
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
    }

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
        if (window.soundEngine) window.soundEngine.playTick();
      }

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (this.timerText) {
      this.timerText.textContent = `${this.timer}s`;
      if (this.timer <= 5) {
        this.timerText.classList.add('urgent');
      } else {
        this.timerText.classList.remove('urgent');
      }
    }
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

    const q = this.roundQuestions[this.currentIndex];
    const isCorrect = selectedIdx === q.correct;
    const allButtons = this.optionsContainer ? this.optionsContainer.querySelectorAll('.quiz-opt-btn') : [];

    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) {
        b.classList.add('correct');
      } else if (i === selectedIdx) {
        b.classList.add('wrong');
      }
    });

    if (isCorrect) {
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      // Cálculo de pontos: 100 base + bônus de tempo restante + multiplicador de streak
      const timeBonus = this.timer * 10;
      const multiplier = 1 + (this.streak - 1) * 0.2;
      const points = Math.round((100 + timeBonus) * multiplier);

      this.score += points;
      this.showFeedback(true, `+${points} Pts! Resposta Correta!`, q.explanation);
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      this.streak = 0;
      this.showFeedback(false, `Não foi dessa vez!`, q.explanation);
    }

    this.updateStats();
  }

  handleTimeout() {
    if (this.isAnswered) return;
    this.isAnswered = true;
    if (window.soundEngine) window.soundEngine.playWrong();
    this.streak = 0;

    const q = this.roundQuestions[this.currentIndex];
    const allButtons = this.optionsContainer ? this.optionsContainer.querySelectorAll('.quiz-opt-btn') : [];
    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
    });

    this.showFeedback(false, `Tempo Esgotado! ⏳`, q.explanation);
    this.updateStats();
  }

  showFeedback(isSuccess, title, explanation) {
    if (!this.feedbackCard) return;
    this.feedbackCard.className = `quiz-feedback-card ${isSuccess ? 'correct' : 'wrong'}`;
    if (this.feedbackTitle) this.feedbackTitle.textContent = title;
    if (this.feedbackText) this.feedbackText.textContent = explanation;
    if (this.feedbackBtn) {
      this.feedbackBtn.textContent = (this.currentIndex + 1 < this.roundQuestions.length)
        ? 'Próxima Pergunta →'
        : 'Ver Resultado Final 🏆';
    }
    this.feedbackCard.classList.remove('hidden');
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.roundQuestions.length) {
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
    if (score >= 1500) {
      return { title: 'Mestre da Sustentabilidade 🌟', desc: 'Conhecimento brilhante e reflexos rápidos! Você é um verdadeiro embaixador do futuro verde.' };
    } else if (score >= 1000) {
      return { title: 'Inovador EcoTech 🚀', desc: 'Excelente domínio sobre soluções sustentáveis, energias renováveis e tecnologia limpa!' };
    } else if (score >= 600) {
      return { title: 'Protetor do Planeta 🌱', desc: 'Bom desempenho! Você conhece as bases sólidas para um mundo mais limpo e equilibrado.' };
    } else {
      return { title: 'Aprendiz Ecológico 💧', desc: 'Excelente começo! Vale a pena explorar mais nosso estande e aprender sobre soluções verdes.' };
    }
  }

  finishQuiz() {
    clearInterval(this.timerInterval);
    if (window.soundEngine) window.soundEngine.playWin();
    if (this.gameScreen) this.gameScreen.classList.add('hidden');
    if (this.endScreen) this.endScreen.classList.remove('hidden');

    const badge = this.getBadge(this.score);
    const scoreVal = document.getElementById('final-score-val');
    if (scoreVal) scoreVal.textContent = this.score;

    const titleEl = document.getElementById('final-badge-title');
    if (titleEl) titleEl.textContent = badge.title;

    const descEl = document.getElementById('final-badge-desc');
    if (descEl) descEl.textContent = badge.desc;

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
      list.innerHTML = '<div class="empty-list" style="text-align:center; padding: 1rem; color: var(--text-muted);">Nenhum recorde registrado ainda. Seja o primeiro a jogar!</div>';
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

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.quizManager = new QuizManager();
  });
} else {
  window.quizManager = new QuizManager();
}
