const SUPABASE_URL = "https://lfpxslduddtfuzolvdep.supabase.co";
const SUPABASE_KEY = "sb_publishable_O1PwAayOB9U2jBNA0hcM8g_9Z6zNYJa";

const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

let currentUser = null;
let currentView = "shop";
let currentLanguage = "pt";
let toastTimer = null;
let cachedProducts = null;
let cachedCartItems = null;
let cachedOrders = null;
let productsLoadToken = 0;
let cartLoadToken = 0;
let ordersLoadToken = 0;

const html = document.documentElement;

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const navbar = document.getElementById("navbar");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const authMessage = document.getElementById("auth-message");

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const themeToggle = document.getElementById("theme-toggle");
const languageToggle = document.getElementById("language-toggle");
const languageMenu = document.getElementById("language-menu");
const currentLanguageFlag = document.getElementById("current-language-flag");
const languageOptions = Array.from(document.querySelectorAll(".lang-option"));

const brandHomeBtn = document.getElementById("brand-home");
const navShopBtn = document.getElementById("nav-shop");
const navCartBtn = document.getElementById("nav-cart");
const navOrdersBtn = document.getElementById("nav-orders");

const userEmailEl = document.getElementById("user-email");
const cartCountEl = document.getElementById("cart-count");

const shopSection = document.getElementById("shop-section");
const cartSection = document.getElementById("cart-section");
const ordersSection = document.getElementById("orders-section");

const productGrid = document.getElementById("product-grid");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartEmptyEl = document.getElementById("cart-empty");
const checkoutBtn = document.getElementById("checkout-btn");
const ordersListEl = document.getElementById("orders-list");

const toastEl = document.getElementById("toast");

const LANG_STORAGE_KEY = "webshop-language";
const LANGUAGE_CONFIG = {
  pt: { htmlLang: "pt-BR", numberLocale: "pt-BR", dateLocale: "pt-BR", currency: "BRL", flag: "🇧🇷" },
  en: { htmlLang: "en", numberLocale: "en-US", dateLocale: "en-US", currency: "USD", flag: "🇬🇧" },
  nl: { htmlLang: "nl", numberLocale: "nl-NL", dateLocale: "nl-NL", currency: "EUR", flag: "🇳🇱" }
};

