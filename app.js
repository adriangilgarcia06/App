const ADMIN_PASSWORD = "admin.1";
const CARLA_NAME = "carla";
const CARLA_PASSWORD = "carlalamejor";

const defaultSettings = {
  appTitle: "Plapp",
  appSubtitle: "Elige un plan y mándamelo.",
  plans: {
    "fullDay": [
        "Comer juntos",
        "Comer + paseo",
        "Comer + cine + cena",
        "Paseo + tomar algo + cena",
        "Día tranquilo en casa",
        "Plan sorpresa",
        "Fuera de Tudela/Cabanillas"
    ],
    "morning": [
        "Desayunar juntos",
        "Café + paseo",
        "Paseo por Tudela",
        "Paseo por Cabanillas",
        "Comprar algo para comer o cenar",
        "Mañana tranquila en casa",
        "Fuera de Tudela/Cabanillas"
    ],
    "lunch": [
        "Ir a comer",
        "Comer en Tudela",
        "Comer en Cabanillas",
        "Comida casera hecha por nosotros",
        "Pizza",
        "Hamburguesa",
        "Sushi",
        "Chino",
        "Bocata o algo rápido",
        "Fuera de Tudela/Cabanillas"
    ],
    "afternoon": [
        "Dar un paseo",
        "Tomar algo",
        "Ir al cine",
        "Merendar",
        "Paseo por Tudela",
        "Paseo por Cabanillas",
        "Café tranquilo",
        "Bolera",
        "Tarde de peli y manta",
        "Tarde de juegos",
        "Comprar algo para cenar",
        "Plan barato y tranquilo",
        "Fuera de Tudela/Cabanillas"
    ],
    "night": [
        "Ir a cenar",
        "Cine + cena",
        "Cena + paseo",
        "Cena + ver las estrellas",
        "Cena en casa",
        "Pizza + peli",
        "Hamburguesa + paseo",
        "Sushi + peli",
        "Chino + sofá",
        "Tomar algo",
        "Peli y manta",
        "Fuera de Tudela/Cabanillas"
    ],
    "afternoonNight": [
        "Paseo + cena",
        "Cine + cena",
        "Merienda + paseo + cena",
        "Atardecer + cena",
        "Cena + estrellas",
        "Bolera + cena",
        "Cena en casa + película",
        "Cocinar juntos + peli",
        "Tomar algo + cena",
        "Plan sorpresa",
        "Fuera de Tudela/Cabanillas"
    ],
    "custom": [
        "Café rápido",
        "Paseo corto",
        "Tomar algo",
        "Helado o postre",
        "Cena rápida",
        "Cine si da tiempo",
        "Comprar cena y verla en casa",
        "Plan improvisado",
        "Fuera de Tudela/Cabanillas"
    ]
},
  dinner: {
    "types": [
        "Chino",
        "Sushi",
        "Pizza",
        "Hamburguesa",
        "Hacer nosotros la cena",
        "Mexicano",
        "Kebab",
        "Italiano",
        "Tapas",
        "Bocatas",
        "Cena en casa con peli",
        "Algo barato y rápido"
    ],
    "burger": [
        "Burger",
        "McDonald's",
        "Popeyes",
        "Plaza (Buñuel)",
        "Mesón",
        "Hamburguesas caseras"
    ],
    "homemade": [
        "Pizza desde cero",
        "Hamburguesas desde cero",
        "Algo frito para picar",
        "Burritos",
        "Nachos",
        "Tacos",
        "Pasta",
        "Tortilla + picoteo",
        "Sándwiches buenos + patatas"
    ]
}
};

const state = {
  draft: emptyDraft(),
  selectedTab: "requests",
  currentUser: sessionStorage.getItem("citaplan_current_user_v5") || ""
};

const timeOptions = [
  { id: "fullDay", label: "Todo el día" },
  { id: "morning", label: "Mañana" },
  { id: "lunch", label: "Comida / mediodía" },
  { id: "afternoon", label: "Tarde" },
  { id: "night", label: "Noche" },
  { id: "afternoonNight", label: "Tarde + noche" },
  { id: "custom", label: "Hora concreta" }
];

