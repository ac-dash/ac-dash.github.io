const encodedWebhook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM3OTc0NTczNDYxMzUzMjc2NC9kNWlkWmdmNXpVNWtafll0R3dxRWNXbWc5T1prQ2hyT3VSRFJRLVE1TklWRzZ5V25DeTBmWlUtenMtTlZlR3liWGw==";
const webhookUrl = atob(encodedWebhook);

function generateCode(length = 7) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

document.getElementById("missionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const goal = document.getElementById("goal").value.trim();
  const payment = document.getElementById("payment").value;
  const username = document.getElementById("username").value.trim();
  const code = generateCode();

  if (!goal || !username) {
    alert("Please fill in all required fields.");
    return;
  }

  const payload = {
    content: `🚀 TURBO Mission\n🎯 Target: ${goal}\n💳 Payment: ${payment}\n🎮 Meta Username: ${username}\n🔗 **Animal Company lobby code (Join this now):** ${code}`
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Network response was not OK");

    const lobbyCodeDiv = document.getElementById("lobbyCode");
    lobbyCodeDiv.textContent = `Animal Company lobby code (Join this now): ${code}`;
  } catch (err) {
    alert("Error sending TURBO mission, please try again.");
    console.error(err);
  }
});