const translations = {
  pt: {
    "skip.link": "Pular para o conteudo",
    "aria.brandHome": "Ir para a loja",
    "aria.mainNav": "Navegacao principal",
    "aria.themeToggle": "Alternar tema",
    "aria.languageToggle": "Mudar idioma",
    "aria.languageMenu": "Idiomas",
    "aria.appSummary": "Resumo da aplicacao",
    "aria.removeCartItem": "Remover item do carrinho",
    "brand.subtitle": "demo commerce",
    "nav.shop": "Loja",
    "nav.cart": "Carrinho",
    "nav.orders": "Pedidos",
    "user.connectedAs": "Conectado como",
    "lang.pt": "Portugues",
    "lang.en": "English",
    "lang.nl": "Nederlands",
    "action.logout": "Sair",
    "action.login": "Entrar",
    "action.signup": "Criar conta",
    "action.checkout": "Finalizar compra simulada",
    "action.add": "Adicionar",
    "auth.eyebrow": "Projeto demonstrativo",
    "auth.title.main": "Um webshop fake,",
    "auth.title.sub": "limpo, moderno e funcional.",
    "auth.lead": "Faca login para explorar produtos, salvar itens no carrinho e simular compras com persistencia real no banco.",
    "auth.feature1": "Autenticacao com e-mail e senha",
    "auth.feature2": "Carrinho salvo por usuario",
    "auth.feature3": "Pedidos simulados persistidos no banco",
    "auth.badge": "Acesso",
    "auth.card.title": "Entrar na sua conta",
    "auth.card.desc": "Use seu e-mail e senha para acessar a loja ou criar uma conta nova.",
    "field.email": "E-mail",
    "field.password": "Senha",
    "placeholder.email": "voce@exemplo.com",
    "placeholder.password": "Digite sua senha",
    "hero.eyebrow": "Webshop demo",
    "hero.title": "Explore, adicione ao carrinho e finalize compras simuladas.",
    "hero.desc": "Esta interface demonstra um fluxo real de e-commerce com autenticacao, persistencia de carrinho e historico de pedidos por usuario.",
    "hero.stat.flow": "Fluxo",
    "hero.stat.checkout": "Checkout",
    "hero.stat.checkoutValue": "Simulado",
    "hero.stat.persistence": "Persistencia",
    "hero.stat.persistenceValue": "Banco real",
    "shop.kicker": "Catalogo",
    "shop.title": "Produtos",
    "shop.desc": "Adicione produtos ao carrinho para simular uma experiencia completa de compra.",
    "cart.kicker": "Sessao do usuario",
    "cart.title": "Carrinho",
    "cart.desc": "Os itens adicionados ficam vinculados ao usuario autenticado.",
    "cart.empty.title": "Seu carrinho esta vazio",
    "cart.empty.desc": "Escolha um produto na loja para comecar a simulacao.",
    "cart.summary": "Resumo",
    "cart.total": "Total",
    "cart.note": "O checkout e apenas demonstrativo, sem cobranca real.",
    "orders.kicker": "Historico",
    "orders.title": "Pedidos",
    "orders.desc": "Aqui ficam registradas as compras simuladas realizadas pelo usuario.",
    "orders.empty.title": "Nenhum pedido ainda",
    "orders.empty.desc": "Suas compras simuladas aparecerao aqui.",
    "orders.status.simulated": "simulado",
    "common.product": "Produto",
    "fallback.noDescription": "Produto sem descricao.",
    "empty.noProducts": "Nenhum produto encontrado.",
    "loading.products": "Carregando produtos...",
    "loading.cart": "Carregando carrinho...",
    "loading.orders": "Carregando pedidos...",
    "error.loadProducts": "Erro ao carregar produtos.",
    "error.loadCart": "Erro ao carregar o carrinho.",
    "error.loadOrders": "Erro ao carregar pedidos.",
    "errors.supabaseUnavailable": "Nao foi possivel carregar o servico de dados. Recarregue a pagina ou tente novamente mais tarde.",
    "errors.backendUnavailable": "Nao foi possivel conectar ao backend agora. O layout continua disponivel, mas o login e o catalogo ficam temporariamente indisponiveis.",
    "auth.fillEmailPassword": "Preencha e-mail e senha.",
    "auth.passwordMin6": "A senha deve ter pelo menos 6 caracteres.",
    "auth.duplicateEmail": "Este e-mail já tem uma conta.",
    "auth.loginSuccess": "Login realizado com sucesso.",
    "auth.signupSuccessLong": "Conta criada. Se o projeto exigir confirmacao por e-mail, verifique sua caixa de entrada.",
    "loading.login": "Entrando...",
    "loading.signup": "Criando...",
    "checkout.processing": "Processando...",
    "toast.loadProductsFailed": "Nao foi possivel carregar os produtos.",
    "toast.loginRequiredAdd": "Faca login para adicionar produtos.",
    "toast.cartAccessError": "Erro ao acessar o carrinho.",
    "toast.cartUpdateError": "Erro ao atualizar o carrinho.",
    "toast.cartInsertError": "Erro ao adicionar item ao carrinho.",
    "toast.addedToCart": "{name} adicionado ao carrinho.",
    "toast.loadCartFailed": "Nao foi possivel carregar o carrinho.",
    "toast.removeItemError": "Erro ao remover item.",
    "toast.itemRemoved": "Item removido do carrinho.",
    "toast.loadOrdersFailed": "Nao foi possivel carregar os pedidos.",
    "toast.cartEmpty": "Seu carrinho esta vazio.",
    "toast.orderCreateError": "Erro ao criar pedido.",
    "toast.orderItemsError": "Erro ao salvar itens do pedido.",
    "toast.clearCartAfterOrderError": "Pedido criado, mas houve erro ao limpar o carrinho.",
    "toast.checkoutSuccess": "Compra simulada finalizada com sucesso.",
    "toast.logoutError": "Erro ao sair da conta.",
    "toast.sessionEnded": "Sessao encerrada."
  },
  en: {
    "skip.link": "Skip to content",
    "aria.brandHome": "Go to shop",
    "aria.mainNav": "Main navigation",
    "aria.themeToggle": "Toggle theme",
    "aria.languageToggle": "Change language",
    "aria.languageMenu": "Languages",
    "aria.appSummary": "Application summary",
    "aria.removeCartItem": "Remove item from cart",
    "brand.subtitle": "demo commerce",
    "nav.shop": "Shop",
    "nav.cart": "Cart",
    "nav.orders": "Orders",
    "user.connectedAs": "Connected as",
    "lang.pt": "Portuguese",
    "lang.en": "English",
    "lang.nl": "Dutch",
    "action.logout": "Logout",
    "action.login": "Login",
    "action.signup": "Create account",
    "action.checkout": "Finish simulated checkout",
    "action.add": "Add",
    "auth.eyebrow": "Demo project",
    "auth.title.main": "A fake webshop,",
    "auth.title.sub": "clean, modern, and functional.",
    "auth.lead": "Log in to explore products, save items in your cart, and simulate purchases with real database persistence.",
    "auth.feature1": "Email and password authentication",
    "auth.feature2": "User-scoped saved cart",
    "auth.feature3": "Simulated orders persisted in database",
    "auth.badge": "Access",
    "auth.card.title": "Sign in to your account",
    "auth.card.desc": "Use your email and password to access the shop or create a new account.",
    "field.email": "Email",
    "field.password": "Password",
    "placeholder.email": "you@example.com",
    "placeholder.password": "Enter your password",
    "hero.eyebrow": "Webshop demo",
    "hero.title": "Browse, add to cart, and finish simulated purchases.",
    "hero.desc": "This interface demonstrates a real e-commerce flow with authentication, cart persistence, and user order history.",
    "hero.stat.flow": "Flow",
    "hero.stat.checkout": "Checkout",
    "hero.stat.checkoutValue": "Simulated",
    "hero.stat.persistence": "Persistence",
    "hero.stat.persistenceValue": "Real database",
    "shop.kicker": "Catalog",
    "shop.title": "Products",
    "shop.desc": "Add products to your cart to simulate a complete shopping experience.",
    "cart.kicker": "User session",
    "cart.title": "Cart",
    "cart.desc": "Added items are linked to the authenticated user.",
    "cart.empty.title": "Your cart is empty",
    "cart.empty.desc": "Pick a product in the shop to start the simulation.",
    "cart.summary": "Summary",
    "cart.total": "Total",
    "cart.note": "Checkout is demo-only, with no real charge.",
    "orders.kicker": "History",
    "orders.title": "Orders",
    "orders.desc": "Your simulated purchases are recorded here.",
    "orders.empty.title": "No orders yet",
    "orders.empty.desc": "Your simulated purchases will appear here.",
    "orders.status.simulated": "simulated",
    "common.product": "Product",
    "fallback.noDescription": "Product without description.",
    "empty.noProducts": "No products found.",
    "loading.products": "Loading products...",
    "loading.cart": "Loading cart...",
    "loading.orders": "Loading orders...",
    "error.loadProducts": "Error loading products.",
    "error.loadCart": "Error loading cart.",
    "error.loadOrders": "Error loading orders.",
    "errors.supabaseUnavailable": "Could not load the data service. Reload the page or try again later.",
    "errors.backendUnavailable": "Could not connect to the backend right now. Layout remains available, but login and catalog are temporarily unavailable.",
    "auth.fillEmailPassword": "Fill in email and password.",
    "auth.passwordMin6": "Password must be at least 6 characters.",
    "auth.duplicateEmail": "You already have an account.",
    "auth.loginSuccess": "Login successful.",
    "auth.signupSuccessLong": "Account created. If email confirmation is required, check your inbox.",
    "loading.login": "Signing in...",
    "loading.signup": "Creating...",
    "checkout.processing": "Processing...",
    "toast.loadProductsFailed": "Could not load products.",
    "toast.loginRequiredAdd": "Sign in to add products.",
    "toast.cartAccessError": "Error accessing cart.",
    "toast.cartUpdateError": "Error updating cart.",
    "toast.cartInsertError": "Error adding item to cart.",
    "toast.addedToCart": "{name} added to cart.",
    "toast.loadCartFailed": "Could not load cart.",
    "toast.removeItemError": "Error removing item.",
    "toast.itemRemoved": "Item removed from cart.",
    "toast.loadOrdersFailed": "Could not load orders.",
    "toast.cartEmpty": "Your cart is empty.",
    "toast.orderCreateError": "Error creating order.",
    "toast.orderItemsError": "Error saving order items.",
    "toast.clearCartAfterOrderError": "Order created, but cart cleanup failed.",
    "toast.checkoutSuccess": "Simulated checkout completed successfully.",
    "toast.logoutError": "Error logging out.",
    "toast.sessionEnded": "Session ended."
  },
  nl: {
    "skip.link": "Spring naar inhoud",
    "aria.brandHome": "Ga naar winkel",
    "aria.mainNav": "Hoofdnavigatie",
    "aria.themeToggle": "Thema wisselen",
    "aria.languageToggle": "Taal wijzigen",
    "aria.languageMenu": "Talen",
    "aria.appSummary": "Applicatieoverzicht",
    "aria.removeCartItem": "Verwijder item uit winkelwagen",
    "brand.subtitle": "demo commerce",
    "nav.shop": "Winkel",
    "nav.cart": "Winkelwagen",
    "nav.orders": "Bestellingen",
    "user.connectedAs": "Ingelogd als",
    "lang.pt": "Portugees",
    "lang.en": "Engels",
    "lang.nl": "Nederlands",
    "action.logout": "Uitloggen",
    "action.login": "Inloggen",
    "action.signup": "Account maken",
    "action.checkout": "Gesimuleerde aankoop afronden",
    "action.add": "Toevoegen",
    "auth.eyebrow": "Demoproject",
    "auth.title.main": "Een fake webshop,",
    "auth.title.sub": "strak, modern en functioneel.",
    "auth.lead": "Log in om producten te verkennen, items op te slaan in je winkelwagen en aankopen te simuleren met echte database-opslag.",
    "auth.feature1": "Authenticatie met e-mail en wachtwoord",
    "auth.feature2": "Winkelwagen opgeslagen per gebruiker",
    "auth.feature3": "Gesimuleerde bestellingen opgeslagen in database",
    "auth.badge": "Toegang",
    "auth.card.title": "Log in op je account",
    "auth.card.desc": "Gebruik je e-mail en wachtwoord om de winkel te openen of een nieuw account te maken.",
    "field.email": "E-mail",
    "field.password": "Wachtwoord",
    "placeholder.email": "jij@voorbeeld.com",
    "placeholder.password": "Voer je wachtwoord in",
    "hero.eyebrow": "Webshop demo",
    "hero.title": "Verken, voeg toe aan winkelwagen en rond gesimuleerde aankopen af.",
    "hero.desc": "Deze interface toont een echte e-commerceflow met authenticatie, winkelwagenopslag en bestelgeschiedenis per gebruiker.",
    "hero.stat.flow": "Flow",
    "hero.stat.checkout": "Checkout",
    "hero.stat.checkoutValue": "Gesimuleerd",
    "hero.stat.persistence": "Opslag",
    "hero.stat.persistenceValue": "Echte database",
    "shop.kicker": "Catalogus",
    "shop.title": "Producten",
    "shop.desc": "Voeg producten toe aan je winkelwagen om een volledige winkelervaring te simuleren.",
    "cart.kicker": "Gebruikerssessie",
    "cart.title": "Winkelwagen",
    "cart.desc": "Toegevoegde items zijn gekoppeld aan de ingelogde gebruiker.",
    "cart.empty.title": "Je winkelwagen is leeg",
    "cart.empty.desc": "Kies een product in de winkel om de simulatie te starten.",
    "cart.summary": "Overzicht",
    "cart.total": "Totaal",
    "cart.note": "Checkout is alleen demonstratief, zonder echte betaling.",
    "orders.kicker": "Historie",
    "orders.title": "Bestellingen",
    "orders.desc": "Hier worden je gesimuleerde aankopen opgeslagen.",
    "orders.empty.title": "Nog geen bestellingen",
    "orders.empty.desc": "Je gesimuleerde aankopen verschijnen hier.",
    "orders.status.simulated": "gesimuleerd",
    "common.product": "Product",
    "fallback.noDescription": "Product zonder beschrijving.",
    "empty.noProducts": "Geen producten gevonden.",
    "loading.products": "Producten laden...",
    "loading.cart": "Winkelwagen laden...",
    "loading.orders": "Bestellingen laden...",
    "error.loadProducts": "Fout bij laden van producten.",
    "error.loadCart": "Fout bij laden van winkelwagen.",
    "error.loadOrders": "Fout bij laden van bestellingen.",
    "errors.supabaseUnavailable": "Kon de dataservice niet laden. Vernieuw de pagina of probeer het later opnieuw.",
    "errors.backendUnavailable": "Er kon nu geen verbinding met de backend worden gemaakt. De layout blijft beschikbaar, maar login en catalogus zijn tijdelijk niet beschikbaar.",
    "auth.fillEmailPassword": "Vul e-mail en wachtwoord in.",
    "auth.passwordMin6": "Wachtwoord moet minimaal 6 tekens hebben.",
    "auth.duplicateEmail": "Dit e-mailadres heeft al een account.",
    "auth.loginSuccess": "Succesvol ingelogd.",
    "auth.signupSuccessLong": "Account aangemaakt. Als e-mailbevestiging nodig is, controleer dan je inbox.",
    "loading.login": "Inloggen...",
    "loading.signup": "Aanmaken...",
    "checkout.processing": "Bezig...",
    "toast.loadProductsFailed": "Kon producten niet laden.",
    "toast.loginRequiredAdd": "Log in om producten toe te voegen.",
    "toast.cartAccessError": "Fout bij openen van winkelwagen.",
    "toast.cartUpdateError": "Fout bij bijwerken van winkelwagen.",
    "toast.cartInsertError": "Fout bij toevoegen aan winkelwagen.",
    "toast.addedToCart": "{name} toegevoegd aan winkelwagen.",
    "toast.loadCartFailed": "Kon winkelwagen niet laden.",
    "toast.removeItemError": "Fout bij verwijderen van item.",
    "toast.itemRemoved": "Item verwijderd uit winkelwagen.",
    "toast.loadOrdersFailed": "Kon bestellingen niet laden.",
    "toast.cartEmpty": "Je winkelwagen is leeg.",
    "toast.orderCreateError": "Fout bij maken van bestelling.",
    "toast.orderItemsError": "Fout bij opslaan van bestelitems.",
    "toast.clearCartAfterOrderError": "Bestelling gemaakt, maar leegmaken van winkelwagen mislukte.",
    "toast.checkoutSuccess": "Gesimuleerde aankoop succesvol afgerond.",
    "toast.logoutError": "Fout bij uitloggen.",
    "toast.sessionEnded": "Sessie beeindigd."
  }
};

