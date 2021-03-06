"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _System = require("systemjs");

var _System2 = _interopRequireWildcard(_System);

require("config");

require("babel/polyfill");

require("core-js");

var _corejs = require("core-js");

var _corejs2 = _interopRequireWildcard(_corejs);

var Promise = _corejs2["default"].Promise;

var AppExtractor = (function () {
  function AppExtractor(appPath) {
    _classCallCheck(this, AppExtractor);

    this.appPath = appPath;
  }

  _createClass(AppExtractor, [{
    key: "getNavFromRoutes",
    value: function getNavFromRoutes(moduleId) {

      _System2["default"].config({
        baseURL: "./",
        transpiler: "babel",
        babelOptions: {
          stage: 0
        },
        paths: {
          "*": this.appPath + "/*.js"
        }
      });

      if (!moduleId) Promise.resolve(null);

      return new Promise(function (resolve, reject) {
        return _System2["default"]["import"](moduleId).then(function (m) {
          var navRoutes = [];
          for (var i = 0, l = m.routes.length; i < l; i++) {
            var route = m.routes[i];
            if (route.nav) navRoutes.push(route);
          }
          resolve(navRoutes);
        });
      });
    }
  }]);

  return AppExtractor;
})();

exports.AppExtractor = AppExtractor;
//# sourceMappingURL=app-extractor.js.map