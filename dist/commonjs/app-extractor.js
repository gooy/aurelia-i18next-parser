"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _systemjs = require("systemjs");

var _systemjs2 = _interopRequireDefault(_systemjs);

require("babel/polyfill");

require("core-js");

var _coreJs = require("core-js");

var _coreJs2 = _interopRequireDefault(_coreJs);

var Promise = _coreJs2["default"].Promise;

var AppExtractor = (function () {
  function AppExtractor(appPath) {
    _classCallCheck(this, AppExtractor);

    this.appPath = appPath;
  }

  _createClass(AppExtractor, [{
    key: "getNavFromRoutes",
    value: function getNavFromRoutes(moduleId) {
      var _this = this;

      _systemjs2["default"]["import"]("config").then(function (m) {
        _systemjs2["default"].config({
          "baseURL": "./",
          "transpiler": "babel",
          "babelOptions": {
            "stage": 0
          },
          "paths": {
            "*": _this.appPath + "/*.js"
          }
        });
      }).then(function () {
        if (!moduleId) Promise.resolve(null);

        return _systemjs2["default"]["import"](moduleId).then(function (m) {
          var navRoutes = [];
          for (var i = 0, l = m.routes.length; i < l; i++) {
            var route = m.routes[i];
            if (route.nav) navRoutes.push(route);
          }
          return navRoutes;
        });
      });
    }
  }]);

  return AppExtractor;
})();

exports.AppExtractor = AppExtractor;
//# sourceMappingURL=app-extractor.js.map