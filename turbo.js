// Encoded webhook URL (Base64, but not secure — just obscured)
const encodedHook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM3OTc0NTczNDYxMzUzMjc2NC9kNWlkWmdmNXpVNUtfWnp0R3dxRWNXbWc5T1prQ2hyT3VSRFRSLVE1TklWSTZ5V0ZuQ3kwZlpVLXpTLU5WZVd5Yll4TA==";

// Decode Base64
const getWebhookUrl = () => atob(encodedHook);

// Generate a 7-character alphanumeric lobby code
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Handle the form submission
document.getElementById("missionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const goal = document.getElementById("goal").value.trim();
  const payment = document.getElementById("payment").value.trim();
  const username = document.getElementById("username").value.trim();
  const code = generateCode();

  const payload = {
    goal,
    payment,
    username,
    code,
    turbo: true
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
      alert("Error sending Turbo mission: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("Failed to send Turbo mission.");
  }
});
