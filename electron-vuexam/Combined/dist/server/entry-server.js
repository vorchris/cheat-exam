"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var serverRenderer = require("vue/server-renderer");
var path = require("path");
var vue = require("vue");
var vueRouter = require("vue-router");
var axios = require("axios");
var $ = require("jquery");
var FormData$1 = require("form-data");
var vue3 = require("@tiptap/vue-3");
var TextAlign = require("@tiptap/extension-text-align");
var Document = require("@tiptap/extension-document");
var Paragraph = require("@tiptap/extension-paragraph");
var Text = require("@tiptap/extension-text");
var CodeBlockLowlight = require("@tiptap/extension-code-block-lowlight");
var Blockquote = require("@tiptap/extension-blockquote");
var BulletList = require("@tiptap/extension-bullet-list");
var HardBreak = require("@tiptap/extension-hard-break");
var ListItem = require("@tiptap/extension-list-item");
var HorizontalRule = require("@tiptap/extension-horizontal-rule");
var Heading = require("@tiptap/extension-heading");
var OrderedList = require("@tiptap/extension-ordered-list");
var Bold = require("@tiptap/extension-bold");
var Code = require("@tiptap/extension-code");
var Italic = require("@tiptap/extension-italic");
var Underline = require("@tiptap/extension-underline");
var Subscript = require("@tiptap/extension-subscript");
var Superscript = require("@tiptap/extension-superscript");
var Dropcursor = require("@tiptap/extension-dropcursor");
var Gapcursor = require("@tiptap/extension-gapcursor");
var History = require("@tiptap/extension-history");
var html2canvas = require("html2canvas");
var jsPDF = require("jspdf");
var lowlight = require("lowlight");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var axios__default = /* @__PURE__ */ _interopDefaultLegacy(axios);
var $__default = /* @__PURE__ */ _interopDefaultLegacy($);
var FormData__default = /* @__PURE__ */ _interopDefaultLegacy(FormData$1);
var TextAlign__default = /* @__PURE__ */ _interopDefaultLegacy(TextAlign);
var Document__default = /* @__PURE__ */ _interopDefaultLegacy(Document);
var Paragraph__default = /* @__PURE__ */ _interopDefaultLegacy(Paragraph);
var Text__default = /* @__PURE__ */ _interopDefaultLegacy(Text);
var CodeBlockLowlight__default = /* @__PURE__ */ _interopDefaultLegacy(CodeBlockLowlight);
var Blockquote__default = /* @__PURE__ */ _interopDefaultLegacy(Blockquote);
var BulletList__default = /* @__PURE__ */ _interopDefaultLegacy(BulletList);
var HardBreak__default = /* @__PURE__ */ _interopDefaultLegacy(HardBreak);
var ListItem__default = /* @__PURE__ */ _interopDefaultLegacy(ListItem);
var HorizontalRule__default = /* @__PURE__ */ _interopDefaultLegacy(HorizontalRule);
var Heading__default = /* @__PURE__ */ _interopDefaultLegacy(Heading);
var OrderedList__default = /* @__PURE__ */ _interopDefaultLegacy(OrderedList);
var Bold__default = /* @__PURE__ */ _interopDefaultLegacy(Bold);
var Code__default = /* @__PURE__ */ _interopDefaultLegacy(Code);
var Italic__default = /* @__PURE__ */ _interopDefaultLegacy(Italic);
var Underline__default = /* @__PURE__ */ _interopDefaultLegacy(Underline);
var Subscript__default = /* @__PURE__ */ _interopDefaultLegacy(Subscript);
var Superscript__default = /* @__PURE__ */ _interopDefaultLegacy(Superscript);
var Dropcursor__default = /* @__PURE__ */ _interopDefaultLegacy(Dropcursor);
var Gapcursor__default = /* @__PURE__ */ _interopDefaultLegacy(Gapcursor);
var History__default = /* @__PURE__ */ _interopDefaultLegacy(History);
var html2canvas__default = /* @__PURE__ */ _interopDefaultLegacy(html2canvas);
var jsPDF__default = /* @__PURE__ */ _interopDefaultLegacy(jsPDF);
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$9 = {};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs) {
  const _component_router_view = vue.resolveComponent("router-view");
  _push(serverRenderer.ssrRenderComponent(_component_router_view, _attrs, {
    default: vue.withCtx(({ Component }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        serverRenderer.ssrRenderSuspense(_push2, {
          default: () => {
            serverRenderer.ssrRenderVNode(_push2, vue.createVNode(vue.resolveDynamicComponent(Component), null, null), _parent2, _scopeId);
          },
          _: 2
        });
      } else {
        return [
          (vue.openBlock(), vue.createBlock(vue.Suspense, null, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component)))
            ]),
            _: 2
          }, 1024))
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var App = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$9]]);
var _imports_1$1 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/server.cf9ece14.svg";
var _imports_0$1 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/speedometer.fcbb4a67.svg";
var _imports_2$2 = "/home/student/Local/DEV/Electron/electron-vuexam/dist/assets/shield-lock.4c0b22ca.svg";
const _sfc_main$8 = {};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs) {
  const _component_router_link = vue.resolveComponent("router-link");
  _push(`<!--[--><div class="w-100 p-3 text-white bg-dark shadow text-right">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "/",
    class: "text-white m-1"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_1$1)} class="white me-2" width="32" height="32"${_scopeId}><span class="fs-4 align-middle me-4"${_scopeId}>Next-Exam</span>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_1$1,
            class: "white me-2",
            width: "32",
            height: "32"
          }),
          vue.createVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">Welcome</span></div><div id="wrapper" class="w-100 h-100 d-flex"><div id="container" class="fadeinslow text-center"><div class="position-absolute start-50 translate-middle text-center" style="${serverRenderer.ssrRenderStyle({ "top": "30vh", "min-width": "268px" })}"><div class="row position-relative text-center p-3"><h4> choose your role </h4></div><div class="row justify-content-md-center"><div class="col">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "student",
    id: "studentbutton",
    class: "text-center btn btn-lg btn-success position-relative p-3 m-2 padding-lr-2"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_0$1)} class="white" width="32" height="32"${_scopeId}><svg width="1.5em" height="1.5em" viewBox="0 0 16 14" class="arrow position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill" fill="#198754" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"${_scopeId}></path></svg>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_0$1,
            class: "white",
            width: "32",
            height: "32"
          }),
          (vue.openBlock(), vue.createBlock("svg", {
            width: "1.5em",
            height: "1.5em",
            viewBox: "0 0 16 14",
            class: "arrow position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill",
            fill: "#198754",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            vue.createVNode("path", { d: "M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" })
          ]))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="col">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "startserver",
    id: "teacherbutton",
    class: "text-center btn btn-lg btn-success position-relative p-3 m-2 padding-lr-2"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_2$2)} class="white" width="32" height="32"${_scopeId}><svg width="1.5em" height="1.5em" viewBox="0 0 16 14" class="arrow position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill" fill="#198754" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"${_scopeId}></path></svg>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_2$2,
            class: "white",
            width: "32",
            height: "32"
          }),
          (vue.openBlock(), vue.createBlock("svg", {
            width: "1.5em",
            height: "1.5em",
            viewBox: "0 0 16 14",
            class: "arrow position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill",
            fill: "#198754",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            vue.createVNode("path", { d: "M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" })
          ]))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><div class="row"><div class="col m-1"> Student </div><div class="col m-1"> Teacher </div></div></div></div></div><!--]-->`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/home.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var home = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$8]]);
