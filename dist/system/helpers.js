System.register([], function (_export) {
  _export('hashFromString', hashFromString);

  _export('mergeHash', mergeHash);

  _export('replaceEmpty', replaceEmpty);

  _export('transformText', transformText);

  function hashFromString(path, value, separator, hash) {
    separator = separator || '.';

    if (path.indexOf(separator, path.length - separator.length) >= 0) {
      path = path.slice(0, -separator.length);
    }

    var parts = path.split(separator);
    var tmp_obj = hash || {};
    var obj = tmp_obj;

    for (var x = 0; x < parts.length; x++) {
      if (x === parts.length - 1) {
        tmp_obj[parts[x]] = value;
      } else if (!tmp_obj[parts[x]]) {
        tmp_obj[parts[x]] = {};
      }
      tmp_obj = tmp_obj[parts[x]];
    }
    return obj;
  }

  function mergeHash(source, target, old) {
    target = target || {};
    old = old || {};

    Object.keys(source).forEach(function (key) {
      if (target[key] !== undefined) {
        if (typeof source[key] === 'object' && source[key].constructor !== Array) {
          var nested = mergeHash(source[key], target[key], old[key]);
          target[key] = nested['new'];
          old[key] = nested.old;
        } else {
          target[key] = source[key];
        }
      } else {
        var pluralMatch = /_plural(_\d+)?$/.test(key);
        var singularKey = key.replace(/_plural(_\d+)?$/, '');

        var contextMatch = /_([^_]+)?$/.test(singularKey);
        var rawKey = singularKey.replace(/_([^_]+)?$/, '');

        if (contextMatch && target[rawKey] !== undefined || pluralMatch && target[singularKey] !== undefined) {
          target[key] = source[key];
        } else {
          old[key] = source[key];
        }
      }
    });

    return {
      'new': target,
      old: old
    };
  }

  function replaceEmpty(source, target, transform) {
    target = target || {};

    Object.keys(source).forEach(function (key) {
      if (target[key] !== undefined) {
        if (typeof source[key] === 'object') {
          target[key] = replaceEmpty(source[key], target[key], transform);
        } else if (target[key] === '') {

          var value = source[key];

          if (transform === 'uppercase') value = transformText(value);

          target[key] = value;
        }
      }
    });

    return target;
  }

  function transformText(str) {
    var re = /(.*?(?=<)).*?(?=>)>|(.*)?/gim;
    var m;

    while ((m = re.exec(str)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }

      if (m[1]) str = str.replace(m[1], m[1].toUpperCase());
      if (m[2]) str = str.replace(m[2], m[2].toUpperCase());
    }
    return str;
  }

  return {
    setters: [],
    execute: function () {
      'use strict';
    }
  };
});
//# sourceMappingURL=helpers.js.map