function emptyDraft() {
  return {
    user: "Carla",
    date: "",
    timeType: "",
    from: "",
    to: "",
    plans: [],
    extraPlan: "",
    outsidePlace: "",
    outsidePlan: "",
    outsideWithNight: "",
    outsideNights: "",
    dinnerType: "",
    burgerChoice: "",
    homemadeChoice: "",
    dinnerComment: "",
    sleepTogether: ""
  };
}

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

function getSettings() {
  const saved = localStorage.getItem("citaplan_settings_v5");
  if (!saved) return clone(defaultSettings);
  try {
    const parsed = JSON.parse(saved);
    return {
      ...clone(defaultSettings),
      ...parsed,
      plans: { ...clone(defaultSettings).plans, ...(parsed.plans || {}) },
      dinner: { ...clone(defaultSettings).dinner, ...(parsed.dinner || {}) }
    };
  } catch {
    return clone(defaultSettings);
  }
}

function saveSettings(settings) {
  localStorage.setItem("citaplan_settings_v5", JSON.stringify(settings));
}

function getRequests() {
  const saved = localStorage.getItem("citaplan_requests_v5");
  if (!saved) return [];
  try { return JSON.parse(saved); } catch { return []; }
}

function saveRequests(requests) {
  localStorage.setItem("citaplan_requests_v5", JSON.stringify(requests));
}

function render(templateId) {
  const app = document.getElementById("app");
  const template = document.getElementById(templateId);
  app.innerHTML = "";
  app.appendChild(template.content.cloneNode(true));
  bindActions();
}

function renderLogin() { render("login-template"); }

function renderHome() {
  if (state.currentUser !== "carla") return renderLogin();
  render("home-template");
  const settings = getSettings();
  document.querySelector("[data-setting='appTitle']").textContent = settings.appTitle;
  document.querySelector("[data-setting='appSubtitle']").textContent = settings.appSubtitle;
}

function renderDate() {
  render("date-template");
  document.getElementById("dateInput").value = state.draft.date || new Date().toISOString().split("T")[0];
}

function renderTime() {
  render("time-template");
  const container = document.getElementById("timeOptions");
  const customBox = document.getElementById("customTimeBox");

  timeOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = option.label;
    btn.dataset.time = option.id;
    if (state.draft.timeType === option.id) btn.classList.add("selected");
    container.appendChild(btn);
  });

  customBox.classList.toggle("hidden", state.draft.timeType !== "custom");

  document.querySelectorAll("[data-time]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.draft.timeType = btn.dataset.time;
      document.querySelectorAll("[data-time]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      customBox.classList.toggle("hidden", state.draft.timeType !== "custom");
    });
  });
}

function renderPlans() {
  render("plan-template");
  const settings = getSettings();
  const container = document.getElementById("planOptions");
  const extra = document.getElementById("extraPlan");
  extra.value = state.draft.extraPlan || "";

  const planKey = state.draft.timeType || "afternoon";
  const currentPlans = settings.plans[planKey] || settings.plans.afternoon;

  currentPlans.forEach(plan => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = plan;
    btn.dataset.plan = plan;
    if (state.draft.plans.includes(plan)) btn.classList.add("selected");

    btn.addEventListener("click", () => {
      if (state.draft.plans.includes(plan)) {
        state.draft.plans = state.draft.plans.filter(p => p !== plan);
        btn.classList.remove("selected");
      } else {
        state.draft.plans.push(plan);
        btn.classList.add("selected");
      }
      updateOutsideBox();
    });

    container.appendChild(btn);
  });

  setupOutsideBox();
  updateOutsideBox();
}

