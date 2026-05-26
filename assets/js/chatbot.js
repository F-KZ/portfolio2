(function () {
  'use strict';

  // ── CONFIGURATION ────────────────────────────────────────────────────────────
  // ⚠️  Ne jamais exposer cette clé côté client en production.
  //     Utilisez un backend proxy (Vercel Edge, Node.js, etc.) qui détient la clé.
  const EMAILJS_PUBLIC_KEY='v_uAluIeQUUcMHhqP'
  const EMAILJS_TEMPLATE_ID='template_aabjjb3'
  const EMAILJS_SERVICE_ID='service_twkldo4'
 

  

  // Persona — modifiez ce prompt pour personnaliser le comportement de l'assistant
  const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Franck Kanza, développeur web freelance basé en Normandie (Caen) et Paris.

Ton rôle : répondre aux visiteurs du site de Franck de façon chaleureuse, concise et professionnelle.

Informations clés sur Franck :
- 6 ans d'expérience, ex-Lead Dev chez Effiscience
- Travail en remote pour toute la France
- Contact : franck.kanza@outlook.fr | +33 6 44 39 62 84 | https://wa.me/33644396284
- Profil Malt : https://www.malt.fr/profile/franckkanza
- Disponible pour de nouvelles missions

Services proposés :
1. Site vitrine — dès 1 000 €, livré en 2–4 semaines (React / Next.js, SEO intégré)
2. E-commerce — dès 6 000 €, livré en 6–10 semaines (Next.js + Stripe / PayPal)
3. Application mobile — dès 4 000 €, livré en 8–16 semaines (React Native, iOS & Android)
4. Chatbot sur-mesure — abonnement mensuel, 3 versions :
   - V1 Essentiel : 100 €/mois ou 1 100 €/an — FAQ, orientation visiteurs, base de connaissances, automatisation simple, design responsive, 30 j support
   - V2 Pro : 200 €/mois ou 2 200 €/an — tout V1 + qualification prospects, collecte de besoins, devis automatisés, notifications leads
   - V3 Premium : 300 €/mois ou 3 300 €/an — tout V1+V2 + prise de RDV automatisée, accès Google Calendar, créneaux horaires, création Google Meet automatique
   - Tarification sur-mesure possible pour gros volumes ou catalogues étendus
5. Plateforme LMS (e-learning) — sur devis personnalisé (Next.js + Stripe, espace apprenant, back-office admin, emails automatisés, 30 j support)

Stack technique : React, Next.js, TypeScript, Tailwind CSS, Node.js, MongoDB, React Native, Expo, Docker, AWS, Vercel

Règles :
- Réponds toujours en français, de façon courte (3–6 lignes max)
- Tu peux utiliser du HTML simple : <strong>, <a href="...">
- Ne mentionne jamais que tu es une IA ou Claude — tu es "l'assistant de Franck"
- Si tu ne sais pas, propose de contacter Franck directement`;

  // ── CSS ──────────────────────────────────────────────────────────────────────
 const css = `
    #fk-chat-wrapper {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      z-index: 9990;
    }
    .fk-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.38);
      animation: fkRing 2.2s ease-out infinite;
      pointer-events: none;
    }
    .fk-ring:nth-child(2) { animation-delay: 0.9s; }
    @keyframes fkRing {
      0%   { transform: scale(1);   opacity: 0.75; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    #fk-chat-btn {
      position: relative;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(99,102,241,0.55);
      z-index: 1;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #fk-chat-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(99,102,241,0.7);
    }
    #fk-chat-notif {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 18px;
      height: 18px;
      background: #ef4444;
      border-radius: 50%;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #fk-chat-window {
      position: fixed;
      bottom: 96px;
      right: 28px;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 500px;
      max-height: calc(100svh - 120px);
      background: #0f1118;
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 18px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9990;
      box-shadow: 0 16px 48px rgba(0,0,0,0.55);
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
      transform-origin: bottom right;
    }
    #fk-chat-window.fk-open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    .fk-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #2e1065 100%);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 11px;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .fk-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
      color: #fff;
      flex-shrink: 0;
      font-family: system-ui, sans-serif;
    }
    .fk-header-info { flex: 1; min-width: 0; }
    .fk-header-name {
      font-weight: 700;
      font-size: 14px;
      color: #fff;
      font-family: system-ui, sans-serif;
    }
    .fk-header-status {
      font-size: 11.5px;
      color: #a5b4fc;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
      font-family: system-ui, sans-serif;
    }
    .fk-header-status::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      flex-shrink: 0;
    }
    .fk-close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 5px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s, background 0.15s;
    }
    .fk-close-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
    .fk-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: #334155 transparent;
    }
    .fk-messages::-webkit-scrollbar { width: 4px; }
    .fk-messages::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    .fk-msg {
      max-width: 85%;
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.55;
      font-family: system-ui, sans-serif;
      animation: fkIn 0.22s ease;
      word-wrap: break-word;
    }
    @keyframes fkIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: none; }
    }
    .fk-bot {
      background: #1e293b;
      color: #e2e8f0;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .fk-bot a { color: #818cf8; }
    .fk-user {
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .fk-typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 11px 14px;
      background: #1e293b;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    .fk-typing span {
      width: 6px;
      height: 6px;
      background: #94a3b8;
      border-radius: 50%;
      animation: fkDot 1.1s infinite;
    }
    .fk-typing span:nth-child(2) { animation-delay: 0.18s; }
    .fk-typing span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes fkDot {
      0%,60%,100% { opacity:0.25; transform:scale(0.8); }
      30%          { opacity:1;    transform:scale(1); }
    }
    .fk-qr-zone {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      padding: 6px 14px 10px;
      flex-shrink: 0;
    }
    .fk-qr {
      padding: 6px 13px;
      border: 1px solid rgba(99,102,241,0.45);
      background: rgba(99,102,241,0.1);
      color: #a5b4fc;
      border-radius: 20px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      white-space: nowrap;
      font-family: system-ui, sans-serif;
    }
    .fk-qr:hover {
      background: rgba(99,102,241,0.28);
      color: #c7d2fe;
      border-color: rgba(99,102,241,0.7);
    }
    .fk-input-row {
      padding: 10px 14px 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }
    .fk-input {
      flex: 1;
      background: #1e293b;
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 22px;
      padding: 9px 16px;
      color: #e2e8f0;
      font-size: 13.5px;
      outline: none;
      font-family: system-ui, sans-serif;
      transition: border-color 0.2s;
    }
    .fk-input:focus  { border-color: #6366f1; }
    .fk-input::placeholder { color: #475569; }
    .fk-send {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.2s;
    }
    .fk-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .fk-send:not(:disabled):hover { opacity: 0.82; }
    @media (max-width: 400px) {
      #fk-chat-window  { right: 8px; bottom: 80px; }
      #fk-chat-wrapper { right: 16px; bottom: 20px; }
    }
    .fk-nav-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 7px 15px;
      border: 1.5px solid rgba(99,102,241,0.55);
      background: rgba(99,102,241,0.08);
      border-radius: 22px;
      color: #6366f1;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      font-family: system-ui, sans-serif;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
      white-space: nowrap;
      position: relative;
    }
    .fk-nav-btn:hover {
      background: rgba(99,102,241,0.2);
      border-color: rgba(99,102,241,0.9);
      color: #818cf8;
    }
    .fk-nav-btn.fk-nav-active {
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      border-color: transparent;
      color: #fff;
    }
    .fk-nav-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22c55e;
      flex-shrink: 0;
    }
    .fk-error {
      font-size: 12px;
      color: #f87171;
      padding: 6px 10px;
      background: rgba(239,68,68,0.1);
      border-radius: 8px;
      align-self: flex-start;
      font-family: system-ui, sans-serif;
    }

    /* ── Lead form ── */
    .fk-lead-form {
      display: flex;
      flex-direction: column;
      gap: 9px;
      padding: 16px 14px;
      background: #151c2c;
      border: 1px solid rgba(99,102,241,0.22);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      width: 100%;
      box-sizing: border-box;
      animation: fkIn 0.22s ease;
    }
    .fk-lead-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #c7d2fe;
      letter-spacing: 0.3px;
      margin-bottom: 2px;
      font-family: system-ui, sans-serif;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .fk-lead-title::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      flex-shrink: 0;
    }
    .fk-lead-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .fk-lead-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .fk-lead-label {
      font-size: 10.5px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-family: system-ui, sans-serif;
    }
    .fk-lead-form input,
    .fk-lead-form textarea {
      background: rgba(15,17,24,0.8);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 9px;
      padding: 9px 11px;
      color: #e2e8f0;
      font-size: 13px;
      font-family: system-ui, sans-serif;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.2s, background 0.2s;
    }
    .fk-lead-form input:focus,
    .fk-lead-form textarea:focus {
      border-color: rgba(99,102,241,0.7);
      background: rgba(99,102,241,0.05);
    }
    .fk-lead-form input::placeholder,
    .fk-lead-form textarea::placeholder { color: #334155; }
    .fk-lead-form textarea {
      resize: none;
      height: 68px;
      line-height: 1.5;
    }
    .fk-lead-submit {
      margin-top: 2px;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 11px 16px;
      font-size: 13.5px;
      font-weight: 700;
      font-family: system-ui, sans-serif;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      width: 100%;
      letter-spacing: 0.2px;
    }
    .fk-lead-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .fk-lead-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
    .fk-lead-error-msg {
      font-size: 11.5px;
      color: #f87171;
      min-height: 14px;
      font-family: system-ui, sans-serif;
      padding: 0 2px;
    }
    .fk-lead-success {
      font-size: 13.5px;
      color: #86efac;
      background: rgba(34,197,94,0.07);
      border: 1px solid rgba(34,197,94,0.18);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      padding: 14px 16px;
      line-height: 1.65;
      align-self: flex-start;
      animation: fkIn 0.22s ease;
      font-family: system-ui, sans-serif;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── DOM ──────────────────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <div id="fk-chat-wrapper">
      <span class="fk-ring"></span>
      <span class="fk-ring"></span>
      <button id="fk-chat-btn" aria-label="Ouvrir le chat">
        <span id="fk-chat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
        <span id="fk-chat-notif">1</span>
      </button>
    </div>

    <div id="fk-chat-window" role="dialog" aria-modal="true" aria-label="Chat — Franck Kanza">
      <div class="fk-header">
        <div class="fk-avatar">FK</div>
        <div class="fk-header-info">
          <div class="fk-header-name">Assistant</div>
          <div class="fk-header-status">Disponible — répond sous 24h</div>
        </div>
        <button class="fk-close-btn" aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="fk-messages" id="fk-messages"></div>
      <div class="fk-qr-zone" id="fk-qr-zone"></div>
      <div class="fk-input-row">
        <input class="fk-input" id="fk-input" type="text" placeholder="Posez votre question…" autocomplete="off" maxlength="300" aria-label="Message">
        <button class="fk-send" id="fk-send" aria-label="Envoyer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `);

  // ── State ────────────────────────────────────────────────────────────────────
  const chatBtn  = document.getElementById('fk-chat-btn');
  const chatWin  = document.getElementById('fk-chat-window');
  const msgBox   = document.getElementById('fk-messages');
  const qrZone   = document.getElementById('fk-qr-zone');
  const inputEl  = document.getElementById('fk-input');
  const sendBtn  = document.getElementById('fk-send');
  const notifEl  = document.getElementById('fk-chat-notif');
  const closeBtn = chatWin.querySelector('.fk-close-btn');
  const iconEl   = document.getElementById('fk-chat-icon');

  let isOpen    = false;
  let isLoading = false;

  // Conversation history sent to the API (role: user | assistant)
  const history = [];

  // Initial quick replies shown before any message
  const INITIAL_QR = ['Voir les services', 'Connaître les tarifs', 'Voir le portfolio', 'Prendre contact'];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function addMsg(html, role) {
    const el = document.createElement('div');
    el.className = `fk-msg fk-${role}`;
    el.innerHTML = html.replace(/\n/g, '<br>');
    msgBox.appendChild(el);
    msgBox.scrollTop = msgBox.scrollHeight;
    return el;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'fk-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgBox.appendChild(el);
    msgBox.scrollTop = msgBox.scrollHeight;
    return el;
  }

  function clearQR() { qrZone.innerHTML = ''; }

  function setQR(labels) {
    clearQR();
    labels.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'fk-qr';
      btn.textContent = label;
      btn.addEventListener('click', () => handleSend(label));
      qrZone.appendChild(btn);
    });
  }

  function setLoading(val) {
    isLoading = val;
    sendBtn.disabled = val;
    inputEl.disabled = val;
  }

  // ── Base de connaissances (fallback hors-ligne) ──────────────────────────────
  const KB = [
    {
      id: 'hello',
      patterns: ['bonjour','salut','hello','bonsoir','coucou','yo','hi','slt'],
      response: 'Bonjour ! 👋 Je suis l\'assistant de <strong>Franck Kanza</strong>, développeur web freelance basé en Normandie & Paris.\n\nJe peux vous renseigner sur ses services, tarifs, délais ou vous aider à prendre contact. Que puis-je faire pour vous ?',
      qr: ['Voir les services','Connaître les tarifs','Voir le portfolio','Prendre contact']
    },
    {
      id: 'service',
      patterns: ['service','propose','créer','développer','réaliser','faire','besoin','aide','prestation'],
      response: 'Franck propose <strong>3 services principaux</strong> :\n\n🌐 <strong>Site vitrine</strong> — React / Next.js, SEO intégré\n🛒 <strong>E-commerce</strong> — Next.js + Stripe / PayPal\n📱 <strong>Application mobile</strong> — React Native (iOS & Android)\n\nChaque projet est conçu sur-mesure avec design unique et livraison soignée.',
      qr: ['Tarifs & formules','Délais de livraison','Prendre contact']
    },
    {
      id: 'vitrine',
      patterns: ['site vitrine','vitrine','site internet','site web'],
      response: 'Le <strong>site vitrine</strong> est idéal pour présenter votre activité.\n\n✅ Design 100 % sur-mesure\n✅ SEO technique Next.js SSR\n✅ Score Lighthouse 90+\n✅ Mobile-first responsive\n✅ Formation incluse pour gérer votre contenu\n\n📅 Livré en <strong>2 à 4 semaines</strong>.',
      qr: ['Prix du site vitrine','Voir le portfolio','Prendre contact']
    },
    {
      id: 'ecommerce',
      patterns: ['e-commerce','boutique','shop','vente en ligne','stripe','paypal','woocommerce','shopify'],
      response: 'La <strong>boutique e-commerce</strong> chez Franck va bien au-delà de Shopify :\n\n✅ Next.js SSR — indexation Google maximale\n✅ Paiements Stripe & PayPal\n✅ Dashboard admin sur-mesure\n✅ Scalable jusqu\'à 10 000 visiteurs/jour\n✅ Architecture sécurisée',
      qr: ['Prix e-commerce','Prendre contact','Voir le portfolio']
    },
    {
      id: 'mobile',
      patterns: ['application mobile','app mobile','ios','android','react native','mobile','expo','application'],
      response: 'Les <strong>applications mobiles</strong> sont développées en <strong>React Native + Expo</strong> :\n\n✅ Un seul code → iOS & Android\n✅ Performances natives 60 FPS\n✅ Paiements in-app, push, géolocalisation\n✅ Backend Node.js intégré si besoin\n✅ 30 jours de support inclus',
      qr: ['Prix application mobile','Prendre contact']
    },
    {
      id: 'prix',
      patterns: ['prix','tarif','coût','combien','budget','coûte','cher','formule','forfait','tarification','payer'],
      response: 'Voici les fourchettes indicatives :\n\n🌐 <strong>Site vitrine</strong> — à partir de <strong>1 000 €</strong>\n🛒 <strong>E-commerce</strong> — à partir de <strong>6 000 €</strong>\n📱 <strong>Application mobile</strong> — à partir de <strong>4 000 €</strong>\n\n💡 Chaque devis est personnalisé et <strong>gratuit</strong>, établi sous 24h.',
      qr: ['Obtenir un devis gratuit','Voir les formules détaillées']
    },
    {
      id: 'delai',
      patterns: ['délai','temps','livraison','combien de temps','durée','quand','planning'],
      response: 'Délais estimatifs :\n\n📅 <strong>Site vitrine</strong> — 2 à 4 semaines\n📅 <strong>E-commerce</strong> — 6 à 10 semaines\n📅 <strong>App mobile</strong> — 8 à 16 semaines\n\nCes durées dépendent de la complexité. Franck vous fournit un planning précis après le brief.',
      qr: ['Prendre contact','Obtenir un devis']
    },
    {
      id: 'techno',
      patterns: ['technologie','techno','langage','stack','react','next','next.js','typescript','node','framework','tailwind','mongodb'],
      response: 'Franck maîtrise un stack moderne :\n\n⚡ <strong>Front-end</strong> : React, Next.js, TypeScript, Tailwind CSS\n📱 <strong>Mobile</strong> : React Native, Expo\n🔧 <strong>Back-end</strong> : Node.js, MongoDB, Prisma\n☁️ <strong>DevOps</strong> : Docker, AWS, Vercel',
      qr: ['Voir les services','Prendre contact']
    },
    {
      id: 'portfolio',
      patterns: ['portfolio','projet','réalisation','travail','exemple','référence','work'],
      response: 'Franck a réalisé <strong>plus de 20 projets</strong> : sites vitrine, e-commerce, apps mobiles.\n\nParmi ses réalisations : <strong>Horizon Transports</strong>, <strong>Barber Shop</strong>, <strong>O\'Délice Burger</strong>, <strong>Kanap</strong>, <strong>U-Walls</strong>, <strong>ID-Formation</strong>…\n\n🔗 Consultez le portfolio complet ci-dessous.',
      qr: ['Voir le portfolio complet','Prendre contact','Obtenir un devis']
    },
    {
      id: 'contact',
      patterns: ['contact','contacter','écrire','appeler','téléphone','email','mail','devis','discuter','parler','joindre','whatsapp','message'],
      response: '📧 <strong>Email</strong> : <a href="mailto:franck.kanza@outlook.fr">franck.kanza@outlook.fr</a>\n📞 <strong>Tél</strong> : <a href="tel:+33644396284">+33 6 44 39 62 84</a> (9h–18h)\n💬 <strong>WhatsApp</strong> : <a href="https://wa.me/33644396284" target="_blank" rel="noopener">Écrire sur WhatsApp</a>\n\nOu via le <a href="/page/contact.html">formulaire de contact</a> — réponse sous 24h.',
      qr: ['Obtenir un devis','Voir les formules détaillées']
    },
    {
      id: 'merci',
      patterns: ['merci','super','parfait','nickel','cool','ok','bien','génial','top'],
      response: 'Avec plaisir ! 😊\n\nN\'hésitez pas à revenir si vous avez d\'autres questions. Franck sera ravi d\'échanger avec vous sur votre projet.',
      qr: ['Prendre contact','Obtenir un devis']
    },
  ];

  const KB_DEFAULT = {
    response: 'Je n\'ai pas bien saisi, mais je peux vous aider sur ces sujets :',
    qr: ['Voir les services','Connaître les tarifs','Voir le portfolio','Prendre contact']
  };

  function kbFind(text) {
    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const item of KB) {
      if (item.patterns.some(p => lower.includes(p.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
        return item;
      }
    }
    return KB_DEFAULT;
  }

  function kbReply(text) {
    const item = kbFind(text);
    addMsg(item.response, 'bot');
    setQR(item.qr || []);
  }

  // ── EmailJS loader (injecté une seule fois) ───────────────────────────────────
  function loadEmailJS() {
    return new Promise((resolve, reject) => {
      if (window.emailjs) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // ── Affiche le formulaire lead dans le fil de messages ────────────────────────
  function showLeadForm() {
    clearQR();
    const wrapper = document.createElement('div');
    wrapper.className = 'fk-lead-form';
    wrapper.innerHTML = `
      <div class="fk-lead-title">Laissez vos coordonnées</div>
      <div class="fk-lead-row">
        <div class="fk-lead-field">
          <span class="fk-lead-label">Prénom *</span>
          <input id="fk-lf-prenom" type="text" placeholder="Marie" maxlength="50" autocomplete="given-name">
        </div>
        <div class="fk-lead-field">
          <span class="fk-lead-label">Nom *</span>
          <input id="fk-lf-nom" type="text" placeholder="Dupont" maxlength="50" autocomplete="family-name">
        </div>
      </div>
      <div class="fk-lead-field">
        <span class="fk-lead-label">Téléphone *</span>
        <input id="fk-lf-tel" type="tel" placeholder="+33 6 00 00 00 00" maxlength="20" autocomplete="tel">
      </div>
      <div class="fk-lead-field">
          <span class="fk-lead-label">Email *</span>
          <input id="fk-lf-email" type="text" placeholder="marie-dupont@..." maxlength="50" autocomplete="mail">
        </div>
      <div class="fk-lead-field">
        <span class="fk-lead-label">Votre projet</span>
        <textarea id="fk-lf-msg" placeholder="Décrivez brièvement votre besoin…"></textarea>
      </div>
      <button class="fk-lead-submit" id="fk-lf-btn">Envoyer ma demande →</button>
      <div class="fk-lead-error-msg" id="fk-lf-err"></div>
    `;
    msgBox.appendChild(wrapper);
    msgBox.scrollTop = msgBox.scrollHeight;

    document.getElementById('fk-lf-btn').addEventListener('click', async () => {
      const prenom = document.getElementById('fk-lf-prenom').value.trim();
      const nom    = document.getElementById('fk-lf-nom').value.trim();
      const mail    = document.getElementById('fk-lf-email').value.trim();
      const tel    = document.getElementById('fk-lf-tel').value.trim();
      const msg    = document.getElementById('fk-lf-msg').value.trim();
      const errEl  = document.getElementById('fk-lf-err');
      const btn    = document.getElementById('fk-lf-btn');

      if (!prenom || !nom || !tel) {
        errEl.textContent = '⚠️ Prénom, nom et téléphone sont obligatoires.';
        return;
      }
      errEl.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';

      try {
        await loadEmailJS();
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
         name: prenom, lead_name: nom, lead_phone: tel, lead_mail: mail,  message: msg || '(aucun message)',
          date: new Date().toLocaleString('fr-FR'),
        });

        // Remplace le formulaire par un message de succès
        wrapper.remove();
        const ok = document.createElement('div');
        ok.className = 'fk-lead-success';
        ok.innerHTML = '✅ <strong>Demande envoyée !</strong><br>Franck vous recontactera sous 24h. Merci ' + prenom + ' !';
        msgBox.appendChild(ok);
        msgBox.scrollTop = msgBox.scrollHeight;
        setQR(['Voir les services', 'Voir le portfolio']);

      } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Envoyer ma demande 🚀';
        errEl.textContent = "❌ Échec de l'envoi. Réessayez ou contactez Franck directement.";
      }
    });
  }

  // ── Claude API call (avec fallback KB) ───────────────────────────────────────
  async function askClaude(userText) {
    history.push({ role: 'user', content: userText });

    const typing = showTyping();
    setLoading(true);
    clearQR();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      typing.remove();

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Erreur API (${res.status})`);
      }

      const data  = await res.json();
      const reply = data.content?.[0]?.text || 'Désolé, je n\'ai pas pu répondre.';

      history.push({ role: 'assistant', content: reply });
      addMsg(reply, 'bot');
      setQR(['Voir les services', 'Connaître les tarifs', 'Prendre contact']);

    } catch (_err) {
      // ── Fallback KB silencieux ───────────────────────────────────────────────
      typing.remove();
      history.pop(); // retire le message user non confirmé par l'API
      kbReply(userText);
    } finally {
      setLoading(false);
    }
  }

  // ── Send ─────────────────────────────────────────────────────────────────────
  // Labels de QR qui déclenchent directement le formulaire lead
  const LEAD_TRIGGERS = ['Obtenir un devis', 'Obtenir un devis gratuit', 'Prendre contact'];

  async function handleSend(overrideText) {
    const text = (overrideText || inputEl.value).trim();
    if (!text || isLoading) return;
    clearQR();
    addMsg(text, 'user');
    inputEl.value = '';

    // Déclenchement direct du formulaire si QR lead
    if (LEAD_TRIGGERS.includes(text)) {
      addMsg('Parfait ! 🎯 Laissez-moi vos coordonnées et Franck vous recontacte sous 24h.', 'bot');
      showLeadForm();
      return;
    }

    await askClaude(text);
  }

  // ── Open / Close ─────────────────────────────────────────────────────────────
  const iconChat  = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  const iconClose = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

  let navBtn = null;
  const headerBtns = document.querySelector('.header-btns');
  if (headerBtns) {
    navBtn = document.createElement('button');
    navBtn.className = 'fk-nav-btn';
    navBtn.setAttribute('aria-label', 'Ouvrir l\'assistant');
    navBtn.innerHTML = `<span class="fk-nav-dot"></span>Assistant`;
    headerBtns.insertBefore(navBtn, headerBtns.firstChild);
  }

  function openChat() {
    isOpen = true;
    chatWin.classList.add('fk-open');
    if (notifEl) notifEl.remove();
    iconEl.innerHTML = iconClose;
    if (navBtn) navBtn.classList.add('fk-nav-active');
    setTimeout(() => inputEl.focus(), 280);
  }

  function closeChat() {
    isOpen = false;
    chatWin.classList.remove('fk-open');
    iconEl.innerHTML = iconChat;
    if (navBtn) navBtn.classList.remove('fk-nav-active');
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  chatBtn.addEventListener('click', () => { isOpen ? closeChat() : openChat(); });
  if (navBtn) navBtn.addEventListener('click', () => { isOpen ? closeChat() : openChat(); });
  closeBtn.addEventListener('click', closeChat);
  sendBtn.addEventListener('click', () => handleSend());
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
  chatWin.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', e => {
    if (!isOpen) return;
    const outside = !chatWin.contains(e.target)
      && !chatBtn.contains(e.target)
      && !(navBtn && navBtn.contains(e.target));
    if (outside) closeChat();
  });

  // ── Welcome ──────────────────────────────────────────────────────────────────
  setTimeout(() => {
    addMsg('Bonjour ! 👋 Je suis l\'assistant de <strong>Franck Kanza</strong>.<br>Comment puis-je vous aider ?', 'bot');
    setQR(INITIAL_QR);
  }, 500);

})();