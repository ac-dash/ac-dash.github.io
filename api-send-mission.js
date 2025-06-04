// ⚠️ This cache resets every time the Vercel function is cold-started or redeployed
const cooldowns = new Map(); // In-memory IP → timestamp

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { goal, payment, username, code, turbo } = req.body;

  const webhookUrl = process.env.DISCORD_WEBHOOK;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  const now = Date.now();
  const lastSent = cooldowns.get(ip);

  // ⏳ Check 1-hour cooldown (3600000 ms)
  if (lastSent && now - lastSent < 3600000) {
    const mins = Math.ceil((3600000 - (now - lastSent)) / 60000);
    return res.status(429).json({ error: `Cooldown active. Try again in ${mins} min(s).` });
  }

  const content = turbo
    ? `🚀 **TURBO MISSION**\n🎯 Goal: ${goal}\n💳 Payment: ${payment}\n🎮 User: ${username}\n🔗 **Animal Company lobby code (Join this now):** ${code}`
    : `🎯 Goal: ${goal}\n💳 Payment: ${payment}\n🎮 User: ${username}\n🔗 **Animal Company lobby code (Join this now):** ${code}`;

  try {
    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!discordRes.ok) {
      return res.status(500).json({ error: 'Failed to send to Discord' });
    }

    // ✅ Store current time as last-used for this IP
    cooldowns.set(ip, now);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected error' });
  }
}