const DEMO_PRODUCT_SEEDS = [
  {
    key: "aurora-lamp",
    name: "Aurora Lamp",
    description: "A warm ambient lamp with a soft glass shade.",
    price: 49,
    image_url: "https://picsum.photos/seed/aurora-lamp/800/600"
  },
  {
    key: "linen-shirt",
    name: "Linen Shirt",
    description: "Breathable everyday shirt with a relaxed cut.",
    price: 58,
    image_url: "https://picsum.photos/seed/linen-shirt/800/600"
  },
  {
    key: "ceramic-mug",
    name: "Ceramic Mug",
    description: "Hand-finished mug for coffee and tea rituals.",
    price: 18,
    image_url: "https://picsum.photos/seed/ceramic-mug/800/600"
  },
  {
    key: "oak-shelf",
    name: "Oak Shelf",
    description: "Compact shelf for books, prints, and small objects.",
    price: 74,
    image_url: "https://picsum.photos/seed/oak-shelf/800/600"
  },
  {
    key: "soft-sneakers",
    name: "Soft Sneakers",
    description: "Lightweight sneakers with a cushioned sole.",
    price: 92,
    image_url: "https://picsum.photos/seed/soft-sneakers/800/600"
  },
  {
    key: "desk-clock",
    name: "Desk Clock",
    description: "Minimal desk clock with a quiet sweep movement.",
    price: 36,
    image_url: "https://picsum.photos/seed/desk-clock/800/600"
  }
];

