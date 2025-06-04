export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { goal, payment, username, code, turbo } = req.body;

  const webhookUrl = "https://discord.com/api/webhooks/1379745734613532764/d5idZgf5zU5K_ZytGwqEcWmg9OZkChrOu4RHTR-Q5NIVG6yWFnCy0fZU-zS-NVeGybXl";

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

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected error' });
  }
}
