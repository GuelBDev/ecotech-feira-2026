/**
 * EcoCity Simulator - Hiper-Realista em Tempo Real
 * Simulação física e visual de uma metrópole sustentável com tráfego animado,
 * partículas de fumaça procedural, turbinas eólicas rotativas e atmosfera dinâmica.
 * Renderizado em Canvas 2D HiDPI.
 * Projeto EcoTech - Feira Escolar 2026
 */

class RealisticCitySimulator {
  constructor() {
    this.demand = 500; // Demanda contínua em MW
    this.logicalW = 640;
    this.logicalH = 320;

    // Sliders
    this.solarSlider = document.getElementById('slider-solar');
    this.windSlider = document.getElementById('slider-wind');
    this.hydroSlider = document.getElementById('slider-hydro');
    this.fossilSlider = document.getElementById('slider-fossil');

    // Displays
    this.valSolar = document.getElementById('val-solar');
    this.valWind = document.getElementById('val-wind');
    this.valHydro = document.getElementById('val-hydro');
    this.valFossil = document.getElementById('val-fossil');

    this.totalEnergyDisplay = document.getElementById('city-energy-total');
    this.statusEnergyBadge = document.getElementById('city-energy-status');
    this.co2Display = document.getElementById('city-co2-val');
    this.aqiDisplay = document.getElementById('city-aqi-val');
    this.happinessDisplay = document.getElementById('city-happiness-val');
    this.happinessBar = document.getElementById('city-happiness-bar');

    // Elementos visuais
    this.citySky = document.getElementById('city-sky');
    this.citySmog = document.getElementById('city-smog');

    this.initEvents();
    this.initCanvasCity();
    this.updateSimulation();
  }