const PRODUCT_LOCALIZATION = {
  "aurora-lamp": {
    names: { pt: "Luminária Aurora", en: "Aurora Lamp", nl: "Aurora Lamp" },
    descriptions: {
      pt: "Luminária acolhedora com cúpula de vidro suave.",
      en: "A warm ambient lamp with a soft glass shade.",
      nl: "Een warme sfeerlamp met een zachte glazen kap."
    },
    prices: { pt: 249.9, en: 49, nl: 44.9 }
  },
  "linen-shirt": {
    names: { pt: "Camisa de Linho", en: "Linen Shirt", nl: "Linnen Overhemd" },
    descriptions: {
      pt: "Camisa leve e respirável para o dia a dia.",
      en: "Breathable everyday shirt with a relaxed cut.",
      nl: "Luchtig overhemd voor elke dag met een losse snit."
    },
    prices: { pt: 289.9, en: 58, nl: 54.9 }
  },
  "ceramic-mug": {
    names: { pt: "Caneca de Cerâmica", en: "Ceramic Mug", nl: "Keramische Mok" },
    descriptions: {
      pt: "Caneca artesanal para café, chá e rituais lentos.",
      en: "Hand-finished mug for coffee and tea rituals.",
      nl: "Handafgewerkte mok voor koffie- en theerituelen."
    },
    prices: { pt: 89.9, en: 18, nl: 16.9 }
  },
  "oak-shelf": {
    names: { pt: "Prateleira de Carvalho", en: "Oak Shelf", nl: "Eiken Wandplank" },
    descriptions: {
      pt: "Prateleira compacta para livros, impressões e objetos pequenos.",
      en: "Compact shelf for books, prints, and small objects.",
      nl: "Compacte plank voor boeken, prints en kleine objecten."
    },
    prices: { pt: 389.9, en: 74, nl: 69.9 }
  },
  "soft-sneakers": {
    names: { pt: "Tênis Macio", en: "Soft Sneakers", nl: "Zachte Sneakers" },
    descriptions: {
      pt: "Tênis leve com sola macia e confortável.",
      en: "Lightweight sneakers with a cushioned sole.",
      nl: "Lichte sneakers met een dempende zool."
    },
    prices: { pt: 479.9, en: 92, nl: 84.9 }
  },
  "desk-clock": {
    names: { pt: "Relógio de Mesa", en: "Desk Clock", nl: "Bureauklok" },
    descriptions: {
      pt: "Relógio minimalista com movimento silencioso.",
      en: "Minimal desk clock with a quiet sweep movement.",
      nl: "Minimalistische bureauklok met stil lopend uurwerk."
    },
    prices: { pt: 189.9, en: 36, nl: 33.9 }
  }
};

