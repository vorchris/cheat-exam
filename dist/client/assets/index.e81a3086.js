import { r as resolveComponent, o as openBlock, c as createBlock, w as withCtx, S as Suspense, a as resolveDynamicComponent, b as createElementBlock, d as createBaseVNode, e as createVNode, F as Fragment, f as createStaticVNode, g as axios, $, h as withDirectives, v as vModelText, i as createCommentVNode, j as renderList, k as createTextVNode, t as toDisplayString, l as browser, m as vModelRadio, n as vModelCheckbox, p as normalizeClass, q as normalizeStyle, N as NodeViewWrapper, s as NodeViewContent, u as nodeViewProps, x as vModelSelect, E as EditorContent, y as Editor, B as Blockquote, z as BulletList, D as Document, H as HardBreak, A as Heading, C as HorizontalRule, L as ListItem, O as OrderedList, P as Paragraph, T as Text, G as Bold, I as Code, J as Italic, K as Subscript, M as Superscript, U as Underline, Q as Dropcursor, R as Gapcursor, V as History, W as TextAlign, X as CodeBlockLowlight, Y as VueNodeViewRenderer, Z as lowlight, _ as E, a0 as html2canvas, a1 as createRouter$1, a2 as createWebHistory, a3 as createSSRApp } from "./vendor.271cff46.js";
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
var _imports_1$1 = "/assets/server.cf9ece14.svg";
var _imports_0$1 = "/assets/speedometer.fcbb4a67.svg";
var _imports_2$2 = "/assets/favicon.4c0b22ca.svg";
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
var _imports_3$1 = "/assets/question-square-fill.ea2f12db.svg";
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
var _imports_0 = "/assets/shield-lock-fill.0867a2c2.svg";
var _imports_2$1 = "/assets/person-lines-fill.1357ba4c.svg";
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
var _imports_1 = "/assets/document-replace.4a0bda07.svg";
var _imports_2 = "/assets/edit-undo.a354989d.svg";
var _imports_3 = "/assets/edit-redo.a69ac9c9.svg";
var _imports_4 = "/assets/format-remove-node.5888b14c.svg";
var _imports_5 = "/assets/format-text-bold.1a54ac69.svg";
var _imports_6 = "/assets/format-text-italic.6bd597c5.svg";
var _imports_7 = "/assets/format-text-underline.a71fe525.svg";
var _imports_8 = "/assets/format-text-subscript.9ee5b476.svg";
var _imports_9 = "/assets/format-text-superscript.b0ee4d63.svg";
var _imports_10 = "/assets/format-list-unordered.c10be25d.svg";
var _imports_11 = "/assets/format-list-ordered.f362c573.svg";
var _imports_12 = "/assets/dialog-xml-editor.7c6730e8.svg";
var _imports_13 = "/assets/code-context.5c99fdf1.svg";
var _imports_14 = "/assets/format-text-blockquote.5deb96c0.svg";
var _imports_15 = "/assets/newline.d88da722.svg";
var _imports_16 = "/assets/format-justify-left.164eed23.svg";
var _imports_17 = "/assets/format-justify-center.0430a947.svg";
var _imports_18 = "/assets/format-justify-right.a25f7a31.svg";
var _imports_19 = "/assets/key-enter.21ff090b.svg";
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
  mounted() {
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
        }).configure({ lowlight })
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
