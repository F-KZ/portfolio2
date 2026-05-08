(function () {
  'use strict';

  // ── CSS ─────────────────────────────────────────────────────────────────────
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

    /* ── Header ── */
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

    /* ── Messages ── */
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

    /* ── Typing ── */
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

    /* ── Quick replies ── */
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

    /* ── Input row ── */
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
    .fk-send:hover { opacity: 0.82; }

    @media (max-width: 400px) {
      #fk-chat-window  { right: 8px; bottom: 80px; }
      #fk-chat-wrapper { right: 16px; bottom: 20px; }
    }

    /* ── Bouton nav ── */
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
        <input class="fk-input" id="fk-input" type="text" placeholder="Posez votre question…" autocomplete="off" maxlength="200" aria-label="Message">
        <button class="fk-send" id="fk-send" aria-label="Envoyer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `);

  // ── Base de connaissances ────────────────────────────────────────────────────
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
      patterns: ['portfolio','projet','réalisation','travail','exemple','référence','work','kanap','barber','horizon','fioul','uwalls'],
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
      id: 'malt',
      patterns: ['malt','plateforme','avis','profil','note','freelance'],
      response: 'Franck est présent sur <strong>Malt</strong>, la plateforme freelance de référence.\n\n⭐ Vous pouvez y consulter son profil, ses avis clients et ses disponibilités.\n\n🔗 <a href="https://www.malt.fr/profile/franckkanza" target="_blank" rel="noopener">Voir son profil Malt</a>',
      qr: ['Prendre contact','Voir les services']
    },
    {
      id: 'dispo',
      patterns: ['disponible','disponibilité','libre','occupé','agenda','planning','mission','embauche','recrut'],
      response: 'Franck est actuellement <strong>disponible</strong> pour de nouvelles missions freelance.\n\nPour connaître ses disponibilités exactes et planifier votre projet, contactez-le directement.',
      qr: ['Prendre contact','Obtenir un devis']
    },
    {
      id: 'lieu',
      patterns: ['normandie','caen','rouen','paris','région','localisation','où','lieu','déplacement','remote','télétravail'],
      response: 'Franck est basé à <strong>Caen, Normandie</strong> et intervient également sur <strong>Paris & Île-de-France</strong>.\n\n🌍 Il travaille en <strong>remote</strong> pour des clients partout en France.',
      qr: ['Prendre contact','Obtenir un devis']
    },
    {
      id: 'seo',
      patterns: ['seo','référencement','google','indexation','visibilité','classement','positionnement','lighthouse'],
      response: 'Franck intègre le <strong>SEO technique</strong> dès la conception :\n\n✅ Rendu SSR Next.js — pages indexables par Google\n✅ Balises meta, Open Graph, schema.org\n✅ Core Web Vitals optimisés\n✅ Score Lighthouse 90+\n✅ Sitemap & robots.txt inclus',
      qr: ['Voir les services','Prendre contact']
    },
    {
      id: 'experience',
      patterns: ['expérience','experience','année','depuis','senior','junior','parcours','cv','formation'],
      response: 'Franck développe depuis <strong>6 ans</strong>.\n\nIl a été <strong>Lead Développeur chez Effiscience</strong>, consultant chez Horizon Transport Formation, et exerce en <strong>freelance</strong> depuis plusieurs années sur des projets variés en France.',
      qr: ['Voir le portfolio','Prendre contact']
    },
    {
      id: 'merci',
      patterns: ['merci','super','parfait','nickel','cool','ok','bien','génial','top'],
      response: 'Avec plaisir ! 😊\n\nN\'hésitez pas à revenir si vous avez d\'autres questions. Franck sera ravi d\'échanger avec vous sur votre projet.',
      qr: ['Prendre contact','Obtenir un devis']
    },
  ];

  const DEFAULT = {
    response: 'Je n\'ai pas bien saisi, mais je peux vous aider sur ces sujets :',
    qr: ['Voir les services','Connaître les tarifs','Voir le portfolio','Prendre contact']
  };

  // Quick-reply actions
  const QR_NAV = {
    'Voir le portfolio complet':      '/page/projets.html',
    'Voir les formules détaillées':   '/page/formules.html',
  };
  const QR_BOT = {
    'Voir les services':          'service',
    'Connaître les tarifs':       'prix',
    'Tarifs & formules':          'prix',
    'Voir le portfolio':          'portfolio',
    'Prendre contact':            'contact',
    'Obtenir un devis':           'contact',
    'Obtenir un devis gratuit':   'contact',
    'Délais de livraison':        'delai',
    'Prix du site vitrine':       'prix',
    'Prix e-commerce':            'prix',
    'Prix application mobile':    'prix',
  };

  // ── Refs ─────────────────────────────────────────────────────────────────────
  const chatBtn  = document.getElementById('fk-chat-btn');
  const chatWin  = document.getElementById('fk-chat-window');
  const msgBox   = document.getElementById('fk-messages');
  const qrZone   = document.getElementById('fk-qr-zone');
  const inputEl  = document.getElementById('fk-input');
  const sendBtn  = document.getElementById('fk-send');
  const notifEl  = document.getElementById('fk-chat-notif');
  const closeBtn = chatWin.querySelector('.fk-close-btn');

  let isOpen = false;

  // ── Logic ────────────────────────────────────────────────────────────────────
  function findResponse(text) {
    const lower = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    for (const item of KB) {
      if (item.patterns.some(p => lower.includes(p.normalize('NFD').replace(/[̀-ͯ]/g, '')))) {
        return item;
      }
    }
    return DEFAULT;
  }

  function addMsg(html, role) {
    const el = document.createElement('div');
    el.className = `fk-msg fk-${role}`;
    el.innerHTML = html.replace(/\n/g, '<br>');
    msgBox.appendChild(el);
    msgBox.scrollTop = msgBox.scrollHeight;
    return el;
  }

  function clearQR() { qrZone.innerHTML = ''; }

  function setQR(labels) {
    clearQR();
    if (!labels || !labels.length) return;
    labels.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'fk-qr';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        clearQR();
        if (QR_NAV[label]) {
          window.open(QR_NAV[label], '_blank');
        } else if (QR_BOT[label]) {
          addMsg(label, 'user');
          botReply(findResponseById(QR_BOT[label]));
        } else {
          addMsg(label, 'user');
          botReply(findResponse(label));
        }
      });
      qrZone.appendChild(btn);
    });
  }

  function findResponseById(id) {
    return KB.find(k => k.id === id) || DEFAULT;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'fk-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgBox.appendChild(el);
    msgBox.scrollTop = msgBox.scrollHeight;
    return el;
  }

  function botReply(item) {
    const typing = showTyping();
    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      typing.remove();
      addMsg(item.response, 'bot');
      setQR(item.qr || []);
    }, delay);
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;
    clearQR();
    addMsg(text, 'user');
    inputEl.value = '';
    botReply(findResponse(text));
  }

  const iconChat  = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  const iconClose = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
  const iconEl    = document.getElementById('fk-chat-icon');

  // ── Nav button injection ──────────────────────────────────────────────────────
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
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  // Empêche les clics dans la fenêtre de remonter jusqu'au document
  chatWin.addEventListener('click', e => e.stopPropagation());

  // Close on outside click
  document.addEventListener('click', e => {
    if (!isOpen) return;
    const outside = !chatWin.contains(e.target)
      && !chatBtn.contains(e.target)
      && !(navBtn && navBtn.contains(e.target));
    if (outside) closeChat();
  });

  // ── Welcome message ───────────────────────────────────────────────────────────
  setTimeout(() => {
    addMsg('Bonjour ! 👋 Je suis l\'assistant de <strong>Franck Kanza</strong>.<br>Comment puis-je vous aider ?', 'bot');
    setQR(['Voir les services','Connaître les tarifs','Voir le portfolio','Prendre contact']);
  }, 500);

})();
