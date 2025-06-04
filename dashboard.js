const COOLDOWN_KEY = "ac_mission_cooldown";
const COOLDOWN_TIME_MS = 60 * 60 * 1000; // 1 hour

function canSubmit() {
  const last = localStorage.getItem(COOLDOWN_KEY);
  if (!last) return true;
  const diff = Date.now() - Number(last);
  return diff > COOLDOWN_TIME_MS;
}

function setCooldown() {
  localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

document.getElementById("missionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!canSubmit()) {
    alert("Please wait 1 hour between missions.");
    return;
  }

  const goal = document.getElementById("goal").value;
  const payment = document.getElementById("payment").value;
  const username = document.getElementById("username").value;
  const code = generateCode();

  const payload = {
    goal,
    payment,
    username,
    code,
    turbo: false
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
        `Animal Company lobby code (Join this now): ${code}`;
      setCooldown();
    } else {
      alert("Error: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Dashboard error:", error);
    alert("Failed to send mission.");
  }
});
