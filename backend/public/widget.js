/**
 * Recoz Lightweight Feedback Widget Embed Script
 * Embed on any webpage to render an unobtrusive feedback trigger and popup modal.
 * Responses submitted via the widget are automatically tracked with source: "widget".
 */
(function () {
  if (window.__RECOZ_WIDGET_INITIALIZED__) return;
  window.__RECOZ_WIDGET_INITIALIZED__ = true;

  function initWidget() {
    // 1. Locate the script tag configuration
    const script =
      document.currentScript ||
      document.querySelector("script[data-survey-url]") ||
      document.querySelector("script[data-survey-id]") ||
      document.querySelector('script[src*="widget.js"]');

    if (!script) return;

    let surveyUrl = script.getAttribute("data-survey-url");
    const surveyId = script.getAttribute("data-survey-id");
    const position = script.getAttribute("data-position") || "bottom-right";
    const accent = script.getAttribute("data-accent") || "#bb0028";
    const label = script.getAttribute("data-label") || "Feedback";

    if (!surveyUrl && surveyId) {
      const scriptOrigin = script.src
        ? new URL(script.src).origin
        : window.location.origin;
      surveyUrl = `${scriptOrigin}/surveys/publish?surveyId=${surveyId}`;
    }

    if (!surveyUrl) {
      console.warn("[Recoz Widget] No data-survey-url or data-survey-id provided.");
      return;
    }

    // Ensure source=widget parameter is appended for database source tracking
    const separator = surveyUrl.includes("?") ? "&" : "?";
    const widgetEmbedUrl = surveyUrl.includes("source=")
      ? surveyUrl
      : `${surveyUrl}${separator}source=widget`;

    // 2. Container Elements
    const container = document.createElement("div");
    container.id = "recoz-widget-root";
    container.style.position = "fixed";
    container.style.zIndex = "999999";
    container.style.bottom = "24px";
    if (position === "bottom-left") {
      container.style.left = "24px";
      container.style.right = "auto";
    } else {
      container.style.right = "24px";
      container.style.left = "auto";
    }
    container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    // 3. Floating Trigger Button
    const button = document.createElement("button");
    button.id = "recoz-widget-launcher";
    button.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:7px;">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>${label}</span>
    `;
    button.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 11px 18px;
      background-color: ${accent};
      color: #ffffff;
      border: none;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25), 0 8px 10px -6px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    `;

    button.onmouseenter = () => {
      button.style.transform = "scale(1.05)";
    };
    button.onmouseleave = () => {
      button.style.transform = "scale(1)";
    };

    // 4. Modal Container & Iframe
    const modalWrapper = document.createElement("div");
    modalWrapper.id = "recoz-widget-modal";
    modalWrapper.style.cssText = `
      display: none;
      position: absolute;
      bottom: 60px;
      ${position === "bottom-left" ? "left: 0;" : "right: 0;"}
      width: min(420px, calc(100vw - 32px));
      height: min(580px, calc(100vh - 100px));
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      border: 1px solid #EFE4D6;
      overflow: hidden;
      flex-direction: column;
      transform-origin: ${position === "bottom-left" ? "bottom left" : "bottom right"};
      transition: opacity 0.2s ease, transform 0.2s ease;
      opacity: 0;
      transform: scale(0.95);
    `;

    // Modal Header with Close Button
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #FFFAF3;
      border-bottom: 1px solid #EFE4D6;
    `;
    header.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:#1f1b18;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${accent};"></span>
        <span>Feedback</span>
      </div>
      <button id="recoz-widget-close" style="background:none; border:none; color:#7d7461; font-size:18px; cursor:pointer; line-height:1; padding:4px 6px; border-radius:6px;">✕</button>
    `;

    const iframe = document.createElement("iframe");
    iframe.src = widgetEmbedUrl;
    iframe.style.cssText = `
      width: 100%;
      height: calc(100% - 41px);
      border: none;
      background: #FFFAF3;
    `;
    iframe.title = "Recoz Customer Feedback";

    modalWrapper.appendChild(header);
    modalWrapper.appendChild(iframe);
    container.appendChild(modalWrapper);
    container.appendChild(button);
    document.body.appendChild(container);

    let isOpen = false;
    function toggleModal() {
      isOpen = !isOpen;
      if (isOpen) {
        modalWrapper.style.display = "flex";
        setTimeout(() => {
          modalWrapper.style.opacity = "1";
          modalWrapper.style.transform = "scale(1)";
        }, 10);
      } else {
        modalWrapper.style.opacity = "0";
        modalWrapper.style.transform = "scale(0.95)";
        setTimeout(() => {
          modalWrapper.style.display = "none";
        }, 200);
      }
    }

    button.addEventListener("click", toggleModal);
    header.querySelector("#recoz-widget-close").addEventListener("click", toggleModal);

    // Listen for escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        toggleModal();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