function setupOutsideBox() {
  document.getElementById("outsidePlace").value = state.draft.outsidePlace || "";
  document.getElementById("outsidePlan").value = state.draft.outsidePlan || "";
  document.getElementById("outsideNights").value = state.draft.outsideNights || "1";

  document.querySelectorAll("[data-city-option]").forEach(btn => {
    if (state.draft.outsidePlace === btn.dataset.cityOption) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      state.draft.outsidePlace = btn.dataset.cityOption;
      document.getElementById("outsidePlace").value = btn.dataset.cityOption;
      document.querySelectorAll("[data-city-option]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  document.querySelectorAll("[data-night-option]").forEach(btn => {
    if (state.draft.outsideWithNight === btn.dataset.nightOption) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      state.draft.outsideWithNight = btn.dataset.nightOption;
      document.querySelectorAll("[data-night-option]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      document.getElementById("nightsBox").classList.toggle("hidden", state.draft.outsideWithNight !== "Sí");
    });
  });

  document.getElementById("nightsBox").classList.toggle("hidden", state.draft.outsideWithNight !== "Sí");
}

function updateOutsideBox() {
  const show = state.draft.plans.some(plan => normalize(plan).includes("fuera de tudela/cabanillas"));
  document.getElementById("outsideBox").classList.toggle("hidden", !show);
}

function collectOutsideFields() {
  if (!state.draft.plans.some(plan => normalize(plan).includes("fuera de tudela/cabanillas"))) return;
  state.draft.outsidePlace = document.getElementById("outsidePlace").value.trim();
  state.draft.outsidePlan = document.getElementById("outsidePlan").value.trim();
  state.draft.outsideNights = document.getElementById("outsideNights").value || "1";
}

function renderDinner() {
  render("dinner-template");
  const settings = getSettings();

  fillChoiceList("dinnerOptions", settings.dinner.types, "dinner", value => {
    state.draft.dinnerType = value;
    state.draft.burgerChoice = "";
    state.draft.homemadeChoice = "";
    updateDinnerSubpanels();
  });

  fillChoiceList("burgerOptions", settings.dinner.burger, "burger", value => {
    state.draft.burgerChoice = value;
  });

  fillChoiceList("homemadeOptions", settings.dinner.homemade, "homemade", value => {
    state.draft.homemadeChoice = value;
  });

  document.getElementById("dinnerComment").value = state.draft.dinnerComment || "";
  updateDinnerSubpanels();
}

function fillChoiceList(containerId, items, group, onSelect) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = item;
    btn.dataset.group = group;
    btn.dataset.value = item;
    if (
      (group === "dinner" && state.draft.dinnerType === item) ||
      (group === "burger" && state.draft.burgerChoice === item) ||
      (group === "homemade" && state.draft.homemadeChoice === item)
    ) btn.classList.add("selected");

    btn.addEventListener("click", () => {
      document.querySelectorAll(`[data-group='${group}']`).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onSelect(item);
    });

    container.appendChild(btn);
  });
}

function updateDinnerSubpanels() {
  const dinnerValue = normalize(state.draft.dinnerType);
  document.getElementById("burgerBox").classList.toggle("hidden", dinnerValue !== "hamburguesa");
  document.getElementById("homemadeBox").classList.toggle("hidden", dinnerValue !== "hacer nosotros la cena");
}

