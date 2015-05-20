System.register(["systemjs", "config", "babel/polyfill", "core-js"], function (_export) {
  var System, corejs, _classCallCheck, _createClass, Promise, AppExtractor;

  return {
    setters: [function (_systemjs) {
      System = _systemjs["default"];
    }, function (_config) {}, function (_babelPolyfill) {}, function (_coreJs) {
      corejs = _coreJs["default"];
    }],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Promise = corejs.Promise;

      AppExtractor = (function () {
        function AppExtractor(appPath) {
          _classCallCheck(this, AppExtractor);

          System.config({
            baseURL: "./",
            transpiler: "babel",
            babelOptions: {
              stage: 0
            },
            paths: {
              "*": appPath + "/*.js"
            }
          });
        }

        _createClass(AppExtractor, [{
          key: "getNavFromRoutes",
          value: function getNavFromRoutes(moduleId) {
            if (!moduleId) Promise.resolve(null);

            return System["import"](moduleId).then(function (m) {
              var navRoutes = [];
              for (var i = 0, l = m.routes.length; i < l; i++) {
                var route = m.routes[i];
                if (route.nav) navRoutes.push(route);
              }
              return navRoutes;
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