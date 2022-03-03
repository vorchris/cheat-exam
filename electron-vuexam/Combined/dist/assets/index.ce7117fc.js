var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { r as resolveComponent, o as openBlock, c as createBlock, w as withCtx, S as Suspense, a as resolveDynamicComponent, b as createElementBlock, d as createBaseVNode, e as createVNode, F as Fragment, f as createStaticVNode, g as axios, $, h as withDirectives, v as vModelText, i as createCommentVNode, j as renderList, k as createTextVNode, t as toDisplayString, l as browser, m as vModelRadio, n as vModelCheckbox, p as normalizeClass, q as normalizeStyle, N as NodeViewWrapper, s as NodeViewContent, u as nodeViewProps, x as vModelSelect, E as EditorContent, y as Editor, B as Blockquote, z as BulletList, D as Document, H as HardBreak, A as Heading, C as HorizontalRule, L as ListItem, O as OrderedList, P as Paragraph, T as Text, G as Bold, I as Code, J as Italic, K as Subscript, M as Superscript, U as Underline, Q as Dropcursor, R as Gapcursor, V as History, W as TextAlign, X as CodeBlockLowlight, Y as VueNodeViewRenderer, Z as lowlight, _ as E, a0 as html2canvas, a1 as createRouter$1, a2 as createWebHistory, a3 as createSSRApp } from "./vendor.660cd120.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var bootstrap_min = "";
var styleMain = "";
/*!
  * Bootstrap v5.0.0-beta3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t, e) {
  typeof exports == "object" && typeof module != "undefined" ? module.exports = e() : typeof define == "function" && define.amd ? define(e) : (t = typeof globalThis != "undefined" ? globalThis : t || self).bootstrap = e();
}(globalThis, function() {
  const t = (t2) => {
    do {
      t2 += Math.floor(1e6 * Math.random());
    } while (document.getElementById(t2));
    return t2;
  }, e = (t2) => {
    let e2 = t2.getAttribute("data-bs-target");
    if (!e2 || e2 === "#") {
      let i2 = t2.getAttribute("href");
      if (!i2 || !i2.includes("#") && !i2.startsWith("."))
        return null;
      i2.includes("#") && !i2.startsWith("#") && (i2 = "#" + i2.split("#")[1]), e2 = i2 && i2 !== "#" ? i2.trim() : null;
    }
    return e2;
  }, i = (t2) => {
    const i2 = e(t2);
    return i2 && document.querySelector(i2) ? i2 : null;
  }, s = (t2) => {
    const i2 = e(t2);
    return i2 ? document.querySelector(i2) : null;
  }, n = (t2) => {
    if (!t2)
      return 0;
    let { transitionDuration: e2, transitionDelay: i2 } = window.getComputedStyle(t2);
    const s2 = Number.parseFloat(e2), n2 = Number.parseFloat(i2);
    return s2 || n2 ? (e2 = e2.split(",")[0], i2 = i2.split(",")[0], 1e3 * (Number.parseFloat(e2) + Number.parseFloat(i2))) : 0;
  }, o = (t2) => {
    t2.dispatchEvent(new Event("transitionend"));
  }, r = (t2) => (t2[0] || t2).nodeType, a = (t2, e2) => {
    let i2 = false;
    const s2 = e2 + 5;
    t2.addEventListener("transitionend", function e3() {
      i2 = true, t2.removeEventListener("transitionend", e3);
    }), setTimeout(() => {
      i2 || o(t2);
    }, s2);
  }, l = (t2, e2, i2) => {
    Object.keys(i2).forEach((s2) => {
      const n2 = i2[s2], o2 = e2[s2], a2 = o2 && r(o2) ? "element" : (l2 = o2) == null ? "" + l2 : {}.toString.call(l2).match(/\s([a-z]+)/i)[1].toLowerCase();
      var l2;
      if (!new RegExp(n2).test(a2))
        throw new TypeError(t2.toUpperCase() + `: Option "${s2}" provided type "${a2}" but expected type "${n2}".`);
    });
  }, c = (t2) => {
    if (!t2)
      return false;
    if (t2.style && t2.parentNode && t2.parentNode.style) {
      const e2 = getComputedStyle(t2), i2 = getComputedStyle(t2.parentNode);
      return e2.display !== "none" && i2.display !== "none" && e2.visibility !== "hidden";
    }
    return false;
  }, d = (t2) => !t2 || t2.nodeType !== Node.ELEMENT_NODE || !!t2.classList.contains("disabled") || (t2.disabled !== void 0 ? t2.disabled : t2.hasAttribute("disabled") && t2.getAttribute("disabled") !== "false"), h = (t2) => {
    if (!document.documentElement.attachShadow)
      return null;
    if (typeof t2.getRootNode == "function") {
      const e2 = t2.getRootNode();
      return e2 instanceof ShadowRoot ? e2 : null;
    }
    return t2 instanceof ShadowRoot ? t2 : t2.parentNode ? h(t2.parentNode) : null;
  }, f = () => function() {
  }, u = (t2) => t2.offsetHeight, p2 = () => {
    const { jQuery: t2 } = window;
    return t2 && !document.body.hasAttribute("data-bs-no-jquery") ? t2 : null;
  }, g = () => document.documentElement.dir === "rtl", m = (t2, e2) => {
    var i2;
    i2 = () => {
      const i3 = p2();
      if (i3) {
        const s2 = i3.fn[t2];
        i3.fn[t2] = e2.jQueryInterface, i3.fn[t2].Constructor = e2, i3.fn[t2].noConflict = () => (i3.fn[t2] = s2, e2.jQueryInterface);
      }
    }, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", i2) : i2();
  }, _ = /* @__PURE__ */ new Map();
  var b = { set(t2, e2, i2) {
    _.has(t2) || _.set(t2, /* @__PURE__ */ new Map());
    const s2 = _.get(t2);
    s2.has(e2) || s2.size === 0 ? s2.set(e2, i2) : console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(s2.keys())[0]}.`);
  }, get: (t2, e2) => _.has(t2) && _.get(t2).get(e2) || null, remove(t2, e2) {
    if (!_.has(t2))
      return;
    const i2 = _.get(t2);
    i2.delete(e2), i2.size === 0 && _.delete(t2);
  } };
  const v = /[^.]*(?=\..*)\.|.*/, y = /\..*/, w = /::\d+$/, E2 = {};
  let T = 1;
  const A = { mouseenter: "mouseover", mouseleave: "mouseout" }, L = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
  function O(t2, e2) {
    return e2 && `${e2}::${T++}` || t2.uidEvent || T++;
  }
  function k(t2) {
    const e2 = O(t2);
    return t2.uidEvent = e2, E2[e2] = E2[e2] || {}, E2[e2];
  }
  function D(t2, e2, i2 = null) {
    const s2 = Object.keys(t2);
    for (let n2 = 0, o2 = s2.length; n2 < o2; n2++) {
      const o3 = t2[s2[n2]];
      if (o3.originalHandler === e2 && o3.delegationSelector === i2)
        return o3;
    }
    return null;
  }
  function x(t2, e2, i2) {
    const s2 = typeof e2 == "string", n2 = s2 ? i2 : e2;
    let o2 = t2.replace(y, "");
    const r2 = A[o2];
    return r2 && (o2 = r2), L.has(o2) || (o2 = t2), [s2, n2, o2];
  }
  function C(t2, e2, i2, s2, n2) {
    if (typeof e2 != "string" || !t2)
      return;
    i2 || (i2 = s2, s2 = null);
    const [o2, r2, a2] = x(e2, i2, s2), l2 = k(t2), c2 = l2[a2] || (l2[a2] = {}), d2 = D(c2, r2, o2 ? i2 : null);
    if (d2)
      return void (d2.oneOff = d2.oneOff && n2);
    const h2 = O(r2, e2.replace(v, "")), f2 = o2 ? function(t3, e3, i3) {
      return function s3(n3) {
        const o3 = t3.querySelectorAll(e3);
        for (let { target: e4 } = n3; e4 && e4 !== this; e4 = e4.parentNode)
          for (let r3 = o3.length; r3--; )
            if (o3[r3] === e4)
              return n3.delegateTarget = e4, s3.oneOff && N.off(t3, n3.type, i3), i3.apply(e4, [n3]);
        return null;
      };
    }(t2, i2, s2) : function(t3, e3) {
      return function i3(s3) {
        return s3.delegateTarget = t3, i3.oneOff && N.off(t3, s3.type, e3), e3.apply(t3, [s3]);
      };
    }(t2, i2);
    f2.delegationSelector = o2 ? i2 : null, f2.originalHandler = r2, f2.oneOff = n2, f2.uidEvent = h2, c2[h2] = f2, t2.addEventListener(a2, f2, o2);
  }
  function S(t2, e2, i2, s2, n2) {
    const o2 = D(e2[i2], s2, n2);
    o2 && (t2.removeEventListener(i2, o2, Boolean(n2)), delete e2[i2][o2.uidEvent]);
  }
  const N = { on(t2, e2, i2, s2) {
    C(t2, e2, i2, s2, false);
  }, one(t2, e2, i2, s2) {
    C(t2, e2, i2, s2, true);
  }, off(t2, e2, i2, s2) {
    if (typeof e2 != "string" || !t2)
      return;
    const [n2, o2, r2] = x(e2, i2, s2), a2 = r2 !== e2, l2 = k(t2), c2 = e2.startsWith(".");
    if (o2 !== void 0) {
      if (!l2 || !l2[r2])
        return;
      return void S(t2, l2, r2, o2, n2 ? i2 : null);
    }
    c2 && Object.keys(l2).forEach((i3) => {
      !function(t3, e3, i4, s3) {
        const n3 = e3[i4] || {};
        Object.keys(n3).forEach((o3) => {
          if (o3.includes(s3)) {
            const s4 = n3[o3];
            S(t3, e3, i4, s4.originalHandler, s4.delegationSelector);
          }
        });
      }(t2, l2, i3, e2.slice(1));
    });
    const d2 = l2[r2] || {};
    Object.keys(d2).forEach((i3) => {
      const s3 = i3.replace(w, "");
      if (!a2 || e2.includes(s3)) {
        const e3 = d2[i3];
        S(t2, l2, r2, e3.originalHandler, e3.delegationSelector);
      }
    });
  }, trigger(t2, e2, i2) {
    if (typeof e2 != "string" || !t2)
      return null;
    const s2 = p2(), n2 = e2.replace(y, ""), o2 = e2 !== n2, r2 = L.has(n2);
    let a2, l2 = true, c2 = true, d2 = false, h2 = null;
    return o2 && s2 && (a2 = s2.Event(e2, i2), s2(t2).trigger(a2), l2 = !a2.isPropagationStopped(), c2 = !a2.isImmediatePropagationStopped(), d2 = a2.isDefaultPrevented()), r2 ? (h2 = document.createEvent("HTMLEvents"), h2.initEvent(n2, l2, true)) : h2 = new CustomEvent(e2, { bubbles: l2, cancelable: true }), i2 !== void 0 && Object.keys(i2).forEach((t3) => {
      Object.defineProperty(h2, t3, { get: () => i2[t3] });
    }), d2 && h2.preventDefault(), c2 && t2.dispatchEvent(h2), h2.defaultPrevented && a2 !== void 0 && a2.preventDefault(), h2;
  } };
  class j {
    constructor(t2) {
      (t2 = typeof t2 == "string" ? document.querySelector(t2) : t2) && (this._element = t2, b.set(this._element, this.constructor.DATA_KEY, this));
    }
    dispose() {
      b.remove(this._element, this.constructor.DATA_KEY), this._element = null;
    }
    static getInstance(t2) {
      return b.get(t2, this.DATA_KEY);
    }
    static get VERSION() {
      return "5.0.0-beta3";
    }
  }
  class P extends j {
    static get DATA_KEY() {
      return "bs.alert";
    }
    close(t2) {
      const e2 = t2 ? this._getRootElement(t2) : this._element, i2 = this._triggerCloseEvent(e2);
      i2 === null || i2.defaultPrevented || this._removeElement(e2);
    }
    _getRootElement(t2) {
      return s(t2) || t2.closest(".alert");
    }
    _triggerCloseEvent(t2) {
      return N.trigger(t2, "close.bs.alert");
    }
    _removeElement(t2) {
      if (t2.classList.remove("show"), !t2.classList.contains("fade"))
        return void this._destroyElement(t2);
      const e2 = n(t2);
      N.one(t2, "transitionend", () => this._destroyElement(t2)), a(t2, e2);
    }
    _destroyElement(t2) {
      t2.parentNode && t2.parentNode.removeChild(t2), N.trigger(t2, "closed.bs.alert");
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        let e2 = b.get(this, "bs.alert");
        e2 || (e2 = new P(this)), t2 === "close" && e2[t2](this);
      });
    }
    static handleDismiss(t2) {
      return function(e2) {
        e2 && e2.preventDefault(), t2.close(this);
      };
    }
  }
  N.on(document, "click.bs.alert.data-api", '[data-bs-dismiss="alert"]', P.handleDismiss(new P())), m("alert", P);
  class I extends j {
    static get DATA_KEY() {
      return "bs.button";
    }
    toggle() {
      this._element.setAttribute("aria-pressed", this._element.classList.toggle("active"));
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        let e2 = b.get(this, "bs.button");
        e2 || (e2 = new I(this)), t2 === "toggle" && e2[t2]();
      });
    }
  }
  function M(t2) {
    return t2 === "true" || t2 !== "false" && (t2 === Number(t2).toString() ? Number(t2) : t2 === "" || t2 === "null" ? null : t2);
  }
  function R(t2) {
    return t2.replace(/[A-Z]/g, (t3) => "-" + t3.toLowerCase());
  }
  N.on(document, "click.bs.button.data-api", '[data-bs-toggle="button"]', (t2) => {
    t2.preventDefault();
    const e2 = t2.target.closest('[data-bs-toggle="button"]');
    let i2 = b.get(e2, "bs.button");
    i2 || (i2 = new I(e2)), i2.toggle();
  }), m("button", I);
  const B = { setDataAttribute(t2, e2, i2) {
    t2.setAttribute("data-bs-" + R(e2), i2);
  }, removeDataAttribute(t2, e2) {
    t2.removeAttribute("data-bs-" + R(e2));
  }, getDataAttributes(t2) {
    if (!t2)
      return {};
    const e2 = {};
    return Object.keys(t2.dataset).filter((t3) => t3.startsWith("bs")).forEach((i2) => {
      let s2 = i2.replace(/^bs/, "");
      s2 = s2.charAt(0).toLowerCase() + s2.slice(1, s2.length), e2[s2] = M(t2.dataset[i2]);
    }), e2;
  }, getDataAttribute: (t2, e2) => M(t2.getAttribute("data-bs-" + R(e2))), offset(t2) {
    const e2 = t2.getBoundingClientRect();
    return { top: e2.top + document.body.scrollTop, left: e2.left + document.body.scrollLeft };
  }, position: (t2) => ({ top: t2.offsetTop, left: t2.offsetLeft }) }, H = { find: (t2, e2 = document.documentElement) => [].concat(...Element.prototype.querySelectorAll.call(e2, t2)), findOne: (t2, e2 = document.documentElement) => Element.prototype.querySelector.call(e2, t2), children: (t2, e2) => [].concat(...t2.children).filter((t3) => t3.matches(e2)), parents(t2, e2) {
    const i2 = [];
    let s2 = t2.parentNode;
    for (; s2 && s2.nodeType === Node.ELEMENT_NODE && s2.nodeType !== 3; )
      s2.matches(e2) && i2.push(s2), s2 = s2.parentNode;
    return i2;
  }, prev(t2, e2) {
    let i2 = t2.previousElementSibling;
    for (; i2; ) {
      if (i2.matches(e2))
        return [i2];
      i2 = i2.previousElementSibling;
    }
    return [];
  }, next(t2, e2) {
    let i2 = t2.nextElementSibling;
    for (; i2; ) {
      if (i2.matches(e2))
        return [i2];
      i2 = i2.nextElementSibling;
    }
    return [];
  } }, W = { interval: 5e3, keyboard: true, slide: false, pause: "hover", wrap: true, touch: true }, U = { interval: "(number|boolean)", keyboard: "boolean", slide: "(boolean|string)", pause: "(string|boolean)", wrap: "boolean", touch: "boolean" }, $2 = "next", F = "prev", z = "left", K = "right";
  class Y extends j {
    constructor(t2, e2) {
      super(t2), this._items = null, this._interval = null, this._activeElement = null, this._isPaused = false, this._isSliding = false, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(e2), this._indicatorsElement = H.findOne(".carousel-indicators", this._element), this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0, this._pointerEvent = Boolean(window.PointerEvent), this._addEventListeners();
    }
    static get Default() {
      return W;
    }
    static get DATA_KEY() {
      return "bs.carousel";
    }
    next() {
      this._isSliding || this._slide($2);
    }
    nextWhenVisible() {
      !document.hidden && c(this._element) && this.next();
    }
    prev() {
      this._isSliding || this._slide(F);
    }
    pause(t2) {
      t2 || (this._isPaused = true), H.findOne(".carousel-item-next, .carousel-item-prev", this._element) && (o(this._element), this.cycle(true)), clearInterval(this._interval), this._interval = null;
    }
    cycle(t2) {
      t2 || (this._isPaused = false), this._interval && (clearInterval(this._interval), this._interval = null), this._config && this._config.interval && !this._isPaused && (this._updateInterval(), this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval));
    }
    to(t2) {
      this._activeElement = H.findOne(".active.carousel-item", this._element);
      const e2 = this._getItemIndex(this._activeElement);
      if (t2 > this._items.length - 1 || t2 < 0)
        return;
      if (this._isSliding)
        return void N.one(this._element, "slid.bs.carousel", () => this.to(t2));
      if (e2 === t2)
        return this.pause(), void this.cycle();
      const i2 = t2 > e2 ? $2 : F;
      this._slide(i2, this._items[t2]);
    }
    dispose() {
      N.off(this._element, ".bs.carousel"), this._items = null, this._config = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null, super.dispose();
    }
    _getConfig(t2) {
      return t2 = __spreadValues(__spreadValues({}, W), t2), l("carousel", t2, U), t2;
    }
    _handleSwipe() {
      const t2 = Math.abs(this.touchDeltaX);
      if (t2 <= 40)
        return;
      const e2 = t2 / this.touchDeltaX;
      this.touchDeltaX = 0, e2 && this._slide(e2 > 0 ? K : z);
    }
    _addEventListeners() {
      this._config.keyboard && N.on(this._element, "keydown.bs.carousel", (t2) => this._keydown(t2)), this._config.pause === "hover" && (N.on(this._element, "mouseenter.bs.carousel", (t2) => this.pause(t2)), N.on(this._element, "mouseleave.bs.carousel", (t2) => this.cycle(t2))), this._config.touch && this._touchSupported && this._addTouchEventListeners();
    }
    _addTouchEventListeners() {
      const t2 = (t3) => {
        !this._pointerEvent || t3.pointerType !== "pen" && t3.pointerType !== "touch" ? this._pointerEvent || (this.touchStartX = t3.touches[0].clientX) : this.touchStartX = t3.clientX;
      }, e2 = (t3) => {
        this.touchDeltaX = t3.touches && t3.touches.length > 1 ? 0 : t3.touches[0].clientX - this.touchStartX;
      }, i2 = (t3) => {
        !this._pointerEvent || t3.pointerType !== "pen" && t3.pointerType !== "touch" || (this.touchDeltaX = t3.clientX - this.touchStartX), this._handleSwipe(), this._config.pause === "hover" && (this.pause(), this.touchTimeout && clearTimeout(this.touchTimeout), this.touchTimeout = setTimeout((t4) => this.cycle(t4), 500 + this._config.interval));
      };
      H.find(".carousel-item img", this._element).forEach((t3) => {
        N.on(t3, "dragstart.bs.carousel", (t4) => t4.preventDefault());
      }), this._pointerEvent ? (N.on(this._element, "pointerdown.bs.carousel", (e3) => t2(e3)), N.on(this._element, "pointerup.bs.carousel", (t3) => i2(t3)), this._element.classList.add("pointer-event")) : (N.on(this._element, "touchstart.bs.carousel", (e3) => t2(e3)), N.on(this._element, "touchmove.bs.carousel", (t3) => e2(t3)), N.on(this._element, "touchend.bs.carousel", (t3) => i2(t3)));
    }
    _keydown(t2) {
      /input|textarea/i.test(t2.target.tagName) || (t2.key === "ArrowLeft" ? (t2.preventDefault(), this._slide(z)) : t2.key === "ArrowRight" && (t2.preventDefault(), this._slide(K)));
    }
    _getItemIndex(t2) {
      return this._items = t2 && t2.parentNode ? H.find(".carousel-item", t2.parentNode) : [], this._items.indexOf(t2);
    }
    _getItemByOrder(t2, e2) {
      const i2 = t2 === $2, s2 = t2 === F, n2 = this._getItemIndex(e2), o2 = this._items.length - 1;
      if ((s2 && n2 === 0 || i2 && n2 === o2) && !this._config.wrap)
        return e2;
      const r2 = (n2 + (s2 ? -1 : 1)) % this._items.length;
      return r2 === -1 ? this._items[this._items.length - 1] : this._items[r2];
    }
    _triggerSlideEvent(t2, e2) {
      const i2 = this._getItemIndex(t2), s2 = this._getItemIndex(H.findOne(".active.carousel-item", this._element));
      return N.trigger(this._element, "slide.bs.carousel", { relatedTarget: t2, direction: e2, from: s2, to: i2 });
    }
    _setActiveIndicatorElement(t2) {
      if (this._indicatorsElement) {
        const e2 = H.findOne(".active", this._indicatorsElement);
        e2.classList.remove("active"), e2.removeAttribute("aria-current");
        const i2 = H.find("[data-bs-target]", this._indicatorsElement);
        for (let e3 = 0; e3 < i2.length; e3++)
          if (Number.parseInt(i2[e3].getAttribute("data-bs-slide-to"), 10) === this._getItemIndex(t2)) {
            i2[e3].classList.add("active"), i2[e3].setAttribute("aria-current", "true");
            break;
          }
      }
    }
    _updateInterval() {
      const t2 = this._activeElement || H.findOne(".active.carousel-item", this._element);
      if (!t2)
        return;
      const e2 = Number.parseInt(t2.getAttribute("data-bs-interval"), 10);
      e2 ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = e2) : this._config.interval = this._config.defaultInterval || this._config.interval;
    }
    _slide(t2, e2) {
      const i2 = this._directionToOrder(t2), s2 = H.findOne(".active.carousel-item", this._element), o2 = this._getItemIndex(s2), r2 = e2 || this._getItemByOrder(i2, s2), l2 = this._getItemIndex(r2), c2 = Boolean(this._interval), d2 = i2 === $2, h2 = d2 ? "carousel-item-start" : "carousel-item-end", f2 = d2 ? "carousel-item-next" : "carousel-item-prev", p3 = this._orderToDirection(i2);
      if (r2 && r2.classList.contains("active"))
        this._isSliding = false;
      else if (!this._triggerSlideEvent(r2, p3).defaultPrevented && s2 && r2) {
        if (this._isSliding = true, c2 && this.pause(), this._setActiveIndicatorElement(r2), this._activeElement = r2, this._element.classList.contains("slide")) {
          r2.classList.add(f2), u(r2), s2.classList.add(h2), r2.classList.add(h2);
          const t3 = n(s2);
          N.one(s2, "transitionend", () => {
            r2.classList.remove(h2, f2), r2.classList.add("active"), s2.classList.remove("active", f2, h2), this._isSliding = false, setTimeout(() => {
              N.trigger(this._element, "slid.bs.carousel", { relatedTarget: r2, direction: p3, from: o2, to: l2 });
            }, 0);
          }), a(s2, t3);
        } else
          s2.classList.remove("active"), r2.classList.add("active"), this._isSliding = false, N.trigger(this._element, "slid.bs.carousel", { relatedTarget: r2, direction: p3, from: o2, to: l2 });
        c2 && this.cycle();
      }
    }
    _directionToOrder(t2) {
      return [K, z].includes(t2) ? g() ? t2 === K ? F : $2 : t2 === K ? $2 : F : t2;
    }
    _orderToDirection(t2) {
      return [$2, F].includes(t2) ? g() ? t2 === $2 ? z : K : t2 === $2 ? K : z : t2;
    }
    static carouselInterface(t2, e2) {
      let i2 = b.get(t2, "bs.carousel"), s2 = __spreadValues(__spreadValues({}, W), B.getDataAttributes(t2));
      typeof e2 == "object" && (s2 = __spreadValues(__spreadValues({}, s2), e2));
      const n2 = typeof e2 == "string" ? e2 : s2.slide;
      if (i2 || (i2 = new Y(t2, s2)), typeof e2 == "number")
        i2.to(e2);
      else if (typeof n2 == "string") {
        if (i2[n2] === void 0)
          throw new TypeError(`No method named "${n2}"`);
        i2[n2]();
      } else
        s2.interval && s2.ride && (i2.pause(), i2.cycle());
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        Y.carouselInterface(this, t2);
      });
    }
    static dataApiClickHandler(t2) {
      const e2 = s(this);
      if (!e2 || !e2.classList.contains("carousel"))
        return;
      const i2 = __spreadValues(__spreadValues({}, B.getDataAttributes(e2)), B.getDataAttributes(this)), n2 = this.getAttribute("data-bs-slide-to");
      n2 && (i2.interval = false), Y.carouselInterface(e2, i2), n2 && b.get(e2, "bs.carousel").to(n2), t2.preventDefault();
    }
  }
  N.on(document, "click.bs.carousel.data-api", "[data-bs-slide], [data-bs-slide-to]", Y.dataApiClickHandler), N.on(window, "load.bs.carousel.data-api", () => {
    const t2 = H.find('[data-bs-ride="carousel"]');
    for (let e2 = 0, i2 = t2.length; e2 < i2; e2++)
      Y.carouselInterface(t2[e2], b.get(t2[e2], "bs.carousel"));
  }), m("carousel", Y);
  const q = { toggle: true, parent: "" }, V = { toggle: "boolean", parent: "(string|element)" };
  class X extends j {
    constructor(t2, e2) {
      super(t2), this._isTransitioning = false, this._config = this._getConfig(e2), this._triggerArray = H.find(`[data-bs-toggle="collapse"][href="#${this._element.id}"],[data-bs-toggle="collapse"][data-bs-target="#${this._element.id}"]`);
      const s2 = H.find('[data-bs-toggle="collapse"]');
      for (let t3 = 0, e3 = s2.length; t3 < e3; t3++) {
        const e4 = s2[t3], n2 = i(e4), o2 = H.find(n2).filter((t4) => t4 === this._element);
        n2 !== null && o2.length && (this._selector = n2, this._triggerArray.push(e4));
      }
      this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle();
    }
    static get Default() {
      return q;
    }
    static get DATA_KEY() {
      return "bs.collapse";
    }
    toggle() {
      this._element.classList.contains("show") ? this.hide() : this.show();
    }
    show() {
      if (this._isTransitioning || this._element.classList.contains("show"))
        return;
      let t2, e2;
      this._parent && (t2 = H.find(".show, .collapsing", this._parent).filter((t3) => typeof this._config.parent == "string" ? t3.getAttribute("data-bs-parent") === this._config.parent : t3.classList.contains("collapse")), t2.length === 0 && (t2 = null));
      const i2 = H.findOne(this._selector);
      if (t2) {
        const s3 = t2.find((t3) => i2 !== t3);
        if (e2 = s3 ? b.get(s3, "bs.collapse") : null, e2 && e2._isTransitioning)
          return;
      }
      if (N.trigger(this._element, "show.bs.collapse").defaultPrevented)
        return;
      t2 && t2.forEach((t3) => {
        i2 !== t3 && X.collapseInterface(t3, "hide"), e2 || b.set(t3, "bs.collapse", null);
      });
      const s2 = this._getDimension();
      this._element.classList.remove("collapse"), this._element.classList.add("collapsing"), this._element.style[s2] = 0, this._triggerArray.length && this._triggerArray.forEach((t3) => {
        t3.classList.remove("collapsed"), t3.setAttribute("aria-expanded", true);
      }), this.setTransitioning(true);
      const o2 = "scroll" + (s2[0].toUpperCase() + s2.slice(1)), r2 = n(this._element);
      N.one(this._element, "transitionend", () => {
        this._element.classList.remove("collapsing"), this._element.classList.add("collapse", "show"), this._element.style[s2] = "", this.setTransitioning(false), N.trigger(this._element, "shown.bs.collapse");
      }), a(this._element, r2), this._element.style[s2] = this._element[o2] + "px";
    }
    hide() {
      if (this._isTransitioning || !this._element.classList.contains("show"))
        return;
      if (N.trigger(this._element, "hide.bs.collapse").defaultPrevented)
        return;
      const t2 = this._getDimension();
      this._element.style[t2] = this._element.getBoundingClientRect()[t2] + "px", u(this._element), this._element.classList.add("collapsing"), this._element.classList.remove("collapse", "show");
      const e2 = this._triggerArray.length;
      if (e2 > 0)
        for (let t3 = 0; t3 < e2; t3++) {
          const e3 = this._triggerArray[t3], i3 = s(e3);
          i3 && !i3.classList.contains("show") && (e3.classList.add("collapsed"), e3.setAttribute("aria-expanded", false));
        }
      this.setTransitioning(true), this._element.style[t2] = "";
      const i2 = n(this._element);
      N.one(this._element, "transitionend", () => {
        this.setTransitioning(false), this._element.classList.remove("collapsing"), this._element.classList.add("collapse"), N.trigger(this._element, "hidden.bs.collapse");
      }), a(this._element, i2);
    }
    setTransitioning(t2) {
      this._isTransitioning = t2;
    }
    dispose() {
      super.dispose(), this._config = null, this._parent = null, this._triggerArray = null, this._isTransitioning = null;
    }
    _getConfig(t2) {
      return (t2 = __spreadValues(__spreadValues({}, q), t2)).toggle = Boolean(t2.toggle), l("collapse", t2, V), t2;
    }
    _getDimension() {
      return this._element.classList.contains("width") ? "width" : "height";
    }
    _getParent() {
      let { parent: t2 } = this._config;
      r(t2) ? t2.jquery === void 0 && t2[0] === void 0 || (t2 = t2[0]) : t2 = H.findOne(t2);
      const e2 = `[data-bs-toggle="collapse"][data-bs-parent="${t2}"]`;
      return H.find(e2, t2).forEach((t3) => {
        const e3 = s(t3);
        this._addAriaAndCollapsedClass(e3, [t3]);
      }), t2;
    }
    _addAriaAndCollapsedClass(t2, e2) {
      if (!t2 || !e2.length)
        return;
      const i2 = t2.classList.contains("show");
      e2.forEach((t3) => {
        i2 ? t3.classList.remove("collapsed") : t3.classList.add("collapsed"), t3.setAttribute("aria-expanded", i2);
      });
    }
    static collapseInterface(t2, e2) {
      let i2 = b.get(t2, "bs.collapse");
      const s2 = __spreadValues(__spreadValues(__spreadValues({}, q), B.getDataAttributes(t2)), typeof e2 == "object" && e2 ? e2 : {});
      if (!i2 && s2.toggle && typeof e2 == "string" && /show|hide/.test(e2) && (s2.toggle = false), i2 || (i2 = new X(t2, s2)), typeof e2 == "string") {
        if (i2[e2] === void 0)
          throw new TypeError(`No method named "${e2}"`);
        i2[e2]();
      }
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        X.collapseInterface(this, t2);
      });
    }
  }
  N.on(document, "click.bs.collapse.data-api", '[data-bs-toggle="collapse"]', function(t2) {
    (t2.target.tagName === "A" || t2.delegateTarget && t2.delegateTarget.tagName === "A") && t2.preventDefault();
    const e2 = B.getDataAttributes(this), s2 = i(this);
    H.find(s2).forEach((t3) => {
      const i2 = b.get(t3, "bs.collapse");
      let s3;
      i2 ? (i2._parent === null && typeof e2.parent == "string" && (i2._config.parent = e2.parent, i2._parent = i2._getParent()), s3 = "toggle") : s3 = e2, X.collapseInterface(t3, s3);
    });
  }), m("collapse", X);
  var Q = "top", G = "bottom", Z = "right", J = "left", tt = [Q, G, Z, J], et = tt.reduce(function(t2, e2) {
    return t2.concat([e2 + "-start", e2 + "-end"]);
  }, []), it = [].concat(tt, ["auto"]).reduce(function(t2, e2) {
    return t2.concat([e2, e2 + "-start", e2 + "-end"]);
  }, []), st = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];
  function nt(t2) {
    return t2 ? (t2.nodeName || "").toLowerCase() : null;
  }
  function ot(t2) {
    if (t2 == null)
      return window;
    if (t2.toString() !== "[object Window]") {
      var e2 = t2.ownerDocument;
      return e2 && e2.defaultView || window;
    }
    return t2;
  }
  function rt(t2) {
    return t2 instanceof ot(t2).Element || t2 instanceof Element;
  }
  function at(t2) {
    return t2 instanceof ot(t2).HTMLElement || t2 instanceof HTMLElement;
  }
  function lt(t2) {
    return typeof ShadowRoot != "undefined" && (t2 instanceof ot(t2).ShadowRoot || t2 instanceof ShadowRoot);
  }
  var ct = { name: "applyStyles", enabled: true, phase: "write", fn: function(t2) {
    var e2 = t2.state;
    Object.keys(e2.elements).forEach(function(t3) {
      var i2 = e2.styles[t3] || {}, s2 = e2.attributes[t3] || {}, n2 = e2.elements[t3];
      at(n2) && nt(n2) && (Object.assign(n2.style, i2), Object.keys(s2).forEach(function(t4) {
        var e3 = s2[t4];
        e3 === false ? n2.removeAttribute(t4) : n2.setAttribute(t4, e3 === true ? "" : e3);
      }));
    });
  }, effect: function(t2) {
    var e2 = t2.state, i2 = { popper: { position: e2.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
    return Object.assign(e2.elements.popper.style, i2.popper), e2.styles = i2, e2.elements.arrow && Object.assign(e2.elements.arrow.style, i2.arrow), function() {
      Object.keys(e2.elements).forEach(function(t3) {
        var s2 = e2.elements[t3], n2 = e2.attributes[t3] || {}, o2 = Object.keys(e2.styles.hasOwnProperty(t3) ? e2.styles[t3] : i2[t3]).reduce(function(t4, e3) {
          return t4[e3] = "", t4;
        }, {});
        at(s2) && nt(s2) && (Object.assign(s2.style, o2), Object.keys(n2).forEach(function(t4) {
          s2.removeAttribute(t4);
        }));
      });
    };
  }, requires: ["computeStyles"] };
  function dt(t2) {
    return t2.split("-")[0];
  }
  function ht(t2) {
    var e2 = t2.getBoundingClientRect();
    return { width: e2.width, height: e2.height, top: e2.top, right: e2.right, bottom: e2.bottom, left: e2.left, x: e2.left, y: e2.top };
  }
  function ft(t2) {
    var e2 = ht(t2), i2 = t2.offsetWidth, s2 = t2.offsetHeight;
    return Math.abs(e2.width - i2) <= 1 && (i2 = e2.width), Math.abs(e2.height - s2) <= 1 && (s2 = e2.height), { x: t2.offsetLeft, y: t2.offsetTop, width: i2, height: s2 };
  }
  function ut(t2, e2) {
    var i2 = e2.getRootNode && e2.getRootNode();
    if (t2.contains(e2))
      return true;
    if (i2 && lt(i2)) {
      var s2 = e2;
      do {
        if (s2 && t2.isSameNode(s2))
          return true;
        s2 = s2.parentNode || s2.host;
      } while (s2);
    }
    return false;
  }
  function pt(t2) {
    return ot(t2).getComputedStyle(t2);
  }
  function gt(t2) {
    return ["table", "td", "th"].indexOf(nt(t2)) >= 0;
  }
  function mt(t2) {
    return ((rt(t2) ? t2.ownerDocument : t2.document) || window.document).documentElement;
  }
  function _t(t2) {
    return nt(t2) === "html" ? t2 : t2.assignedSlot || t2.parentNode || (lt(t2) ? t2.host : null) || mt(t2);
  }
  function bt(t2) {
    return at(t2) && pt(t2).position !== "fixed" ? t2.offsetParent : null;
  }
  function vt(t2) {
    for (var e2 = ot(t2), i2 = bt(t2); i2 && gt(i2) && pt(i2).position === "static"; )
      i2 = bt(i2);
    return i2 && (nt(i2) === "html" || nt(i2) === "body" && pt(i2).position === "static") ? e2 : i2 || function(t3) {
      for (var e3 = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, i3 = _t(t3); at(i3) && ["html", "body"].indexOf(nt(i3)) < 0; ) {
        var s2 = pt(i3);
        if (s2.transform !== "none" || s2.perspective !== "none" || s2.contain === "paint" || ["transform", "perspective"].indexOf(s2.willChange) !== -1 || e3 && s2.willChange === "filter" || e3 && s2.filter && s2.filter !== "none")
          return i3;
        i3 = i3.parentNode;
      }
      return null;
    }(t2) || e2;
  }
  function yt(t2) {
    return ["top", "bottom"].indexOf(t2) >= 0 ? "x" : "y";
  }
  var wt = Math.max, Et = Math.min, Tt = Math.round;
  function At(t2, e2, i2) {
    return wt(t2, Et(e2, i2));
  }
  function Lt(t2) {
    return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, t2);
  }
  function Ot(t2, e2) {
    return e2.reduce(function(e3, i2) {
      return e3[i2] = t2, e3;
    }, {});
  }
  var kt = { name: "arrow", enabled: true, phase: "main", fn: function(t2) {
    var e2, i2 = t2.state, s2 = t2.name, n2 = t2.options, o2 = i2.elements.arrow, r2 = i2.modifiersData.popperOffsets, a2 = dt(i2.placement), l2 = yt(a2), c2 = [J, Z].indexOf(a2) >= 0 ? "height" : "width";
    if (o2 && r2) {
      var d2 = function(t3, e3) {
        return Lt(typeof (t3 = typeof t3 == "function" ? t3(Object.assign({}, e3.rects, { placement: e3.placement })) : t3) != "number" ? t3 : Ot(t3, tt));
      }(n2.padding, i2), h2 = ft(o2), f2 = l2 === "y" ? Q : J, u2 = l2 === "y" ? G : Z, p3 = i2.rects.reference[c2] + i2.rects.reference[l2] - r2[l2] - i2.rects.popper[c2], g2 = r2[l2] - i2.rects.reference[l2], m2 = vt(o2), _2 = m2 ? l2 === "y" ? m2.clientHeight || 0 : m2.clientWidth || 0 : 0, b2 = p3 / 2 - g2 / 2, v2 = d2[f2], y2 = _2 - h2[c2] - d2[u2], w2 = _2 / 2 - h2[c2] / 2 + b2, E3 = At(v2, w2, y2), T2 = l2;
      i2.modifiersData[s2] = ((e2 = {})[T2] = E3, e2.centerOffset = E3 - w2, e2);
    }
  }, effect: function(t2) {
    var e2 = t2.state, i2 = t2.options.element, s2 = i2 === void 0 ? "[data-popper-arrow]" : i2;
    s2 != null && (typeof s2 != "string" || (s2 = e2.elements.popper.querySelector(s2))) && ut(e2.elements.popper, s2) && (e2.elements.arrow = s2);
  }, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] }, Dt = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  function xt(t2) {
    var e2, i2 = t2.popper, s2 = t2.popperRect, n2 = t2.placement, o2 = t2.offsets, r2 = t2.position, a2 = t2.gpuAcceleration, l2 = t2.adaptive, c2 = t2.roundOffsets, d2 = c2 === true ? function(t3) {
      var e3 = t3.x, i3 = t3.y, s3 = window.devicePixelRatio || 1;
      return { x: Tt(Tt(e3 * s3) / s3) || 0, y: Tt(Tt(i3 * s3) / s3) || 0 };
    }(o2) : typeof c2 == "function" ? c2(o2) : o2, h2 = d2.x, f2 = h2 === void 0 ? 0 : h2, u2 = d2.y, p3 = u2 === void 0 ? 0 : u2, g2 = o2.hasOwnProperty("x"), m2 = o2.hasOwnProperty("y"), _2 = J, b2 = Q, v2 = window;
    if (l2) {
      var y2 = vt(i2), w2 = "clientHeight", E3 = "clientWidth";
      y2 === ot(i2) && pt(y2 = mt(i2)).position !== "static" && (w2 = "scrollHeight", E3 = "scrollWidth"), y2 = y2, n2 === Q && (b2 = G, p3 -= y2[w2] - s2.height, p3 *= a2 ? 1 : -1), n2 === J && (_2 = Z, f2 -= y2[E3] - s2.width, f2 *= a2 ? 1 : -1);
    }
    var T2, A2 = Object.assign({ position: r2 }, l2 && Dt);
    return a2 ? Object.assign({}, A2, ((T2 = {})[b2] = m2 ? "0" : "", T2[_2] = g2 ? "0" : "", T2.transform = (v2.devicePixelRatio || 1) < 2 ? "translate(" + f2 + "px, " + p3 + "px)" : "translate3d(" + f2 + "px, " + p3 + "px, 0)", T2)) : Object.assign({}, A2, ((e2 = {})[b2] = m2 ? p3 + "px" : "", e2[_2] = g2 ? f2 + "px" : "", e2.transform = "", e2));
  }
  var Ct = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: function(t2) {
    var e2 = t2.state, i2 = t2.options, s2 = i2.gpuAcceleration, n2 = s2 === void 0 || s2, o2 = i2.adaptive, r2 = o2 === void 0 || o2, a2 = i2.roundOffsets, l2 = a2 === void 0 || a2, c2 = { placement: dt(e2.placement), popper: e2.elements.popper, popperRect: e2.rects.popper, gpuAcceleration: n2 };
    e2.modifiersData.popperOffsets != null && (e2.styles.popper = Object.assign({}, e2.styles.popper, xt(Object.assign({}, c2, { offsets: e2.modifiersData.popperOffsets, position: e2.options.strategy, adaptive: r2, roundOffsets: l2 })))), e2.modifiersData.arrow != null && (e2.styles.arrow = Object.assign({}, e2.styles.arrow, xt(Object.assign({}, c2, { offsets: e2.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: l2 })))), e2.attributes.popper = Object.assign({}, e2.attributes.popper, { "data-popper-placement": e2.placement });
  }, data: {} }, St = { passive: true }, Nt = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
  }, effect: function(t2) {
    var e2 = t2.state, i2 = t2.instance, s2 = t2.options, n2 = s2.scroll, o2 = n2 === void 0 || n2, r2 = s2.resize, a2 = r2 === void 0 || r2, l2 = ot(e2.elements.popper), c2 = [].concat(e2.scrollParents.reference, e2.scrollParents.popper);
    return o2 && c2.forEach(function(t3) {
      t3.addEventListener("scroll", i2.update, St);
    }), a2 && l2.addEventListener("resize", i2.update, St), function() {
      o2 && c2.forEach(function(t3) {
        t3.removeEventListener("scroll", i2.update, St);
      }), a2 && l2.removeEventListener("resize", i2.update, St);
    };
  }, data: {} }, jt = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function Pt(t2) {
    return t2.replace(/left|right|bottom|top/g, function(t3) {
      return jt[t3];
    });
  }
  var It = { start: "end", end: "start" };
  function Mt(t2) {
    return t2.replace(/start|end/g, function(t3) {
      return It[t3];
    });
  }
  function Rt(t2) {
    var e2 = ot(t2);
    return { scrollLeft: e2.pageXOffset, scrollTop: e2.pageYOffset };
  }
  function Bt(t2) {
    return ht(mt(t2)).left + Rt(t2).scrollLeft;
  }
  function Ht(t2) {
    var e2 = pt(t2), i2 = e2.overflow, s2 = e2.overflowX, n2 = e2.overflowY;
    return /auto|scroll|overlay|hidden/.test(i2 + n2 + s2);
  }
  function Wt(t2, e2) {
    var i2;
    e2 === void 0 && (e2 = []);
    var s2 = function t3(e3) {
      return ["html", "body", "#document"].indexOf(nt(e3)) >= 0 ? e3.ownerDocument.body : at(e3) && Ht(e3) ? e3 : t3(_t(e3));
    }(t2), n2 = s2 === ((i2 = t2.ownerDocument) == null ? void 0 : i2.body), o2 = ot(s2), r2 = n2 ? [o2].concat(o2.visualViewport || [], Ht(s2) ? s2 : []) : s2, a2 = e2.concat(r2);
    return n2 ? a2 : a2.concat(Wt(_t(r2)));
  }
  function Ut(t2) {
    return Object.assign({}, t2, { left: t2.x, top: t2.y, right: t2.x + t2.width, bottom: t2.y + t2.height });
  }
  function $t(t2, e2) {
    return e2 === "viewport" ? Ut(function(t3) {
      var e3 = ot(t3), i2 = mt(t3), s2 = e3.visualViewport, n2 = i2.clientWidth, o2 = i2.clientHeight, r2 = 0, a2 = 0;
      return s2 && (n2 = s2.width, o2 = s2.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (r2 = s2.offsetLeft, a2 = s2.offsetTop)), { width: n2, height: o2, x: r2 + Bt(t3), y: a2 };
    }(t2)) : at(e2) ? function(t3) {
      var e3 = ht(t3);
      return e3.top = e3.top + t3.clientTop, e3.left = e3.left + t3.clientLeft, e3.bottom = e3.top + t3.clientHeight, e3.right = e3.left + t3.clientWidth, e3.width = t3.clientWidth, e3.height = t3.clientHeight, e3.x = e3.left, e3.y = e3.top, e3;
    }(e2) : Ut(function(t3) {
      var e3, i2 = mt(t3), s2 = Rt(t3), n2 = (e3 = t3.ownerDocument) == null ? void 0 : e3.body, o2 = wt(i2.scrollWidth, i2.clientWidth, n2 ? n2.scrollWidth : 0, n2 ? n2.clientWidth : 0), r2 = wt(i2.scrollHeight, i2.clientHeight, n2 ? n2.scrollHeight : 0, n2 ? n2.clientHeight : 0), a2 = -s2.scrollLeft + Bt(t3), l2 = -s2.scrollTop;
      return pt(n2 || i2).direction === "rtl" && (a2 += wt(i2.clientWidth, n2 ? n2.clientWidth : 0) - o2), { width: o2, height: r2, x: a2, y: l2 };
    }(mt(t2)));
  }
  function Ft(t2) {
    return t2.split("-")[1];
  }
  function zt(t2) {
    var e2, i2 = t2.reference, s2 = t2.element, n2 = t2.placement, o2 = n2 ? dt(n2) : null, r2 = n2 ? Ft(n2) : null, a2 = i2.x + i2.width / 2 - s2.width / 2, l2 = i2.y + i2.height / 2 - s2.height / 2;
    switch (o2) {
      case Q:
        e2 = { x: a2, y: i2.y - s2.height };
        break;
      case G:
        e2 = { x: a2, y: i2.y + i2.height };
        break;
      case Z:
        e2 = { x: i2.x + i2.width, y: l2 };
        break;
      case J:
        e2 = { x: i2.x - s2.width, y: l2 };
        break;
      default:
        e2 = { x: i2.x, y: i2.y };
    }
    var c2 = o2 ? yt(o2) : null;
    if (c2 != null) {
      var d2 = c2 === "y" ? "height" : "width";
      switch (r2) {
        case "start":
          e2[c2] = e2[c2] - (i2[d2] / 2 - s2[d2] / 2);
          break;
        case "end":
          e2[c2] = e2[c2] + (i2[d2] / 2 - s2[d2] / 2);
      }
    }
    return e2;
  }
  function Kt(t2, e2) {
    e2 === void 0 && (e2 = {});
    var i2 = e2, s2 = i2.placement, n2 = s2 === void 0 ? t2.placement : s2, o2 = i2.boundary, r2 = o2 === void 0 ? "clippingParents" : o2, a2 = i2.rootBoundary, l2 = a2 === void 0 ? "viewport" : a2, c2 = i2.elementContext, d2 = c2 === void 0 ? "popper" : c2, h2 = i2.altBoundary, f2 = h2 !== void 0 && h2, u2 = i2.padding, p3 = u2 === void 0 ? 0 : u2, g2 = Lt(typeof p3 != "number" ? p3 : Ot(p3, tt)), m2 = d2 === "popper" ? "reference" : "popper", _2 = t2.elements.reference, b2 = t2.rects.popper, v2 = t2.elements[f2 ? m2 : d2], y2 = function(t3, e3, i3) {
      var s3 = e3 === "clippingParents" ? function(t4) {
        var e4 = Wt(_t(t4)), i4 = ["absolute", "fixed"].indexOf(pt(t4).position) >= 0 && at(t4) ? vt(t4) : t4;
        return rt(i4) ? e4.filter(function(t5) {
          return rt(t5) && ut(t5, i4) && nt(t5) !== "body";
        }) : [];
      }(t3) : [].concat(e3), n3 = [].concat(s3, [i3]), o3 = n3[0], r3 = n3.reduce(function(e4, i4) {
        var s4 = $t(t3, i4);
        return e4.top = wt(s4.top, e4.top), e4.right = Et(s4.right, e4.right), e4.bottom = Et(s4.bottom, e4.bottom), e4.left = wt(s4.left, e4.left), e4;
      }, $t(t3, o3));
      return r3.width = r3.right - r3.left, r3.height = r3.bottom - r3.top, r3.x = r3.left, r3.y = r3.top, r3;
    }(rt(v2) ? v2 : v2.contextElement || mt(t2.elements.popper), r2, l2), w2 = ht(_2), E3 = zt({ reference: w2, element: b2, strategy: "absolute", placement: n2 }), T2 = Ut(Object.assign({}, b2, E3)), A2 = d2 === "popper" ? T2 : w2, L2 = { top: y2.top - A2.top + g2.top, bottom: A2.bottom - y2.bottom + g2.bottom, left: y2.left - A2.left + g2.left, right: A2.right - y2.right + g2.right }, O2 = t2.modifiersData.offset;
    if (d2 === "popper" && O2) {
      var k2 = O2[n2];
      Object.keys(L2).forEach(function(t3) {
        var e3 = [Z, G].indexOf(t3) >= 0 ? 1 : -1, i3 = [Q, G].indexOf(t3) >= 0 ? "y" : "x";
        L2[t3] += k2[i3] * e3;
      });
    }
    return L2;
  }
  function Yt(t2, e2) {
    e2 === void 0 && (e2 = {});
    var i2 = e2, s2 = i2.placement, n2 = i2.boundary, o2 = i2.rootBoundary, r2 = i2.padding, a2 = i2.flipVariations, l2 = i2.allowedAutoPlacements, c2 = l2 === void 0 ? it : l2, d2 = Ft(s2), h2 = d2 ? a2 ? et : et.filter(function(t3) {
      return Ft(t3) === d2;
    }) : tt, f2 = h2.filter(function(t3) {
      return c2.indexOf(t3) >= 0;
    });
    f2.length === 0 && (f2 = h2);
    var u2 = f2.reduce(function(e3, i3) {
      return e3[i3] = Kt(t2, { placement: i3, boundary: n2, rootBoundary: o2, padding: r2 })[dt(i3)], e3;
    }, {});
    return Object.keys(u2).sort(function(t3, e3) {
      return u2[t3] - u2[e3];
    });
  }
  var qt = { name: "flip", enabled: true, phase: "main", fn: function(t2) {
    var e2 = t2.state, i2 = t2.options, s2 = t2.name;
    if (!e2.modifiersData[s2]._skip) {
      for (var n2 = i2.mainAxis, o2 = n2 === void 0 || n2, r2 = i2.altAxis, a2 = r2 === void 0 || r2, l2 = i2.fallbackPlacements, c2 = i2.padding, d2 = i2.boundary, h2 = i2.rootBoundary, f2 = i2.altBoundary, u2 = i2.flipVariations, p3 = u2 === void 0 || u2, g2 = i2.allowedAutoPlacements, m2 = e2.options.placement, _2 = dt(m2), b2 = l2 || (_2 !== m2 && p3 ? function(t3) {
        if (dt(t3) === "auto")
          return [];
        var e3 = Pt(t3);
        return [Mt(t3), e3, Mt(e3)];
      }(m2) : [Pt(m2)]), v2 = [m2].concat(b2).reduce(function(t3, i3) {
        return t3.concat(dt(i3) === "auto" ? Yt(e2, { placement: i3, boundary: d2, rootBoundary: h2, padding: c2, flipVariations: p3, allowedAutoPlacements: g2 }) : i3);
      }, []), y2 = e2.rects.reference, w2 = e2.rects.popper, E3 = /* @__PURE__ */ new Map(), T2 = true, A2 = v2[0], L2 = 0; L2 < v2.length; L2++) {
        var O2 = v2[L2], k2 = dt(O2), D2 = Ft(O2) === "start", x2 = [Q, G].indexOf(k2) >= 0, C2 = x2 ? "width" : "height", S2 = Kt(e2, { placement: O2, boundary: d2, rootBoundary: h2, altBoundary: f2, padding: c2 }), N2 = x2 ? D2 ? Z : J : D2 ? G : Q;
        y2[C2] > w2[C2] && (N2 = Pt(N2));
        var j2 = Pt(N2), P2 = [];
        if (o2 && P2.push(S2[k2] <= 0), a2 && P2.push(S2[N2] <= 0, S2[j2] <= 0), P2.every(function(t3) {
          return t3;
        })) {
          A2 = O2, T2 = false;
          break;
        }
        E3.set(O2, P2);
      }
      if (T2)
        for (var I2 = function(t3) {
          var e3 = v2.find(function(e4) {
            var i3 = E3.get(e4);
            if (i3)
              return i3.slice(0, t3).every(function(t4) {
                return t4;
              });
          });
          if (e3)
            return A2 = e3, "break";
        }, M2 = p3 ? 3 : 1; M2 > 0 && I2(M2) !== "break"; M2--)
          ;
      e2.placement !== A2 && (e2.modifiersData[s2]._skip = true, e2.placement = A2, e2.reset = true);
    }
  }, requiresIfExists: ["offset"], data: { _skip: false } };
  function Vt(t2, e2, i2) {
    return i2 === void 0 && (i2 = { x: 0, y: 0 }), { top: t2.top - e2.height - i2.y, right: t2.right - e2.width + i2.x, bottom: t2.bottom - e2.height + i2.y, left: t2.left - e2.width - i2.x };
  }
  function Xt(t2) {
    return [Q, Z, G, J].some(function(e2) {
      return t2[e2] >= 0;
    });
  }
  var Qt = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: function(t2) {
    var e2 = t2.state, i2 = t2.name, s2 = e2.rects.reference, n2 = e2.rects.popper, o2 = e2.modifiersData.preventOverflow, r2 = Kt(e2, { elementContext: "reference" }), a2 = Kt(e2, { altBoundary: true }), l2 = Vt(r2, s2), c2 = Vt(a2, n2, o2), d2 = Xt(l2), h2 = Xt(c2);
    e2.modifiersData[i2] = { referenceClippingOffsets: l2, popperEscapeOffsets: c2, isReferenceHidden: d2, hasPopperEscaped: h2 }, e2.attributes.popper = Object.assign({}, e2.attributes.popper, { "data-popper-reference-hidden": d2, "data-popper-escaped": h2 });
  } }, Gt = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: function(t2) {
    var e2 = t2.state, i2 = t2.options, s2 = t2.name, n2 = i2.offset, o2 = n2 === void 0 ? [0, 0] : n2, r2 = it.reduce(function(t3, i3) {
      return t3[i3] = function(t4, e3, i4) {
        var s3 = dt(t4), n3 = [J, Q].indexOf(s3) >= 0 ? -1 : 1, o3 = typeof i4 == "function" ? i4(Object.assign({}, e3, { placement: t4 })) : i4, r3 = o3[0], a3 = o3[1];
        return r3 = r3 || 0, a3 = (a3 || 0) * n3, [J, Z].indexOf(s3) >= 0 ? { x: a3, y: r3 } : { x: r3, y: a3 };
      }(i3, e2.rects, o2), t3;
    }, {}), a2 = r2[e2.placement], l2 = a2.x, c2 = a2.y;
    e2.modifiersData.popperOffsets != null && (e2.modifiersData.popperOffsets.x += l2, e2.modifiersData.popperOffsets.y += c2), e2.modifiersData[s2] = r2;
  } }, Zt = { name: "popperOffsets", enabled: true, phase: "read", fn: function(t2) {
    var e2 = t2.state, i2 = t2.name;
    e2.modifiersData[i2] = zt({ reference: e2.rects.reference, element: e2.rects.popper, strategy: "absolute", placement: e2.placement });
  }, data: {} }, Jt = { name: "preventOverflow", enabled: true, phase: "main", fn: function(t2) {
    var e2 = t2.state, i2 = t2.options, s2 = t2.name, n2 = i2.mainAxis, o2 = n2 === void 0 || n2, r2 = i2.altAxis, a2 = r2 !== void 0 && r2, l2 = i2.boundary, c2 = i2.rootBoundary, d2 = i2.altBoundary, h2 = i2.padding, f2 = i2.tether, u2 = f2 === void 0 || f2, p3 = i2.tetherOffset, g2 = p3 === void 0 ? 0 : p3, m2 = Kt(e2, { boundary: l2, rootBoundary: c2, padding: h2, altBoundary: d2 }), _2 = dt(e2.placement), b2 = Ft(e2.placement), v2 = !b2, y2 = yt(_2), w2 = y2 === "x" ? "y" : "x", E3 = e2.modifiersData.popperOffsets, T2 = e2.rects.reference, A2 = e2.rects.popper, L2 = typeof g2 == "function" ? g2(Object.assign({}, e2.rects, { placement: e2.placement })) : g2, O2 = { x: 0, y: 0 };
    if (E3) {
      if (o2 || a2) {
        var k2 = y2 === "y" ? Q : J, D2 = y2 === "y" ? G : Z, x2 = y2 === "y" ? "height" : "width", C2 = E3[y2], S2 = E3[y2] + m2[k2], N2 = E3[y2] - m2[D2], j2 = u2 ? -A2[x2] / 2 : 0, P2 = b2 === "start" ? T2[x2] : A2[x2], I2 = b2 === "start" ? -A2[x2] : -T2[x2], M2 = e2.elements.arrow, R2 = u2 && M2 ? ft(M2) : { width: 0, height: 0 }, B2 = e2.modifiersData["arrow#persistent"] ? e2.modifiersData["arrow#persistent"].padding : { top: 0, right: 0, bottom: 0, left: 0 }, H2 = B2[k2], W2 = B2[D2], U2 = At(0, T2[x2], R2[x2]), $3 = v2 ? T2[x2] / 2 - j2 - U2 - H2 - L2 : P2 - U2 - H2 - L2, F2 = v2 ? -T2[x2] / 2 + j2 + U2 + W2 + L2 : I2 + U2 + W2 + L2, z2 = e2.elements.arrow && vt(e2.elements.arrow), K2 = z2 ? y2 === "y" ? z2.clientTop || 0 : z2.clientLeft || 0 : 0, Y2 = e2.modifiersData.offset ? e2.modifiersData.offset[e2.placement][y2] : 0, q2 = E3[y2] + $3 - Y2 - K2, V2 = E3[y2] + F2 - Y2;
        if (o2) {
          var X2 = At(u2 ? Et(S2, q2) : S2, C2, u2 ? wt(N2, V2) : N2);
          E3[y2] = X2, O2[y2] = X2 - C2;
        }
        if (a2) {
          var tt2 = y2 === "x" ? Q : J, et2 = y2 === "x" ? G : Z, it2 = E3[w2], st2 = it2 + m2[tt2], nt2 = it2 - m2[et2], ot2 = At(u2 ? Et(st2, q2) : st2, it2, u2 ? wt(nt2, V2) : nt2);
          E3[w2] = ot2, O2[w2] = ot2 - it2;
        }
      }
      e2.modifiersData[s2] = O2;
    }
  }, requiresIfExists: ["offset"] };
  function te(t2, e2, i2) {
    i2 === void 0 && (i2 = false);
    var s2, n2, o2 = mt(e2), r2 = ht(t2), a2 = at(e2), l2 = { scrollLeft: 0, scrollTop: 0 }, c2 = { x: 0, y: 0 };
    return (a2 || !a2 && !i2) && ((nt(e2) !== "body" || Ht(o2)) && (l2 = (s2 = e2) !== ot(s2) && at(s2) ? { scrollLeft: (n2 = s2).scrollLeft, scrollTop: n2.scrollTop } : Rt(s2)), at(e2) ? ((c2 = ht(e2)).x += e2.clientLeft, c2.y += e2.clientTop) : o2 && (c2.x = Bt(o2))), { x: r2.left + l2.scrollLeft - c2.x, y: r2.top + l2.scrollTop - c2.y, width: r2.width, height: r2.height };
  }
  var ee = { placement: "bottom", modifiers: [], strategy: "absolute" };
  function ie() {
    for (var t2 = arguments.length, e2 = new Array(t2), i2 = 0; i2 < t2; i2++)
      e2[i2] = arguments[i2];
    return !e2.some(function(t3) {
      return !(t3 && typeof t3.getBoundingClientRect == "function");
    });
  }
  function se(t2) {
    t2 === void 0 && (t2 = {});
    var e2 = t2, i2 = e2.defaultModifiers, s2 = i2 === void 0 ? [] : i2, n2 = e2.defaultOptions, o2 = n2 === void 0 ? ee : n2;
    return function(t3, e3, i3) {
      i3 === void 0 && (i3 = o2);
      var n3, r2, a2 = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, ee, o2), modifiersData: {}, elements: { reference: t3, popper: e3 }, attributes: {}, styles: {} }, l2 = [], c2 = false, d2 = { state: a2, setOptions: function(i4) {
        h2(), a2.options = Object.assign({}, o2, a2.options, i4), a2.scrollParents = { reference: rt(t3) ? Wt(t3) : t3.contextElement ? Wt(t3.contextElement) : [], popper: Wt(e3) };
        var n4, r3, c3 = function(t4) {
          var e4 = function(t5) {
            var e5 = /* @__PURE__ */ new Map(), i5 = /* @__PURE__ */ new Set(), s3 = [];
            return t5.forEach(function(t6) {
              e5.set(t6.name, t6);
            }), t5.forEach(function(t6) {
              i5.has(t6.name) || function t7(n5) {
                i5.add(n5.name), [].concat(n5.requires || [], n5.requiresIfExists || []).forEach(function(s4) {
                  if (!i5.has(s4)) {
                    var n6 = e5.get(s4);
                    n6 && t7(n6);
                  }
                }), s3.push(n5);
              }(t6);
            }), s3;
          }(t4);
          return st.reduce(function(t5, i5) {
            return t5.concat(e4.filter(function(t6) {
              return t6.phase === i5;
            }));
          }, []);
        }((n4 = [].concat(s2, a2.options.modifiers), r3 = n4.reduce(function(t4, e4) {
          var i5 = t4[e4.name];
          return t4[e4.name] = i5 ? Object.assign({}, i5, e4, { options: Object.assign({}, i5.options, e4.options), data: Object.assign({}, i5.data, e4.data) }) : e4, t4;
        }, {}), Object.keys(r3).map(function(t4) {
          return r3[t4];
        })));
        return a2.orderedModifiers = c3.filter(function(t4) {
          return t4.enabled;
        }), a2.orderedModifiers.forEach(function(t4) {
          var e4 = t4.name, i5 = t4.options, s3 = i5 === void 0 ? {} : i5, n5 = t4.effect;
          if (typeof n5 == "function") {
            var o3 = n5({ state: a2, name: e4, instance: d2, options: s3 });
            l2.push(o3 || function() {
            });
          }
        }), d2.update();
      }, forceUpdate: function() {
        if (!c2) {
          var t4 = a2.elements, e4 = t4.reference, i4 = t4.popper;
          if (ie(e4, i4)) {
            a2.rects = { reference: te(e4, vt(i4), a2.options.strategy === "fixed"), popper: ft(i4) }, a2.reset = false, a2.placement = a2.options.placement, a2.orderedModifiers.forEach(function(t5) {
              return a2.modifiersData[t5.name] = Object.assign({}, t5.data);
            });
            for (var s3 = 0; s3 < a2.orderedModifiers.length; s3++)
              if (a2.reset !== true) {
                var n4 = a2.orderedModifiers[s3], o3 = n4.fn, r3 = n4.options, l3 = r3 === void 0 ? {} : r3, h3 = n4.name;
                typeof o3 == "function" && (a2 = o3({ state: a2, options: l3, name: h3, instance: d2 }) || a2);
              } else
                a2.reset = false, s3 = -1;
          }
        }
      }, update: (n3 = function() {
        return new Promise(function(t4) {
          d2.forceUpdate(), t4(a2);
        });
      }, function() {
        return r2 || (r2 = new Promise(function(t4) {
          Promise.resolve().then(function() {
            r2 = void 0, t4(n3());
          });
        })), r2;
      }), destroy: function() {
        h2(), c2 = true;
      } };
      if (!ie(t3, e3))
        return d2;
      function h2() {
        l2.forEach(function(t4) {
          return t4();
        }), l2 = [];
      }
      return d2.setOptions(i3).then(function(t4) {
        !c2 && i3.onFirstUpdate && i3.onFirstUpdate(t4);
      }), d2;
    };
  }
  var ne = se(), oe = se({ defaultModifiers: [Nt, Zt, Ct, ct] }), re = se({ defaultModifiers: [Nt, Zt, Ct, ct, Gt, qt, Jt, kt, Qt] }), ae = Object.freeze({ __proto__: null, popperGenerator: se, detectOverflow: Kt, createPopperBase: ne, createPopper: re, createPopperLite: oe, top: Q, bottom: G, right: Z, left: J, auto: "auto", basePlacements: tt, start: "start", end: "end", clippingParents: "clippingParents", viewport: "viewport", popper: "popper", reference: "reference", variationPlacements: et, placements: it, beforeRead: "beforeRead", read: "read", afterRead: "afterRead", beforeMain: "beforeMain", main: "main", afterMain: "afterMain", beforeWrite: "beforeWrite", write: "write", afterWrite: "afterWrite", modifierPhases: st, applyStyles: ct, arrow: kt, computeStyles: Ct, eventListeners: Nt, flip: qt, hide: Qt, offset: Gt, popperOffsets: Zt, preventOverflow: Jt });
  const le = new RegExp("ArrowUp|ArrowDown|Escape"), ce = g() ? "top-end" : "top-start", de = g() ? "top-start" : "top-end", he = g() ? "bottom-end" : "bottom-start", fe = g() ? "bottom-start" : "bottom-end", ue = g() ? "left-start" : "right-start", pe = g() ? "right-start" : "left-start", ge = { offset: [0, 2], boundary: "clippingParents", reference: "toggle", display: "dynamic", popperConfig: null }, me = { offset: "(array|string|function)", boundary: "(string|element)", reference: "(string|element|object)", display: "string", popperConfig: "(null|object|function)" };
  class _e extends j {
    constructor(t2, e2) {
      super(t2), this._popper = null, this._config = this._getConfig(e2), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners();
    }
    static get Default() {
      return ge;
    }
    static get DefaultType() {
      return me;
    }
    static get DATA_KEY() {
      return "bs.dropdown";
    }
    toggle() {
      if (this._element.disabled || this._element.classList.contains("disabled"))
        return;
      const t2 = this._element.classList.contains("show");
      _e.clearMenus(), t2 || this.show();
    }
    show() {
      if (this._element.disabled || this._element.classList.contains("disabled") || this._menu.classList.contains("show"))
        return;
      const t2 = _e.getParentFromElement(this._element), e2 = { relatedTarget: this._element };
      if (!N.trigger(this._element, "show.bs.dropdown", e2).defaultPrevented) {
        if (this._inNavbar)
          B.setDataAttribute(this._menu, "popper", "none");
        else {
          if (ae === void 0)
            throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
          let e3 = this._element;
          this._config.reference === "parent" ? e3 = t2 : r(this._config.reference) ? (e3 = this._config.reference, this._config.reference.jquery !== void 0 && (e3 = this._config.reference[0])) : typeof this._config.reference == "object" && (e3 = this._config.reference);
          const i2 = this._getPopperConfig(), s2 = i2.modifiers.find((t3) => t3.name === "applyStyles" && t3.enabled === false);
          this._popper = re(e3, this._menu, i2), s2 && B.setDataAttribute(this._menu, "popper", "static");
        }
        "ontouchstart" in document.documentElement && !t2.closest(".navbar-nav") && [].concat(...document.body.children).forEach((t3) => N.on(t3, "mouseover", null, function() {
        })), this._element.focus(), this._element.setAttribute("aria-expanded", true), this._menu.classList.toggle("show"), this._element.classList.toggle("show"), N.trigger(this._element, "shown.bs.dropdown", e2);
      }
    }
    hide() {
      if (this._element.disabled || this._element.classList.contains("disabled") || !this._menu.classList.contains("show"))
        return;
      const t2 = { relatedTarget: this._element };
      N.trigger(this._element, "hide.bs.dropdown", t2).defaultPrevented || (this._popper && this._popper.destroy(), this._menu.classList.toggle("show"), this._element.classList.toggle("show"), B.removeDataAttribute(this._menu, "popper"), N.trigger(this._element, "hidden.bs.dropdown", t2));
    }
    dispose() {
      N.off(this._element, ".bs.dropdown"), this._menu = null, this._popper && (this._popper.destroy(), this._popper = null), super.dispose();
    }
    update() {
      this._inNavbar = this._detectNavbar(), this._popper && this._popper.update();
    }
    _addEventListeners() {
      N.on(this._element, "click.bs.dropdown", (t2) => {
        t2.preventDefault(), this.toggle();
      });
    }
    _getConfig(t2) {
      if (t2 = __spreadValues(__spreadValues(__spreadValues({}, this.constructor.Default), B.getDataAttributes(this._element)), t2), l("dropdown", t2, this.constructor.DefaultType), typeof t2.reference == "object" && !r(t2.reference) && typeof t2.reference.getBoundingClientRect != "function")
        throw new TypeError("dropdown".toUpperCase() + ': Option "reference" provided type "object" without a required "getBoundingClientRect" method.');
      return t2;
    }
    _getMenuElement() {
      return H.next(this._element, ".dropdown-menu")[0];
    }
    _getPlacement() {
      const t2 = this._element.parentNode;
      if (t2.classList.contains("dropend"))
        return ue;
      if (t2.classList.contains("dropstart"))
        return pe;
      const e2 = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
      return t2.classList.contains("dropup") ? e2 ? de : ce : e2 ? fe : he;
    }
    _detectNavbar() {
      return this._element.closest(".navbar") !== null;
    }
    _getOffset() {
      const { offset: t2 } = this._config;
      return typeof t2 == "string" ? t2.split(",").map((t3) => Number.parseInt(t3, 10)) : typeof t2 == "function" ? (e2) => t2(e2, this._element) : t2;
    }
    _getPopperConfig() {
      const t2 = { placement: this._getPlacement(), modifiers: [{ name: "preventOverflow", options: { boundary: this._config.boundary } }, { name: "offset", options: { offset: this._getOffset() } }] };
      return this._config.display === "static" && (t2.modifiers = [{ name: "applyStyles", enabled: false }]), __spreadValues(__spreadValues({}, t2), typeof this._config.popperConfig == "function" ? this._config.popperConfig(t2) : this._config.popperConfig);
    }
    static dropdownInterface(t2, e2) {
      let i2 = b.get(t2, "bs.dropdown");
      if (i2 || (i2 = new _e(t2, typeof e2 == "object" ? e2 : null)), typeof e2 == "string") {
        if (i2[e2] === void 0)
          throw new TypeError(`No method named "${e2}"`);
        i2[e2]();
      }
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        _e.dropdownInterface(this, t2);
      });
    }
    static clearMenus(t2) {
      if (t2) {
        if (t2.button === 2 || t2.type === "keyup" && t2.key !== "Tab")
          return;
        if (/input|select|textarea|form/i.test(t2.target.tagName))
          return;
      }
      const e2 = H.find('[data-bs-toggle="dropdown"]');
      for (let i2 = 0, s2 = e2.length; i2 < s2; i2++) {
        const s3 = b.get(e2[i2], "bs.dropdown"), n2 = { relatedTarget: e2[i2] };
        if (t2 && t2.type === "click" && (n2.clickEvent = t2), !s3)
          continue;
        const o2 = s3._menu;
        if (e2[i2].classList.contains("show")) {
          if (t2) {
            if ([s3._element].some((e3) => t2.composedPath().includes(e3)))
              continue;
            if (t2.type === "keyup" && t2.key === "Tab" && o2.contains(t2.target))
              continue;
          }
          N.trigger(e2[i2], "hide.bs.dropdown", n2).defaultPrevented || ("ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((t3) => N.off(t3, "mouseover", null, function() {
          })), e2[i2].setAttribute("aria-expanded", "false"), s3._popper && s3._popper.destroy(), o2.classList.remove("show"), e2[i2].classList.remove("show"), B.removeDataAttribute(o2, "popper"), N.trigger(e2[i2], "hidden.bs.dropdown", n2));
        }
      }
    }
    static getParentFromElement(t2) {
      return s(t2) || t2.parentNode;
    }
    static dataApiKeydownHandler(t2) {
      if (/input|textarea/i.test(t2.target.tagName) ? t2.key === "Space" || t2.key !== "Escape" && (t2.key !== "ArrowDown" && t2.key !== "ArrowUp" || t2.target.closest(".dropdown-menu")) : !le.test(t2.key))
        return;
      if (t2.preventDefault(), t2.stopPropagation(), this.disabled || this.classList.contains("disabled"))
        return;
      const e2 = _e.getParentFromElement(this), i2 = this.classList.contains("show");
      if (t2.key === "Escape")
        return (this.matches('[data-bs-toggle="dropdown"]') ? this : H.prev(this, '[data-bs-toggle="dropdown"]')[0]).focus(), void _e.clearMenus();
      if (!i2 && (t2.key === "ArrowUp" || t2.key === "ArrowDown"))
        return void (this.matches('[data-bs-toggle="dropdown"]') ? this : H.prev(this, '[data-bs-toggle="dropdown"]')[0]).click();
      if (!i2 || t2.key === "Space")
        return void _e.clearMenus();
      const s2 = H.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", e2).filter(c);
      if (!s2.length)
        return;
      let n2 = s2.indexOf(t2.target);
      t2.key === "ArrowUp" && n2 > 0 && n2--, t2.key === "ArrowDown" && n2 < s2.length - 1 && n2++, n2 = n2 === -1 ? 0 : n2, s2[n2].focus();
    }
  }
  N.on(document, "keydown.bs.dropdown.data-api", '[data-bs-toggle="dropdown"]', _e.dataApiKeydownHandler), N.on(document, "keydown.bs.dropdown.data-api", ".dropdown-menu", _e.dataApiKeydownHandler), N.on(document, "click.bs.dropdown.data-api", _e.clearMenus), N.on(document, "keyup.bs.dropdown.data-api", _e.clearMenus), N.on(document, "click.bs.dropdown.data-api", '[data-bs-toggle="dropdown"]', function(t2) {
    t2.preventDefault(), _e.dropdownInterface(this);
  }), m("dropdown", _e);
  const be = { backdrop: true, keyboard: true, focus: true }, ve = { backdrop: "(boolean|string)", keyboard: "boolean", focus: "boolean" };
  class ye extends j {
    constructor(t2, e2) {
      super(t2), this._config = this._getConfig(e2), this._dialog = H.findOne(".modal-dialog", this._element), this._backdrop = null, this._isShown = false, this._isBodyOverflowing = false, this._ignoreBackdropClick = false, this._isTransitioning = false, this._scrollbarWidth = 0;
    }
    static get Default() {
      return be;
    }
    static get DATA_KEY() {
      return "bs.modal";
    }
    toggle(t2) {
      return this._isShown ? this.hide() : this.show(t2);
    }
    show(t2) {
      if (this._isShown || this._isTransitioning)
        return;
      this._isAnimated() && (this._isTransitioning = true);
      const e2 = N.trigger(this._element, "show.bs.modal", { relatedTarget: t2 });
      this._isShown || e2.defaultPrevented || (this._isShown = true, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), N.on(this._element, "click.dismiss.bs.modal", '[data-bs-dismiss="modal"]', (t3) => this.hide(t3)), N.on(this._dialog, "mousedown.dismiss.bs.modal", () => {
        N.one(this._element, "mouseup.dismiss.bs.modal", (t3) => {
          t3.target === this._element && (this._ignoreBackdropClick = true);
        });
      }), this._showBackdrop(() => this._showElement(t2)));
    }
    hide(t2) {
      if (t2 && t2.preventDefault(), !this._isShown || this._isTransitioning)
        return;
      if (N.trigger(this._element, "hide.bs.modal").defaultPrevented)
        return;
      this._isShown = false;
      const e2 = this._isAnimated();
      if (e2 && (this._isTransitioning = true), this._setEscapeEvent(), this._setResizeEvent(), N.off(document, "focusin.bs.modal"), this._element.classList.remove("show"), N.off(this._element, "click.dismiss.bs.modal"), N.off(this._dialog, "mousedown.dismiss.bs.modal"), e2) {
        const t3 = n(this._element);
        N.one(this._element, "transitionend", (t4) => this._hideModal(t4)), a(this._element, t3);
      } else
        this._hideModal();
    }
    dispose() {
      [window, this._element, this._dialog].forEach((t2) => N.off(t2, ".bs.modal")), super.dispose(), N.off(document, "focusin.bs.modal"), this._config = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null;
    }
    handleUpdate() {
      this._adjustDialog();
    }
    _getConfig(t2) {
      return t2 = __spreadValues(__spreadValues({}, be), t2), l("modal", t2, ve), t2;
    }
    _showElement(t2) {
      const e2 = this._isAnimated(), i2 = H.findOne(".modal-body", this._dialog);
      this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", true), this._element.setAttribute("role", "dialog"), this._element.scrollTop = 0, i2 && (i2.scrollTop = 0), e2 && u(this._element), this._element.classList.add("show"), this._config.focus && this._enforceFocus();
      const s2 = () => {
        this._config.focus && this._element.focus(), this._isTransitioning = false, N.trigger(this._element, "shown.bs.modal", { relatedTarget: t2 });
      };
      if (e2) {
        const t3 = n(this._dialog);
        N.one(this._dialog, "transitionend", s2), a(this._dialog, t3);
      } else
        s2();
    }
    _enforceFocus() {
      N.off(document, "focusin.bs.modal"), N.on(document, "focusin.bs.modal", (t2) => {
        document === t2.target || this._element === t2.target || this._element.contains(t2.target) || this._element.focus();
      });
    }
    _setEscapeEvent() {
      this._isShown ? N.on(this._element, "keydown.dismiss.bs.modal", (t2) => {
        this._config.keyboard && t2.key === "Escape" ? (t2.preventDefault(), this.hide()) : this._config.keyboard || t2.key !== "Escape" || this._triggerBackdropTransition();
      }) : N.off(this._element, "keydown.dismiss.bs.modal");
    }
    _setResizeEvent() {
      this._isShown ? N.on(window, "resize.bs.modal", () => this._adjustDialog()) : N.off(window, "resize.bs.modal");
    }
    _hideModal() {
      this._element.style.display = "none", this._element.setAttribute("aria-hidden", true), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = false, this._showBackdrop(() => {
        document.body.classList.remove("modal-open"), this._resetAdjustments(), this._resetScrollbar(), N.trigger(this._element, "hidden.bs.modal");
      });
    }
    _removeBackdrop() {
      this._backdrop.parentNode.removeChild(this._backdrop), this._backdrop = null;
    }
    _showBackdrop(t2) {
      const e2 = this._isAnimated();
      if (this._isShown && this._config.backdrop) {
        if (this._backdrop = document.createElement("div"), this._backdrop.className = "modal-backdrop", e2 && this._backdrop.classList.add("fade"), document.body.appendChild(this._backdrop), N.on(this._element, "click.dismiss.bs.modal", (t3) => {
          this._ignoreBackdropClick ? this._ignoreBackdropClick = false : t3.target === t3.currentTarget && (this._config.backdrop === "static" ? this._triggerBackdropTransition() : this.hide());
        }), e2 && u(this._backdrop), this._backdrop.classList.add("show"), !e2)
          return void t2();
        const i2 = n(this._backdrop);
        N.one(this._backdrop, "transitionend", t2), a(this._backdrop, i2);
      } else if (!this._isShown && this._backdrop) {
        this._backdrop.classList.remove("show");
        const i2 = () => {
          this._removeBackdrop(), t2();
        };
        if (e2) {
          const t3 = n(this._backdrop);
          N.one(this._backdrop, "transitionend", i2), a(this._backdrop, t3);
        } else
          i2();
      } else
        t2();
    }
    _isAnimated() {
      return this._element.classList.contains("fade");
    }
    _triggerBackdropTransition() {
      if (N.trigger(this._element, "hidePrevented.bs.modal").defaultPrevented)
        return;
      const t2 = this._element.scrollHeight > document.documentElement.clientHeight;
      t2 || (this._element.style.overflowY = "hidden"), this._element.classList.add("modal-static");
      const e2 = n(this._dialog);
      N.off(this._element, "transitionend"), N.one(this._element, "transitionend", () => {
        this._element.classList.remove("modal-static"), t2 || (N.one(this._element, "transitionend", () => {
          this._element.style.overflowY = "";
        }), a(this._element, e2));
      }), a(this._element, e2), this._element.focus();
    }
    _adjustDialog() {
      const t2 = this._element.scrollHeight > document.documentElement.clientHeight;
      (!this._isBodyOverflowing && t2 && !g() || this._isBodyOverflowing && !t2 && g()) && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), (this._isBodyOverflowing && !t2 && !g() || !this._isBodyOverflowing && t2 && g()) && (this._element.style.paddingRight = this._scrollbarWidth + "px");
    }
    _resetAdjustments() {
      this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
    }
    _checkScrollbar() {
      const t2 = document.body.getBoundingClientRect();
      this._isBodyOverflowing = Math.round(t2.left + t2.right) < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth();
    }
    _setScrollbar() {
      this._isBodyOverflowing && (this._setElementAttributes(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", "paddingRight", (t2) => t2 + this._scrollbarWidth), this._setElementAttributes(".sticky-top", "marginRight", (t2) => t2 - this._scrollbarWidth), this._setElementAttributes("body", "paddingRight", (t2) => t2 + this._scrollbarWidth)), document.body.classList.add("modal-open");
    }
    _setElementAttributes(t2, e2, i2) {
      H.find(t2).forEach((t3) => {
        if (t3 !== document.body && window.innerWidth > t3.clientWidth + this._scrollbarWidth)
          return;
        const s2 = t3.style[e2], n2 = window.getComputedStyle(t3)[e2];
        B.setDataAttribute(t3, e2, s2), t3.style[e2] = i2(Number.parseFloat(n2)) + "px";
      });
    }
    _resetScrollbar() {
      this._resetElementAttributes(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", "paddingRight"), this._resetElementAttributes(".sticky-top", "marginRight"), this._resetElementAttributes("body", "paddingRight");
    }
    _resetElementAttributes(t2, e2) {
      H.find(t2).forEach((t3) => {
        const i2 = B.getDataAttribute(t3, e2);
        i2 === void 0 && t3 === document.body ? t3.style[e2] = "" : (B.removeDataAttribute(t3, e2), t3.style[e2] = i2);
      });
    }
    _getScrollbarWidth() {
      const t2 = document.createElement("div");
      t2.className = "modal-scrollbar-measure", document.body.appendChild(t2);
      const e2 = t2.getBoundingClientRect().width - t2.clientWidth;
      return document.body.removeChild(t2), e2;
    }
    static jQueryInterface(t2, e2) {
      return this.each(function() {
        let i2 = b.get(this, "bs.modal");
        const s2 = __spreadValues(__spreadValues(__spreadValues({}, be), B.getDataAttributes(this)), typeof t2 == "object" && t2 ? t2 : {});
        if (i2 || (i2 = new ye(this, s2)), typeof t2 == "string") {
          if (i2[t2] === void 0)
            throw new TypeError(`No method named "${t2}"`);
          i2[t2](e2);
        }
      });
    }
  }
  N.on(document, "click.bs.modal.data-api", '[data-bs-toggle="modal"]', function(t2) {
    const e2 = s(this);
    this.tagName !== "A" && this.tagName !== "AREA" || t2.preventDefault(), N.one(e2, "show.bs.modal", (t3) => {
      t3.defaultPrevented || N.one(e2, "hidden.bs.modal", () => {
        c(this) && this.focus();
      });
    });
    let i2 = b.get(e2, "bs.modal");
    if (!i2) {
      const t3 = __spreadValues(__spreadValues({}, B.getDataAttributes(e2)), B.getDataAttributes(this));
      i2 = new ye(e2, t3);
    }
    i2.toggle(this);
  }), m("modal", ye);
  const we = () => {
    const t2 = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - t2);
  }, Ee = (t2, e2, i2) => {
    const s2 = we();
    H.find(t2).forEach((t3) => {
      if (t3 !== document.body && window.innerWidth > t3.clientWidth + s2)
        return;
      const n2 = t3.style[e2], o2 = window.getComputedStyle(t3)[e2];
      B.setDataAttribute(t3, e2, n2), t3.style[e2] = i2(Number.parseFloat(o2)) + "px";
    });
  }, Te = (t2, e2) => {
    H.find(t2).forEach((t3) => {
      const i2 = B.getDataAttribute(t3, e2);
      i2 === void 0 && t3 === document.body ? t3.style.removeProperty(e2) : (B.removeDataAttribute(t3, e2), t3.style[e2] = i2);
    });
  }, Ae = { backdrop: true, keyboard: true, scroll: false }, Le = { backdrop: "boolean", keyboard: "boolean", scroll: "boolean" };
  class Oe extends j {
    constructor(t2, e2) {
      super(t2), this._config = this._getConfig(e2), this._isShown = false, this._addEventListeners();
    }
    static get Default() {
      return Ae;
    }
    static get DATA_KEY() {
      return "bs.offcanvas";
    }
    toggle(t2) {
      return this._isShown ? this.hide() : this.show(t2);
    }
    show(t2) {
      this._isShown || N.trigger(this._element, "show.bs.offcanvas", { relatedTarget: t2 }).defaultPrevented || (this._isShown = true, this._element.style.visibility = "visible", this._config.backdrop && document.body.classList.add("offcanvas-backdrop"), this._config.scroll || ((t3 = we()) => {
        document.body.style.overflow = "hidden", Ee(".fixed-top, .fixed-bottom, .is-fixed", "paddingRight", (e2) => e2 + t3), Ee(".sticky-top", "marginRight", (e2) => e2 - t3), Ee("body", "paddingRight", (e2) => e2 + t3);
      })(), this._element.classList.add("offcanvas-toggling"), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", true), this._element.setAttribute("role", "dialog"), this._element.classList.add("show"), setTimeout(() => {
        this._element.classList.remove("offcanvas-toggling"), N.trigger(this._element, "shown.bs.offcanvas", { relatedTarget: t2 }), this._enforceFocusOnElement(this._element);
      }, n(this._element)));
    }
    hide() {
      this._isShown && (N.trigger(this._element, "hide.bs.offcanvas").defaultPrevented || (this._element.classList.add("offcanvas-toggling"), N.off(document, "focusin.bs.offcanvas"), this._element.blur(), this._isShown = false, this._element.classList.remove("show"), setTimeout(() => {
        this._element.setAttribute("aria-hidden", true), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._element.style.visibility = "hidden", this._config.backdrop && document.body.classList.remove("offcanvas-backdrop"), this._config.scroll || (document.body.style.overflow = "auto", Te(".fixed-top, .fixed-bottom, .is-fixed", "paddingRight"), Te(".sticky-top", "marginRight"), Te("body", "paddingRight")), N.trigger(this._element, "hidden.bs.offcanvas"), this._element.classList.remove("offcanvas-toggling");
      }, n(this._element))));
    }
    _getConfig(t2) {
      return t2 = __spreadValues(__spreadValues(__spreadValues({}, Ae), B.getDataAttributes(this._element)), typeof t2 == "object" ? t2 : {}), l("offcanvas", t2, Le), t2;
    }
    _enforceFocusOnElement(t2) {
      N.off(document, "focusin.bs.offcanvas"), N.on(document, "focusin.bs.offcanvas", (e2) => {
        document === e2.target || t2 === e2.target || t2.contains(e2.target) || t2.focus();
      }), t2.focus();
    }
    _addEventListeners() {
      N.on(this._element, "click.dismiss.bs.offcanvas", '[data-bs-dismiss="offcanvas"]', () => this.hide()), N.on(document, "keydown", (t2) => {
        this._config.keyboard && t2.key === "Escape" && this.hide();
      }), N.on(document, "click.bs.offcanvas.data-api", (t2) => {
        const e2 = H.findOne(i(t2.target));
        this._element.contains(t2.target) || e2 === this._element || this.hide();
      });
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        const e2 = b.get(this, "bs.offcanvas") || new Oe(this, typeof t2 == "object" ? t2 : {});
        if (typeof t2 == "string") {
          if (e2[t2] === void 0 || t2.startsWith("_") || t2 === "constructor")
            throw new TypeError(`No method named "${t2}"`);
          e2[t2](this);
        }
      });
    }
  }
  N.on(document, "click.bs.offcanvas.data-api", '[data-bs-toggle="offcanvas"]', function(t2) {
    const e2 = s(this);
    if (["A", "AREA"].includes(this.tagName) && t2.preventDefault(), d(this))
      return;
    N.one(e2, "hidden.bs.offcanvas", () => {
      c(this) && this.focus();
    });
    const i2 = H.findOne(".offcanvas.show, .offcanvas-toggling");
    i2 && i2 !== e2 || (b.get(e2, "bs.offcanvas") || new Oe(e2)).toggle(this);
  }), N.on(window, "load.bs.offcanvas.data-api", () => {
    H.find(".offcanvas.show").forEach((t2) => (b.get(t2, "bs.offcanvas") || new Oe(t2)).show());
  }), m("offcanvas", Oe);
  const ke = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]), De = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i, xe = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i, Ce = (t2, e2) => {
    const i2 = t2.nodeName.toLowerCase();
    if (e2.includes(i2))
      return !ke.has(i2) || Boolean(De.test(t2.nodeValue) || xe.test(t2.nodeValue));
    const s2 = e2.filter((t3) => t3 instanceof RegExp);
    for (let t3 = 0, e3 = s2.length; t3 < e3; t3++)
      if (s2[t3].test(i2))
        return true;
    return false;
  };
  function Se(t2, e2, i2) {
    if (!t2.length)
      return t2;
    if (i2 && typeof i2 == "function")
      return i2(t2);
    const s2 = new window.DOMParser().parseFromString(t2, "text/html"), n2 = Object.keys(e2), o2 = [].concat(...s2.body.querySelectorAll("*"));
    for (let t3 = 0, i3 = o2.length; t3 < i3; t3++) {
      const i4 = o2[t3], s3 = i4.nodeName.toLowerCase();
      if (!n2.includes(s3)) {
        i4.parentNode.removeChild(i4);
        continue;
      }
      const r2 = [].concat(...i4.attributes), a2 = [].concat(e2["*"] || [], e2[s3] || []);
      r2.forEach((t4) => {
        Ce(t4, a2) || i4.removeAttribute(t4.nodeName);
      });
    }
    return s2.body.innerHTML;
  }
  const Ne = new RegExp("(^|\\s)bs-tooltip\\S+", "g"), je = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]), Pe = { animation: "boolean", template: "string", title: "(string|element|function)", trigger: "string", delay: "(number|object)", html: "boolean", selector: "(string|boolean)", placement: "(string|function)", offset: "(array|string|function)", container: "(string|element|boolean)", fallbackPlacements: "array", boundary: "(string|element)", customClass: "(string|function)", sanitize: "boolean", sanitizeFn: "(null|function)", allowList: "object", popperConfig: "(null|object|function)" }, Ie = { AUTO: "auto", TOP: "top", RIGHT: g() ? "left" : "right", BOTTOM: "bottom", LEFT: g() ? "right" : "left" }, Me = { animation: true, template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: false, selector: false, placement: "top", offset: [0, 0], container: false, fallbackPlacements: ["top", "right", "bottom", "left"], boundary: "clippingParents", customClass: "", sanitize: true, sanitizeFn: null, allowList: { "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i], a: ["target", "href", "title", "rel"], area: [], b: [], br: [], col: [], code: [], div: [], em: [], hr: [], h1: [], h2: [], h3: [], h4: [], h5: [], h6: [], i: [], img: ["src", "srcset", "alt", "title", "width", "height"], li: [], ol: [], p: [], pre: [], s: [], small: [], span: [], sub: [], sup: [], strong: [], u: [], ul: [] }, popperConfig: null }, Re = { HIDE: "hide.bs.tooltip", HIDDEN: "hidden.bs.tooltip", SHOW: "show.bs.tooltip", SHOWN: "shown.bs.tooltip", INSERTED: "inserted.bs.tooltip", CLICK: "click.bs.tooltip", FOCUSIN: "focusin.bs.tooltip", FOCUSOUT: "focusout.bs.tooltip", MOUSEENTER: "mouseenter.bs.tooltip", MOUSELEAVE: "mouseleave.bs.tooltip" };
  class Be extends j {
    constructor(t2, e2) {
      if (ae === void 0)
        throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
      super(t2), this._isEnabled = true, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.config = this._getConfig(e2), this.tip = null, this._setListeners();
    }
    static get Default() {
      return Me;
    }
    static get NAME() {
      return "tooltip";
    }
    static get DATA_KEY() {
      return "bs.tooltip";
    }
    static get Event() {
      return Re;
    }
    static get EVENT_KEY() {
      return ".bs.tooltip";
    }
    static get DefaultType() {
      return Pe;
    }
    enable() {
      this._isEnabled = true;
    }
    disable() {
      this._isEnabled = false;
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
    toggle(t2) {
      if (this._isEnabled)
        if (t2) {
          const e2 = this._initializeOnDelegatedTarget(t2);
          e2._activeTrigger.click = !e2._activeTrigger.click, e2._isWithActiveTrigger() ? e2._enter(null, e2) : e2._leave(null, e2);
        } else {
          if (this.getTipElement().classList.contains("show"))
            return void this._leave(null, this);
          this._enter(null, this);
        }
    }
    dispose() {
      clearTimeout(this._timeout), N.off(this._element, this.constructor.EVENT_KEY), N.off(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this.tip && this.tip.parentNode && this.tip.parentNode.removeChild(this.tip), this._isEnabled = null, this._timeout = null, this._hoverState = null, this._activeTrigger = null, this._popper && this._popper.destroy(), this._popper = null, this.config = null, this.tip = null, super.dispose();
    }
    show() {
      if (this._element.style.display === "none")
        throw new Error("Please use show on visible elements");
      if (!this.isWithContent() || !this._isEnabled)
        return;
      const e2 = N.trigger(this._element, this.constructor.Event.SHOW), i2 = h(this._element), s2 = i2 === null ? this._element.ownerDocument.documentElement.contains(this._element) : i2.contains(this._element);
      if (e2.defaultPrevented || !s2)
        return;
      const o2 = this.getTipElement(), r2 = t(this.constructor.NAME);
      o2.setAttribute("id", r2), this._element.setAttribute("aria-describedby", r2), this.setContent(), this.config.animation && o2.classList.add("fade");
      const l2 = typeof this.config.placement == "function" ? this.config.placement.call(this, o2, this._element) : this.config.placement, c2 = this._getAttachment(l2);
      this._addAttachmentClass(c2);
      const d2 = this._getContainer();
      b.set(o2, this.constructor.DATA_KEY, this), this._element.ownerDocument.documentElement.contains(this.tip) || (d2.appendChild(o2), N.trigger(this._element, this.constructor.Event.INSERTED)), this._popper ? this._popper.update() : this._popper = re(this._element, o2, this._getPopperConfig(c2)), o2.classList.add("show");
      const f2 = typeof this.config.customClass == "function" ? this.config.customClass() : this.config.customClass;
      f2 && o2.classList.add(...f2.split(" ")), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((t2) => {
        N.on(t2, "mouseover", function() {
        });
      });
      const u2 = () => {
        const t2 = this._hoverState;
        this._hoverState = null, N.trigger(this._element, this.constructor.Event.SHOWN), t2 === "out" && this._leave(null, this);
      };
      if (this.tip.classList.contains("fade")) {
        const t2 = n(this.tip);
        N.one(this.tip, "transitionend", u2), a(this.tip, t2);
      } else
        u2();
    }
    hide() {
      if (!this._popper)
        return;
      const t2 = this.getTipElement(), e2 = () => {
        this._isWithActiveTrigger() || (this._hoverState !== "show" && t2.parentNode && t2.parentNode.removeChild(t2), this._cleanTipClass(), this._element.removeAttribute("aria-describedby"), N.trigger(this._element, this.constructor.Event.HIDDEN), this._popper && (this._popper.destroy(), this._popper = null));
      };
      if (!N.trigger(this._element, this.constructor.Event.HIDE).defaultPrevented) {
        if (t2.classList.remove("show"), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((t3) => N.off(t3, "mouseover", f)), this._activeTrigger.click = false, this._activeTrigger.focus = false, this._activeTrigger.hover = false, this.tip.classList.contains("fade")) {
          const i2 = n(t2);
          N.one(t2, "transitionend", e2), a(t2, i2);
        } else
          e2();
        this._hoverState = "";
      }
    }
    update() {
      this._popper !== null && this._popper.update();
    }
    isWithContent() {
      return Boolean(this.getTitle());
    }
    getTipElement() {
      if (this.tip)
        return this.tip;
      const t2 = document.createElement("div");
      return t2.innerHTML = this.config.template, this.tip = t2.children[0], this.tip;
    }
    setContent() {
      const t2 = this.getTipElement();
      this.setElementContent(H.findOne(".tooltip-inner", t2), this.getTitle()), t2.classList.remove("fade", "show");
    }
    setElementContent(t2, e2) {
      if (t2 !== null)
        return typeof e2 == "object" && r(e2) ? (e2.jquery && (e2 = e2[0]), void (this.config.html ? e2.parentNode !== t2 && (t2.innerHTML = "", t2.appendChild(e2)) : t2.textContent = e2.textContent)) : void (this.config.html ? (this.config.sanitize && (e2 = Se(e2, this.config.allowList, this.config.sanitizeFn)), t2.innerHTML = e2) : t2.textContent = e2);
    }
    getTitle() {
      let t2 = this._element.getAttribute("data-bs-original-title");
      return t2 || (t2 = typeof this.config.title == "function" ? this.config.title.call(this._element) : this.config.title), t2;
    }
    updateAttachment(t2) {
      return t2 === "right" ? "end" : t2 === "left" ? "start" : t2;
    }
    _initializeOnDelegatedTarget(t2, e2) {
      const i2 = this.constructor.DATA_KEY;
      return (e2 = e2 || b.get(t2.delegateTarget, i2)) || (e2 = new this.constructor(t2.delegateTarget, this._getDelegateConfig()), b.set(t2.delegateTarget, i2, e2)), e2;
    }
    _getOffset() {
      const { offset: t2 } = this.config;
      return typeof t2 == "string" ? t2.split(",").map((t3) => Number.parseInt(t3, 10)) : typeof t2 == "function" ? (e2) => t2(e2, this._element) : t2;
    }
    _getPopperConfig(t2) {
      const e2 = { placement: t2, modifiers: [{ name: "flip", options: { altBoundary: true, fallbackPlacements: this.config.fallbackPlacements } }, { name: "offset", options: { offset: this._getOffset() } }, { name: "preventOverflow", options: { boundary: this.config.boundary } }, { name: "arrow", options: { element: `.${this.constructor.NAME}-arrow` } }, { name: "onChange", enabled: true, phase: "afterWrite", fn: (t3) => this._handlePopperPlacementChange(t3) }], onFirstUpdate: (t3) => {
        t3.options.placement !== t3.placement && this._handlePopperPlacementChange(t3);
      } };
      return __spreadValues(__spreadValues({}, e2), typeof this.config.popperConfig == "function" ? this.config.popperConfig(e2) : this.config.popperConfig);
    }
    _addAttachmentClass(t2) {
      this.getTipElement().classList.add("bs-tooltip-" + this.updateAttachment(t2));
    }
    _getContainer() {
      return this.config.container === false ? document.body : r(this.config.container) ? this.config.container : H.findOne(this.config.container);
    }
    _getAttachment(t2) {
      return Ie[t2.toUpperCase()];
    }
    _setListeners() {
      this.config.trigger.split(" ").forEach((t2) => {
        if (t2 === "click")
          N.on(this._element, this.constructor.Event.CLICK, this.config.selector, (t3) => this.toggle(t3));
        else if (t2 !== "manual") {
          const e2 = t2 === "hover" ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN, i2 = t2 === "hover" ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          N.on(this._element, e2, this.config.selector, (t3) => this._enter(t3)), N.on(this._element, i2, this.config.selector, (t3) => this._leave(t3));
        }
      }), this._hideModalHandler = () => {
        this._element && this.hide();
      }, N.on(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this.config.selector ? this.config = __spreadProps(__spreadValues({}, this.config), { trigger: "manual", selector: "" }) : this._fixTitle();
    }
    _fixTitle() {
      const t2 = this._element.getAttribute("title"), e2 = typeof this._element.getAttribute("data-bs-original-title");
      (t2 || e2 !== "string") && (this._element.setAttribute("data-bs-original-title", t2 || ""), !t2 || this._element.getAttribute("aria-label") || this._element.textContent || this._element.setAttribute("aria-label", t2), this._element.setAttribute("title", ""));
    }
    _enter(t2, e2) {
      e2 = this._initializeOnDelegatedTarget(t2, e2), t2 && (e2._activeTrigger[t2.type === "focusin" ? "focus" : "hover"] = true), e2.getTipElement().classList.contains("show") || e2._hoverState === "show" ? e2._hoverState = "show" : (clearTimeout(e2._timeout), e2._hoverState = "show", e2.config.delay && e2.config.delay.show ? e2._timeout = setTimeout(() => {
        e2._hoverState === "show" && e2.show();
      }, e2.config.delay.show) : e2.show());
    }
    _leave(t2, e2) {
      e2 = this._initializeOnDelegatedTarget(t2, e2), t2 && (e2._activeTrigger[t2.type === "focusout" ? "focus" : "hover"] = e2._element.contains(t2.relatedTarget)), e2._isWithActiveTrigger() || (clearTimeout(e2._timeout), e2._hoverState = "out", e2.config.delay && e2.config.delay.hide ? e2._timeout = setTimeout(() => {
        e2._hoverState === "out" && e2.hide();
      }, e2.config.delay.hide) : e2.hide());
    }
    _isWithActiveTrigger() {
      for (const t2 in this._activeTrigger)
        if (this._activeTrigger[t2])
          return true;
      return false;
    }
    _getConfig(t2) {
      const e2 = B.getDataAttributes(this._element);
      return Object.keys(e2).forEach((t3) => {
        je.has(t3) && delete e2[t3];
      }), t2 && typeof t2.container == "object" && t2.container.jquery && (t2.container = t2.container[0]), typeof (t2 = __spreadValues(__spreadValues(__spreadValues({}, this.constructor.Default), e2), typeof t2 == "object" && t2 ? t2 : {})).delay == "number" && (t2.delay = { show: t2.delay, hide: t2.delay }), typeof t2.title == "number" && (t2.title = t2.title.toString()), typeof t2.content == "number" && (t2.content = t2.content.toString()), l("tooltip", t2, this.constructor.DefaultType), t2.sanitize && (t2.template = Se(t2.template, t2.allowList, t2.sanitizeFn)), t2;
    }
    _getDelegateConfig() {
      const t2 = {};
      if (this.config)
        for (const e2 in this.config)
          this.constructor.Default[e2] !== this.config[e2] && (t2[e2] = this.config[e2]);
      return t2;
    }
    _cleanTipClass() {
      const t2 = this.getTipElement(), e2 = t2.getAttribute("class").match(Ne);
      e2 !== null && e2.length > 0 && e2.map((t3) => t3.trim()).forEach((e3) => t2.classList.remove(e3));
    }
    _handlePopperPlacementChange(t2) {
      const { state: e2 } = t2;
      e2 && (this.tip = e2.elements.popper, this._cleanTipClass(), this._addAttachmentClass(this._getAttachment(e2.placement)));
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        let e2 = b.get(this, "bs.tooltip");
        const i2 = typeof t2 == "object" && t2;
        if ((e2 || !/dispose|hide/.test(t2)) && (e2 || (e2 = new Be(this, i2)), typeof t2 == "string")) {
          if (e2[t2] === void 0)
            throw new TypeError(`No method named "${t2}"`);
          e2[t2]();
        }
      });
    }
  }
  m("tooltip", Be);
  const He = new RegExp("(^|\\s)bs-popover\\S+", "g"), We = __spreadProps(__spreadValues({}, Be.Default), { placement: "right", offset: [0, 8], trigger: "click", content: "", template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>' }), Ue = __spreadProps(__spreadValues({}, Be.DefaultType), { content: "(string|element|function)" }), $e = { HIDE: "hide.bs.popover", HIDDEN: "hidden.bs.popover", SHOW: "show.bs.popover", SHOWN: "shown.bs.popover", INSERTED: "inserted.bs.popover", CLICK: "click.bs.popover", FOCUSIN: "focusin.bs.popover", FOCUSOUT: "focusout.bs.popover", MOUSEENTER: "mouseenter.bs.popover", MOUSELEAVE: "mouseleave.bs.popover" };
  class Fe extends Be {
    static get Default() {
      return We;
    }
    static get NAME() {
      return "popover";
    }
    static get DATA_KEY() {
      return "bs.popover";
    }
    static get Event() {
      return $e;
    }
    static get EVENT_KEY() {
      return ".bs.popover";
    }
    static get DefaultType() {
      return Ue;
    }
    isWithContent() {
      return this.getTitle() || this._getContent();
    }
    setContent() {
      const t2 = this.getTipElement();
      this.setElementContent(H.findOne(".popover-header", t2), this.getTitle());
      let e2 = this._getContent();
      typeof e2 == "function" && (e2 = e2.call(this._element)), this.setElementContent(H.findOne(".popover-body", t2), e2), t2.classList.remove("fade", "show");
    }
    _addAttachmentClass(t2) {
      this.getTipElement().classList.add("bs-popover-" + this.updateAttachment(t2));
    }
    _getContent() {
      return this._element.getAttribute("data-bs-content") || this.config.content;
    }
    _cleanTipClass() {
      const t2 = this.getTipElement(), e2 = t2.getAttribute("class").match(He);
      e2 !== null && e2.length > 0 && e2.map((t3) => t3.trim()).forEach((e3) => t2.classList.remove(e3));
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        let e2 = b.get(this, "bs.popover");
        const i2 = typeof t2 == "object" ? t2 : null;
        if ((e2 || !/dispose|hide/.test(t2)) && (e2 || (e2 = new Fe(this, i2), b.set(this, "bs.popover", e2)), typeof t2 == "string")) {
          if (e2[t2] === void 0)
            throw new TypeError(`No method named "${t2}"`);
          e2[t2]();
        }
      });
    }
  }
  m("popover", Fe);
  const ze = { offset: 10, method: "auto", target: "" }, Ke = { offset: "number", method: "string", target: "(string|element)" };
  class Ye extends j {
    constructor(t2, e2) {
      super(t2), this._scrollElement = this._element.tagName === "BODY" ? window : this._element, this._config = this._getConfig(e2), this._selector = `${this._config.target} .nav-link, ${this._config.target} .list-group-item, ${this._config.target} .dropdown-item`, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, N.on(this._scrollElement, "scroll.bs.scrollspy", () => this._process()), this.refresh(), this._process();
    }
    static get Default() {
      return ze;
    }
    static get DATA_KEY() {
      return "bs.scrollspy";
    }
    refresh() {
      const t2 = this._scrollElement === this._scrollElement.window ? "offset" : "position", e2 = this._config.method === "auto" ? t2 : this._config.method, s2 = e2 === "position" ? this._getScrollTop() : 0;
      this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), H.find(this._selector).map((t3) => {
        const n2 = i(t3), o2 = n2 ? H.findOne(n2) : null;
        if (o2) {
          const t4 = o2.getBoundingClientRect();
          if (t4.width || t4.height)
            return [B[e2](o2).top + s2, n2];
        }
        return null;
      }).filter((t3) => t3).sort((t3, e3) => t3[0] - e3[0]).forEach((t3) => {
        this._offsets.push(t3[0]), this._targets.push(t3[1]);
      });
    }
    dispose() {
      super.dispose(), N.off(this._scrollElement, ".bs.scrollspy"), this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null;
    }
    _getConfig(e2) {
      if (typeof (e2 = __spreadValues(__spreadValues({}, ze), typeof e2 == "object" && e2 ? e2 : {})).target != "string" && r(e2.target)) {
        let { id: i2 } = e2.target;
        i2 || (i2 = t("scrollspy"), e2.target.id = i2), e2.target = "#" + i2;
      }
      return l("scrollspy", e2, Ke), e2;
    }
    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }
    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }
    _process() {
      const t2 = this._getScrollTop() + this._config.offset, e2 = this._getScrollHeight(), i2 = this._config.offset + e2 - this._getOffsetHeight();
      if (this._scrollHeight !== e2 && this.refresh(), t2 >= i2) {
        const t3 = this._targets[this._targets.length - 1];
        this._activeTarget !== t3 && this._activate(t3);
      } else {
        if (this._activeTarget && t2 < this._offsets[0] && this._offsets[0] > 0)
          return this._activeTarget = null, void this._clear();
        for (let e3 = this._offsets.length; e3--; )
          this._activeTarget !== this._targets[e3] && t2 >= this._offsets[e3] && (this._offsets[e3 + 1] === void 0 || t2 < this._offsets[e3 + 1]) && this._activate(this._targets[e3]);
      }
    }
    _activate(t2) {
      this._activeTarget = t2, this._clear();
      const e2 = this._selector.split(",").map((e3) => `${e3}[data-bs-target="${t2}"],${e3}[href="${t2}"]`), i2 = H.findOne(e2.join(","));
      i2.classList.contains("dropdown-item") ? (H.findOne(".dropdown-toggle", i2.closest(".dropdown")).classList.add("active"), i2.classList.add("active")) : (i2.classList.add("active"), H.parents(i2, ".nav, .list-group").forEach((t3) => {
        H.prev(t3, ".nav-link, .list-group-item").forEach((t4) => t4.classList.add("active")), H.prev(t3, ".nav-item").forEach((t4) => {
          H.children(t4, ".nav-link").forEach((t5) => t5.classList.add("active"));
        });
      })), N.trigger(this._scrollElement, "activate.bs.scrollspy", { relatedTarget: t2 });
    }
    _clear() {
      H.find(this._selector).filter((t2) => t2.classList.contains("active")).forEach((t2) => t2.classList.remove("active"));
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        let e2 = b.get(this, "bs.scrollspy");
        if (e2 || (e2 = new Ye(this, typeof t2 == "object" && t2)), typeof t2 == "string") {
          if (e2[t2] === void 0)
            throw new TypeError(`No method named "${t2}"`);
          e2[t2]();
        }
      });
    }
  }
  N.on(window, "load.bs.scrollspy.data-api", () => {
    H.find('[data-bs-spy="scroll"]').forEach((t2) => new Ye(t2, B.getDataAttributes(t2)));
  }), m("scrollspy", Ye);
  class qe extends j {
    static get DATA_KEY() {
      return "bs.tab";
    }
    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains("active") || d(this._element))
        return;
      let t2;
      const e2 = s(this._element), i2 = this._element.closest(".nav, .list-group");
      if (i2) {
        const e3 = i2.nodeName === "UL" || i2.nodeName === "OL" ? ":scope > li > .active" : ".active";
        t2 = H.find(e3, i2), t2 = t2[t2.length - 1];
      }
      const n2 = t2 ? N.trigger(t2, "hide.bs.tab", { relatedTarget: this._element }) : null;
      if (N.trigger(this._element, "show.bs.tab", { relatedTarget: t2 }).defaultPrevented || n2 !== null && n2.defaultPrevented)
        return;
      this._activate(this._element, i2);
      const o2 = () => {
        N.trigger(t2, "hidden.bs.tab", { relatedTarget: this._element }), N.trigger(this._element, "shown.bs.tab", { relatedTarget: t2 });
      };
      e2 ? this._activate(e2, e2.parentNode, o2) : o2();
    }
    _activate(t2, e2, i2) {
      const s2 = (!e2 || e2.nodeName !== "UL" && e2.nodeName !== "OL" ? H.children(e2, ".active") : H.find(":scope > li > .active", e2))[0], o2 = i2 && s2 && s2.classList.contains("fade"), r2 = () => this._transitionComplete(t2, s2, i2);
      if (s2 && o2) {
        const t3 = n(s2);
        s2.classList.remove("show"), N.one(s2, "transitionend", r2), a(s2, t3);
      } else
        r2();
    }
    _transitionComplete(t2, e2, i2) {
      if (e2) {
        e2.classList.remove("active");
        const t3 = H.findOne(":scope > .dropdown-menu .active", e2.parentNode);
        t3 && t3.classList.remove("active"), e2.getAttribute("role") === "tab" && e2.setAttribute("aria-selected", false);
      }
      t2.classList.add("active"), t2.getAttribute("role") === "tab" && t2.setAttribute("aria-selected", true), u(t2), t2.classList.contains("fade") && t2.classList.add("show"), t2.parentNode && t2.parentNode.classList.contains("dropdown-menu") && (t2.closest(".dropdown") && H.find(".dropdown-toggle").forEach((t3) => t3.classList.add("active")), t2.setAttribute("aria-expanded", true)), i2 && i2();
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        const e2 = b.get(this, "bs.tab") || new qe(this);
        if (typeof t2 == "string") {
          if (e2[t2] === void 0)
            throw new TypeError(`No method named "${t2}"`);
          e2[t2]();
        }
      });
    }
  }
  N.on(document, "click.bs.tab.data-api", '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]', function(t2) {
    t2.preventDefault(), (b.get(this, "bs.tab") || new qe(this)).show();
  }), m("tab", qe);
  const Ve = { animation: "boolean", autohide: "boolean", delay: "number" }, Xe = { animation: true, autohide: true, delay: 5e3 };
  class Qe extends j {
    constructor(t2, e2) {
      super(t2), this._config = this._getConfig(e2), this._timeout = null, this._setListeners();
    }
    static get DefaultType() {
      return Ve;
    }
    static get Default() {
      return Xe;
    }
    static get DATA_KEY() {
      return "bs.toast";
    }
    show() {
      if (N.trigger(this._element, "show.bs.toast").defaultPrevented)
        return;
      this._clearTimeout(), this._config.animation && this._element.classList.add("fade");
      const t2 = () => {
        this._element.classList.remove("showing"), this._element.classList.add("show"), N.trigger(this._element, "shown.bs.toast"), this._config.autohide && (this._timeout = setTimeout(() => {
          this.hide();
        }, this._config.delay));
      };
      if (this._element.classList.remove("hide"), u(this._element), this._element.classList.add("showing"), this._config.animation) {
        const e2 = n(this._element);
        N.one(this._element, "transitionend", t2), a(this._element, e2);
      } else
        t2();
    }
    hide() {
      if (!this._element.classList.contains("show"))
        return;
      if (N.trigger(this._element, "hide.bs.toast").defaultPrevented)
        return;
      const t2 = () => {
        this._element.classList.add("hide"), N.trigger(this._element, "hidden.bs.toast");
      };
      if (this._element.classList.remove("show"), this._config.animation) {
        const e2 = n(this._element);
        N.one(this._element, "transitionend", t2), a(this._element, e2);
      } else
        t2();
    }
    dispose() {
      this._clearTimeout(), this._element.classList.contains("show") && this._element.classList.remove("show"), N.off(this._element, "click.dismiss.bs.toast"), super.dispose(), this._config = null;
    }
    _getConfig(t2) {
      return t2 = __spreadValues(__spreadValues(__spreadValues({}, Xe), B.getDataAttributes(this._element)), typeof t2 == "object" && t2 ? t2 : {}), l("toast", t2, this.constructor.DefaultType), t2;
    }
    _setListeners() {
      N.on(this._element, "click.dismiss.bs.toast", '[data-bs-dismiss="toast"]', () => this.hide());
    }
    _clearTimeout() {
      clearTimeout(this._timeout), this._timeout = null;
    }
    static jQueryInterface(t2) {
      return this.each(function() {
        let e2 = b.get(this, "bs.toast");
        if (e2 || (e2 = new Qe(this, typeof t2 == "object" && t2)), typeof t2 == "string") {
          if (e2[t2] === void 0)
            throw new TypeError(`No method named "${t2}"`);
          e2[t2](this);
        }
      });
    }
  }
  return m("toast", Qe), { Alert: P, Button: I, Carousel: Y, Collapse: X, Dropdown: _e, Modal: ye, Offcanvas: Oe, Popover: Fe, ScrollSpy: Ye, Tab: qe, Toast: Qe, Tooltip: Be };
});
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$9 = {};
function _sfc_render$9(_ctx, _cache) {
  const _component_router_view = resolveComponent("router-view");
  return openBlock(), createBlock(_component_router_view, null, {
    default: withCtx(({ Component }) => [
      (openBlock(), createBlock(Suspense, null, {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(Component)))
        ]),
        _: 2
      }, 1024))
    ]),
    _: 1
  });
}
var App = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
var _imports_1$1 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/server.cf9ece14.svg";
var _imports_0$1 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/speedometer.fcbb4a67.svg";
var _imports_2$2 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/shield-lock.4c0b22ca.svg";
const _sfc_main$8 = {};
const _hoisted_1$8 = { class: "w-100 p-3 text-white bg-dark shadow text-right" };
const _hoisted_2$8 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_1$1,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3$8 = /* @__PURE__ */ createBaseVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam", -1);
const _hoisted_4$7 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "Welcome", -1);
const _hoisted_5$7 = {
  id: "wrapper",
  class: "w-100 h-100 d-flex"
};
const _hoisted_6$5 = {
  id: "container",
  class: "fadeinslow text-center"
};
const _hoisted_7$5 = {
  class: "position-absolute start-50 translate-middle text-center",
  style: { "top": "30vh", "min-width": "268px" }
};
const _hoisted_8$5 = /* @__PURE__ */ createBaseVNode("div", { class: "row position-relative text-center p-3" }, [
  /* @__PURE__ */ createBaseVNode("h4", null, " choose your role ")
], -1);
const _hoisted_9$5 = { class: "row justify-content-md-center" };
const _hoisted_10$5 = { class: "col" };
const _hoisted_11$5 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_0$1,
  class: "white",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_12$5 = /* @__PURE__ */ createBaseVNode("svg", {
  width: "1.5em",
  height: "1.5em",
  viewBox: "0 0 16 14",
  class: "arrow position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill",
  fill: "#198754",
  xmlns: "http://www.w3.org/2000/svg"
}, [
  /* @__PURE__ */ createBaseVNode("path", { d: "M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" })
], -1);
const _hoisted_13$5 = { class: "col" };
const _hoisted_14$5 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_2$2,
  class: "white",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_15$5 = /* @__PURE__ */ createBaseVNode("svg", {
  width: "1.5em",
  height: "1.5em",
  viewBox: "0 0 16 14",
  class: "arrow position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill",
  fill: "#198754",
  xmlns: "http://www.w3.org/2000/svg"
}, [
  /* @__PURE__ */ createBaseVNode("path", { d: "M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" })
], -1);
const _hoisted_16$5 = /* @__PURE__ */ createBaseVNode("div", { class: "row" }, [
  /* @__PURE__ */ createBaseVNode("div", { class: "col m-1" }, " Student "),
  /* @__PURE__ */ createBaseVNode("div", { class: "col m-1" }, " Teacher ")
], -1);
function _sfc_render$8(_ctx, _cache) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$8, [
      createVNode(_component_router_link, {
        to: "/",
        class: "text-white m-1"
      }, {
        default: withCtx(() => [
          _hoisted_2$8,
          _hoisted_3$8
        ]),
        _: 1
      }),
      _hoisted_4$7
    ]),
    createBaseVNode("div", _hoisted_5$7, [
      createBaseVNode("div", _hoisted_6$5, [
        createBaseVNode("div", _hoisted_7$5, [
          _hoisted_8$5,
          createBaseVNode("div", _hoisted_9$5, [
            createBaseVNode("div", _hoisted_10$5, [
              createVNode(_component_router_link, {
                to: "student",
                id: "studentbutton",
                class: "text-center btn btn-lg btn-success position-relative p-3 m-2 padding-lr-2"
              }, {
                default: withCtx(() => [
                  _hoisted_11$5,
                  _hoisted_12$5
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_13$5, [
              createVNode(_component_router_link, {
                to: "startserver",
                id: "teacherbutton",
                class: "text-center btn btn-lg btn-success position-relative p-3 m-2 padding-lr-2"
              }, {
                default: withCtx(() => [
                  _hoisted_14$5,
                  _hoisted_15$5
                ]),
                _: 1
              })
            ])
          ]),
          _hoisted_16$5
        ])
      ])
    ])
  ], 64);
}
var home = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
const _sfc_main$7 = {};
const _hoisted_1$7 = { class: "w-100 p-3 text-white bg-dark shadow text-right" };
const _hoisted_2$7 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_1$1,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3$7 = /* @__PURE__ */ createBaseVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam", -1);
const _hoisted_4$6 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "Welcome", -1);
const _hoisted_5$6 = /* @__PURE__ */ createStaticVNode('<div id="wrapper" class="w-100 h-100 d-flex"><div id="container" class="fadeinslow text-center"><div class="position-absolute start-50 translate-middle text-center" style="top:30vh;min-width:268px;"><div class="row position-relative text-center p-3"><h4> Error 404 </h4></div><div class="row justify-content-md-center"></div><div class="row"></div></div></div></div>', 1);
function _sfc_render$7(_ctx, _cache) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$7, [
      createVNode(_component_router_link, {
        to: "/",
        class: "text-white m-1"
      }, {
        default: withCtx(() => [
          _hoisted_2$7,
          _hoisted_3$7
        ]),
        _: 1
      }),
      _hoisted_4$6
    ]),
    _hoisted_5$6
  ], 64);
}
var notfound = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
var _imports_3$1 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/question-square-fill.ea2f12db.svg";
const _sfc_main$6 = {
  data() {
    return {
      token: "",
      username: "Thomas",
      pincode: "1337",
      clientinfo: {},
      serverlist: [],
      remoterequest: false,
      fetchinterval: null
    };
  },
  components: {},
  methods: {
    fetchInfo() {
      axios.get("/client/control/getinfo").then((response) => {
        this.clientinfo = response.data.clientinfo;
        this.serverlist = response.data.serverlist;
        this.token = this.clientinfo.token;
        if (this.clientinfo && this.clientinfo.token) {
          let registerbuttons = document.getElementsByName("register");
          registerbuttons.forEach((button) => {
            button.disabled = true;
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    async registerClient(serverip, servername) {
      $(`#${servername}`).val("registering...");
      await axios.get(`http://localhost:3000/client/control/register/${serverip}/${servername}/${this.pincode}/${this.username}`).then((response) => {
        this.status(response.data.message);
        console.log(response.data.message);
      }).catch((err) => console.log(err));
    },
    async status(text) {
      $("#statusdiv").text(text);
      $("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $("#statusdiv").fadeOut("slow");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  },
  mounted() {
    $("#statusdiv").fadeOut("slow");
    this.fetchInfo();
    this.fetchinterval = setInterval(() => {
      this.fetchInfo();
    }, 2e3);
  },
  beforeUnmount() {
    clearInterval(this.fetchinterval);
  }
};
const _hoisted_1$6 = {
  id: "apphead",
  class: "w-100 p-3 text-white bg-dark shadow text-right"
};
const _hoisted_2$6 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_0$1,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3$6 = /* @__PURE__ */ createBaseVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam", -1);
const _hoisted_4$5 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "Student", -1);
const _hoisted_5$5 = {
  id: "wrapper",
  class: "w-100 h-100 d-flex"
};
const _hoisted_6$4 = {
  class: "p-3 text-white bg-dark h-100",
  style: { "width": "240px", "min-width": "240px" }
};
const _hoisted_7$4 = { class: "nav nav-pills flex-column mb-auto" };
const _hoisted_8$4 = { class: "nav-item" };
const _hoisted_9$4 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_1$1,
  class: "white me-2",
  width: "16",
  height: "16"
}, null, -1);
const _hoisted_10$4 = /* @__PURE__ */ createTextVNode(" Running Exams ");
const _hoisted_11$4 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_3$1,
  class: "white me-2",
  width: "16",
  height: "16"
}, null, -1);
const _hoisted_12$4 = /* @__PURE__ */ createTextVNode(" Editor ");
const _hoisted_13$4 = /* @__PURE__ */ createBaseVNode("div", { class: "m-2" }, [
  /* @__PURE__ */ createBaseVNode("br"),
  /* @__PURE__ */ createBaseVNode("div", {
    id: "statusdiv",
    class: "btn btn-warning m-2"
  }, " Client started ")
], -1);
const _hoisted_14$4 = {
  id: "content",
  class: "fadeinslow p-3"
};
const _hoisted_15$4 = {
  key: 0,
  class: "col-8"
};
const _hoisted_16$4 = { class: "input-group mb-1" };
const _hoisted_17$4 = /* @__PURE__ */ createBaseVNode("span", {
  class: "input-group-text col-3",
  style: { "min-width": "120px" },
  id: "inputGroup-sizing-lg"
}, "Username", -1);
const _hoisted_18$4 = { class: "col-sm-7" };
const _hoisted_19$4 = { class: "input-group mb-3" };
const _hoisted_20$3 = /* @__PURE__ */ createBaseVNode("span", {
  class: "input-group-text col-3",
  style: { "min-width": "120px" },
  id: "inputGroup-sizing-lg"
}, "Pincode", -1);
const _hoisted_21$3 = { class: "col-sm-7" };
const _hoisted_22$3 = /* @__PURE__ */ createBaseVNode("h4", null, "Running Exams", -1);
const _hoisted_23$3 = {
  id: "list",
  class: "placeholder"
};
const _hoisted_24$3 = {
  class: "row p-3 m-0 mb-2 border bg-light",
  style: { "margin-right": "10px !important", "width": "300px", "min-width": "250px" }
};
const _hoisted_25$3 = { class: "row" };
const _hoisted_26$3 = /* @__PURE__ */ createBaseVNode("dt", { class: "col-sm-4" }, "Name", -1);
const _hoisted_27$3 = { class: "col-sm-8" };
const _hoisted_28$3 = ["id", "onClick"];
const _hoisted_29$3 = ["id"];
const _hoisted_30$3 = ["id"];
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$6, [
      createVNode(_component_router_link, {
        to: "/",
        class: "text-white m-1"
      }, {
        default: withCtx(() => [
          _hoisted_2$6,
          _hoisted_3$6
        ]),
        _: 1
      }),
      _hoisted_4$5
    ]),
    createBaseVNode("div", _hoisted_5$5, [
      createBaseVNode("div", _hoisted_6$4, [
        createBaseVNode("ul", _hoisted_7$4, [
          createBaseVNode("li", _hoisted_8$4, [
            createVNode(_component_router_link, {
              to: "student",
              id: "exams",
              class: "nav-link active"
            }, {
              default: withCtx(() => [
                _hoisted_9$4,
                _hoisted_10$4
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", null, [
            createVNode(_component_router_link, {
              to: "/editor/" + $data.clientinfo.token,
              class: "nav-link"
            }, {
              default: withCtx(() => [
                _hoisted_11$4,
                _hoisted_12$4
              ]),
              _: 1
            }, 8, ["to"])
          ])
        ]),
        _hoisted_13$4
      ]),
      createBaseVNode("div", _hoisted_14$4, [
        !$data.remoterequest ? (openBlock(), createElementBlock("div", _hoisted_15$4, [
          createBaseVNode("div", _hoisted_16$4, [
            _hoisted_17$4,
            createBaseVNode("div", _hoisted_18$4, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event),
                type: "text",
                class: "form-control",
                id: "user",
                placeholder: "Thomas"
              }, null, 512), [
                [vModelText, $data.username]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_19$4, [
            _hoisted_20$3,
            createBaseVNode("div", _hoisted_21$3, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.pincode = $event),
                type: "text",
                class: "form-control",
                id: "pin",
                placeholder: "1337"
              }, null, 512), [
                [vModelText, $data.pincode]
              ])
            ])
          ])
        ])) : createCommentVNode("", true),
        _hoisted_22$3,
        createBaseVNode("div", _hoisted_23$3, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($data.serverlist, (server) => {
            return openBlock(), createElementBlock("div", _hoisted_24$3, [
              createBaseVNode("dl", _hoisted_25$3, [
                _hoisted_26$3,
                createBaseVNode("dd", _hoisted_27$3, toDisplayString(server.servername), 1)
              ]),
              !$data.token ? (openBlock(), createElementBlock("input", {
                key: 0,
                id: server.servername,
                type: "button",
                name: "register",
                class: "btn btn-info",
                value: "register",
                onClick: ($event) => $options.registerClient(server.serverip, server.servername)
              }, null, 8, _hoisted_28$3)) : createCommentVNode("", true),
              $data.token && $data.clientinfo.servername !== server.servername ? (openBlock(), createElementBlock("input", {
                key: 1,
                id: server.servername,
                type: "button",
                name: "register",
                class: "btn btn-secondary",
                value: "register"
              }, null, 8, _hoisted_29$3)) : createCommentVNode("", true),
              $data.token && $data.clientinfo.servername === server.servername ? (openBlock(), createElementBlock("input", {
                key: 2,
                id: server.servername,
                type: "button",
                name: "register",
                class: "btn btn-success",
                value: "registered"
              }, null, 8, _hoisted_30$3)) : createCommentVNode("", true)
            ]);
          }), 256))
        ])
      ])
    ])
  ], 64);
}
var student = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
var _imports_0 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/shield-lock-fill.0867a2c2.svg";
var _imports_2$1 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/person-lines-fill.1357ba4c.svg";
const _sfc_main$5 = {
  data() {
    return {
      servername: "Mathe5A",
      pincode: "1337",
      password: "password",
      prod: false
    };
  },
  components: {},
  methods: {
    async startServer() {
      await axios.get(`http://${window.location.host}/server/control/start/${this.servername}/${this.pincode}/${this.password}`).then(async (response) => {
        this.status(response.data.message);
        await this.sleep(1e3);
        this.$router.push({ path: "/serverlist" });
      }).catch((err) => {
        this.status(err);
      });
    },
    async status(text) {
      $("#statusdiv").text(text);
      $("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $("#statusdiv").fadeOut("slow");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  },
  mounted() {
    if (this.prod) {
      $("#servername").val("");
      $("#pin").val("");
      $("#password").val("");
    }
  },
  beforeUnmount() {
    clearInterval(this.fetchinterval);
  }
};
const _hoisted_1$5 = { class: "w-100 p-3 text-white bg-dark shadow text-right" };
const _hoisted_2$5 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_0,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3$5 = /* @__PURE__ */ createBaseVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam", -1);
const _hoisted_4$4 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "Teacher", -1);
const _hoisted_5$4 = {
  id: "wrapper",
  class: "w-100 h-100 d-flex"
};
const _hoisted_6$3 = /* @__PURE__ */ createStaticVNode('<div class="p-3 text-white bg-dark h-100" style="width:240px;min-width:240px;"><ul class="nav nav-pills flex-column mb-auto"><li class="nav-item"><a href="/startserver" id="startserver" class="nav-link active"><img src="' + _imports_1$1 + '" class="white me-2" width="16" height="16"> Start Exam Server </a></li><li><a href="/serverlist" id="serverlist" class="nav-link"><img src="' + _imports_2$1 + '" class="white me-2" width="16" height="16"> Server List </a></li><li><a href="#" class="nav-link"><img src="' + _imports_3$1 + '" class="white me-2" width="16" height="16"> Help </a></li></ul><div class="m-2"><br><div id="statusdiv" class="btn btn-warning m-2 hidden"> connected </div></div><br></div>', 1);
const _hoisted_7$3 = {
  id: "content",
  class: "fadeinslow p-3"
};
const _hoisted_8$3 = { class: "col-7" };
const _hoisted_9$3 = { class: "input-group mb-1" };
const _hoisted_10$3 = /* @__PURE__ */ createBaseVNode("span", {
  class: "input-group-text col-4",
  style: { "min-width": "120px" },
  id: "inputGroup-sizing-lg"
}, "Exam Name", -1);
const _hoisted_11$3 = { class: "col-sm-7" };
const _hoisted_12$3 = { class: "input-group mb-1" };
const _hoisted_13$3 = /* @__PURE__ */ createBaseVNode("span", {
  class: "input-group-text col-4",
  style: { "min-width": "120px" },
  id: "inputGroup-sizing-lg"
}, "Pincode", -1);
const _hoisted_14$3 = { class: "col-sm-7" };
const _hoisted_15$3 = { class: "input-group mb-3" };
const _hoisted_16$3 = /* @__PURE__ */ createBaseVNode("span", {
  class: "input-group-text col-4",
  style: { "min-width": "120px" },
  id: "inputGroup-sizing-lg"
}, "Password", -1);
const _hoisted_17$3 = { class: "col-sm-7" };
const _hoisted_18$3 = { class: "col mb-4" };
const _hoisted_19$3 = /* @__PURE__ */ createBaseVNode("div", {
  id: "list",
  class: "placeholder"
}, null, -1);
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$5, [
      createVNode(_component_router_link, {
        to: "/",
        class: "text-white m-1"
      }, {
        default: withCtx(() => [
          _hoisted_2$5,
          _hoisted_3$5
        ]),
        _: 1
      }),
      _hoisted_4$4
    ]),
    createBaseVNode("div", _hoisted_5$4, [
      _hoisted_6$3,
      createBaseVNode("div", _hoisted_7$3, [
        createBaseVNode("div", _hoisted_8$3, [
          createBaseVNode("div", _hoisted_9$3, [
            _hoisted_10$3,
            createBaseVNode("div", _hoisted_11$3, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.servername = $event),
                type: "text",
                class: "form-control",
                id: "servername",
                placeholder: "Mathematik-5a"
              }, null, 512), [
                [vModelText, $data.servername]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_12$3, [
            _hoisted_13$3,
            createBaseVNode("div", _hoisted_14$3, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.pincode = $event),
                type: "text",
                class: "form-control",
                id: "pin",
                placeholder: "1337"
              }, null, 512), [
                [vModelText, $data.pincode]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_15$3, [
            _hoisted_16$3,
            createBaseVNode("div", _hoisted_17$3, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.password = $event),
                type: "text",
                class: "form-control",
                id: "password",
                placeholder: "password"
              }, null, 512), [
                [vModelText, $data.password]
              ])
            ])
          ]),
          createBaseVNode("div", _hoisted_18$3, [
            createBaseVNode("button", {
              onClick: _cache[3] || (_cache[3] = ($event) => $options.startServer()),
              id: "examstart",
              class: "btn btn-success",
              value: "start exam"
            }, "Start New Exam Server")
          ])
        ]),
        _hoisted_19$3
      ])
    ])
  ], 64);
}
var startserver = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const _sfc_main$4 = {
  data() {
    return {
      fetchinterval: null,
      abgabeinterval: null,
      studentlist: [],
      servername: this.$route.params.servername,
      servertoken: this.$route.params.servertoken,
      serverip: this.$route.params.serverip,
      now: null,
      files: null,
      examtype: "language",
      autoabgabe: false
    };
  },
  components: {},
  methods: {
    fetchInfo() {
      this.now = new Date().getTime();
      axios.get(`http://${this.serverip}:3000/server/control/studentlist/${this.servername}/${this.servertoken}`).then((response) => {
        this.studentlist = response.data.studentlist;
        this.studentlist.forEach((student2) => {
          if (!student2.focus) {
            this.status(`${student2.clientname} has left the exam`);
          }
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    toggleAutoabgabe() {
      if (this.autoabgabe) {
        this.abgabeinterval = setInterval(() => {
          this.getFiles("all");
        }, 6e4);
      } else {
        clearInterval(this.abgabeinterval);
      }
    },
    sendFiles(who) {
      if (!this.files) {
        this.status("No Files selected");
        return;
      }
      this.status("File(s) uploading...");
      const formData = new browser();
      formData.append("servertoken", this.servertoken);
      formData.append("servername", this.servername);
      for (const i of Object.keys(this.files)) {
        formData.append("files", this.files[i]);
      }
      axios({
        method: "post",
        url: `http://${this.serverip}:3000/server/data/send/${who}`,
        data: formData,
        headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` }
      }).then((response) => {
        this.status(response.data.message);
        if (response.data.status === "success") {
          this.status("Files sent");
          setTimeout(this.toggleUpload, 2e3);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    handleFileUpload(event) {
      this.files = event.target.files;
    },
    stopserver() {
      axios.get(`http://${this.serverip}:3000/server/control/stopserver/${this.servername}/${this.servertoken}`).then(async (response) => {
        this.status(response.data.message);
        console.log(response.data);
        await this.sleep(3e3);
        this.$router.push({ path: "/serverlist" });
      }).catch((err) => {
        console.log(err);
      });
    },
    startExam(who) {
      console.log(this.examtype);
      if (who == "all") {
        if (this.studentlist.length <= 0) {
          this.status("no clients connected");
          console.log("no clients connected");
        } else {
          this.status("starting exam mode for all clients");
          this.studentlist.forEach((student2) => {
            console.log(student2);
            if (student2.exammode) {
              return;
            }
            axios.get(`http://${student2.clientip}:3000/client/control/exammode/start/${student2.token}/${this.examtype}`).then((response) => {
              this.status(response.data.message);
              console.log(response.data);
            }).catch((error) => {
              console.log(error);
            });
          });
        }
      }
    },
    endExam(who) {
      this.status("stopping exam mode");
      if (who == "all") {
        if (this.studentlist.length <= 0) {
          this.status("no clients connected");
          console.log("no clients connected");
        } else {
          this.studentlist.forEach((student2) => {
            axios.get(`http://${student2.clientip}:3000/client/control/exammode/stop/${student2.token}`).then(async (response) => {
              this.status(response.data.message);
              console.log(response.data);
            }).catch((error) => {
              console.log(error);
            });
          });
        }
      }
    },
    getFiles(who) {
      if (who == "all") {
        if (this.studentlist.length <= 0) {
          this.status("no clients connected");
          console.log("no clients connected");
        } else {
          console.log("Requesting Filetransfer from ALL Clients");
          this.studentlist.forEach((student2) => {
            axios.get(`http://${student2.clientip}:3000/client/data/abgabe/send/${student2.token}`).then((response) => {
              console.log(response.data.message);
            }).catch((error) => {
              console.log(error);
            });
          });
        }
      }
    },
    kick(studenttoken, studentip) {
      axios.get(`http://${this.serverip}:3000/server/control/kick/${this.servername}/${this.servertoken}/${studenttoken}`).then((response) => {
        console.log(response.data);
        this.status(response.data.message);
      }).catch((error) => {
        console.log(error);
      });
      axios.get(`http://${studentip}:3000/client/control/kick/${studenttoken}`).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    async restore(studenttoken) {
      await axios.get(`http://${this.serverip}:3000/server/control/studentlist/statechange/${this.servername}/${studenttoken}/true`).then(async (response) => {
        this.status(response.data.message);
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    toggleUpload() {
      let status = $("#uploaddiv").css("display");
      if (status == "none") {
        $("#uploaddiv").css("display", "block");
        $("#formFileMultiple").val("");
      } else {
        $("#uploaddiv").css("display", "none");
      }
    },
    async task2(token, ip) {
      axios.get(`http://${ip}:3000/client/control/tokencheck/${token}`).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    async status(text) {
      $("#statusdiv").text(text);
      $("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $("#statusdiv").fadeOut("slow");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  },
  mounted() {
    $("#statusdiv").fadeOut("slow");
    this.fetchInfo();
    this.fetchinterval = setInterval(() => {
      this.fetchInfo();
    }, 4e3);
  },
  beforeUnmount() {
    clearInterval(this.fetchinterval);
    clearInterval(this.abgabeinterval);
  }
};
const _hoisted_1$4 = { class: "w-100 p-3 text-white bg-dark shadow text-right" };
const _hoisted_2$4 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_0$1,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3$4 = /* @__PURE__ */ createBaseVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam", -1);
const _hoisted_4$3 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "Dashboard", -1);
const _hoisted_5$3 = {
  id: "wrapper",
  class: "w-100 h-100 d-flex"
};
const _hoisted_6$2 = {
  class: "p-3 text-white bg-dark h-100",
  style: { "width": "240px", "min-width": "240px" }
};
const _hoisted_7$2 = { class: "btn btn-light m-1 text-start" };
const _hoisted_8$2 = /* @__PURE__ */ createTextVNode("Name ");
const _hoisted_9$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_10$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_11$2 = { class: "btn btn-light m-1 mb-1 text-start" };
const _hoisted_12$2 = /* @__PURE__ */ createTextVNode("Pin ");
const _hoisted_13$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_14$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_15$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_16$2 = { class: "form-check m-1" };
const _hoisted_17$2 = /* @__PURE__ */ createBaseVNode("label", {
  class: "form-check-label",
  for: "examtype1"
}, " Texteditor ", -1);
const _hoisted_18$2 = { class: "form-check m-1 mb-2" };
const _hoisted_19$2 = /* @__PURE__ */ createBaseVNode("label", {
  class: "form-check-label",
  for: "examtype2"
}, " Geogebra ", -1);
const _hoisted_20$2 = { class: "form-check form-switch m-1 mb-4" };
const _hoisted_21$2 = /* @__PURE__ */ createBaseVNode("label", {
  class: "form-check-label",
  for: "flexSwitchCheckDefault"
}, "Auto Abgabe", -1);
const _hoisted_22$2 = /* @__PURE__ */ createBaseVNode("div", {
  id: "statusdiv",
  class: "btn btn-warning m-1"
}, " connected ", -1);
const _hoisted_23$2 = {
  id: "uploaddiv",
  class: "fadeinslow"
};
const _hoisted_24$2 = {
  id: "uploadform",
  method: "POST",
  enctype: "multipart/form-data"
};
const _hoisted_25$2 = { class: "mb-3" };
const _hoisted_26$2 = /* @__PURE__ */ createBaseVNode("label", {
  for: "formFileMultiple",
  class: "form-label"
}, "Send Files to ALL Clients", -1);
const _hoisted_27$2 = {
  id: "content",
  class: "fadeinslow p-3"
};
const _hoisted_28$2 = {
  id: "studentslist",
  class: "placeholder pt-4"
};
const _hoisted_29$2 = { style: {} };
const _hoisted_30$2 = ["onClick"];
const _hoisted_31$1 = {
  class: "btn-group pt-0",
  role: "group"
};
const _hoisted_32$1 = ["onClick"];
const _hoisted_33$1 = ["onClick"];
const _hoisted_34$1 = ["onClick"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$4, [
      createVNode(_component_router_link, {
        to: "/",
        class: "text-white m-1"
      }, {
        default: withCtx(() => [
          _hoisted_2$4,
          _hoisted_3$4
        ]),
        _: 1
      }),
      _hoisted_4$3
    ]),
    createBaseVNode("div", _hoisted_5$3, [
      createBaseVNode("div", _hoisted_6$2, [
        createBaseVNode("div", _hoisted_7$2, [
          _hoisted_8$2,
          _hoisted_9$2,
          createBaseVNode("b", null, toDisplayString(_ctx.$route.params.servername), 1)
        ]),
        _hoisted_10$2,
        createBaseVNode("div", _hoisted_11$2, [
          _hoisted_12$2,
          _hoisted_13$2,
          createBaseVNode("b", null, toDisplayString(_ctx.$route.params.pin), 1)
        ]),
        _hoisted_14$2,
        createBaseVNode("div", {
          class: "btn btn-danger m-1 mb-3 text-start",
          onClick: _cache[0] || (_cache[0] = ($event) => $options.stopserver())
        }, "Stop Server"),
        _hoisted_15$2,
        createBaseVNode("div", _hoisted_16$2, [
          withDirectives(createBaseVNode("input", {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.examtype = $event),
            value: "language",
            class: "form-check-input",
            type: "radio",
            name: "examtype",
            id: "examtype1",
            checked: ""
          }, null, 512), [
            [vModelRadio, $data.examtype]
          ]),
          _hoisted_17$2
        ]),
        createBaseVNode("div", _hoisted_18$2, [
          withDirectives(createBaseVNode("input", {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.examtype = $event),
            value: "math",
            class: "form-check-input",
            type: "radio",
            name: "examtype",
            id: "examtype2"
          }, null, 512), [
            [vModelRadio, $data.examtype]
          ]),
          _hoisted_19$2
        ]),
        createBaseVNode("div", _hoisted_20$2, [
          withDirectives(createBaseVNode("input", {
            onChange: _cache[3] || (_cache[3] = ($event) => $options.toggleAutoabgabe()),
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.autoabgabe = $event),
            class: "form-check-input",
            type: "checkbox",
            id: "autoabgabe"
          }, null, 544), [
            [vModelCheckbox, $data.autoabgabe]
          ]),
          _hoisted_21$2
        ]),
        _hoisted_22$2
      ]),
      createBaseVNode("div", _hoisted_23$2, [
        createBaseVNode("form", _hoisted_24$2, [
          createBaseVNode("div", _hoisted_25$2, [
            _hoisted_26$2,
            createBaseVNode("div", {
              class: "btn-close d-inline float-end",
              onClick: _cache[5] || (_cache[5] = ($event) => $options.toggleUpload())
            }),
            createBaseVNode("input", {
              class: "form-control",
              type: "file",
              name: "files",
              id: "formFileMultiple",
              multiple: "",
              onChange: _cache[6] || (_cache[6] = ($event) => $options.handleFileUpload($event))
            }, null, 32),
            withDirectives(createBaseVNode("input", {
              class: "form-control",
              type: "hidden",
              name: "servertoken",
              id: "servertoken",
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.servertoken = $event)
            }, null, 512), [
              [vModelText, $data.servertoken]
            ]),
            withDirectives(createBaseVNode("input", {
              class: "form-control",
              type: "hidden",
              name: "servername",
              id: "servername",
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.servername = $event)
            }, null, 512), [
              [vModelText, $data.servername]
            ])
          ]),
          createBaseVNode("input", {
            onClick: _cache[9] || (_cache[9] = ($event) => $options.sendFiles("all")),
            type: "buttom",
            name: "submit",
            class: "btn btn-info",
            value: "senden"
          })
        ])
      ]),
      createBaseVNode("div", _hoisted_27$2, [
        createBaseVNode("div", {
          class: "btn btn-success m-1 text-start",
          style: { "width": "100px" },
          onClick: _cache[10] || (_cache[10] = ($event) => $options.startExam("all"))
        }, "Exam starten"),
        createBaseVNode("div", {
          class: "btn btn-info m-1 text-start",
          style: { "width": "100px" },
          onClick: _cache[11] || (_cache[11] = ($event) => $options.toggleUpload())
        }, "Datei senden"),
        createBaseVNode("div", {
          class: "btn btn-info m-1 text-start",
          style: { "width": "100px" },
          onClick: _cache[12] || (_cache[12] = ($event) => $options.getFiles("all"))
        }, "Abgabe holen"),
        createBaseVNode("div", {
          class: "btn btn-danger m-1 text-start",
          style: { "width": "100px" },
          onClick: _cache[13] || (_cache[13] = ($event) => $options.endExam("all"))
        }, "Exam beenden"),
        createBaseVNode("div", _hoisted_28$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($data.studentlist, (student2) => {
            return openBlock(), createElementBlock("div", {
              class: normalizeClass([!student2.focus ? "focuswarn" : "", "studentwidget btn border-0 rounded-3 btn-block m-1"])
            }, [
              createBaseVNode("div", {
                id: "image",
                class: "rounded",
                style: normalizeStyle(["background-image:url(/files/" + student2.token + ".jpg?ver=" + student2.timestamp + ")", { "position": "relative", "height": "75%", "background-size": "cover" }])
              }, [
                createBaseVNode("span", _hoisted_29$2, [
                  createTextVNode(toDisplayString(student2.clientname) + " ", 1),
                  createBaseVNode("button", {
                    onClick: ($event) => $options.kick(student2.token, student2.clientip),
                    type: "button",
                    class: "btn-close btn-close-white pt-2 pe-2 float-end",
                    title: "kick user"
                  }, null, 8, _hoisted_30$2)
                ])
              ], 4),
              createBaseVNode("div", _hoisted_31$1, [
                $data.now - 6e4 < student2.timestamp ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  onClick: ($event) => $options.task2(student2.token, student2.clientip),
                  type: "button",
                  class: "btn btn-outline-success btn-sm",
                  style: { "border-top-left-radius": "0px", "border-top-right-radius": "0px" }
                }, "send", 8, _hoisted_32$1)) : createCommentVNode("", true),
                $data.now - 6e4 < student2.timestamp ? (openBlock(), createElementBlock("button", {
                  key: 1,
                  onClick: ($event) => $options.task2(student2.token, student2.clientip),
                  type: "button",
                  class: "btn btn-outline-success btn-sm",
                  style: { "border-top-left-radius": "0px", "border-top-right-radius": "0px" }
                }, "get", 8, _hoisted_33$1)) : createCommentVNode("", true),
                !student2.focus && $data.now - 6e4 < student2.timestamp ? (openBlock(), createElementBlock("button", {
                  key: 2,
                  onClick: ($event) => $options.restore(student2.token),
                  type: "button",
                  class: "btn btn-danger btn-sm",
                  style: { "border-top-left-radius": "0px", "border-top-right-radius": "0px" }
                }, "restore", 8, _hoisted_34$1)) : createCommentVNode("", true)
              ])
            ], 2);
          }), 256))
        ])
      ])
    ])
  ], 64);
}
var dashboard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = {
  data() {
    return {
      fetchinterval: null,
      serverlist: [],
      password: "password"
    };
  },
  components: {},
  methods: {
    fetchInfo() {
      axios.get("/server/control/serverlist").then((response) => {
        this.serverlist = response.data.serverlist;
      }).catch((err) => {
        console.log(err);
      });
    },
    login(servername) {
      let password = $(`#${servername}`).val();
      window.location.href = `/dashboard/${servername}/${password}`;
    },
    async status(text) {
      $("#statusdiv").text(text);
      $("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $("#statusdiv").fadeOut("slow");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  },
  mounted() {
    this.fetchInfo();
    this.fetchinterval = setInterval(() => {
      this.fetchInfo();
    }, 2e3);
  },
  beforeUnmount() {
    clearInterval(this.fetchinterval);
  }
};
const _hoisted_1$3 = { class: "w-100 p-3 text-white bg-dark shadow text-right" };
const _hoisted_2$3 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_0,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3$3 = /* @__PURE__ */ createBaseVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam", -1);
const _hoisted_4$2 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "Teacher", -1);
const _hoisted_5$2 = {
  id: "wrapper",
  class: "w-100 h-100 d-flex"
};
const _hoisted_6$1 = {
  class: "p-3 text-white bg-dark h-100",
  style: { "width": "240px", "min-width": "240px" }
};
const _hoisted_7$1 = { class: "nav nav-pills flex-column mb-auto" };
const _hoisted_8$1 = { class: "nav-item" };
const _hoisted_9$1 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_1$1,
  class: "white me-2",
  width: "16",
  height: "16"
}, null, -1);
const _hoisted_10$1 = /* @__PURE__ */ createTextVNode(" Start Exam Server ");
const _hoisted_11$1 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_2$1,
  class: "white me-2",
  width: "16",
  height: "16"
}, null, -1);
const _hoisted_12$1 = /* @__PURE__ */ createTextVNode(" Server List ");
const _hoisted_13$1 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_3$1,
  class: "white me-2",
  width: "16",
  height: "16"
}, null, -1);
const _hoisted_14$1 = /* @__PURE__ */ createTextVNode(" Help ");
const _hoisted_15$1 = /* @__PURE__ */ createBaseVNode("div", { class: "m-2" }, [
  /* @__PURE__ */ createBaseVNode("br"),
  /* @__PURE__ */ createBaseVNode("div", {
    id: "statusdiv",
    class: "btn btn-warning m-2 hidden"
  })
], -1);
const _hoisted_16$1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_17$1 = {
  id: "content",
  class: "fadeinslow p-3"
};
const _hoisted_18$1 = {
  id: "list",
  class: "container-fluid m-0 p-0"
};
const _hoisted_19$1 = { class: "row g-2" };
const _hoisted_20$1 = {
  class: "col-6",
  style: { "min-width": "280px", "max-width": "320px" }
};
const _hoisted_21$1 = { class: "p-3 border bg-light" };
const _hoisted_22$1 = { class: "row mb-0" };
const _hoisted_23$1 = /* @__PURE__ */ createBaseVNode("dt", { class: "col-sm-4 p-1" }, "Name", -1);
const _hoisted_24$1 = { class: "col-sm-8 p-1" };
const _hoisted_25$1 = /* @__PURE__ */ createBaseVNode("dt", { class: "col-sm-4 p-1" }, "IP Address", -1);
const _hoisted_26$1 = { class: "col-sm-8 p-1" };
const _hoisted_27$1 = /* @__PURE__ */ createBaseVNode("dt", { class: "col-sm-4 p-1 pt-2" }, "Password", -1);
const _hoisted_28$1 = { class: "col-sm-8 p-1" };
const _hoisted_29$1 = ["id", "value"];
const _hoisted_30$1 = ["onClick"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$3, [
      createVNode(_component_router_link, {
        to: "/",
        class: "text-white m-1"
      }, {
        default: withCtx(() => [
          _hoisted_2$3,
          _hoisted_3$3
        ]),
        _: 1
      }),
      _hoisted_4$2
    ]),
    createBaseVNode("div", _hoisted_5$2, [
      createBaseVNode("div", _hoisted_6$1, [
        createBaseVNode("ul", _hoisted_7$1, [
          createBaseVNode("li", _hoisted_8$1, [
            createVNode(_component_router_link, {
              to: "startserver",
              id: "startserver",
              class: "nav-link"
            }, {
              default: withCtx(() => [
                _hoisted_9$1,
                _hoisted_10$1
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", null, [
            createVNode(_component_router_link, {
              to: "serverlist",
              id: "serverlist",
              class: "nav-link active"
            }, {
              default: withCtx(() => [
                _hoisted_11$1,
                _hoisted_12$1
              ]),
              _: 1
            })
          ]),
          createBaseVNode("li", null, [
            createVNode(_component_router_link, {
              to: "#",
              class: "nav-link"
            }, {
              default: withCtx(() => [
                _hoisted_13$1,
                _hoisted_14$1
              ]),
              _: 1
            })
          ])
        ]),
        _hoisted_15$1,
        _hoisted_16$1
      ]),
      createBaseVNode("div", _hoisted_17$1, [
        createBaseVNode("div", _hoisted_18$1, [
          createBaseVNode("div", _hoisted_19$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($data.serverlist, (server) => {
              return openBlock(), createElementBlock("div", _hoisted_20$1, [
                createBaseVNode("div", _hoisted_21$1, [
                  createBaseVNode("dl", _hoisted_22$1, [
                    _hoisted_23$1,
                    createBaseVNode("dd", _hoisted_24$1, toDisplayString(server.servername), 1),
                    _hoisted_25$1,
                    createBaseVNode("dd", _hoisted_26$1, toDisplayString(server.serverip), 1),
                    _hoisted_27$1,
                    createBaseVNode("dd", _hoisted_28$1, [
                      createBaseVNode("input", {
                        id: server.servername,
                        type: "password",
                        class: "form-control",
                        placeholder: "password",
                        value: $data.password
                      }, null, 8, _hoisted_29$1),
                      createBaseVNode("input", {
                        onClick: ($event) => $options.login(server.servername),
                        type: "button",
                        name: "login",
                        class: "btn btn-success mt-1",
                        value: "Log In"
                      }, null, 8, _hoisted_30$1)
                    ])
                  ])
                ])
              ]);
            }), 256))
          ])
        ])
      ])
    ])
  ], 64);
}
var serverlist = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
var CodeBlockComponent_vue_vue_type_style_index_0_lang = "";
const _sfc_main$2 = {
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps,
  data() {
    return {
      languages: this.extension.options.lowlight.listLanguages()
    };
  },
  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language;
      },
      set(language) {
        this.updateAttributes({ language });
      }
    }
  }
};
const _hoisted_1$2 = /* @__PURE__ */ createBaseVNode("option", { value: null }, " auto ", -1);
const _hoisted_2$2 = /* @__PURE__ */ createBaseVNode("option", { disabled: "" }, " \u2014 ", -1);
const _hoisted_3$2 = ["value"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_node_view_content = resolveComponent("node-view-content");
  const _component_node_view_wrapper = resolveComponent("node-view-wrapper");
  return openBlock(), createBlock(_component_node_view_wrapper, { class: "code-block" }, {
    default: withCtx(() => [
      withDirectives(createBaseVNode("select", {
        contenteditable: "false",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.selectedLanguage = $event)
      }, [
        _hoisted_1$2,
        _hoisted_2$2,
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.languages, (language, index) => {
          return openBlock(), createElementBlock("option", {
            value: language,
            key: index
          }, toDisplayString(language), 9, _hoisted_3$2);
        }), 128))
      ], 512), [
        [vModelSelect, $options.selectedLanguage]
      ]),
      createBaseVNode("pre", null, [
        createBaseVNode("code", null, [
          createVNode(_component_node_view_content)
        ])
      ])
    ]),
    _: 1
  });
}
var CodeBlockComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const activatefocuscheck = (vue) => {
  let hidden, visibilityChange;
  const focusevent = new Event("focuslost");
  window.addEventListener("focuslost", async function(e) {
    console.log("houston we have a problem");
    await fetch(`http://${vue.serverip}:3000/server/control/studentlist/statechange/${vue.servername}/${vue.token}/false`).then((response) => response.json()).then(async (data) => {
      console.log(data);
    });
  }, false);
  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = "";
    window.dispatchEvent(focusevent);
  });
  window.addEventListener("blur", (e) => {
    window.dispatchEvent(focusevent);
  });
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }
  if (typeof document.addEventListener === "undefined" || hidden === void 0) {
    console.log("This app requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
  } else {
    document.addEventListener(visibilityChange, (e) => {
      if (document[hidden]) {
        window.dispatchEvent(focusevent);
      }
    }, false);
  }
};
var _imports_1 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/document-replace.4a0bda07.svg";
var _imports_2 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/edit-undo.a354989d.svg";
var _imports_3 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/edit-redo.a69ac9c9.svg";
var _imports_4 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-remove-node.5888b14c.svg";
var _imports_5 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-text-bold.1a54ac69.svg";
var _imports_6 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-text-italic.6bd597c5.svg";
var _imports_7 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-text-underline.a71fe525.svg";
var _imports_8 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-text-subscript.9ee5b476.svg";
var _imports_9 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-text-superscript.b0ee4d63.svg";
var _imports_10 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-list-unordered.c10be25d.svg";
var _imports_11 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-list-ordered.f362c573.svg";
var _imports_12 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/dialog-xml-editor.7c6730e8.svg";
var _imports_13 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/code-context.5c99fdf1.svg";
var _imports_14 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-text-blockquote.5deb96c0.svg";
var _imports_15 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/newline.d88da722.svg";
var _imports_16 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-justify-left.164eed23.svg";
var _imports_17 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-justify-center.0430a947.svg";
var _imports_18 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/format-justify-right.a25f7a31.svg";
var _imports_19 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/key-enter.21ff090b.svg";
var editor_vue_vue_type_style_index_0_lang = "";
const _sfc_main$1 = {
  components: {
    EditorContent
  },
  data() {
    return {
      selectedFile: null,
      currentFile: null,
      editor: null,
      fetchinterval: null,
      loadfilelistinterval: null,
      servername: this.$route.params.servername,
      servertoken: this.$route.params.servertoken,
      serverip: this.$route.params.serverip,
      token: this.$route.params.token,
      clientname: this.$route.params.clientname,
      localfiles: null
    };
  },
  async mounted() {
    if (this.token) {
      activatefocuscheck.call("", this);
    }
    this.editor = new Editor({
      extensions: [
        Blockquote,
        BulletList,
        Document,
        HardBreak,
        Heading,
        HorizontalRule,
        ListItem,
        OrderedList,
        Paragraph,
        Text,
        Bold,
        Code,
        Italic,
        Subscript,
        Superscript,
        Underline,
        Dropcursor,
        Gapcursor,
        History,
        TextAlign.configure({
          types: ["heading", "paragraph"]
        }),
        CodeBlockLowlight.extend({
          addNodeView() {
            return VueNodeViewRenderer(CodeBlockComponent);
          }
        }).configure({
          lowlight
        })
      ],
      content: `
     
<h2>
    Hi there,
</h2>
<p>
    this is a <em>basic</em> example of <strong>tiptap</strong>. 
    <br>Next up: A bullet list:
</p>
<ul>
    <li>Free Open Source Software</li>
    <li>Plattform independent</li>
</ul>
<p>Let\u2019s try a code block:</p>
<pre><code class="language-css">
body {
    background-color: rgba(200,200,24,1);
}
</code></pre>
<p> 1 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>2 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>3 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>4 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>5 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>6 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>7 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>8 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>9 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>10 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>11 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>12 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>13 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>14 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>Let\u2019s try a code block: </p>
<pre><code class="language-javascript">
const test = function ( data ) { console.log(data); }
</code></pre>
<p>1 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>2 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>3 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>4 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>5 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>6 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>7 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>8 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>9 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>10 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>11 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>12 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>13 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
<p>14 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>

ENDE !!`
    });
    this.currentFile = this.clientname;
    this.fetchinterval = setInterval(() => {
      this.fetchContent();
    }, 6e3);
    this.loadfilelistinterval = setInterval(() => {
      this.loadFilelist();
    }, 6e3);
    this.loadFilelist();
  },
  methods: {
    loadFilelist() {
      fetch(`http://localhost:3000/client/data/getfiles`, { method: "POST" }).then((response) => response.json()).then((data) => {
        this.localfiles = data;
      }).catch((err) => {
        console.warn(err);
      });
    },
    loadfile(file) {
      this.toggleUpload();
      this.currentFile = file.replace(/\.[^/.]+$/, "");
      const form = new FormData();
      form.append("filename", file);
      fetch(`http://localhost:3000/client/data/getfiles`, { method: "POST", body: form }).then((response) => response.json()).then((html) => {
        this.editor.commands.clearContent(true);
        this.editor.commands.insertContent(html);
      }).catch((err) => {
        console.warn(err);
      });
    },
    toggleUpload() {
      let status = $("#uploaddiv").css("display");
      if (status == "none") {
        $("#uploaddiv").css("display", "block");
        $("#formFileMultiple").val("");
      } else {
        $("#uploaddiv").css("display", "none");
      }
    },
    async fetchContent() {
      let body = document.body;
      let doc = new E("p", "px", "a4", true, true);
      let pagenumber = 0;
      let windowHeight = 0;
      html2canvas(body, {
        scale: 1,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        onclone: (document2) => {
          document2.getElementById("editortoolbar").style.display = "none";
          document2.getElementById("localfiles").style.display = "none";
          let body2 = document2.body;
          let html = document2.documentElement;
          windowHeight = Math.max(body2.scrollHeight, body2.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
          pagenumber = Math.ceil(windowHeight / 1123);
        }
      }).then(async () => {
        for (let i = 0; i < pagenumber; i++) {
          await new Promise((resolve) => {
            html2canvas(body, {
              scale: 1,
              x: 0,
              y: i * 1123,
              scrollX: 0,
              scrollY: 0,
              windowWidth: 794,
              windowHeight,
              onclone: (document2) => {
                document2.getElementById("editortoolbar").style.display = "none";
                document2.getElementById("localfiles").style.display = "none";
              }
            }).then((canvas) => {
              let img = canvas.toDataURL("image/jpeg", 1);
              doc.addImage(img, "JPG", 0, 0, 0, 0, i, "FAST");
              if (i + 1 == pagenumber) {
                const editorcontent = this.editor.getHTML();
                const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
                const form = new FormData();
                form.append("file", pdfBlob, `${this.currentFile}.pdf`);
                form.append("editorcontent", editorcontent);
                form.append("currentfilename", this.currentFile);
                fetch(`http://localhost:3000/client/data/store`, { method: "POST", body: form }).then((response) => response.json()).then(async (data) => {
                  console.log(data);
                }).catch((err) => {
                  console.warn(err);
                });
              } else {
                doc.addPage();
              }
              resolve();
            });
          });
        }
      });
    }
  },
  beforeUnmount() {
    this.editor.destroy();
    clearInterval(this.fetchinterval);
    clearInterval(this.loadfilelistinterval);
  }
};
const _hoisted_1$1 = { class: "w-100 p-3 text-white bg-dark shadow text-right" };
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_0$1,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3$1 = { class: "fs-4 align-middle me-4" };
const _hoisted_4$1 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "Next-Exam Writer", -1);
const _hoisted_5$1 = { id: "editorcontainer" };
const _hoisted_6 = {
  id: "uploaddiv",
  class: "fadeinslow p-4"
};
const _hoisted_7 = { class: "mb-3 row" };
const _hoisted_8 = { class: "mb-3" };
const _hoisted_9 = /* @__PURE__ */ createTextVNode("Wollen sie den Inhalt des Editors durch den Inhalt der Datei ");
const _hoisted_10 = /* @__PURE__ */ createTextVNode(" ersetzen?");
const _hoisted_11 = {
  id: "localfiles",
  class: "mb-2"
};
const _hoisted_12 = ["onClick"];
const _hoisted_13 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_1,
  class: "",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_14 = {
  key: 0,
  class: "mb-2",
  id: "editortoolbar"
};
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_2,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_16 = [
  _hoisted_15
];
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_3,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_18 = [
  _hoisted_17
];
const _hoisted_19 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_4,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_20 = [
  _hoisted_19
];
const _hoisted_21 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_5,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_22 = [
  _hoisted_21
];
const _hoisted_23 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_6,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_24 = [
  _hoisted_23
];
const _hoisted_25 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_7,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_26 = [
  _hoisted_25
];
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_8,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_28 = [
  _hoisted_27
];
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_9,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_30 = [
  _hoisted_29
];
const _hoisted_31 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_10,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_32 = [
  _hoisted_31
];
const _hoisted_33 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_11,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_34 = [
  _hoisted_33
];
const _hoisted_35 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_12,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_36 = [
  _hoisted_35
];
const _hoisted_37 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_13,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_38 = [
  _hoisted_37
];
const _hoisted_39 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_14,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_40 = [
  _hoisted_39
];
const _hoisted_41 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_15,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_42 = [
  _hoisted_41
];
const _hoisted_43 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_16,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_44 = [
  _hoisted_43
];
const _hoisted_45 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_17,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_46 = [
  _hoisted_45
];
const _hoisted_47 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_18,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_48 = [
  _hoisted_47
];
const _hoisted_49 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_19,
  class: "white",
  width: "22",
  height: "22"
}, null, -1);
const _hoisted_50 = [
  _hoisted_49
];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_editor_content = resolveComponent("editor-content");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1$1, [
      _hoisted_2$1,
      createBaseVNode("span", _hoisted_3$1, toDisplayString($data.clientname), 1),
      _hoisted_4$1
    ]),
    createBaseVNode("div", _hoisted_5$1, [
      createBaseVNode("div", _hoisted_6, [
        createBaseVNode("div", _hoisted_7, [
          createBaseVNode("div", _hoisted_8, [
            _hoisted_9,
            createBaseVNode("b", null, toDisplayString($data.selectedFile), 1),
            _hoisted_10
          ]),
          createBaseVNode("div", {
            class: "col d-inlineblock btn btn-success m-1",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.toggleUpload())
          }, "cancel "),
          createBaseVNode("div", {
            class: "col d-inlineblock btn btn-danger m-1",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.loadfile($data.selectedFile))
          }, "replace")
        ])
      ]),
      createBaseVNode("div", _hoisted_11, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.localfiles, (file) => {
          return openBlock(), createElementBlock("div", {
            class: "btn btn-dark me-2",
            onClick: ($event) => {
              $data.selectedFile = file;
              $options.toggleUpload();
            }
          }, [
            _hoisted_13,
            createTextVNode(" " + toDisplayString(file), 1)
          ], 8, _hoisted_12);
        }), 256))
      ]),
      $data.editor ? (openBlock(), createElementBlock("div", _hoisted_14, [
        createBaseVNode("button", {
          onClick: _cache[2] || (_cache[2] = ($event) => $data.editor.chain().focus().undo().run()),
          class: "btn btn-outline-warning p-1 me-1 mb-1"
        }, _hoisted_16),
        createBaseVNode("button", {
          onClick: _cache[3] || (_cache[3] = ($event) => $data.editor.chain().focus().redo().run()),
          class: "btn btn-outline-warning p-1 me-1 mb-1"
        }, _hoisted_18),
        createBaseVNode("button", {
          onClick: _cache[4] || (_cache[4] = ($event) => $data.editor.chain().focus().clearNodes().run()),
          class: "btn btn-outline-warning p-1 me-3 mb-1"
        }, _hoisted_20),
        createBaseVNode("button", {
          onClick: _cache[5] || (_cache[5] = ($event) => $data.editor.chain().focus().toggleBold().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("bold") }, "btn btn-outline-success p-1 me-1 mb-1"])
        }, _hoisted_22, 2),
        createBaseVNode("button", {
          onClick: _cache[6] || (_cache[6] = ($event) => $data.editor.chain().focus().toggleItalic().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("italic") }, "btn btn-outline-success p-1 me-1 mb-1"])
        }, _hoisted_24, 2),
        createBaseVNode("button", {
          onClick: _cache[7] || (_cache[7] = ($event) => $data.editor.chain().focus().toggleUnderline().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("underline") }, "btn btn-outline-success p-1 me-1 mb-1"])
        }, _hoisted_26, 2),
        createBaseVNode("button", {
          onClick: _cache[8] || (_cache[8] = ($event) => $data.editor.chain().focus().toggleHeading({ level: 2 }).run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("heading", { level: 2 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])
        }, "h2", 2),
        createBaseVNode("button", {
          onClick: _cache[9] || (_cache[9] = ($event) => $data.editor.chain().focus().toggleHeading({ level: 3 }).run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("heading", { level: 3 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])
        }, "h3", 2),
        createBaseVNode("button", {
          onClick: _cache[10] || (_cache[10] = ($event) => $data.editor.chain().focus().toggleHeading({ level: 4 }).run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("heading", { level: 4 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])
        }, "h4", 2),
        createBaseVNode("button", {
          onClick: _cache[11] || (_cache[11] = ($event) => $data.editor.chain().focus().toggleHeading({ level: 5 }).run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("heading", { level: 5 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])
        }, "h5", 2),
        createBaseVNode("button", {
          onClick: _cache[12] || (_cache[12] = ($event) => $data.editor.chain().focus().toggleSubscript().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("subscript") }, "btn btn-outline-success p-1 me-1 mb-1"])
        }, _hoisted_28, 2),
        createBaseVNode("button", {
          onClick: _cache[13] || (_cache[13] = ($event) => $data.editor.chain().focus().toggleSuperscript().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("superscript") }, "btn btn-outline-success p-1 me-2 mb-1"])
        }, _hoisted_30, 2),
        createBaseVNode("button", {
          onClick: _cache[14] || (_cache[14] = ($event) => $data.editor.chain().focus().toggleBulletList().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("bulletList") }, "btn btn-outline-info p-1 me-1 mb-1"])
        }, _hoisted_32, 2),
        createBaseVNode("button", {
          onClick: _cache[15] || (_cache[15] = ($event) => $data.editor.chain().focus().toggleOrderedList().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("orderedList") }, "btn btn-outline-info p-1 me-1 mb-1"])
        }, _hoisted_34, 2),
        createBaseVNode("button", {
          onClick: _cache[16] || (_cache[16] = ($event) => $data.editor.chain().focus().toggleCodeBlock().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("codeBlock") }, "btn btn-outline-secondary p-1 me-1 mb-1"])
        }, _hoisted_36, 2),
        createBaseVNode("button", {
          onClick: _cache[17] || (_cache[17] = ($event) => $data.editor.chain().focus().toggleCode().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("code") }, "btn btn-outline-secondary p-1 me-1 mb-1"])
        }, _hoisted_38, 2),
        createBaseVNode("button", {
          onClick: _cache[18] || (_cache[18] = ($event) => $data.editor.chain().focus().toggleBlockquote().run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive("blockquote") }, "btn btn-outline-info p-1 me-1 mb-1"])
        }, _hoisted_40, 2),
        createBaseVNode("button", {
          onClick: _cache[19] || (_cache[19] = ($event) => $data.editor.chain().focus().setHorizontalRule().run()),
          class: "btn btn-outline-info p-1 me-2 mb-1"
        }, _hoisted_42),
        createBaseVNode("button", {
          onClick: _cache[20] || (_cache[20] = ($event) => $data.editor.chain().focus().setTextAlign("left").run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive({ textAlign: "left" }) }, "btn btn-outline-info p-1 me-1 mb-1"])
        }, _hoisted_44, 2),
        createBaseVNode("button", {
          onClick: _cache[21] || (_cache[21] = ($event) => $data.editor.chain().focus().setTextAlign("center").run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive({ textAlign: "center" }) }, "btn btn-outline-info p-1 me-1 mb-1"])
        }, _hoisted_46, 2),
        createBaseVNode("button", {
          onClick: _cache[22] || (_cache[22] = ($event) => $data.editor.chain().focus().setTextAlign("right").run()),
          class: normalizeClass([{ "is-active": $data.editor.isActive({ textAlign: "right" }) }, "btn btn-outline-info p-1 me-2 mb-1"])
        }, _hoisted_48, 2),
        createBaseVNode("button", {
          onClick: _cache[23] || (_cache[23] = ($event) => $data.editor.chain().focus().setHardBreak().run()),
          class: "btn btn-outline-info p-1 me-2 mb-1"
        }, _hoisted_50)
      ])) : createCommentVNode("", true),
      createVNode(_component_editor_content, {
        editor: $data.editor,
        class: "p-0",
        id: "editorcontent"
      }, null, 8, ["editor"])
    ])
  ], 64);
}
var editor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  data() {
    return {
      currentFile: null,
      fetchinterval: null,
      servername: this.$route.params.servername,
      servertoken: this.$route.params.servertoken,
      serverip: this.$route.params.serverip,
      token: this.$route.params.token,
      clientname: this.$route.params.clientname
    };
  },
  mounted() {
    this.currentFile = this.clientname;
    if (this.token) {
      activatefocuscheck.call("", this);
    }
  },
  methods: {
    async fetchContent() {
      let body = document.body;
      let doc = new E("p", "px", "a4", true, true);
      let pagenumber = 0;
      let windowHeight = 0;
      html2canvas(body, {
        scale: 1,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        onclone: (document2) => {
          let body2 = document2.body;
          let html = document2.documentElement;
          windowHeight = Math.max(body2.scrollHeight, body2.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
          pagenumber = Math.ceil(windowHeight / 1123);
        }
      }).then(async () => {
        for (let i = 0; i < pagenumber; i++) {
          await new Promise((resolve) => {
            html2canvas(body, {
              scale: 1,
              x: 0,
              y: i * 1123,
              scrollX: 0,
              scrollY: 0,
              windowWidth: 794,
              windowHeight,
              onclone: (document2) => {
              }
            }).then((canvas) => {
              let img = canvas.toDataURL("image/jpeg", 1);
              doc.addImage(img, "JPG", 0, 0, 0, 0, i, "FAST");
              if (i + 1 == pagenumber) {
                const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
                const form = new FormData();
                form.append("file", pdfBlob, `${this.currentFile}.pdf`);
                form.append("editorcontent", false);
                form.append("currentfilename", this.currentFile);
                fetch(`http://localhost:3000/client/data/store`, { method: "POST", body: form }).then((response) => response.json()).then(async (data) => {
                  console.log(data);
                }).catch((err) => {
                  console.warn(err);
                });
              } else {
                doc.addPage();
              }
              resolve();
            });
          });
        }
      });
    }
  },
  beforeUnmount() {
    this.editor.destroy();
    clearInterval(this.fetchinterval);
    clearInterval(this.loadfilelistinterval);
  }
};
const _hoisted_1 = {
  id: "apphead",
  class: "w-100 p-3 text-white bg-dark shadow text-right"
};
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("img", {
  src: _imports_0$1,
  class: "white me-2",
  width: "32",
  height: "32"
}, null, -1);
const _hoisted_3 = { class: "fs-4 align-middle me-4" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("span", {
  class: "fs-4 align-middle",
  style: { "float": "right" }
}, "GeoGebra", -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("div", { id: "content" }, [
  /* @__PURE__ */ createBaseVNode("iframe", {
    id: "geogebraframe",
    src: "http://localhost:3000/geogebra/geometry.html"
  })
], -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", _hoisted_1, [
      _hoisted_2,
      createBaseVNode("span", _hoisted_3, toDisplayString($data.clientname), 1),
      _hoisted_4
    ]),
    _hoisted_5
  ], 64);
}
var geogebra = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const routes = [
  { path: "/", component: home },
  { path: "/student", component: student },
  { path: "/editor/:token", name: "editor", component: editor, beforeEnter: [checkToken] },
  { path: "/math/:token", name: "math", component: geogebra, beforeEnter: [checkToken] },
  { path: "/startserver", component: startserver },
  { path: "/serverlist", component: serverlist },
  { path: "/dashboard/:servername/:passwd", name: "dashboard", component: dashboard, beforeEnter: [checkPasswd] },
  { path: "/:pathMatch(.*)*", component: notfound }
];
async function checkToken(to, from) {
  let status = await axios.get(`http://localhost:3000/client/control/tokencheck/${to.params.token}`).then((response) => {
    return response.data.status;
  }).catch((err) => {
    console.log(err);
  });
  if (status === "success") {
    let clientinfo = await axios.get(`http://localhost:3000/client/control/getinfo`).then((response) => {
      return response.data.clientinfo;
    }).catch((err) => {
      console.log(err);
    });
    to.params.serverip = clientinfo.serverip;
    to.params.servername = clientinfo.servername;
    to.params.servertoken = clientinfo.servertoken;
    to.params.clientname = clientinfo.name;
    return true;
  } else {
    console.log("token error");
    return { path: "/student" };
  }
}
async function checkPasswd(to) {
  let res = await axios.get(`http://localhost:3000/server/control/checkpasswd/${to.params.servername}/${to.params.passwd}`).then((response) => {
    return response.data;
  }).catch((err) => {
    console.log(err);
  });
  if (res.status === "success") {
    to.params.pin = res.data.pin;
    to.params.servertoken = res.data.servertoken;
    to.params.serverip = res.data.serverip;
    console.log("password ok");
    return true;
  } else {
    console.log("password error");
    return { path: "/startserver" };
  }
}
function createRouter() {
  return createRouter$1({ history: createWebHistory(), routes });
}
const router = createRouter();
const app = createSSRApp(App);
app.config.unwrapInjectedRef = true;
app.use(router);
router.isReady().then(() => {
  app.mount("#app");
});
