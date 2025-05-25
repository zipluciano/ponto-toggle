function stringToBoolean(str) {
  return str === "true";
}

function toggleActionComponents() {
  document.getElementById("auth-token-form").classList.add("hide");
  document.getElementById("register-toggle").classList.remove("hide");
}

function startupToggleComponents() {
  const authToken = localStorage.getItem("REGISTER_AUTH_TOKEN");
  if (authToken) toggleActionComponents();
}

async function fetchStatus() {
  const registerStatus = await fetch("https://check-ponto-node-docker-768896443744.us-west1.run.app/check", {
    headers: {
      Authorization: localStorage.getItem("REGISTER_AUTH_TOKEN")
    }
  }).then(res => res.json());
  document.getElementById("register-status").innerText = `Register status: ${registerStatus.shouldRegister}`;
  localStorage.setItem("SHOULD_REGISTER", registerStatus.shouldRegister);
}

async function startupCheck() {
  startupToggleComponents();
  await fetchStatus();
}

async function handleToggleRegister() {
  await fetch("https://check-ponto-node-docker-768896443744.us-west1.run.app/register", {
    headers: {
      Authorization: localStorage.getItem("REGISTER_AUTH_TOKEN"),
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ shouldRegister: !stringToBoolean(localStorage.getItem("SHOULD_REGISTER")) })
  });
  document.getElementById("register-status").innerText = `Register status: ${!stringToBoolean(
    localStorage.getItem("SHOULD_REGISTER")
  )}`;
  localStorage.setItem("SHOULD_REGISTER", `${!stringToBoolean(localStorage.getItem("SHOULD_REGISTER"))}`);
}

document.getElementById("auth-token-form").addEventListener("submit", async e => {
  e.preventDefault();
  const authToken = new FormData(e.target).get("auth-token");
  localStorage.setItem("REGISTER_AUTH_TOKEN", authToken);
  toggleActionComponents();
  await fetchStatus();
});

startupCheck();
