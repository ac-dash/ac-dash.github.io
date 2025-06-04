function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

document.getElementById("missionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const goal = document.getElementById("goal").value;
  const payment = document.getElementById("payment").value;
  const username = document.getElementById("username").value;
  const code = generateCode();

  try {
    const res = await fetch("/api/send-mission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, payment, username, code, turbo: true })
    });

    const result = await res.json();

    if (result.success) {
      document.getElementById("lobbyCode").textContent = `Animal Company lobby code (Join this now): ${code}`;
    } else {
      alert("Error: " + result.error);
    }
  } catch (err) {
    console.error(err);
    alert("Unexpected error");
  }
});
