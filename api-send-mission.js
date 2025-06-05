export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK;
  if (!webhookUrl) {
    return res.status(500).json({ error: "Webhook URL not configured" });
  }

  const { goal, payment, username, code, turbo } = req.body;

  const message = {
    username: turbo ? "🚀 TURBO Mission" : "Mission Request",
    embeds: [
      {
        title: turbo ? "🔥 TURBO MISSION STARTED" : "🎯 New Mission Request",
        color: turbo ? 0xff3366 : 0x00aaff,
        fields: [
          { name: "Goal", value: goal || "N/A", inline: false },
          { name: "Payment", value: payment || "N/A", inline: true },
          { name: "Meta Username", value: username || "N/A", inline: true },
          { name: "Lobby Code", value: `\`${code}\``, inline: false }
        ],
        footer: {
          text: turbo ? "Turbo Priority Request" : "Standard Request"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    if (!discordRes.ok) {
      const error = await discordRes.text();
      return res.status(400).json({ error: "Discord error", detail: error });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending to Discord:", err);
    res.status(500).json({ error: "Internal error" });
  }
}
