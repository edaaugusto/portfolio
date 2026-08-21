(function () {
  const API_BASE_URL = "http://127.0.0.1:3000";

  function setStatus(el, state, text) {
    el.dataset.state = state;
    el.textContent = text;
  }

  async function checkBackendHealth() {
    const el = document.getElementById("api-status");
    if (!el) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setStatus(el, "ok", "Backend conectado");
    } catch (err) {
      setStatus(el, "offline", "Backend offline");
    }
  }

  document.addEventListener("DOMContentLoaded", checkBackendHealth);
})();