  initEvents() {
    const sliders = [this.solarSlider, this.windSlider, this.hydroSlider, this.fossilSlider];
    sliders.forEach(slider => {
      if (slider) {
        slider.addEventListener('input', () => this.updateSimulation());
      }
    });

    document.getElementById('preset-fossil')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playPop();
      this.setSliders(0, 0, 100, 420);
    });

    document.getElementById('preset-balanced')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playPop();
      this.setSliders(160, 140, 150, 70);
    });

    document.getElementById('preset-future')?.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.setSliders(220, 180, 120, 0);
    });

    window.addEventListener('resize', () => {
      this.setupCanvas();
    });
  }

  setSliders(solar, wind, hydro, fossil) {
    if (this.solarSlider) this.solarSlider.value = solar;
    if (this.windSlider) this.windSlider.value = wind;
    if (this.hydroSlider) this.hydroSlider.value = hydro;
    if (this.fossilSlider) this.fossilSlider.value = fossil;
    this.updateSimulation();
  }

  updateSimulation() {
    const solar = parseInt(this.solarSlider?.value || 0, 10);
    const wind = parseInt(this.windSlider?.value || 0, 10);
    const hydro = parseInt(this.hydroSlider?.value || 0, 10);
    const fossil = parseInt(this.fossilSlider?.value || 0, 10);

    if (this.valSolar) this.valSolar.textContent = `${solar} MW`;
    if (this.valWind) this.valWind.textContent = `${wind} MW`;
    if (this.valHydro) this.valHydro.textContent = `${hydro} MW`;
    if (this.valFossil) this.valFossil.textContent = `${fossil} MW`;

    const totalGenerated = solar + wind + hydro + fossil;
    const cleanEnergy = solar + wind + hydro;
    const cleanPercentage = totalGenerated > 0 ? (cleanEnergy / totalGenerated) * 100 : 0;

    // Emissões e AQI
    const co2Rate = Math.round(fossil * 820);
    const aqi = Math.min(350, Math.round(15 + (fossil / 450) * 310));

    // Felicidade da população
    let happiness = 100;
    if (totalGenerated < this.demand) {
      const deficit = this.demand - totalGenerated;
      happiness -= Math.round((deficit / this.demand) * 80);
    }
    if (aqi > 45) {
      happiness -= Math.round(((aqi - 45) / 300) * 45);
    }
    if (cleanPercentage >= 90 && totalGenerated >= this.demand) {
      happiness = Math.min(100, happiness + 10);
    }
    happiness = Math.max(0, Math.min(100, happiness));

    // Atualizar UI
    if (this.totalEnergyDisplay) {
      this.totalEnergyDisplay.textContent = `${totalGenerated} / ${this.demand} MW`;
    }

    if (this.statusEnergyBadge) {
      if (totalGenerated < this.demand) {
        this.statusEnergyBadge.className = 'status-badge deficit';
        this.statusEnergyBadge.textContent = `⚠️ Apagão Parcial (-${this.demand - totalGenerated} MW)`;
      } else if (totalGenerated === this.demand) {
        this.statusEnergyBadge.className = 'status-badge ideal';
        this.statusEnergyBadge.textContent = `✅ Rede 100% Equilibrada`;
      } else {
        this.statusEnergyBadge.className = 'status-badge surplus';
        this.statusEnergyBadge.textContent = `⚡ Superávit (+${totalGenerated - this.demand} MW Baterias)`;
      }
    }

    if (this.co2Display) {
      this.co2Display.textContent = `${co2Rate.toLocaleString('pt-BR')} kg/h`;
      this.co2Display.style.color = fossil === 0 ? '#10b981' : (fossil > 180 ? '#f43f5e' : '#f59e0b');
    }

    if (this.aqiDisplay) {
      let cat = 'Excelente 🍃';
      let col = '#10b981';
      if (aqi > 200) { cat = 'Crítico ⚠️'; col = '#f43f5e'; }
      else if (aqi > 100) { cat = 'Moderado 🌫️'; col = '#f59e0b'; }
      else if (aqi > 45) { cat = 'Bom ⛅'; col = '#06b6d4'; }
      this.aqiDisplay.textContent = `${aqi} (${cat})`;
      this.aqiDisplay.style.color = col;
    }

    if (this.happinessDisplay) {
      this.happinessDisplay.textContent = `${happiness}%`;
    }
    if (this.happinessBar) {
      this.happinessBar.style.width = `${happiness}%`;
      this.happinessBar.style.backgroundColor = happiness > 70 ? '#10b981' : (happiness > 40 ? '#f59e0b' : '#f43f5e');
    }

    // Parâmetros para o Canvas
    this.cityState = {
      solar,
      wind,
      hydro,
      fossil,
      aqi,
      happiness,
      totalGenerated
    };
  }

  // --- Motor de Renderização Realista da Cidade em Canvas 2D ---
  initCanvasCity() {
    const container = document.querySelector('.city-viewport');
    if (!container) return;

    this.container = container;
    container.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.zIndex = '5';

    container.appendChild(this.canvas);
    this.setupCanvas();

    // Partículas de fumaça da chaminé
    this.smokeParticles = [];
    // Carros elétricos na rodovia
    this.vehicles = [
      { x: 50, speed: 2.2, dir: 1, color: '#38bdf8' },
      { x: 220, speed: 1.8, dir: 1, color: '#10b981' },
      { x: 450, speed: 2.5, dir: -1, color: '#f59e0b' },
      { x: 340, speed: 1.6, dir: -1, color: '#e2e8f0' }
    ];

    this.windTurbineAngle = 0;
    this.frameCount = 0;

    // Iniciar loop de animação contínuo
    const animate = () => {
      this.renderFrame();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  setupCanvas() {
    if (!this.canvas) return;
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    this.canvas.width = this.logicalW * dpr;
    this.canvas.height = this.logicalH * dpr;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  renderFrame() {
    if (!this.ctx) return;
    const w = this.logicalW;
    const h = this.logicalH;
    const state = this.cityState || { solar: 160, wind: 140, fossil: 70, aqi: 60, happiness: 85 };

    this.ctx.clearRect(0, 0, w, h);
    this.frameCount++;

    // 1. Céu e Atmosfera Dinâmica
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, h);
    if (state.fossil > 200) {
      skyGrad.addColorStop(0, '#1e2029');
      skyGrad.addColorStop(0.5, '#332924');
      skyGrad.addColorStop(1, '#0b0c10');
    } else if (state.fossil > 50) {
      skyGrad.addColorStop(0, '#0c4a6e');
      skyGrad.addColorStop(0.4, '#075985');
      skyGrad.addColorStop(1, '#070a12');
    } else {
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.35, '#0369a1');
      skyGrad.addColorStop(0.8, '#082f49');
      skyGrad.addColorStop(1, '#030712');
    }
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, w, h);

    // Sol brilhante (se solar > 0)
    if (state.solar > 0) {
      const sunIntensity = Math.min(1, state.solar / 200);
      const sunGrad = this.ctx.createRadialGradient(80, 60, 5, 80, 60, 60);
      sunGrad.addColorStop(0, `rgba(253, 224, 71, ${0.9 * sunIntensity})`);
      sunGrad.addColorStop(0.4, `rgba(251, 191, 36, ${0.4 * sunIntensity})`);
      sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      this.ctx.fillStyle = sunGrad;
      this.ctx.beginPath();
      this.ctx.arc(80, 60, 60, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Montanhas Distantes ao Fundo
    this.ctx.fillStyle = '#0a101d';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 200);
    this.ctx.bezierCurveTo(120, 140, 200, 180, 320, 150);
    this.ctx.bezierCurveTo(420, 120, 520, 170, w, 160);
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(0, h);
    this.ctx.fill();

    // 3. Rio de Água Limpa / Hidroelétrica ao Fundo
    const riverGrad = this.ctx.createLinearGradient(0, 210, 0, h);
    riverGrad.addColorStop(0, '#0284c7');
    riverGrad.addColorStop(1, '#0f172a');
    this.ctx.fillStyle = riverGrad;
    this.ctx.fillRect(0, 210, w, 50);

    // Reflexo na água
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 6; i++) {
      const rx = (this.frameCount * 1.2 + i * 110) % w;
      this.ctx.fillRect(rx, 220 + (i % 3) * 6, 45, 2);
    }

    // 4. Usina Fóssil e Chaminés (lado direito)
    const factoryX = 490;
    const factoryY = 170;
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(factoryX, factoryY, 65, 70);
    this.ctx.fillStyle = '#334155';
    this.ctx.fillRect(factoryX + 12, factoryY - 25, 14, 25);
    this.ctx.fillRect(factoryX + 38, factoryY - 32, 14, 32);

    // Fumaça Procedural saindo da chaminé
    if (state.fossil > 0) {
      if (this.frameCount % 4 === 0) {
        this.smokeParticles.push({
          x: factoryX + 45 + (Math.random() - 0.5) * 6,
          y: factoryY - 35,
          vx: 0.8 + Math.random() * 0.6,
          vy: -1.2 - Math.random() * 0.8,
          radius: 6,
          alpha: Math.min(0.85, (state.fossil / 250))
        });
      }
    }

    // Atualizar e desenhar partículas de fumaça
    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.radius += 0.45;
      p.alpha -= 0.008;

      if (p.alpha <= 0 || p.y < 0) {
        this.smokeParticles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = `rgba(100, 116, 139, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 5. Skyline Urbano (Edifícios de Vidro Modernos)
    const buildings = [
      { x: 170, y: 110, w: 42, h: 130, color: '#0f172a', win: true },
      { x: 218, y: 80,  w: 52, h: 160, color: '#182234', win: true, roofSolar: true },
      { x: 276, y: 125, w: 38, h: 115, color: '#0f172a', win: true },
      { x: 320, y: 95,  w: 60, h: 145, color: '#182234', win: true, roofSolar: true },
      { x: 386, y: 140, w: 45, h: 100, color: '#0f172a', win: true }
    ];

    buildings.forEach(b => {
      // Corpo do prédio
      this.ctx.fillStyle = b.color;
      this.ctx.fillRect(b.x, b.y, b.w, b.h);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.strokeRect(b.x, b.y, b.w, b.h);

      // Janelas acesas em vidro
      if (b.win) {
        const rows = Math.floor(b.h / 14);
        const cols = Math.floor(b.w / 12);
        for (let r = 1; r < rows - 1; r++) {
          for (let c = 1; c < cols; c++) {
            const isLit = (r + c * 2 + (this.frameCount > 0 ? 1 : 0)) % 3 !== 0;
            if (isLit) {
              this.ctx.fillStyle = (r % 2 === 0) ? '#38bdf8' : '#fef08a';
              this.ctx.fillRect(b.x + c * 11, b.y + r * 13, 6, 7);
            }
          }
        }
      }

      // Painéis solares no topo
      if (b.roofSolar && state.solar > 0) {
        this.ctx.fillStyle = '#0284c7';
        this.ctx.fillRect(b.x + 4, b.y - 8, b.w - 8, 8);
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(b.x + 4, b.y - 8, b.w - 8, 8);
      }
    });

    // 6. Turbinas Eólicas Realistas (Lado Esquerdo)
    const windSpeed = (state.wind / 300) * 0.18;
    this.windTurbineAngle += windSpeed;

    this.drawRealisticTurbine(110, 140, 65, this.windTurbineAngle);
    this.drawRealisticTurbine(60, 160, 50, this.windTurbineAngle * 1.15);

    // 7. Rodovia e Ponte Elevada (Mobilidade Elétrica)
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 245, w, 28);
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 245, w, 28);

    // Faixas da pista
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    this.ctx.setLineDash([12, 12]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 259);
    this.ctx.lineTo(w, 259);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Carros elétricos animados
    this.vehicles.forEach(v => {
      v.x += v.speed * v.dir;
      if (v.dir === 1 && v.x > w + 20) v.x = -20;
      if (v.dir === -1 && v.x < -20) v.x = w + 20;

      const vy = v.dir === 1 ? 250 : 262;

      // Corpo do veículo
      this.ctx.fillStyle = v.color;
      this.ctx.fillRect(v.x, vy, 22, 9);

      // Faróis
      if (v.dir === 1) {
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillRect(v.x + 20, vy + 2, 3, 5);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(v.x - 2, vy + 2, 2, 5);
      } else {
        this.ctx.fillStyle = '#fef08a';
        this.ctx.fillRect(v.x - 2, vy + 2, 3, 5);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(v.x + 20, vy + 2, 2, 5);
      }
    });

    // 8. Vegetação Urbana e Árvores
    this.ctx.fillStyle = state.happiness > 60 ? '#10b981' : (state.happiness > 30 ? '#059669' : '#475569');
    for (let tx = 130; tx < 460; tx += 48) {
      this.ctx.beginPath();
      this.ctx.arc(tx, 242, 9, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 9. Névoa de Smog Atmosférico Realista (se fóssil alto)
    if (state.aqi > 50) {
      const smogIntensity = Math.min(0.75, (state.aqi - 50) / 280);
      this.ctx.fillStyle = `rgba(100, 80, 60, ${smogIntensity})`;
      this.ctx.fillRect(0, 0, w, h);
    }
  }

  drawRealisticTurbine(x, y, height, angle) {
    // Torre afunilada
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 3, y);
    this.ctx.lineTo(x + 3, y);
    this.ctx.lineTo(x + 1.5, y - height);
    this.ctx.lineTo(x - 1.5, y - height);
    this.ctx.closePath();
    this.ctx.fill();

    // Cubo do rotor
    const hubY = y - height;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(x, hubY, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // 3 pás aerodinâmicas
    const bladeLen = height * 0.55;
    for (let i = 0; i < 3; i++) {
      const a = angle + (i * Math.PI * 2) / 3;
      const bx = x + Math.cos(a) * bladeLen;
      const by = hubY + Math.sin(a) * bladeLen;

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.5;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(x, hubY);
      this.ctx.lineTo(bx, by);
      this.ctx.stroke();
    }
  }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ecoCitySimulator = new RealisticCitySimulator();
  });
} else {
  window.ecoCitySimulator = new RealisticCitySimulator();
}