const CURRENCY_CONFIG = {
  pt: { locale: "pt-BR", currency: "BRL", rate: 1 },
  en: { locale: "en-US", currency: "USD", rate: 0.19 },
  nl: { locale: "nl-NL", currency: "EUR", rate: 0.18 }
};

let demoProductsSeedPromise = null;

function slugifyText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isDuplicateSignupError(error) {
  const message = String(error?.message || "").toLowerCase();
  const code = String(error?.code || "").toLowerCase();

  return (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already registered") ||
    message.includes("email already has an account")
  );
}

async function emailAlreadyExists(email) {
  if (!ensureSupabaseClient()) return false;

  const tablesToCheck = ["users", "profiles"];

  for (const tableName of tablesToCheck) {
    const { data, error } = await supabaseClient
      .from(tableName)
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return true;
    }
  }

  return false;
}

function getLocalizedProduct(product) {
  const translationKey = slugifyText(product?.name);
  const localization = PRODUCT_LOCALIZATION[translationKey] || {};
  const localizedName = localization.names?.[currentLanguage] || product?.name || t("common.product");
  const localizedDescription = localization.descriptions?.[currentLanguage] || product?.description || t("fallback.noDescription");

  return {
    key: translationKey,
    name: localizedName,
    description: localizedDescription,
    imageUrl: product?.image_url || "https://picsum.photos/seed/fallback/800/600",
    price: Number(product?.price || 0)
  };
}

async function ensureDemoProducts() {
  if (!ensureSupabaseClient()) return;
  if (demoProductsSeedPromise) return demoProductsSeedPromise;

  demoProductsSeedPromise = (async () => {
    const { data, error } = await supabaseClient.from("products").select("name");

    if (error) return;

    const existingNames = new Set((data || []).map((product) => slugifyText(product.name)));
    const missingProducts = DEMO_PRODUCT_SEEDS.filter(
      (product) => !existingNames.has(slugifyText(product.name))
    );

    if (missingProducts.length === 0) return;

    await supabaseClient.from("products").insert(missingProducts);
  })().catch(() => {});

  return demoProductsSeedPromise;
}

function t(key, params = {}) {
  const languageTable = translations[currentLanguage] || translations.pt;
  const template = languageTable[key] || translations.pt[key] || key;

  return Object.entries(params).reduce((message, [name, value]) => {
    return message.replaceAll(`{${name}}`, String(value));
  }, template);
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (!key) return;
    element.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (!key) return;
    element.setAttribute("aria-label", t(key));
  });
}

function closeLanguageMenu() {
  if (!languageMenu || !languageToggle) return;
  languageMenu.classList.add("hidden");
  languageToggle.setAttribute("aria-expanded", "false");
}

function toggleLanguageMenu() {
  if (!languageMenu || !languageToggle) return;
  const opening = languageMenu.classList.contains("hidden");
  languageMenu.classList.toggle("hidden", !opening);
  languageToggle.setAttribute("aria-expanded", String(opening));
}

function refreshVisibleDynamicContent() {
  if (Array.isArray(cachedProducts)) renderProducts(cachedProducts);
  if (Array.isArray(cachedCartItems)) renderCart(cachedCartItems);
  if (Array.isArray(cachedOrders)) renderOrders(cachedOrders);

  if (!Array.isArray(cachedProducts) && productGrid?.querySelector(".loading")) {
    productGrid.innerHTML = `<p class="loading">${t("loading.products")}</p>`;
  }

  if (!Array.isArray(cachedCartItems) && cartItemsEl?.querySelector(".loading")) {
    cartItemsEl.innerHTML = `<p class="loading">${t("loading.cart")}</p>`;
  }

  if (!Array.isArray(cachedOrders) && ordersListEl?.querySelector(".loading")) {
    ordersListEl.innerHTML = `<p class="loading">${t("loading.orders")}</p>`;
  }
}

function updateLanguageUI() {
  const config = LANGUAGE_CONFIG[currentLanguage] || LANGUAGE_CONFIG.pt;
  html.lang = config.htmlLang;

  if (currentLanguageFlag) {
    currentLanguageFlag.textContent = config.flag;
  }

  languageOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.language === currentLanguage);
  });
}

function setLanguage(language, persist = true) {
  if (!LANGUAGE_CONFIG[language]) return;

  currentLanguage = language;
  if (persist) {
    localStorage.setItem(LANG_STORAGE_KEY, language);
  }

  updateLanguageUI();
  applyTranslations();
  refreshVisibleDynamicContent();
}

function initLanguage() {
  const storedLanguage = localStorage.getItem(LANG_STORAGE_KEY);
  const initialLanguage = LANGUAGE_CONFIG[storedLanguage] ? storedLanguage : "pt";
  setLanguage(initialLanguage, false);
}

function setTheme(theme) {
  html.setAttribute("data-theme", theme);
}

function initTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

function ensureSupabaseClient() {
  if (supabaseClient) return true;

  showAuthMessage(t("errors.supabaseUnavailable"), "error");
  showLoggedOutUI();
  return false;
}

