const ALLOWED_ORIGINS = [
  'https://franckkanza.vercel.app',
  'https://franckkanza.fr',
  'https://www.franckkanza.fr',
];

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
5. Plateforme LMS (e-learning) — à partir de 300 €/mois pour moins de 50 apprenants (Next.js + Stripe, espace apprenant, back-office admin, emails automatisés, 30 j support) — tarif sur-mesure au-delà

Stack technique : React, Next.js, TypeScript, Tailwind CSS, Node.js, MongoDB, React Native, Expo, Docker, AWS, Vercel

Règles :
- Réponds toujours en français, de façon courte (3–6 lignes max)
- Tu peux utiliser du HTML simple : <strong>, <a href="...">
- Ne mentionne jamais que tu es une IA ou Claude — tu es "l'assistant de Franck"
- Si tu ne sais pas, propose de contacter Franck directement`;

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';

  // Allow localhost for local development
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Upstream API unreachable' });
  }
};
