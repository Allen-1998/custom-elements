class CopyText extends HTMLElement {
  constructor() {
    super();
    this.style.cursor = "pointer";
    this.style.userSelect = "none";
    this.style.display = "flex";

    const shadow = this.attachShadow({ mode: "open" });

    const slot = document.createElement("slot");
    shadow.appendChild(slot);

    let icon;
    if (this.hasAttribute("icon")) {
      icon = document.createElement("img");
      icon.src = this.getAttribute("icon");
    } else {
      icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 256 256");
      icon.innerHTML =
        '<g fill="#3287c8"><path d="M184 72v144H40V72Z" opacity=".2"/><path d="M184 64H40a8 8 0 0 0-8 8v144a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8Zm-8 144H48V80h128Zm48-168v144a8 8 0 0 1-16 0V48H72a8 8 0 0 1 0-16h144a8 8 0 0 1 8 8Z"/></g>';
    }
    icon.style = this.getAttribute("icon-style") || "width: 14px; height: 14px";
    shadow.appendChild(icon);

    this.onclick = function (e) {
      this.copyToClip(e.target.innerText);
    };
  }
  copyToClip(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showMessage("复制成功!");
        })
        .catch(() => {
          alert("复制失败！");
        });
    } else if (document.execCommand("copy")) {
      const textEl = document.createElement("input");
      textEl.setAttribute("value", text);
      document.body.appendChild(textEl);
      textEl.select();
      document.execCommand("copy");
      document.body.removeChild(textEl);
      this.showMessage("复制成功!");
    } else {
      alert("此浏览器暂不支持该功能！");
    }
  }
  showMessage(message) {
    if (!document.querySelector("#success-message")) this.createMesssageEl();
    const messageEl = document.querySelector("#success-message");
    messageEl.classList.remove("show-success-message");
    setTimeout(() => {
      if (messageEl.innerText !== message) {
        messageEl.innerText = message;
      }
      messageEl.classList.add("show-success-message");
    }, 0);
  }
  createMesssageEl() {
    if (document.querySelector("#success-message")) return;
    const head = document.querySelector("head");
    const style = document.createElement("style");
    const styleText = `
      #success-message {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translate(-50%, -150%);
        padding: 0 40px;
        box-sizing: border-box;
        border-radius: 4px;
        height: 30px;
        line-height: 30px;
        color: #67c23a;
        background-color: #e1f3d8;
        font-size: 14px !important;
        outline: 1px solid #67c23a66 !important;
        pointer-events: none !important;
        z-index: 2147483647;
      }
      .show-success-message {
        animation: successMessageAnimation 2s;
      }
  
      @keyframes successMessageAnimation {
        0% {
          transform: translate(-50%, -150%);
        }
        10% {
          transform: translate(-50%, 100%);
        }
        70% {
          transform: translate(-50%, 100%);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -150%);
          opacity: 0;
        }
      }
    `;

    style.innerText = styleText.replace(/\s{2,}/g, "");
    head.appendChild(style);

    const messageEl = document.createElement("div");
    messageEl.setAttribute("id", "success-message");
    const body = document.querySelector("body");
    body.appendChild(messageEl);
  }
  connectedCallback() {
    console.log("Custom square element added to page.");
  }
}

window.addEventListener("load", function () {
  if (!customElements.get("copy-text")) {
    customElements.define("copy-text", CopyText);
  }
});