function toggleTheme() {
  const current = html.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
}

function showToast(message, isError = false) {
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.style.background = isError ? "var(--color-error)" : "var(--color-text)";
  toastEl.classList.remove("hidden");

  requestAnimationFrame(() => {
    toastEl.classList.add("show");
  });

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => {
      toastEl.classList.add("hidden");
    }, 260);
  }, 2600);
}

function showAuthMessage(message, type = "neutral") {
  if (!authMessage) return;
  authMessage.textContent = message;

  if (type === "error") {
    authMessage.style.color = "var(--color-error)";
  } else if (type === "success") {
    authMessage.style.color = "var(--color-success)";
  } else {
    authMessage.style.color = "var(--color-text-muted)";
  }
}

function clearAuthMessage() {
  showAuthMessage("", "neutral");
}

function setLoading(button, loadingText) {
  if (!button) return;
  button.dataset.originalText = button.textContent;
  button.textContent = loadingText;
  button.disabled = true;
  button.style.opacity = "0.8";
}

function clearLoading(button) {
  if (!button) return;
  button.textContent = button.dataset.originalText || button.textContent;
  button.disabled = false;
  button.style.opacity = "1";
}

function formatPrice(value) {
  const config = LANGUAGE_CONFIG[currentLanguage] || LANGUAGE_CONFIG.pt;
  const money = CURRENCY_CONFIG[currentLanguage] || CURRENCY_CONFIG.pt;
  const convertedValue = Number(value || 0) * money.rate;

  return convertedValue.toLocaleString(config.numberLocale, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateString) {
  const config = LANGUAGE_CONFIG[currentLanguage] || LANGUAGE_CONFIG.pt;

  return new Date(dateString).toLocaleDateString(config.dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function setActiveNav(view) {
  [navShopBtn, navCartBtn, navOrdersBtn].forEach((btn) => {
    if (btn) btn.classList.remove("nav-btn-active");
  });

  if (view === "shop" && navShopBtn) navShopBtn.classList.add("nav-btn-active");
  if (view === "cart" && navCartBtn) navCartBtn.classList.add("nav-btn-active");
  if (view === "orders" && navOrdersBtn) navOrdersBtn.classList.add("nav-btn-active");
}

function hideAllViews() {
  [shopSection, cartSection, ordersSection].forEach((section) => {
    if (section) section.classList.add("hidden");
  });
}

async function showView(viewName) {
  currentView = viewName;
  hideAllViews();
  setActiveNav(viewName);

  if (viewName === "shop" && shopSection) {
    shopSection.classList.remove("hidden");
    void loadProducts();
  }

  if (viewName === "cart" && cartSection) {
    cartSection.classList.remove("hidden");
    void loadCart();
  }

  if (viewName === "orders" && ordersSection) {
    ordersSection.classList.remove("hidden");
    void loadOrders();
  }
}

function showLoggedOutUI() {
  currentUser = null;

  if (authSection) authSection.classList.remove("hidden");
  if (appSection) appSection.classList.add("hidden");
  if (navbar) navbar.classList.add("hidden");

  clearAuthMessage();

  if (userEmailEl) userEmailEl.textContent = "";
  if (cartCountEl) {
    cartCountEl.textContent = "0";
    cartCountEl.classList.add("hidden");
  }
}

async function showLoggedInUI(user) {
  currentUser = user;

  if (authSection) authSection.classList.add("hidden");
  if (appSection) appSection.classList.remove("hidden");
  if (navbar) navbar.classList.remove("hidden");

  if (userEmailEl) {
    userEmailEl.textContent = user?.email || "";
  }

  await loadCartCount();
  await showView(currentView || "shop");
}

function renderProducts(products) {
  if (!productGrid) return;

  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p class="empty-msg">${t("empty.noProducts")}</p>`;
    return;
  }

  productGrid.innerHTML = products.map((product) => `
    ${(() => {
      const localizedProduct = getLocalizedProduct(product);
      return `
    <article class="product-card">
      <img
        src="${localizedProduct.imageUrl}"
        alt="${localizedProduct.name}"
        loading="lazy"
        width="800"
        height="600"
      />
      <div class="product-info">
        <h3>${localizedProduct.name}</h3>
        <p class="product-desc">${localizedProduct.description}</p>
        <div class="product-footer">
          <span class="price">${formatPrice(localizedProduct.price)}</span>
          <button
            type="button"
            onclick="addToCart('${product.id}', '${String(localizedProduct.name).replace(/'/g, "\\'")}')"
          >
            ${t("action.add")}
          </button>
        </div>
      </div>
    </article>
      `;
    })()}
  `).join("");
}

async function loadProducts() {
  if (!productGrid) return;
  if (!ensureSupabaseClient()) return;

  const loadToken = ++productsLoadToken;

  await ensureDemoProducts();

  if (Array.isArray(cachedProducts)) {
    renderProducts(cachedProducts);
  } else {
    productGrid.innerHTML = `<p class="loading">${t("loading.products")}</p>`;
  }

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (loadToken !== productsLoadToken) return;

  if (error) {
    if (!Array.isArray(cachedProducts)) {
      productGrid.innerHTML = `<p class="empty-msg">${t("error.loadProducts")}</p>`;
      showToast(t("toast.loadProductsFailed"), true);
    }
    return;
  }

  cachedProducts = data || [];
  renderProducts(data);
}

async function addToCart(productId, productName = "Produto") {
  if (!ensureSupabaseClient()) return;

  if (!currentUser) {
    showToast(t("toast.loginRequiredAdd"), true);
    return;
  }

  const { data: existingItem, error: existingError } = await supabaseClient
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", currentUser.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingError) {
    showToast(t("toast.cartAccessError"), true);
    return;
  }

  if (existingItem) {
    const { error: updateError } = await supabaseClient
      .from("cart_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id);

    if (updateError) {
      showToast(t("toast.cartUpdateError"), true);
      return;
    }
  } else {
    const { error: insertError } = await supabaseClient
      .from("cart_items")
      .insert({
        user_id: currentUser.id,
        product_id: productId,
        quantity: 1
      });

    if (insertError) {
      showToast(t("toast.cartInsertError"), true);
      return;
    }
  }

  await loadCartCount();
  showToast(t("toast.addedToCart", { name: productName || t("common.product") }));
}

window.addToCart = addToCart;

async function loadCartCount() {
  if (!currentUser || !cartCountEl || !ensureSupabaseClient()) return;

  const { count, error } = await supabaseClient
    .from("cart_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", currentUser.id);

  if (error) return;

  const finalCount = count || 0;
  cartCountEl.textContent = String(finalCount);

  if (finalCount > 0) {
    cartCountEl.classList.remove("hidden");
    cartCountEl.animate(
      [
        { transform: "scale(0.9)", opacity: 0.7 },
        { transform: "scale(1.08)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 }
      ],
      { duration: 240, easing: "cubic-bezier(0.16,1,0.3,1)" }
    );
  } else {
    cartCountEl.classList.add("hidden");
  }
}

function renderCart(items) {
  if (!cartItemsEl || !cartTotalEl || !cartEmptyEl || !checkoutBtn) return;

  if (!items || items.length === 0) {
    cartItemsEl.innerHTML = "";
    cartTotalEl.textContent = formatPrice(0);
    cartEmptyEl.classList.remove("hidden");
    checkoutBtn.classList.add("hidden");
    return;
  }

  cartEmptyEl.classList.add("hidden");
  checkoutBtn.classList.remove("hidden");

  let total = 0;

  cartItemsEl.innerHTML = items.map((item) => {
    const product = item.products || {};
    const localizedProduct = getLocalizedProduct(product);
    const subtotal = Number(localizedProduct.price || 0) * Number(item.quantity || 0);
    total += subtotal;

    return `
      <article class="cart-item">
        <img
          src="${localizedProduct.imageUrl}"
          alt="${localizedProduct.name}"
          loading="lazy"
          width="300"
          height="300"
        />
        <div class="cart-item-info">
          <strong>${localizedProduct.name}</strong>
          <span>${formatPrice(localizedProduct.price)} × ${item.quantity}</span>
        </div>
        <div class="cart-item-actions">
          <span class="item-subtotal">${formatPrice(subtotal)}</span>
          <button
            class="btn-remove"
            type="button"
            onclick="removeCartItem('${item.id}')"
            aria-label="${t("aria.removeCartItem")}"
          >
            ✕
          </button>
        </div>
      </article>
    `;
  }).join("");

  cartTotalEl.textContent = formatPrice(total);
}

async function loadCart() {
  if (!currentUser || !cartItemsEl || !ensureSupabaseClient()) return;

  const loadToken = ++cartLoadToken;

  if (Array.isArray(cachedCartItems)) {
    renderCart(cachedCartItems);
  } else {
    cartItemsEl.innerHTML = `<p class="loading">${t("loading.cart")}</p>`;
    if (checkoutBtn) checkoutBtn.classList.add("hidden");
    if (cartEmptyEl) cartEmptyEl.classList.add("hidden");
  }

  const { data, error } = await supabaseClient
    .from("cart_items")
    .select("id, quantity, products(id, name, price, image_url)")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (loadToken !== cartLoadToken) return;

  if (error) {
    if (!Array.isArray(cachedCartItems)) {
      cartItemsEl.innerHTML = `<p class="empty-msg">${t("error.loadCart")}</p>`;
      showToast(t("toast.loadCartFailed"), true);
    }
    return;
  }

  cachedCartItems = data || [];
  renderCart(data);
}

async function removeCartItem(itemId) {
  if (!ensureSupabaseClient()) return;

  const { error } = await supabaseClient
    .from("cart_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    showToast(t("toast.removeItemError"), true);
    return;
  }

  cachedCartItems = null;
  await loadCartCount();
  await loadCart();
  showToast(t("toast.itemRemoved"));
}

window.removeCartItem = removeCartItem;

function renderOrders(orders) {
  if (!ordersListEl) return;

  if (!orders || orders.length === 0) {
    ordersListEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-mark" aria-hidden="true">○</div>
        <h3>${t("orders.empty.title")}</h3>
        <p>${t("orders.empty.desc")}</p>
      </div>
    `;
    return;
  }

  ordersListEl.innerHTML = orders.map((order) => `
    <article class="order-card">
      <div class="order-header">
        <span class="order-date">${formatDate(order.created_at)}</span>
        <span class="order-status">${order.status ? String(order.status).replace(/simulado|simulated/gi, t("orders.status.simulated")) : t("orders.status.simulated")}</span>
        <strong>${formatPrice(order.total)}</strong>
      </div>

      <ul class="order-items-list">
        ${(order.order_items || []).map((item) => {
          const localizedProduct = getLocalizedProduct(item.products || {});
          return `
          <li>
            ${localizedProduct.name} × ${item.quantity}
            — ${formatPrice(localizedProduct.price || item.price_at_time)}
          </li>
        `;
        }).join("")}
      </ul>
    </article>
  `).join("");
}

async function loadOrders() {
  if (!currentUser || !ordersListEl || !ensureSupabaseClient()) return;

  const loadToken = ++ordersLoadToken;

  if (Array.isArray(cachedOrders)) {
    renderOrders(cachedOrders);
  } else {
    ordersListEl.innerHTML = `<p class="loading">${t("loading.orders")}</p>`;
  }

  const { data, error } = await supabaseClient
    .from("orders")
    .select(`
      id,
      total,
      status,
      created_at,
      order_items(
        quantity,
        price_at_time,
        products(name)
      )
    `)
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (loadToken !== ordersLoadToken) return;

  if (error) {
    if (!Array.isArray(cachedOrders)) {
      ordersListEl.innerHTML = `<p class="empty-msg">${t("error.loadOrders")}</p>`;
      showToast(t("toast.loadOrdersFailed"), true);
    }
    return;
  }

  cachedOrders = data || [];
  renderOrders(data);
}

async function handleCheckout() {
  if (!currentUser) return;
  if (!ensureSupabaseClient()) return;

  setLoading(checkoutBtn, t("checkout.processing"));

  const { data: cartItems, error: cartError } = await supabaseClient
    .from("cart_items")
    .select("id, quantity, products(id, price)")
    .eq("user_id", currentUser.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    clearLoading(checkoutBtn);
    showToast(t("toast.cartEmpty"), true);
    return;
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + (Number(item.products?.price || 0) * Number(item.quantity || 0));
  }, 0);

  const { data: order, error: orderError } = await supabaseClient
    .from("orders")
    .insert({
      user_id: currentUser.id,
      total,
      status: "simulado"
    })
    .select()
    .single();

  if (orderError || !order) {
    clearLoading(checkoutBtn);
    showToast(t("toast.orderCreateError"), true);
    return;
  }

  const orderItemsPayload = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.products.id,
    quantity: item.quantity,
    price_at_time: item.products.price
  }));

  const { error: orderItemsError } = await supabaseClient
    .from("order_items")
    .insert(orderItemsPayload);

  if (orderItemsError) {
    clearLoading(checkoutBtn);
    showToast(t("toast.orderItemsError"), true);
    return;
  }

  const { error: clearCartError } = await supabaseClient
    .from("cart_items")
    .delete()
    .eq("user_id", currentUser.id);

  clearLoading(checkoutBtn);

  if (clearCartError) {
    showToast(t("toast.clearCartAfterOrderError"), true);
    return;
  }

  cachedCartItems = null;
  cachedOrders = null;
  await loadCartCount();
  await loadCart();
  showToast(t("toast.checkoutSuccess"));
  await showView("orders");
}

