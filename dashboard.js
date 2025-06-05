function setCookie(name, value, hours) {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}

function canSubmit() {
  return getCookie("ac_cooldown") === null;
}

function setCooldown() {
  setCookie("ac_cooldown", "true", 2); // expires in 2 hours
}

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

document.getElementById("missionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!canSubmit()) {
    alert("Please wait 2 hours between missions.");
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
