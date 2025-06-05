function setCookie(name, value, hours) {
  const now = new Date();
  now.setTime(now.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${now.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
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
      alert("You must wait before submitting another mission.");
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
        setCookie("ac_cooldown", "true", 2);
      } else {
        alert("Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  });
});