async function handleLogin() {
  if (!ensureSupabaseClient()) return;

  const email = emailInput?.value.trim();
  const password = passwordInput?.value.trim();

  if (!email || !password) {
    showAuthMessage(t("auth.fillEmailPassword"), "error");
    return;
  }

  setLoading(loginBtn, t("loading.login"));
  clearAuthMessage();

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  clearLoading(loginBtn);

  if (error) {
    showAuthMessage(error.message, "error");
    return;
  }

  showAuthMessage(t("auth.loginSuccess"), "success");

  if (data?.user) {
    await showLoggedInUI(data.user);
  }
}

async function handleSignup() {
  if (!ensureSupabaseClient()) return;

  const email = emailInput?.value.trim();
  const password = passwordInput?.value.trim();

  if (!email || !password) {
    showAuthMessage(t("auth.fillEmailPassword"), "error");
    return;
  }

  if (password.length < 6) {
    showAuthMessage(t("auth.passwordMin6"), "error");
    return;
  }

  if (await emailAlreadyExists(email)) {
    showAuthMessage(t("auth.duplicateEmail"), "error");
    return;
  }

  setLoading(signupBtn, t("loading.signup"));
  clearAuthMessage();

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  clearLoading(signupBtn);

  if (error) {
    if (isDuplicateSignupError(error)) {
      showAuthMessage(t("auth.duplicateEmail"), "error");
      return;
    }

    showAuthMessage(error.message, "error");
    return;
  }

  showAuthMessage(t("auth.signupSuccessLong"), "success");
}

