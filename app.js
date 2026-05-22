const SUPABASE_URL = "https://lfpxslduddtfuzolvdep.supabase.co";
const SUPABASE_KEY = "sb_publishable_O1PwAayOB9U2jBNA0hcM8g_9Z6zNYJa";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const authMessage = document.getElementById("auth-message");
const authSection = document.getElementById("auth-section");
const userSection = document.getElementById("user-section");
const userEmail = document.getElementById("user-email");

function showMessage(message, isError = true) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#b91c1c" : "#15803d";
}

function updateUI(user) {
  if (user) {
    authSection.classList.add("hidden");
    userSection.classList.remove("hidden");
    userEmail.textContent = `Logado como: ${user.email}`;
  } else {
    authSection.classList.remove("hidden");
    userSection.classList.add("hidden");
    userEmail.textContent = "";
  }
}

async function checkUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    updateUI(null);
    return;
  }
  updateUI(data.user);
}

signupBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    showMessage(error.message, true);
    return;
  }

  showMessage("Conta criada com sucesso. Verifique o e-mail se necessário.", false);
});

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showMessage(error.message, true);
    return;
  }

  showMessage("Login realizado com sucesso.", false);
  checkUser();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  updateUI(null);
});

checkUser();