const _sfc_main$7 = {};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs) {
  const _component_router_link = vue.resolveComponent("router-link");
  _push(`<!--[--><div class="w-100 p-3 text-white bg-dark shadow text-right">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "/",
    class: "text-white m-1"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_1$1)} class="white me-2" width="32" height="32"${_scopeId}><span class="fs-4 align-middle me-4"${_scopeId}>Next-Exam</span>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_1$1,
            class: "white me-2",
            width: "32",
            height: "32"
          }),
          vue.createVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">Welcome</span></div><div id="wrapper" class="w-100 h-100 d-flex"><div id="container" class="fadeinslow text-center"><div class="position-absolute start-50 translate-middle text-center" style="${serverRenderer.ssrRenderStyle({ "top": "30vh", "min-width": "268px" })}"><div class="row position-relative text-center p-3"><h4> Error 404 </h4></div><div class="row justify-content-md-center"></div><div class="row"></div></div></div></div><!--]-->`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/notfound.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var notfound = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7]]);
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
      axios__default["default"].get("/client/control/getinfo").then((response) => {
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
      $__default["default"](`#${servername}`).val("registering...");
      await axios__default["default"].get(`http://localhost:3000/client/control/register/${serverip}/${servername}/${this.pincode}/${this.username}`).then((response) => {
        this.status(response.data.message);
        console.log(response.data.message);
      }).catch((err) => console.log(err));
    },
    async status(text) {
      $__default["default"]("#statusdiv").text(text);
      $__default["default"]("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $__default["default"]("#statusdiv").fadeOut("slow");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  },
  mounted() {
    $__default["default"]("#statusdiv").fadeOut("slow");
    this.fetchInfo();
    this.fetchinterval = setInterval(() => {
      this.fetchInfo();
    }, 2e3);
  },
  beforeUnmount() {
    clearInterval(this.fetchinterval);
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue.resolveComponent("router-link");
  _push(`<!--[--><div id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "/",
    class: "text-white m-1"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_0$1)} class="white me-2" width="32" height="32"${_scopeId}><span class="fs-4 align-middle me-4"${_scopeId}>Next-Exam</span>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_0$1,
            class: "white me-2",
            width: "32",
            height: "32"
          }),
          vue.createVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">Student</span></div><div id="wrapper" class="w-100 h-100 d-flex"><div class="p-3 text-white bg-dark h-100" style="${serverRenderer.ssrRenderStyle({ "width": "240px", "min-width": "240px" })}"><ul class="nav nav-pills flex-column mb-auto"><li class="nav-item">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "student",
    id: "exams",
    class: "nav-link active"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_1$1)} class="white me-2" width="16" height="16"${_scopeId}> Running Exams `);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_1$1,
            class: "white me-2",
            width: "16",
            height: "16"
          }),
          vue.createTextVNode(" Running Exams ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "/editor/" + $data.clientinfo.token,
    class: "nav-link"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_3$1)} class="white me-2" width="16" height="16"${_scopeId}> Editor `);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_3$1,
            class: "white me-2",
            width: "16",
            height: "16"
          }),
          vue.createTextVNode(" Editor ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul><div class="m-2"><br><div id="statusdiv" class="btn btn-warning m-2"> Client started </div></div></div><div id="content" class="fadeinslow p-3">`);
  if (!$data.remoterequest) {
    _push(`<div class="col-8"><div class="input-group mb-1"><span class="input-group-text col-3" style="${serverRenderer.ssrRenderStyle({ "min-width": "120px" })}" id="inputGroup-sizing-lg">Username</span><div class="col-sm-7"><input${serverRenderer.ssrRenderAttr("value", $data.username)} type="text" class="form-control" id="user" placeholder="Thomas"></div></div><div class="input-group mb-3"><span class="input-group-text col-3" style="${serverRenderer.ssrRenderStyle({ "min-width": "120px" })}" id="inputGroup-sizing-lg">Pincode</span><div class="col-sm-7"><input${serverRenderer.ssrRenderAttr("value", $data.pincode)} type="text" class="form-control" id="pin" placeholder="1337"></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<h4>Running Exams</h4><div id="list" class="placeholder"><!--[-->`);
  serverRenderer.ssrRenderList($data.serverlist, (server) => {
    _push(`<div class="row p-3 m-0 mb-2 border bg-light" style="${serverRenderer.ssrRenderStyle({ "margin-right": "10px !important", "width": "300px", "min-width": "250px" })}"><dl class="row"><dt class="col-sm-4">Name</dt><dd class="col-sm-8">${serverRenderer.ssrInterpolate(server.servername)}</dd></dl>`);
    if (!$data.token) {
      _push(`<input${serverRenderer.ssrRenderAttr("id", server.servername)} type="button" name="register" class="btn btn-info" value="register">`);
    } else {
      _push(`<!---->`);
    }
    if ($data.token && $data.clientinfo.servername !== server.servername) {
      _push(`<input${serverRenderer.ssrRenderAttr("id", server.servername)} type="button" name="register" class="btn btn-secondary" value="register">`);
    } else {
      _push(`<!---->`);
    }
    if ($data.token && $data.clientinfo.servername === server.servername) {
      _push(`<input${serverRenderer.ssrRenderAttr("id", server.servername)} type="button" name="register" class="btn btn-success" value="registered">`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  });
  _push(`<!--]--></div></div></div><!--]-->`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/student.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var student = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6]]);
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
      await axios__default["default"].get(`http://${window.location.host}/server/control/start/${this.servername}/${this.pincode}/${this.password}`).then(async (response) => {
        this.status(response.data.message);
        await this.sleep(1e3);
        this.$router.push({ path: "/serverlist" });
      }).catch((err) => {
        this.status(err);
      });
    },
    async status(text) {
      $__default["default"]("#statusdiv").text(text);
      $__default["default"]("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $__default["default"]("#statusdiv").fadeOut("slow");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  },
  mounted() {
    if (this.prod) {
      $__default["default"]("#servername").val("");
      $__default["default"]("#pin").val("");
      $__default["default"]("#password").val("");
    }
  },
  beforeUnmount() {
    clearInterval(this.fetchinterval);
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue.resolveComponent("router-link");
  _push(`<!--[--><div class="w-100 p-3 text-white bg-dark shadow text-right">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "/",
    class: "text-white m-1"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_0)} class="white me-2" width="32" height="32"${_scopeId}><span class="fs-4 align-middle me-4"${_scopeId}>Next-Exam</span>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_0,
            class: "white me-2",
            width: "32",
            height: "32"
          }),
          vue.createVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">Teacher</span></div><div id="wrapper" class="w-100 h-100 d-flex"><div class="p-3 text-white bg-dark h-100" style="${serverRenderer.ssrRenderStyle({ "width": "240px", "min-width": "240px" })}"><ul class="nav nav-pills flex-column mb-auto"><li class="nav-item"><a href="/startserver" id="startserver" class="nav-link active"><img${serverRenderer.ssrRenderAttr("src", _imports_1$1)} class="white me-2" width="16" height="16"> Start Exam Server </a></li><li><a href="/serverlist" id="serverlist" class="nav-link"><img${serverRenderer.ssrRenderAttr("src", _imports_2$1)} class="white me-2" width="16" height="16"> Server List </a></li><li><a href="#" class="nav-link"><img${serverRenderer.ssrRenderAttr("src", _imports_3$1)} class="white me-2" width="16" height="16"> Help </a></li></ul><div class="m-2"><br><div id="statusdiv" class="btn btn-warning m-2 hidden"> connected </div></div><br></div><div id="content" class="fadeinslow p-3"><div class="col-7"><div class="input-group mb-1"><span class="input-group-text col-4" style="${serverRenderer.ssrRenderStyle({ "min-width": "120px" })}" id="inputGroup-sizing-lg">Exam Name</span><div class="col-sm-7"><input${serverRenderer.ssrRenderAttr("value", $data.servername)} type="text" class="form-control" id="servername" placeholder="Mathematik-5a"></div></div><div class="input-group mb-1"><span class="input-group-text col-4" style="${serverRenderer.ssrRenderStyle({ "min-width": "120px" })}" id="inputGroup-sizing-lg">Pincode</span><div class="col-sm-7"><input${serverRenderer.ssrRenderAttr("value", $data.pincode)} type="text" class="form-control" id="pin" placeholder="1337"></div></div><div class="input-group mb-3"><span class="input-group-text col-4" style="${serverRenderer.ssrRenderStyle({ "min-width": "120px" })}" id="inputGroup-sizing-lg">Password</span><div class="col-sm-7"><input${serverRenderer.ssrRenderAttr("value", $data.password)} type="text" class="form-control" id="password" placeholder="password"></div></div><div class="col mb-4"><button id="examstart" class="btn btn-success" value="start exam">Start New Exam Server</button></div></div><div id="list" class="placeholder"></div></div></div><!--]-->`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/startserver.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var startserver = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5]]);
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
      axios__default["default"].get(`http://${this.serverip}:3000/server/control/studentlist/${this.servername}/${this.servertoken}`).then((response) => {
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
      const formData = new FormData__default["default"]();
      formData.append("servertoken", this.servertoken);
      formData.append("servername", this.servername);
      for (const i of Object.keys(this.files)) {
        formData.append("files", this.files[i]);
      }
      axios__default["default"]({
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
      axios__default["default"].get(`http://${this.serverip}:3000/server/control/stopserver/${this.servername}/${this.servertoken}`).then(async (response) => {
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
            axios__default["default"].get(`http://${student2.clientip}:3000/client/control/exammode/start/${student2.token}/${this.examtype}`).then((response) => {
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
            axios__default["default"].get(`http://${student2.clientip}:3000/client/control/exammode/stop/${student2.token}`).then(async (response) => {
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
            axios__default["default"].get(`http://${student2.clientip}:3000/client/data/abgabe/send/${student2.token}`).then((response) => {
              console.log(response.data.message);
            }).catch((error) => {
              console.log(error);
            });
          });
        }
      }
    },
    kick(studenttoken, studentip) {
      axios__default["default"].get(`http://${this.serverip}:3000/server/control/kick/${this.servername}/${this.servertoken}/${studenttoken}`).then((response) => {
        console.log(response.data);
        this.status(response.data.message);
      }).catch((error) => {
        console.log(error);
      });
      axios__default["default"].get(`http://${studentip}:3000/client/control/kick/${studenttoken}`).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    async restore(studenttoken) {
      await axios__default["default"].get(`http://${this.serverip}:3000/server/control/studentlist/statechange/${this.servername}/${studenttoken}/true`).then(async (response) => {
        this.status(response.data.message);
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    toggleUpload() {
      let status = $__default["default"]("#uploaddiv").css("display");
      if (status == "none") {
        $__default["default"]("#uploaddiv").css("display", "block");
        $__default["default"]("#formFileMultiple").val("");
      } else {
        $__default["default"]("#uploaddiv").css("display", "none");
      }
    },
    async task2(token, ip) {
      axios__default["default"].get(`http://${ip}:3000/client/control/tokencheck/${token}`).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    async status(text) {
      $__default["default"]("#statusdiv").text(text);
      $__default["default"]("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $__default["default"]("#statusdiv").fadeOut("slow");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  },
  mounted() {
    $__default["default"]("#statusdiv").fadeOut("slow");
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
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue.resolveComponent("router-link");
  _push(`<!--[--><div class="w-100 p-3 text-white bg-dark shadow text-right">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "/",
    class: "text-white m-1"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_0$1)} class="white me-2" width="32" height="32"${_scopeId}><span class="fs-4 align-middle me-4"${_scopeId}>Next-Exam</span>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_0$1,
            class: "white me-2",
            width: "32",
            height: "32"
          }),
          vue.createVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">Dashboard</span></div><div id="wrapper" class="w-100 h-100 d-flex"><div class="p-3 text-white bg-dark h-100" style="${serverRenderer.ssrRenderStyle({ "width": "240px", "min-width": "240px" })}"><div class="btn btn-light m-1 text-start">Name <br><b>${serverRenderer.ssrInterpolate(_ctx.$route.params.servername)}</b></div><br><div class="btn btn-light m-1 mb-1 text-start">Pin <br><b>${serverRenderer.ssrInterpolate(_ctx.$route.params.pin)}</b></div><br><div class="btn btn-danger m-1 mb-3 text-start">Stop Server</div><br><div class="form-check m-1"><input${serverRenderer.ssrIncludeBooleanAttr(serverRenderer.ssrLooseEqual($data.examtype, "language")) ? " checked" : ""} value="language" class="form-check-input" type="radio" name="examtype" id="examtype1" checked><label class="form-check-label" for="examtype1"> Texteditor </label></div><div class="form-check m-1 mb-2"><input${serverRenderer.ssrIncludeBooleanAttr(serverRenderer.ssrLooseEqual($data.examtype, "math")) ? " checked" : ""} value="math" class="form-check-input" type="radio" name="examtype" id="examtype2"><label class="form-check-label" for="examtype2"> Geogebra </label></div><div class="form-check form-switch m-1 mb-4"><input${serverRenderer.ssrIncludeBooleanAttr(Array.isArray($data.autoabgabe) ? serverRenderer.ssrLooseContain($data.autoabgabe, null) : $data.autoabgabe) ? " checked" : ""} class="form-check-input" type="checkbox" id="autoabgabe"><label class="form-check-label" for="flexSwitchCheckDefault">Auto Abgabe</label></div><div id="statusdiv" class="btn btn-warning m-1"> connected </div></div><div id="uploaddiv" class="fadeinslow"><form id="uploadform" method="POST" enctype="multipart/form-data"><div class="mb-3"><label for="formFileMultiple" class="form-label">Send Files to ALL Clients</label><div class="btn-close d-inline float-end"></div><input class="form-control" type="file" name="files" id="formFileMultiple" multiple><input class="form-control" type="hidden" name="servertoken" id="servertoken"${serverRenderer.ssrRenderAttr("value", $data.servertoken)}><input class="form-control" type="hidden" name="servername" id="servername"${serverRenderer.ssrRenderAttr("value", $data.servername)}></div><input type="buttom" name="submit" class="btn btn-info" value="senden"></form></div><div id="content" class="fadeinslow p-3"><div class="btn btn-success m-1 text-start" style="${serverRenderer.ssrRenderStyle({ "width": "100px" })}">Exam starten</div><div class="btn btn-info m-1 text-start" style="${serverRenderer.ssrRenderStyle({ "width": "100px" })}">Datei senden</div><div class="btn btn-info m-1 text-start" style="${serverRenderer.ssrRenderStyle({ "width": "100px" })}">Abgabe holen</div><div class="btn btn-danger m-1 text-start" style="${serverRenderer.ssrRenderStyle({ "width": "100px" })}">Exam beenden</div><div id="studentslist" class="placeholder pt-4"><!--[-->`);
  serverRenderer.ssrRenderList($data.studentlist, (student2) => {
    _push(`<div class="${serverRenderer.ssrRenderClass([!student2.focus ? "focuswarn" : "", "studentwidget btn border-0 rounded-3 btn-block m-1"])}"><div id="image" class="rounded" style="${serverRenderer.ssrRenderStyle(["background-image:url(/files/" + student2.token + ".jpg?ver=" + student2.timestamp + ")", { "position": "relative", "height": "75%", "background-size": "cover" }])}"><span style="${serverRenderer.ssrRenderStyle({})}">${serverRenderer.ssrInterpolate(student2.clientname)} <button type="button" class="btn-close btn-close-white pt-2 pe-2 float-end" title="kick user"></button></span></div><div class="btn-group pt-0" role="group">`);
    if ($data.now - 6e4 < student2.timestamp) {
      _push(`<button type="button" class="btn btn-outline-success btn-sm" style="${serverRenderer.ssrRenderStyle({ "border-top-left-radius": "0px", "border-top-right-radius": "0px" })}">send</button>`);
    } else {
      _push(`<!---->`);
    }
    if ($data.now - 6e4 < student2.timestamp) {
      _push(`<button type="button" class="btn btn-outline-success btn-sm" style="${serverRenderer.ssrRenderStyle({ "border-top-left-radius": "0px", "border-top-right-radius": "0px" })}">get</button>`);
    } else {
      _push(`<!---->`);
    }
    if (!student2.focus && $data.now - 6e4 < student2.timestamp) {
      _push(`<button type="button" class="btn btn-danger btn-sm" style="${serverRenderer.ssrRenderStyle({ "border-top-left-radius": "0px", "border-top-right-radius": "0px" })}">restore</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
  });
  _push(`<!--]--></div></div></div><!--]-->`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/dashboard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var dashboard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);
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
      axios__default["default"].get("/server/control/serverlist").then((response) => {
        this.serverlist = response.data.serverlist;
      }).catch((err) => {
        console.log(err);
      });
    },
    login(servername) {
      let password = $__default["default"](`#${servername}`).val();
      window.location.href = `/dashboard/${servername}/${password}`;
    },
    async status(text) {
      $__default["default"]("#statusdiv").text(text);
      $__default["default"]("#statusdiv").fadeIn("slow");
      await this.sleep(2e3);
      $__default["default"]("#statusdiv").fadeOut("slow");
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
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = vue.resolveComponent("router-link");
  _push(`<!--[--><div class="w-100 p-3 text-white bg-dark shadow text-right">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "/",
    class: "text-white m-1"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_0)} class="white me-2" width="32" height="32"${_scopeId}><span class="fs-4 align-middle me-4"${_scopeId}>Next-Exam</span>`);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_0,
            class: "white me-2",
            width: "32",
            height: "32"
          }),
          vue.createVNode("span", { class: "fs-4 align-middle me-4" }, "Next-Exam")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">Teacher</span></div><div id="wrapper" class="w-100 h-100 d-flex"><div class="p-3 text-white bg-dark h-100" style="${serverRenderer.ssrRenderStyle({ "width": "240px", "min-width": "240px" })}"><ul class="nav nav-pills flex-column mb-auto"><li class="nav-item">`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "startserver",
    id: "startserver",
    class: "nav-link"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_1$1)} class="white me-2" width="16" height="16"${_scopeId}> Start Exam Server `);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_1$1,
            class: "white me-2",
            width: "16",
            height: "16"
          }),
          vue.createTextVNode(" Start Exam Server ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "serverlist",
    id: "serverlist",
    class: "nav-link active"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_2$1)} class="white me-2" width="16" height="16"${_scopeId}> Server List `);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_2$1,
            class: "white me-2",
            width: "16",
            height: "16"
          }),
          vue.createTextVNode(" Server List ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.ssrRenderComponent(_component_router_link, {
    to: "#",
    class: "nav-link"
  }, {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${serverRenderer.ssrRenderAttr("src", _imports_3$1)} class="white me-2" width="16" height="16"${_scopeId}> Help `);
      } else {
        return [
          vue.createVNode("img", {
            src: _imports_3$1,
            class: "white me-2",
            width: "16",
            height: "16"
          }),
          vue.createTextVNode(" Help ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul><div class="m-2"><br><div id="statusdiv" class="btn btn-warning m-2 hidden"></div></div><br></div><div id="content" class="fadeinslow p-3"><div id="list" class="container-fluid m-0 p-0"><div class="row g-2"><!--[-->`);
  serverRenderer.ssrRenderList($data.serverlist, (server) => {
    _push(`<div class="col-6" style="${serverRenderer.ssrRenderStyle({ "min-width": "280px", "max-width": "320px" })}"><div class="p-3 border bg-light"><dl class="row mb-0"><dt class="col-sm-4 p-1">Name</dt><dd class="col-sm-8 p-1">${serverRenderer.ssrInterpolate(server.servername)}</dd><dt class="col-sm-4 p-1">IP Address</dt><dd class="col-sm-8 p-1">${serverRenderer.ssrInterpolate(server.serverip)}</dd><dt class="col-sm-4 p-1 pt-2">Password</dt><dd class="col-sm-8 p-1"><input${serverRenderer.ssrRenderAttr("id", server.servername)} type="password" class="form-control" placeholder="password"${serverRenderer.ssrRenderAttr("value", $data.password)}><input type="button" name="login" class="btn btn-success mt-1" value="Log In"></dd></dl></div></div>`);
  });
  _push(`<!--]--></div></div></div></div><!--]-->`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/serverlist.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var serverlist = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
var CodeBlockComponent_vue_vue_type_style_index_0_lang = "";
const _sfc_main$2 = {
  components: {
    NodeViewWrapper: vue3.NodeViewWrapper,
    NodeViewContent: vue3.NodeViewContent
  },
  props: vue3.nodeViewProps,
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
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_node_view_wrapper = vue.resolveComponent("node-view-wrapper");
  const _component_node_view_content = vue.resolveComponent("node-view-content");
  _push(serverRenderer.ssrRenderComponent(_component_node_view_wrapper, vue.mergeProps({ class: "code-block" }, _attrs), {
    default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<select contenteditable="false"${_scopeId}><option${serverRenderer.ssrRenderAttr("value", null)}${_scopeId}> auto </option><option disabled${_scopeId}> \u2014 </option><!--[-->`);
        serverRenderer.ssrRenderList($data.languages, (language, index) => {
          _push2(`<option${serverRenderer.ssrRenderAttr("value", language)}${_scopeId}>${serverRenderer.ssrInterpolate(language)}</option>`);
        });
        _push2(`<!--]--></select><pre${_scopeId}><code${_scopeId}>`);
        _push2(serverRenderer.ssrRenderComponent(_component_node_view_content, null, null, _parent2, _scopeId));
        _push2(`</code></pre>`);
      } else {
        return [
          vue.withDirectives(vue.createVNode("select", {
            contenteditable: "false",
            "onUpdate:modelValue": ($event) => $options.selectedLanguage = $event
          }, [
            vue.createVNode("option", { value: null }, " auto "),
            vue.createVNode("option", { disabled: "" }, " \u2014 "),
            (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($data.languages, (language, index) => {
              return vue.openBlock(), vue.createBlock("option", {
                value: language,
                key: index
              }, vue.toDisplayString(language), 9, ["value"]);
            }), 128))
          ], 8, ["onUpdate:modelValue"]), [
            [vue.vModelSelect, $options.selectedLanguage]
          ]),
          vue.createVNode("pre", null, [
            vue.createVNode("code", null, [
              vue.createVNode(_component_node_view_content)
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/CodeBlockComponent.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var CodeBlockComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const activatefocuscheck = (vue2) => {
  let hidden, visibilityChange;
  const focusevent = new Event("focuslost");
  window.addEventListener("focuslost", async function(e) {
    console.log("houston we have a problem");
    await fetch(`http://${vue2.serverip}:3000/server/control/studentlist/statechange/${vue2.servername}/${vue2.token}/false`).then((response) => response.json()).then(async (data) => {
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
    EditorContent: vue3.EditorContent
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
    this.editor = new vue3.Editor({
      extensions: [
        Blockquote__default["default"],
        BulletList__default["default"],
        Document__default["default"],
        HardBreak__default["default"],
        Heading__default["default"],
        HorizontalRule__default["default"],
        ListItem__default["default"],
        OrderedList__default["default"],
        Paragraph__default["default"],
        Text__default["default"],
        Bold__default["default"],
        Code__default["default"],
        Italic__default["default"],
        Subscript__default["default"],
        Superscript__default["default"],
        Underline__default["default"],
        Dropcursor__default["default"],
        Gapcursor__default["default"],
        History__default["default"],
        TextAlign__default["default"].configure({
          types: ["heading", "paragraph"]
        }),
        CodeBlockLowlight__default["default"].extend({
          addNodeView() {
            return vue3.VueNodeViewRenderer(CodeBlockComponent);
          }
        }).configure({
          lowlight: lowlight.lowlight
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
      let status = $__default["default"]("#uploaddiv").css("display");
      if (status == "none") {
        $__default["default"]("#uploaddiv").css("display", "block");
        $__default["default"]("#formFileMultiple").val("");
      } else {
        $__default["default"]("#uploaddiv").css("display", "none");
      }
    },
    async fetchContent() {
      let body = document.body;
      let doc = new jsPDF__default["default"]("p", "px", "a4", true, true);
      let pagenumber = 0;
      let windowHeight = 0;
      html2canvas__default["default"](body, {
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
            html2canvas__default["default"](body, {
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
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_editor_content = vue.resolveComponent("editor-content");
  _push(`<!--[--><div class="w-100 p-3 text-white bg-dark shadow text-right"><img${serverRenderer.ssrRenderAttr("src", _imports_0$1)} class="white me-2" width="32" height="32"><span class="fs-4 align-middle me-4">${serverRenderer.ssrInterpolate($data.clientname)}</span><span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">Next-Exam Writer</span></div><div id="editorcontainer"><div id="uploaddiv" class="fadeinslow p-4"><div class="mb-3 row"><div class="mb-3">Wollen sie den Inhalt des Editors durch den Inhalt der Datei <b>${serverRenderer.ssrInterpolate($data.selectedFile)}</b> ersetzen?</div><div class="col d-inlineblock btn btn-success m-1">cancel </div><div class="col d-inlineblock btn btn-danger m-1">replace</div></div></div><div id="localfiles" class="mb-2"><!--[-->`);
  serverRenderer.ssrRenderList($data.localfiles, (file) => {
    _push(`<div class="btn btn-dark me-2"><img${serverRenderer.ssrRenderAttr("src", _imports_1)} class="" width="22" height="22"> ${serverRenderer.ssrInterpolate(file)}</div>`);
  });
  _push(`<!--]--></div>`);
  if ($data.editor) {
    _push(`<div class="mb-2" id="editortoolbar"><button class="btn btn-outline-warning p-1 me-1 mb-1"><img${serverRenderer.ssrRenderAttr("src", _imports_2)} class="white" width="22" height="22"></button><button class="btn btn-outline-warning p-1 me-1 mb-1"><img${serverRenderer.ssrRenderAttr("src", _imports_3)} class="white" width="22" height="22"></button><button class="btn btn-outline-warning p-1 me-3 mb-1"><img${serverRenderer.ssrRenderAttr("src", _imports_4)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("bold") }, "btn btn-outline-success p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_5)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("italic") }, "btn btn-outline-success p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_6)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("underline") }, "btn btn-outline-success p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_7)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("heading", { level: 2 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])}">h2</button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("heading", { level: 3 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])}">h3</button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("heading", { level: 4 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])}">h4</button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("heading", { level: 5 }) }, "btn btn-outline-dark p-1 me-1 mb-1"])}">h5</button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("subscript") }, "btn btn-outline-success p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_8)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("superscript") }, "btn btn-outline-success p-1 me-2 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_9)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("bulletList") }, "btn btn-outline-info p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_10)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("orderedList") }, "btn btn-outline-info p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_11)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("codeBlock") }, "btn btn-outline-secondary p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_12)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("code") }, "btn btn-outline-secondary p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_13)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive("blockquote") }, "btn btn-outline-info p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_14)} class="white" width="22" height="22"></button><button class="btn btn-outline-info p-1 me-2 mb-1"><img${serverRenderer.ssrRenderAttr("src", _imports_15)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive({ textAlign: "left" }) }, "btn btn-outline-info p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_16)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive({ textAlign: "center" }) }, "btn btn-outline-info p-1 me-1 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_17)} class="white" width="22" height="22"></button><button class="${serverRenderer.ssrRenderClass([{ "is-active": $data.editor.isActive({ textAlign: "right" }) }, "btn btn-outline-info p-1 me-2 mb-1"])}"><img${serverRenderer.ssrRenderAttr("src", _imports_18)} class="white" width="22" height="22"></button><button class="btn btn-outline-info p-1 me-2 mb-1"><img${serverRenderer.ssrRenderAttr("src", _imports_19)} class="white" width="22" height="22"></button></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(serverRenderer.ssrRenderComponent(_component_editor_content, {
    editor: $data.editor,
    class: "p-0",
    id: "editorcontent"
  }, null, _parent));
  _push(`</div><!--]-->`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/editor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var editor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
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
      let doc = new jsPDF__default["default"]("p", "px", "a4", true, true);
      let pagenumber = 0;
      let windowHeight = 0;
      html2canvas__default["default"](body, {
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
            html2canvas__default["default"](body, {
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
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[--><div id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right"><img${serverRenderer.ssrRenderAttr("src", _imports_0$1)} class="white me-2" width="32" height="32"><span class="fs-4 align-middle me-4">${serverRenderer.ssrInterpolate($data.clientname)}</span><span class="fs-4 align-middle" style="${serverRenderer.ssrRenderStyle({ "float": "right" })}">GeoGebra</span></div><div id="content"><iframe id="geogebraframe" src="http://localhost:3000/geogebra/geometry.html"></iframe></div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/geogebra.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var geogebra = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
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
  let status = await axios__default["default"].get(`http://localhost:3000/client/control/tokencheck/${to.params.token}`).then((response) => {
    return response.data.status;
  }).catch((err) => {
    console.log(err);
  });
  if (status === "success") {
    let clientinfo = await axios__default["default"].get(`http://localhost:3000/client/control/getinfo`).then((response) => {
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
  let res = await axios__default["default"].get(`http://localhost:3000/server/control/checkpasswd/${to.params.servername}/${to.params.passwd}`).then((response) => {
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
  return vueRouter.createRouter({ history: vueRouter.createMemoryHistory(), routes });
}
async function render(url, manifest) {
  const router = createRouter();
  const app = vue.createSSRApp(App);
  app.config.unwrapInjectedRef = true;
  app.use(router);
  router.push(url);
  await router.isReady();
  const ctx = {};
  const html = await serverRenderer.renderToString(app, ctx);
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
  return [html, preloadLinks];
}
function renderPreloadLinks(modules, manifest) {
  let links = "";
  const seen = /* @__PURE__ */ new Set();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = path.basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}
function renderPreloadLink(file) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    return "";
  }
}
exports.render = render;