async function handleLogout() {
  if (!ensureSupabaseClient()) {
    showLoggedOutUI();
    return;
  }

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showToast(t("toast.logoutError"), true);
    return;
  }

  showToast(t("toast.sessionEnded"));
  showLoggedOutUI();
}

function bindEvents() {
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (languageToggle) {
    languageToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLanguageMenu();
    });
  }

  if (languageMenu) {
    languageMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  languageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const language = option.dataset.language;
      if (!language) return;
      setLanguage(language);
      closeLanguageMenu();
    });
  });

  document.addEventListener("click", () => {
    closeLanguageMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLanguageMenu();
  });

  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", async () => {
      if (currentUser) await showView("shop");
    });
  }

  if (navShopBtn) {
    navShopBtn.addEventListener("click", async () => {
      if (currentUser) await showView("shop");
    });
  }

  if (navCartBtn) {
    navCartBtn.addEventListener("click", async () => {
      if (currentUser) await showView("cart");
    });
  }

  if (navOrdersBtn) {
    navOrdersBtn.addEventListener("click", async () => {
      if (currentUser) await showView("orders");
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", handleSignup);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
  }

  if (passwordInput) {
    passwordInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        await handleLogin();
      }
    });
  }
}

async function bootstrap() {
  initTheme();
  initLanguage();
  bindEvents();
  showLoggedOutUI();

  if (!supabaseClient) {
    showAuthMessage(t("errors.backendUnavailable"), "error");
    return;
  }

  const { data, error } = await supabaseClient.auth.getUser();

  if (!error && data?.user) {
    await showLoggedInUI(data.user);
  } else {
    showLoggedOutUI();
  }

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_OUT") {
      showLoggedOutUI();
      return;
    }

    if (session?.user) {
      await showLoggedInUI(session.user);
    }
  });
}

bootstrap();