function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

document.getElementById("missionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const goal = document.getElementById("goal").value;
  const payment = document.getElementById("payment").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("turboPass").value;
  const code = generateCode();

  const payload = {
    goal,
    payment,
    username,
    code,
    turbo: true,
    password
  };

  try {
    const response = await fetch("/api/send-mission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      document.getElementById("lobbyCode").textContent =
        `🚀 Animal Company lobby code (Join this now): ${code}`;
    } else {
      alert("Error: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Turbo error:", error);
    alert("Failed to send Turbo mission.");
  }
});
