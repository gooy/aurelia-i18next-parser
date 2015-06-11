"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.i18next = i18next;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _through2 = require("through2");

var _through22 = _interopRequireDefault(_through2);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _gracefulFs = require("graceful-fs");

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _jsdom = require("jsdom");

var _jsdom2 = _interopRequireDefault(_jsdom);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _helpers = require("./helpers");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

var _appExtractor = require("./app-extractor");

var _coreJs = require("core-js");

var _coreJs2 = _interopRequireDefault(_coreJs);

var Promise = _coreJs2["default"].Promise;

var PluginError = _gulpUtil2["default"].PluginError;

var PLUGIN_NAME = "aurelia-i18next-parser";

var Parser = (function () {
  function Parser(opts) {
    _classCallCheck(this, Parser);

    this.verbose = false;
    this.defaultNamespace = "translation";
    this.functions = ["t"];
    this.namespaceSeparator = ":";
    this.translation_attribute = "data-i18n";
    this.image_src = "data-src";
    this.keySeparator = ".";
    this.regex = null;
    this.appPath = null;
    this.localesPath = "src/locales";
    this.routesModuleId = "routes";
    this.locales = ["en-US"];
    this.defaultLocale = "en";
    this.registry = [];
    this.values = {};
    this.nodes = {};

    if (opts) Object.assign(this, opts);

    if (this.appPath) this.extractor = new _appExtractor.AppExtractor(this.appPath);
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse() {
      return this.stream = _through22["default"].obj(this.transformFile.bind(this), this.flush.bind(this));
    }
  }, {
    key: "parseTranslations",
    value: function parseTranslations(path, data) {
      var ext = this.getExtension(path);
      switch (ext) {
        case "html":
          if (this.verbose) _gulpUtil2["default"].log("parse HTML:", path);
          return this.parseHTML(data);
        default:
          if (this.verbose) _gulpUtil2["default"].log("parse JS:", path);
          return this.parseJavaScript(data);
      }
    }
  }, {
    key: "parseJavaScript",
    value: function parseJavaScript(data) {

      var fnPattern = "(?:" + this.functions.join(")|(?:").replace(".", "\\.") + ")";
      var pattern = "[^a-zA-Z0-9_](?:" + fnPattern + ")(?:\\(|\\s)\\s*(?:(?:'((?:(?:\\\\')?[^']*)+[^\\\\])')|(?:\"((?:(?:\\\\\")?[^\"]*)+[^\\\\])\"))";
      var functionRegex = new RegExp(this.regex || pattern, "g");
      var matches;
      var keys = [];

      while (matches = functionRegex.exec(data)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            if (i > 0 && matches[i]) keys.push(matches[i]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return Promise.resolve(keys);
    }
  }, {
    key: "parseHTML",
    value: function parseHTML(data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _jsdom2["default"].env({
          html: data,
          done: function done(errors, window) {
            if (errors) {
              _gulpUtil2["default"].log(errors);
              reject(errors);
              return;
            }
            resolve(_this.parseDOM(window, _jquery2["default"]));
          }
        });
      });
    }
  }, {
    key: "parseDOM",
    value: function parseDOM(window, $) {
      var _this2 = this;

      $ = $(window);
      var keys = [];
      var selector = "[" + this.translation_attribute + "]";
      var nodes = $(selector);

      nodes.each(function (i) {
        var node = nodes.eq(i);
        var value, key, m;

        key = node.attr(_this2.translation_attribute);

        var attr = "text";

        if (node[0].nodeName === "IMG") attr = "src";

        var re = /\[([a-z]*)]/g;

        while ((m = re.exec(key)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          if (m) {
            key = key.replace(m[0], "");
            attr = m[1];
          }
        }

        switch (node[0].nodeName) {
          case "IMG":
            value = node.attr(_this2.image_src);
            break;
          default:
            switch (attr) {
              case "text":
                value = node.text().trim();
                break;
              case "prepend":
                value = node.html().trim();
                break;
              case "append":
                value = node.html().trim();
                break;
              case "html":
                value = node.html().trim();
                break;
              default:
                value = node.attr(attr);
                break;
            }
        }

        if (key.indexOf("${") > -1) {
          return;
        }

        key = key.replace(/\\('|")/g, "$1");

        key = key.replace(/\[[a-z]*]/g, "");

        if (!key) key = value;
        keys.push(key);
        _this2.values[key] = value;
        _this2.nodes[key] = node;
      });

      return keys;
    }
  }, {
    key: "addToRegistry",
    value: function addToRegistry(keys) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          key = key.replace(/\\('|")/g, "$1");

          if (key.indexOf(this.namespaceSeparator) === -1) {
            key = this.defaultNamespace + this.keySeparator + key;
          } else {
            key = key.replace(this.namespaceSeparator, this.keySeparator);
          }

          this.registry.push(key);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "generateTranslation",
    value: function generateTranslation(locale) {

      var mergedTranslations, currentTranslations, oldTranslations, key;

      this.registryHash = {};

      for (var i = 0, l = this.registry.length; i < l; i++) {
        key = this.registry[i];
        this.registryHash = (0, _helpers.hashFromString)(key, "", this.keySeparator, this.registryHash);
      }

      for (var namespace in this.registryHash) {
        if (!this.registryHash.hasOwnProperty(namespace)) continue;

        var namespacePath = namespace + ".json";
        var namespaceOldPath = namespace + "_old.json";

        var basePath = process.cwd() + "/" + this.localesPath + "/" + locale + "/";
        if (this.verbose) _gulpUtil2["default"].log("basePath", basePath);

        if (_gracefulFs2["default"].existsSync(basePath + namespacePath)) {
          try {
            currentTranslations = JSON.parse(_gracefulFs2["default"].readFileSync(basePath + namespacePath));
          } catch (error) {
            this.emit("json_error", error.name, error.message);
            currentTranslations = {};
          }
        } else {
          currentTranslations = {};
        }

        if (_gracefulFs2["default"].existsSync(basePath + namespaceOldPath)) {
          try {
            oldTranslations = JSON.parse(_gracefulFs2["default"].readFileSync(basePath + namespaceOldPath));
          } catch (error) {
            this.emit("json_error", error.name, error.message);
            currentTranslations = {};
          }
        } else {
          oldTranslations = {};
        }

        mergedTranslations = (0, _helpers.mergeHash)(currentTranslations, Object.assign({}, this.registryHash[namespace]));

        mergedTranslations["new"] = (0, _helpers.replaceEmpty)(oldTranslations, mergedTranslations["new"]);

        var transform = null;

        if (locale !== this.defaultLocale) transform = "uppercase";

        mergedTranslations["new"] = this.getValuesFromHash(this.valuesHash, mergedTranslations["new"], transform, this.nodesHash, this.valuesHash);

        mergedTranslations.old = _lodash2["default"].extend(oldTranslations, mergedTranslations["new"]);

        var mergedTranslationsFile = new _vinyl2["default"]({
          path: locale + "/" + namespacePath,

          contents: new Buffer(JSON.stringify(mergedTranslations["new"], null, 2))
        });
        var mergedOldTranslationsFile = new _vinyl2["default"]({
          path: locale + "/" + namespaceOldPath,

          contents: new Buffer(JSON.stringify(mergedTranslations.old, null, 2))
        });

        this.stream.push(mergedTranslationsFile);
        this.stream.push(mergedOldTranslationsFile);
      }
    }
  }, {
    key: "generateAllTranslations",
    value: function generateAllTranslations() {
      this.updateHashes();

      if (this.verbose) {
        _gulpUtil2["default"].log("extracted registry:");
        _gulpUtil2["default"].log(this.registry);
      }

      for (var i = 0, l = this.locales.length; i < l; i++) {
        this.generateTranslation(this.locales[i]);
      }
    }
  }, {
    key: "extractFromApp",
    value: function extractFromApp() {
      var _this3 = this;

      return this.extractor.getNavFromRoutes(this.routesModuleId).then(function (navRoutes) {
        if (!navRoutes) return null;

        for (var i = 0, l = navRoutes.length; i < l; i++) {
          var item = navRoutes[i];
          _this3.values[item.i18n] = item.title;
          _this3.registry.push(_this3.defaultNamespace + _this3.keySeparator + item.i18n);
        }

        if (_this3.verbose) {
          _gulpUtil2["default"].log("navRoutes found:");
          _gulpUtil2["default"].log(navRoutes);
        }

        return null;
      });
    }
  }, {
    key: "getValuesFromHash",
    value: function getValuesFromHash(source, target, transform, nodesHash, valuesHash) {
      var _this4 = this;

      target = target || {};

      Object.keys(source).forEach(function (key) {

        var node = null;
        if (nodesHash) node = nodesHash[key];
        var value;

        if (target[key] !== undefined) {
          if (typeof source[key] === "object") {
            target[key] = _this4.getValuesFromHash(source[key], target[key], transform, node, valuesHash ? valuesHash[key] : valuesHash);
          } else if (target[key] === "") {
            if (!node) {
              if (valuesHash) value = valuesHash[key];
              if (transform === "uppercase") value = (0, _helpers.transformText)(value);
            } else {
              value = source[key];
              if (transform === "uppercase" && node[0].nodeName !== "IMG") value = (0, _helpers.transformText)(value);
            }
            target[key] = value;
          }
        }
      });

      return target;
    }
  }, {
    key: "getExtension",
    value: function getExtension(path) {
      return path.substr(path.lastIndexOf(".") + 1);
    }
  }, {
    key: "updateHashes",
    value: function updateHashes() {

      this.translationsHash = {};
      this.valuesHash = {};
      this.nodesHash = {};

      var key;

      this.translations = _lodash2["default"].uniq(this.translations).sort();

      for (key in this.values) {
        if (!this.values.hasOwnProperty(key)) continue;
        this.valuesHash = (0, _helpers.hashFromString)(key, this.values[key], this.keySeparator, this.valuesHash);
      }

      for (key in this.nodes) {
        if (!this.nodes.hasOwnProperty(key)) continue;
        this.nodesHash = (0, _helpers.hashFromString)(key, this.nodes[key], this.keySeparator, this.nodesHash);
      }
    }
  }, {
    key: "transformFile",
    value: function transformFile(file, encoding, cb) {
      var _this5 = this;

      var data, path;

      if (file.isStream()) {
        this.emit("error", new PluginError(PLUGIN_NAME, "Streams are not supported!"));
        return cb();
      }

      if (file.isNull()) {
        path = file.path;
        if (file.stat.isDirectory()) {
          return cb();
        } else if (path && _gracefulFs2["default"].existsSync(path)) {
          data = _gracefulFs2["default"].readFileSync(path);
        } else {
          this.emit("error", new PluginError(PLUGIN_NAME, "File has no content and is not readable"));
          return cb();
        }
      }

      if (file.isBuffer()) {
        path = file.path.replace(process.cwd() + "/", "");
        data = file.contents.toString();
      }

      if (!data) return cb();

      data = this.parseTranslations(path, data).then(function (keys) {
        _this5.addToRegistry(keys);

        cb();
      });
    }
  }, {
    key: "flush",
    value: function flush(cb) {
      var _this6 = this;

      if (this.extractor) {
        this.extractFromApp().then(function () {
          _this6.generateAllTranslations();
          cb();
        });
      } else {
        this.generateAllTranslations();
        cb();
      }
    }
  }]);

  return Parser;
})();

exports.Parser = Parser;

function i18next(opts) {
  return new Parser(opts).parse();
}
//# sourceMappingURL=index.js.map