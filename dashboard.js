function setCookie(name, value, hours) {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
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
      alert("Please wait 2 hours between submissions.");
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

      if (response.ok) {
        document.getElementById("lobbyCode").textContent =
          `Animal Company lobby code (Join this now): ${code}`;
        setCookie("ac_cooldown", "yes", 2);
      } else {
        const result = await response.json();
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Mission failed.");
    }
  });
});
