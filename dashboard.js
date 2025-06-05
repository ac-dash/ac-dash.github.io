function setCookie(name, value, hours) {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let c of cookies) {
    const [key, val] = c.split('=');
    if (key === name) return val;
  }
  return null;
}

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("missionForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (getCookie("ac_cooldown")) {
      alert("You must wait before submitting again.");
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
      const response = await fetch("https://your-webhook-proxy.example.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        document.getElementById("lobbyCode").textContent = `Animal Company lobby code (Join this now): ${code}`;
        setCookie("ac_cooldown", "true", 2); // 2 hours
      } else {
        alert("Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  });
});
