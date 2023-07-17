class ImagePreview extends HTMLElement {
  svgMap = {
    closeIcon:
      '<path fill="currentColor" d="M764.288 214.592L512 466.88L259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512L214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"/>',
    zoomOutIcon:
      '<path fill="currentColor" d="m795.904 750.72l124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704a352 352 0 0 0 0 704zM352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64z"/>',
    zoomInIcon:
      '<path fill="currentColor" d="m795.904 750.72l124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704a352 352 0 0 0 0 704zm-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96z"/>',
    refreshLeftIcon:
      '<path fill="currentColor" d="M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88a384 384 0 0 1-383.936 384a384 384 0 0 1-384-384h64a320 320 0 1 0 640 0a320 320 0 0 0-555.712-216.448z"/>',
    refreshRightIcon:
      '<path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384a384 384 0 0 1-384-384a384 384 0 0 1 643.712-282.88z"/>',
    arrowLeftIcon:
      '<path fill="currentColor" d="M609.408 149.376L277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0a30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688a29.12 29.12 0 0 0-41.728 0z"/>',
    arrowRightIcon:
      '<path fill="currentColor" d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512L340.864 831.872a30.592 30.592 0 0 0 0 42.752a29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"/>',
  };
  img;
  model;
  largeImage;
  largeImageSrc;
  index;
  srcList;
  scale = 1;
  rotate = 0;
  boundKeydownHandler;
  boundMousewheelHandler;
  constructor() {
    super();
    if (!this.hasAttribute("src")) {
      throw new Error("src is required");
    }
    if (!this.style.display) {
      this.style.display = "inline-block";
    }

    const shadow = this.attachShadow({ mode: "open" });

    const img = document.createElement("img");
    const imgSrc = this.getAttribute("src");
    img.src = imgSrc;
    img.style = "width: 100%;height: 100%;cursor: pointer;";
    img.onclick = this.openModel.bind(this);
    shadow.appendChild(img);
    this.img = img;

    const model = document.createElement("div");
    model.id = "image-preview-model";
    model.style =
      "position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background: rgba(0,0,0,0.5);user-select: none;z-index: 2147483647;";
    model.onclick = this.closeModel.bind(this);

    const largeImage = document.createElement("img");
    const largeImageSrc = this.getAttribute("large-src") || imgSrc;
    largeImage.src = largeImageSrc;
    largeImage.draggable = false;
    largeImage.style =
      "position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);max-height: 60vh;cursor: default;transition: transform 0.3s;";
    largeImage.onclick = (e) => {
      e.stopPropagation();
    };
    let startDrag, startX, startY, initialX, initialY;
    largeImage.onmousedown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      initialX = largeImage.offsetLeft;
      initialY = largeImage.offsetTop;
      startDrag = true;
    };
    largeImage.onmousemove = (e) => {
      if (!startDrag) return;
      const moveX = e.clientX - startX;
      const moveY = e.clientY - startY;
      largeImage.style.left = `${initialX + moveX}px`;
      largeImage.style.top = `${initialY + moveY}px`;
    };
    largeImage.onmouseleave = (e) => {
      startDrag = false;
    };
    largeImage.onmouseup = (e) => {
      startDrag = false;
    };

    model.appendChild(largeImage);
    this.largeImage = largeImage;
    this.largeImageSrc = largeImageSrc;
    this.srcList = JSON.parse(this.getAttribute("src-list") || "[]");
    this.index = this.srcList.indexOf(largeImageSrc);

    const closeIcon = this.creatSvgIcon("closeIcon");
    closeIcon.style =
      closeIcon.getAttribute("style") +
      "position: absolute;top: 40px;right: 40px;color: #fff;background: #606266;opacity: 0.7;border-radius: 50%;padding: 10px;";
    closeIcon.onclick = this.closeModel.bind(this);
    model.appendChild(closeIcon);

    const actions = document.createElement("div");
    actions.style =
      "position: absolute;left: 50%;bottom: 30px;transform: translateX(-50%);color: #fff;background: #606266;opacity: 0.7;padding: 10px 30px;display: flex;align-items: center;justify-content: space-between; width: 150px;border-radius: 30px;";
    actions.onclick = (e) => {
      e.stopPropagation();
    };
    const zoomOutIcon = this.creatSvgIcon("zoomOutIcon");
    zoomOutIcon.onclick = () => this.handleActions("zoomOut");
    actions.appendChild(zoomOutIcon);
    const zoomInIcon = this.creatSvgIcon("zoomInIcon");
    zoomInIcon.onclick = () => this.handleActions("zoomIn");
    actions.appendChild(zoomInIcon);
    const refreshLeftIcon = this.creatSvgIcon("refreshLeftIcon");
    refreshLeftIcon.onclick = () => this.handleActions("refreshLeft");
    actions.appendChild(refreshLeftIcon);
    const refreshRightIcon = this.creatSvgIcon("refreshRightIcon");
    refreshRightIcon.onclick = () => this.handleActions("refreshRight");
    actions.appendChild(refreshRightIcon);
    model.appendChild(actions);

    const arrowLeftIcon = this.creatSvgIcon("arrowLeftIcon");
    arrowLeftIcon.style =
      arrowLeftIcon.getAttribute("style") +
      "position: absolute;top: 50%;left: 40px;transform: translateY(-50%);color: #fff;background: #606266;opacity: 0.7;border-radius: 50%;padding: 10px;";
    arrowLeftIcon.onclick = (e) => {
      e.stopPropagation();
      this.handleActions("prev");
    };
    model.appendChild(arrowLeftIcon);

    const arrowRightIcon = this.creatSvgIcon("arrowRightIcon");
    arrowRightIcon.style =
      arrowRightIcon.getAttribute("style") +
      "position: absolute;top: 50%;right: 40px;transform: translateY(-50%);color: #fff;background: #606266;opacity: 0.7;border-radius: 50%;padding: 10px;";
    arrowRightIcon.onclick = (e) => {
      e.stopPropagation();
      this.handleActions("next");
    };
    model.appendChild(arrowRightIcon);

    this.arrowLeftIcon = arrowLeftIcon;
    this.arrowRightIcon = arrowRightIcon;
    this.model = model;
  }
  static get observedAttributes() {
    return ["src", "large-src", "src-list"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "src":
        this.img.src = newValue;
        if (this.largeImageSrc === oldValue) {
          this.largeImageSrc = newValue;
        }
        break;

      case "large-src":
        this.largeImageSrc = newValue;
        break;

      case "src-list":
        this.srcList = JSON.parse(newValue);
        break;

      default:
        break;
    }
  }
  openModel() {
    document.body.appendChild(this.model);
    this.largeImage.style =
      "position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);max-height: 60vh;cursor: default;transition: transform 0.3s;";
    this.scale = 1;
    this.rotate = 0;
    this.index = this.srcList.indexOf(this.largeImageSrc);
    this.largeImage.src = this.largeImageSrc;
    if (this.srcList && this.srcList.length > 1) {
      this.arrowLeftIcon.style.display = "block";
      this.arrowRightIcon.style.display = "block";
    } else {
      this.arrowLeftIcon.style.display = "none";
      this.arrowRightIcon.style.display = "none";
    }
    this.updateLargeImageTransform();
    this.registerEventListener();
  }
  closeModel(e) {
    e.stopPropagation();
    this.unregisterEventListener();
    document.body.removeChild(document.getElementById("image-preview-model"));
  }
  handleActions(action) {
    switch (action) {
      case "zoomOut":
        this.scale > 0.3 && (this.scale -= 0.1);
        this.updateLargeImageTransform();
        break;

      case "zoomIn":
        this.scale < 3 && (this.scale += 0.1);
        this.updateLargeImageTransform();
        break;

      case "refreshLeft":
        this.rotate -= 90;
        this.updateLargeImageTransform();
        break;

      case "refreshRight":
        this.rotate += 90;
        this.updateLargeImageTransform();
        break;

      case "prev":
        if (!this.srcList) return;
        this.index === 0
          ? (this.index = this.srcList.length - 1)
          : this.index--;
        this.updateImageSrc();
        break;

      case "next":
        if (!this.srcList) return;
        this.index === this.srcList.length - 1
          ? (this.index = 0)
          : this.index++;
        this.updateImageSrc();
        break;

      default:
        break;
    }
  }
  updateLargeImageTransform() {
    this.largeImage.style.transform = `translate(-50%, -50%) scale(${this.scale}) rotate(${this.rotate}deg)`;
  }
  updateImageSrc() {
    this.largeImage.src = this.srcList[this.index];
  }
  keydownHandler(e) {
    switch (e.code) {
      case "ArrowUp":
        this.throttle(this.handleActions("zoomIn"));
        break;
      case "ArrowDown":
        this.throttle(this.handleActions("zoomOut"));
        break;
      case "ArrowLeft":
        this.handleActions("prev");
        break;
      case "ArrowRight":
        this.handleActions("next");
        break;
      case "Escape":
        this.closeModel.call(this, e);
        break;
    }
  }
  mousewheelHandler(e) {
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    this.throttle(this.handleActions(delta < 0 ? "zoomIn" : "zoomOut"));
  }
  registerEventListener() {
    this.boundKeydownHandler = this.keydownHandler.bind(this);
    this.boundMousewheelHandler = this.mousewheelHandler.bind(this);
    document.addEventListener("keydown", this.boundKeydownHandler);
    this.model.addEventListener("wheel", this.boundMousewheelHandler);
  }
  unregisterEventListener() {
    document.removeEventListener("keydown", this.boundKeydownHandler);
    this.model.removeEventListener("wheel", this.boundMousewheelHandler);
  }
  creatSvgIcon(key) {
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("width", 24);
    icon.setAttribute("height", 24);
    icon.setAttribute("viewBox", "0 0 1024 1024");
    icon.setAttribute("style", "cursor: pointer;");
    icon.innerHTML = this.svgMap[key];
    return icon;
  }
  throttle(fn, wait = 300) {
    let timer;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, arguments);
        }, wait);
      }
    };
  }
}

window.onload = function () {
  if (!customElements.get("image-preview")) {
    customElements.define("image-preview", ImagePreview);
  }
};
