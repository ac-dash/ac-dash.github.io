function setCookie(name, value, hours) {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let c of cookies) {
    const [key, val] = c.split("=");
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
      alert("You've already submitted. Please wait 2 hours before trying again.");
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
        setCookie("ac_cooldown", "yes", 2); // 2-hour cooldown
      } else {
        const err = await response.json();
        alert("Submission failed: " + err.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("An error occurred. Please try again later.");
    }
  });
});
