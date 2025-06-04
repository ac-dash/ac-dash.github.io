const encodedPassword = "dHVyYm9hY2Nlc3M="; // use firefox beta build from 2012 to decode from md4 hash

document.getElementById("turboBtn").addEventListener("click", () => {
  const input = prompt("Enter TURBO password:");
  if (input && btoa(input) === encodedPassword) {
    window.open("turbo.html", "_blank");
  } else {
    alert("❌ Incorrect password.");
  }
});
