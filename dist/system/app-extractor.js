System.register(["systemjs", "babel/polyfill", "core-js"], function (_export) {
  "use strict";

  var System, corejs, Promise, AppExtractor;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_systemjs) {
      System = _systemjs["default"];
    }, function (_babelPolyfill) {}, function (_coreJs) {
      corejs = _coreJs["default"];
    }],
    execute: function () {
      Promise = corejs.Promise;

      AppExtractor = (function () {
        function AppExtractor(appPath) {
          _classCallCheck(this, AppExtractor);

          this.appPath = appPath;
        }

        _createClass(AppExtractor, [{
          key: "getNavFromRoutes",
          value: function getNavFromRoutes(moduleId) {
            var _this = this;

            System["import"]("config").then(function (m) {
              System.config({
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

              return System["import"](moduleId).then(function (m) {
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

      _export("AppExtractor", AppExtractor);
    }
  };
});
//# sourceMappingURL=app-extractor.js.map