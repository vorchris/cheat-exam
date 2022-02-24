/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./.expressvue/src/views/editor/entry-client.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./.expressvue/src/views/editor/entry-client.js":
/*!******************************************************!*\
  !*** ./.expressvue/src/views/editor/entry-client.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nTypeError: /home/student/Webroot/next-exam/.expressvue/src/views/editor/entry-client.js: Cannot read properties of null (reading 'bindings')\\n    at Scope.moveBindingTo (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/scope/index.js:993:13)\\n    at BlockScoping.updateScopeInfo (/home/student/Webroot/next-exam/node_modules/babel-plugin-transform-es2015-block-scoping/lib/index.js:364:17)\\n    at BlockScoping.run (/home/student/Webroot/next-exam/node_modules/babel-plugin-transform-es2015-block-scoping/lib/index.js:330:12)\\n    at PluginPass.BlockStatementSwitchStatementProgram (/home/student/Webroot/next-exam/node_modules/babel-plugin-transform-es2015-block-scoping/lib/index.js:70:24)\\n    at newFn (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/visitors.js:177:21)\\n    at NodePath._call (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/path/context.js:53:20)\\n    at NodePath.call (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/path/context.js:40:17)\\n    at NodePath.visit (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/path/context.js:100:31)\\n    at TraversalContext.visitQueue (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/context.js:103:16)\\n    at TraversalContext.visitSingle (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/context.js:77:19)\\n    at TraversalContext.visit (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/context.js:131:19)\\n    at traverseNode (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/traverse-node.js:24:17)\\n    at traverse (/home/student/Webroot/next-exam/node_modules/@babel/traverse/lib/index.js:62:34)\\n    at transformFile (/home/student/Webroot/next-exam/node_modules/@babel/core/lib/transformation/index.js:108:29)\\n    at transformFile.next (<anonymous>)\\n    at run (/home/student/Webroot/next-exam/node_modules/@babel/core/lib/transformation/index.js:35:12)\");\n\n//# sourceURL=webpack:///./.expressvue/src/views/editor/entry-client.js?");

/***/ })

/******/ });