function renderSleep() {
  render("sleep-template");
  document.querySelectorAll("[data-sleep]").forEach(btn => {
    if (state.draft.sleepTogether === btn.dataset.sleep) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      state.draft.sleepTogether = btn.dataset.sleep;
      document.querySelectorAll("[data-sleep]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

function renderSummary() {
  render("summary-template");
  document.getElementById("summaryCard").innerHTML = requestToHtml(state.draft);
}

function renderSent() {
  render("sent-template");
  const requests = getRequests().filter(req => req.user === "Carla");
  const latest = requests[0];
  document.getElementById("sentCard").innerHTML = latest
    ? requestToHtml(latest) + `<p><strong>Estado:</strong> ${escapeHtml(latest.status)}</p>`
    : "<p>No hay ninguna propuesta enviada todavía.</p>";
}

function renderAdminLogin() { render("admin-login-template"); }

function renderAdmin() {
  render("admin-template");
  setupTabs();
  renderRequestsList();
  fillSettingsForm();
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tab === state.selectedTab);
    tab.addEventListener("click", () => {
      state.selectedTab = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("requestsPanel").classList.toggle("active", state.selectedTab === "requests");
      document.getElementById("settingsPanel").classList.toggle("active", state.selectedTab === "settings");
    });
  });
  document.getElementById("requestsPanel").classList.toggle("active", state.selectedTab === "requests");
  document.getElementById("settingsPanel").classList.toggle("active", state.selectedTab === "settings");
}

function renderRequestsList() {
  const list = document.getElementById("requestsList");
  const requests = getRequests();
  if (!requests.length) {
    list.innerHTML = `<div class="empty">Todavía no hay propuestas.</div>`;
    return;
  }

  list.innerHTML = requests.map(req => `
    <article class="request-item">
      <h3>${formatDate(req.date)} <span class="badge">${escapeHtml(req.status)}</span></h3>
      ${requestToHtml(req)}
      <label class="field">Comentario admin
        <textarea data-comment="${req.id}">${escapeHtml(req.adminComment || "")}</textarea>
      </label>
      <div class="request-actions">
        <button class="secondary" data-status="${req.id}" data-value="Aceptada">Aceptar</button>
        <button class="secondary" data-status="${req.id}" data-value="Rechazada">Rechazar</button>
        <button class="secondary" data-status="${req.id}" data-value="Pendiente">Pendiente</button>
        <button class="secondary" data-status="${req.id}" data-value="Completada">Completada</button>
      </div>
      <button class="danger" data-delete="${req.id}">Eliminar</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-status]").forEach(btn => {
    btn.addEventListener("click", () => {
      updateRequest(btn.dataset.status, { status: btn.dataset.value });
      renderAdmin();
    });
  });

  document.querySelectorAll("[data-comment]").forEach(area => {
    area.addEventListener("change", () => updateRequest(area.dataset.comment, { adminComment: area.value }));
  });

  document.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("¿Eliminar esta propuesta?")) {
        saveRequests(getRequests().filter(r => r.id !== btn.dataset.delete));
        renderAdmin();
      }
    });
  });
}

function updateRequest(id, patch) {
  saveRequests(getRequests().map(req => req.id === id ? { ...req, ...patch } : req));
}

function fillSettingsForm() {
  const settings = getSettings();
  document.getElementById("settingTitle").value = settings.appTitle;
  document.getElementById("settingSubtitle").value = settings.appSubtitle;
  document.getElementById("plansFullDay").value = settings.plans.fullDay.join("\n");
  document.getElementById("plansMorning").value = settings.plans.morning.join("\n");
  document.getElementById("plansLunch").value = settings.plans.lunch.join("\n");
  document.getElementById("plansAfternoon").value = settings.plans.afternoon.join("\n");
  document.getElementById("plansNight").value = settings.plans.night.join("\n");
  document.getElementById("plansAfternoonNight").value = settings.plans.afternoonNight.join("\n");
  document.getElementById("plansCustom").value = settings.plans.custom.join("\n");
  document.getElementById("dinnerTypes").value = settings.dinner.types.join("\n");
  document.getElementById("burgerTypes").value = settings.dinner.burger.join("\n");
  document.getElementById("homemadeTypes").value = settings.dinner.homemade.join("\n");
}

function collectSettingsForm() {
  return {
    appTitle: document.getElementById("settingTitle").value.trim() || "Plapp",
    appSubtitle: document.getElementById("settingSubtitle").value.trim() || "Elige un plan y mándamelo.",
    plans: {
      fullDay: lines("plansFullDay"),
      morning: lines("plansMorning"),
      lunch: lines("plansLunch"),
      afternoon: lines("plansAfternoon"),
      night: lines("plansNight"),
      afternoonNight: lines("plansAfternoonNight"),
      custom: lines("plansCustom")
    },
    dinner: {
      types: lines("dinnerTypes"),
      burger: lines("burgerTypes"),
      homemade: lines("homemadeTypes")
    }
  };
}

function lines(id) {
  return document.getElementById(id).value.split("\n").map(x => x.trim()).filter(Boolean);
}

function requestToHtml(req) {
  const selectedPlans = [...(req.plans || [])];
  if (req.extraPlan) selectedPlans.push(req.extraPlan);

  let outsideHtml = "";
  if (hasOutsidePlan(req)) {
    outsideHtml = `
      <p><strong>Ciudad/sitio:</strong> ${escapeHtml(req.outsidePlace || "Sin escribir")}</p>
      <p><strong>Plan fuera:</strong> ${escapeHtml(req.outsidePlan || "Sin escribir")}</p>
      <p><strong>¿Incluye noche?:</strong> ${escapeHtml(req.outsideWithNight || "Sin responder")}</p>
      ${req.outsideWithNight === "Sí" ? `<p><strong>Noches:</strong> ${escapeHtml(req.outsideNights || "1")}</p>` : ""}
    `;
  }

  let dinnerHtml = "";
  if (requestNeedsDinner(req)) {
    dinnerHtml += `<p><strong>Cena:</strong> ${escapeHtml(req.dinnerType || "Sin elegir")}</p>`;
    if (normalize(req.dinnerType) === "hamburguesa") dinnerHtml += `<p><strong>Sitio hamburguesa:</strong> ${escapeHtml(req.burgerChoice || "Sin elegir")}</p>`;
    if (normalize(req.dinnerType) === "hacer nosotros la cena") dinnerHtml += `<p><strong>Cena casera:</strong> ${escapeHtml(req.homemadeChoice || "Sin elegir")}</p>`;
    if (req.dinnerComment) dinnerHtml += `<p><strong>Comentario cena:</strong> ${escapeHtml(req.dinnerComment)}</p>`;
  }

  return `
    <p><strong>Persona:</strong> ${escapeHtml(req.user || "Carla")}</p>
    <p><strong>Día:</strong> ${formatDate(req.date)}</p>
    <p><strong>Horario:</strong> ${escapeHtml(getTimeLabel(req))}</p>
    <p><strong>Plan:</strong> ${selectedPlans.length ? escapeHtml(selectedPlans.join(", ")) : "Sin plan elegido"}</p>
    ${outsideHtml}
    ${dinnerHtml}
    <p><strong>Dormir juntos:</strong> ${escapeHtml(req.sleepTogether || "Sin responder")}</p>
    ${req.adminComment ? `<p><strong>Comentario admin:</strong> ${escapeHtml(req.adminComment)}</p>` : ""}
  `;
}

function getTimeLabel(req) {
  const option = timeOptions.find(o => o.id === req.timeType);
  if (!option) return "Sin horario";
  if (req.timeType === "custom") return `Hora concreta: ${req.from || "?"} - ${req.to || "?"}`;
  return option.label;
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function normalize(text) {
  return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function compact(text) {
  return normalize(text).replace(/\s/g, "");
}

function hasOutsidePlan(req) {
  return (req.plans || []).some(plan => normalize(plan).includes("fuera de tudela/cabanillas"));
}

function requestNeedsDinner(req) {
  const allText = [...(req.plans || []), req.extraPlan || "", req.outsidePlan || ""].join(" ");
  return normalize(allText).includes("cena") || normalize(allText).includes("cenar");
}

function requireCarla() {
  if (state.currentUser !== "carla") {
    renderLogin();
    return false;
  }
  return true;
}

function bindActions() {
  document.querySelectorAll("[data-action]").forEach(el => el.addEventListener("click", () => handleAction(el.dataset.action)));
}

function handleAction(action) {
  switch(action) {
    case "go-login":
      renderLogin();
      break;

    case "user-login":
      const name = compact(document.getElementById("userName").value);
      const pass = compact(document.getElementById("userPassword").value);
      if (name === CARLA_NAME && pass === CARLA_PASSWORD) {
        state.currentUser = "carla";
        sessionStorage.setItem("citaplan_current_user_v5", "carla");
        renderHome();
      } else {
        document.getElementById("loginError").classList.remove("hidden");
      }
      break;

    case "logout-user":
      state.currentUser = "";
      sessionStorage.removeItem("citaplan_current_user_v5");
      renderLogin();
      break;

    case "start-plan":
      if (!requireCarla()) return;
      state.draft = emptyDraft();
      renderDate();
      break;

    case "go-home": renderHome(); break;
    case "go-date": renderDate(); break;
    case "go-time": renderTime(); break;
    case "go-plan": renderPlans(); break;
    case "go-sleep": renderSleep(); break;

    case "go-previous-before-sleep":
      if (requestNeedsDinner(state.draft)) renderDinner();
      else renderPlans();
      break;

    case "save-date":
      state.draft.date = document.getElementById("dateInput").value;
      if (!state.draft.date) return alert("Elige un día.");
      renderTime();
      break;

    case "save-time":
      if (!state.draft.timeType) return alert("Elige un horario.");
      if (state.draft.timeType === "custom") {
        state.draft.from = document.getElementById("fromTime").value;
        state.draft.to = document.getElementById("toTime").value;
      }
      renderPlans();
      break;

    case "save-plans":
      state.draft.extraPlan = document.getElementById("extraPlan").value.trim();
      collectOutsideFields();

      if (hasOutsidePlan(state.draft)) {
        if (!state.draft.outsidePlace) return alert("Elige o escribe la ciudad/sitio.");
        if (!state.draft.outsidePlan) return alert("Escribe qué plan quieres hacer allí.");
        if (!state.draft.outsideWithNight) return alert("Elige si incluye noche o no.");
      }

      if (!state.draft.plans.length && !state.draft.extraPlan) return alert("Elige al menos un plan o escribe uno.");
      if (requestNeedsDinner(state.draft)) renderDinner();
      else renderSleep();
      break;

    case "save-dinner":
      state.draft.dinnerComment = document.getElementById("dinnerComment").value.trim();
      if (!state.draft.dinnerType) return alert("Elige un tipo de cena.");
      if (normalize(state.draft.dinnerType) === "hamburguesa" && !state.draft.burgerChoice) return alert("Elige dónde tomar hamburguesa.");
      if (normalize(state.draft.dinnerType) === "hacer nosotros la cena" && !state.draft.homemadeChoice) return alert("Elige qué cena hacemos nosotros.");
      renderSleep();
      break;

    case "save-sleep":
      if (!state.draft.sleepTogether) return alert("Elige Sí o No.");
      renderSummary();
      break;

    case "send-request":
      const requests = getRequests();
      const newRequest = {
        ...state.draft,
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        status: "Pendiente",
        createdAt: new Date().toISOString(),
        adminComment: ""
      };
      saveRequests([newRequest, ...requests]);
      alert("Propuesta enviada.");
      renderSent();
      break;

    case "view-sent": renderSent(); break;


    case "show-install-help":
      alert("Para instalar Plapp en iPhone: abre esta web en Safari, pulsa Compartir y elige Añadir a pantalla de inicio. En Android: abre en Chrome, pulsa el menú ⋮ y elige Instalar app o Añadir a pantalla de inicio.");
      break;

    case "open-admin":
      if (sessionStorage.getItem("citaplan_admin_v5") === "yes") renderAdmin();
      else renderAdminLogin();
      break;

    case "admin-login":
      if (document.getElementById("adminPassword").value === ADMIN_PASSWORD) {
        sessionStorage.setItem("citaplan_admin_v5", "yes");
        renderAdmin();
      } else {
        document.getElementById("adminError").classList.remove("hidden");
      }
      break;

    case "admin-logout":
      sessionStorage.removeItem("citaplan_admin_v5");
      renderLogin();
      break;

    case "save-settings":
      saveSettings(collectSettingsForm());
      alert("Cambios guardados.");
      renderAdmin();
      break;

    case "reset-settings":
      if (confirm("¿Restaurar los textos y planes iniciales?")) {
        localStorage.removeItem("citaplan_settings_v5");
        renderAdmin();
      }
      break;

    case "clear-requests":
      if (confirm("¿Borrar todas las propuestas?")) {
        saveRequests([]);
        renderAdmin();
      }
      break;

    case "export-data":
      const data = { settings: getSettings(), requests: getRequests() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "citaplan_datos_v5.json";
      a.click();
      URL.revokeObjectURL(url);
      break;
  }
}

if (state.currentUser === "carla") renderHome();
else renderLogin();


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
