"use strict";
const electron = require("electron");
const require$$1$2 = require("assert");
const require$$1 = require("util");
const require$$0 = require("tty");
const require$$0$1 = require("os");
const require$$1$1 = require("path");
const require$$0$2 = require("fs");
const require$$6 = require("buffer");
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var ffi$1 = {};
var ref$1 = { exports: {} };
var src$1 = { exports: {} };
var browser$1 = { exports: {} };
var ms$1;
var hasRequiredMs$1;
function requireMs$1() {
  if (hasRequiredMs$1)
    return ms$1;
  hasRequiredMs$1 = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms$1 = function(val, options) {
    options = options || {};
    var type2 = typeof val;
    if (type2 === "string" && val.length > 0) {
      return parse(val);
    } else if (type2 === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type2 = (match[2] || "ms").toLowerCase();
    switch (type2) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms$1;
}
var common$1;
var hasRequiredCommon$1;
function requireCommon$1() {
  if (hasRequiredCommon$1)
    return common$1;
  hasRequiredCommon$1 = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs$1();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug2(...args) {
        if (!debug2.enabled) {
          return;
        }
        const self = debug2;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self.diff = ms2;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self, args);
        const logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }
      debug2.namespace = namespace;
      debug2.useColors = createDebug.useColors();
      debug2.color = createDebug.selectColor(namespace);
      debug2.extend = extend;
      debug2.destroy = createDebug.destroy;
      Object.defineProperty(debug2, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      return debug2;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      let i;
      const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      const len = split.length;
      for (i = 0; i < len; i++) {
        if (!split[i]) {
          continue;
        }
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
        } else {
          createDebug.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      const namespaces = [
        ...createDebug.names.map(toNamespace),
        ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      if (name[name.length - 1] === "*") {
        return true;
      }
      let i;
      let len;
      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function toNamespace(regexp) {
      return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common$1 = setup;
  return common$1;
}
var hasRequiredBrowser$1;
function requireBrowser$1() {
  if (hasRequiredBrowser$1)
    return browser$1.exports;
  hasRequiredBrowser$1 = 1;
  (function(module, exports) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon$1()(exports);
    const { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser$1, browser$1.exports);
  return browser$1.exports;
}
var node$1 = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag)
    return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor)
    return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os = require$$0$1;
  const tty = require$$0;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode$1;
function requireNode$1() {
  if (hasRequiredNode$1)
    return node$1.exports;
  hasRequiredNode$1 = 1;
  (function(module, exports) {
    const tty = require$$0;
    const util2 = require$$1;
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon$1()(exports);
    const { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  })(node$1, node$1.exports);
  return node$1.exports;
}
if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
  src$1.exports = requireBrowser$1();
} else {
  src$1.exports = requireNode$1();
}
var srcExports$1 = src$1.exports;
var nodeGypBuild$1 = { exports: {} };
function commonjsRequire(path2) {
  throw new Error('Could not dynamically require "' + path2 + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var nodeGypBuild;
var hasRequiredNodeGypBuild;
function requireNodeGypBuild() {
  if (hasRequiredNodeGypBuild)
    return nodeGypBuild;
  hasRequiredNodeGypBuild = 1;
  var fs = require$$0$2;
  var path2 = require$$1$1;
  var os = require$$0$1;
  var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
  var vars = process.config && process.config.variables || {};
  var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
  var abi = process.versions.modules;
  var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
  var arch = process.env.npm_config_arch || os.arch();
  var platform = process.env.npm_config_platform || os.platform();
  var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
  var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
  var uv = (process.versions.uv || "").split(".")[0];
  nodeGypBuild = load;
  function load(dir) {
    return runtimeRequire(load.resolve(dir));
  }
  load.resolve = load.path = function(dir) {
    dir = path2.resolve(dir || ".");
    try {
      var name = runtimeRequire(path2.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
      if (process.env[name + "_PREBUILD"])
        dir = process.env[name + "_PREBUILD"];
    } catch (err) {
    }
    if (!prebuildsOnly) {
      var release = getFirst(path2.join(dir, "build/Release"), matchBuild);
      if (release)
        return release;
      var debug2 = getFirst(path2.join(dir, "build/Debug"), matchBuild);
      if (debug2)
        return debug2;
    }
    var prebuild = resolve(dir);
    if (prebuild)
      return prebuild;
    var nearby = resolve(path2.dirname(process.execPath));
    if (nearby)
      return nearby;
    var target = [
      "platform=" + platform,
      "arch=" + arch,
      "runtime=" + runtime,
      "abi=" + abi,
      "uv=" + uv,
      armv ? "armv=" + armv : "",
      "libc=" + libc,
      "node=" + process.versions.node,
      process.versions.electron ? "electron=" + process.versions.electron : "",
      typeof __webpack_require__ === "function" ? "webpack=true" : ""
      // eslint-disable-line
    ].filter(Boolean).join(" ");
    throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
    function resolve(dir2) {
      var tuples = readdirSync(path2.join(dir2, "prebuilds")).map(parseTuple);
      var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
      if (!tuple)
        return;
      var prebuilds = path2.join(dir2, "prebuilds", tuple.name);
      var parsed = readdirSync(prebuilds).map(parseTags);
      var candidates = parsed.filter(matchTags(runtime, abi));
      var winner = candidates.sort(compareTags(runtime))[0];
      if (winner)
        return path2.join(prebuilds, winner.file);
    }
  };
  function readdirSync(dir) {
    try {
      return fs.readdirSync(dir);
    } catch (err) {
      return [];
    }
  }
  function getFirst(dir, filter) {
    var files = readdirSync(dir).filter(filter);
    return files[0] && path2.join(dir, files[0]);
  }
  function matchBuild(name) {
    return /\.node$/.test(name);
  }
  function parseTuple(name) {
    var arr = name.split("-");
    if (arr.length !== 2)
      return;
    var platform2 = arr[0];
    var architectures = arr[1].split("+");
    if (!platform2)
      return;
    if (!architectures.length)
      return;
    if (!architectures.every(Boolean))
      return;
    return { name, platform: platform2, architectures };
  }
  function matchTuple(platform2, arch2) {
    return function(tuple) {
      if (tuple == null)
        return false;
      if (tuple.platform !== platform2)
        return false;
      return tuple.architectures.includes(arch2);
    };
  }
  function compareTuples(a, b) {
    return a.architectures.length - b.architectures.length;
  }
  function parseTags(file) {
    var arr = file.split(".");
    var extension = arr.pop();
    var tags = { file, specificity: 0 };
    if (extension !== "node")
      return;
    for (var i = 0; i < arr.length; i++) {
      var tag = arr[i];
      if (tag === "node" || tag === "electron" || tag === "node-webkit") {
        tags.runtime = tag;
      } else if (tag === "napi") {
        tags.napi = true;
      } else if (tag.slice(0, 3) === "abi") {
        tags.abi = tag.slice(3);
      } else if (tag.slice(0, 2) === "uv") {
        tags.uv = tag.slice(2);
      } else if (tag.slice(0, 4) === "armv") {
        tags.armv = tag.slice(4);
      } else if (tag === "glibc" || tag === "musl") {
        tags.libc = tag;
      } else {
        continue;
      }
      tags.specificity++;
    }
    return tags;
  }
  function matchTags(runtime2, abi2) {
    return function(tags) {
      if (tags == null)
        return false;
      if (tags.runtime !== runtime2 && !runtimeAgnostic(tags))
        return false;
      if (tags.abi !== abi2 && !tags.napi)
        return false;
      if (tags.uv && tags.uv !== uv)
        return false;
      if (tags.armv && tags.armv !== armv)
        return false;
      if (tags.libc && tags.libc !== libc)
        return false;
      return true;
    };
  }
  function runtimeAgnostic(tags) {
    return tags.runtime === "node" && tags.napi;
  }
  function compareTags(runtime2) {
    return function(a, b) {
      if (a.runtime !== b.runtime) {
        return a.runtime === runtime2 ? -1 : 1;
      } else if (a.abi !== b.abi) {
        return a.abi ? -1 : 1;
      } else if (a.specificity !== b.specificity) {
        return a.specificity > b.specificity ? -1 : 1;
      } else {
        return 0;
      }
    };
  }
  function isNwjs() {
    return !!(process.versions && process.versions.nw);
  }
  function isElectron() {
    if (process.versions && process.versions.electron)
      return true;
    if (process.env.ELECTRON_RUN_AS_NODE)
      return true;
    return typeof window !== "undefined" && window.process && window.process.type === "renderer";
  }
  function isAlpine(platform2) {
    return platform2 === "linux" && fs.existsSync("/etc/alpine-release");
  }
  load.parseTags = parseTags;
  load.matchTags = matchTags;
  load.compareTags = compareTags;
  load.parseTuple = parseTuple;
  load.matchTuple = matchTuple;
  load.compareTuples = compareTuples;
  return nodeGypBuild;
}
if (typeof process.addon === "function") {
  nodeGypBuild$1.exports = process.addon.bind(process);
} else {
  nodeGypBuild$1.exports = requireNodeGypBuild();
}
var nodeGypBuildExports = nodeGypBuild$1.exports;
(function(module, exports) {
  const assert2 = require$$1$2;
  const inspect = require$$1.inspect;
  const debug2 = srcExports$1("ref");
  const os = require$$0$1;
  const path2 = require$$1$1;
  exports = module.exports = nodeGypBuildExports(path2.join(__dirname, ".."));
  exports.endianness = os.endianness();
  exports.refType = function refType(type2) {
    const _type = exports.coerceType(type2);
    const rtn = Object.create(_type);
    rtn.indirection++;
    if (_type.name) {
      Object.defineProperty(rtn, "name", {
        value: _type.name + "*",
        configurable: true,
        enumerable: true,
        writable: true
      });
    }
    return rtn;
  };
  exports.derefType = function derefType(type2) {
    const _type = exports.coerceType(type2);
    if (_type.indirection === 1) {
      throw new Error("Cannot create deref'd type for type with indirection 1");
    }
    let rtn = Object.getPrototypeOf(_type);
    if (rtn.indirection !== _type.indirection - 1) {
      rtn = Object.create(_type);
      rtn.indirection--;
    }
    return rtn;
  };
  exports.coerceType = function coerceType(type2) {
    let rtn = type2;
    if (typeof rtn === "string") {
      rtn = exports.types[type2];
      if (rtn)
        return rtn;
      rtn = type2.replace(/\s+/g, "").toLowerCase();
      if (rtn === "pointer") {
        rtn = exports.refType(exports.types.void);
      } else if (rtn === "string") {
        rtn = exports.types.CString;
      } else {
        var refCount = 0;
        rtn = rtn.replace(/\*/g, function() {
          refCount++;
          return "";
        });
        rtn = exports.types[rtn];
        if (refCount > 0) {
          if (!(rtn && "size" in rtn && "indirection" in rtn)) {
            throw new TypeError('could not determine a proper "type" from: ' + inspect(type2));
          }
          for (let i = 0; i < refCount; i++) {
            rtn = exports.refType(rtn);
          }
        }
      }
    }
    if (!(rtn && "size" in rtn && "indirection" in rtn)) {
      throw new TypeError('could not determine a proper "type" from: ' + inspect(type2));
    }
    return rtn;
  };
  exports.getType = function getType(buffer) {
    if (!buffer.type) {
      debug2('WARN: no "type" found on buffer, setting default "type"', buffer);
      buffer.type = {};
      buffer.type.size = buffer.length;
      buffer.type.indirection = 1;
      buffer.type.get = function get() {
        throw new Error('unknown "type"; cannot get()');
      };
      buffer.type.set = function set() {
        throw new Error('unknown "type"; cannot set()');
      };
    }
    return exports.coerceType(buffer.type);
  };
  exports.get = function get(buffer, offset, type2) {
    if (!offset) {
      offset = 0;
    }
    if (type2) {
      type2 = exports.coerceType(type2);
    } else {
      type2 = exports.getType(buffer);
    }
    debug2("get(): (offset: %d)", offset, buffer);
    assert2(type2.indirection > 0, `"indirection" level must be at least 1, saw ${type2.indirection}`);
    if (type2.indirection === 1) {
      return type2.get(buffer, offset);
    } else {
      const size = type2.indirection === 2 ? type2.size : exports.sizeof.pointer;
      const reference = exports.readPointer(buffer, offset, size);
      reference.type = exports.derefType(type2);
      return reference;
    }
  };
  exports.set = function set(buffer, offset, value, type2) {
    if (!offset) {
      offset = 0;
    }
    if (type2) {
      type2 = exports.coerceType(type2);
    } else {
      type2 = exports.getType(buffer);
    }
    debug2("set(): (offset: %d)", offset, buffer, value);
    assert2(type2.indirection >= 1, '"indirection" level must be at least 1');
    if (type2.indirection === 1) {
      type2.set(buffer, offset, value);
    } else {
      exports.writePointer(buffer, offset, value);
    }
  };
  exports.alloc = function alloc(_type, value) {
    var type2 = exports.coerceType(_type);
    debug2('allocating Buffer for type with "size"', type2.size);
    let size;
    if (type2.indirection === 1) {
      size = type2.size;
    } else {
      size = exports.sizeof.pointer;
    }
    const buffer = Buffer.alloc(size);
    buffer.type = type2;
    if (arguments.length >= 2) {
      debug2("setting value on allocated buffer", value);
      exports.set(buffer, 0, value, type2);
    }
    return buffer;
  };
  exports.allocCString = function allocCString(string, encoding) {
    if (null == string || Buffer.isBuffer(string) && exports.isNull(string)) {
      return exports.NULL;
    }
    const size = Buffer.byteLength(string, encoding) + 1;
    const buffer = Buffer.allocUnsafe(size);
    exports.writeCString(buffer, 0, string, encoding);
    buffer.type = charPtrType;
    return buffer;
  };
  exports.writeCString = function writeCString(buffer, offset, string, encoding) {
    assert2(Buffer.isBuffer(buffer), "expected a Buffer as the first argument");
    assert2.strictEqual("string", typeof string, 'expected a "string" as the third argument');
    if (!offset) {
      offset = 0;
    }
    if (!encoding) {
      encoding = "utf8";
    }
    const size = buffer.length - offset - 1;
    const len = buffer.write(string, offset, size, encoding);
    buffer.writeUInt8(0, offset + len);
  };
  exports["readInt64" + exports.endianness] = exports.readInt64;
  exports["readUInt64" + exports.endianness] = exports.readUInt64;
  exports["writeInt64" + exports.endianness] = exports.writeInt64;
  exports["writeUInt64" + exports.endianness] = exports.writeUInt64;
  var opposite = exports.endianness == "LE" ? "BE" : "LE";
  var int64temp = Buffer.alloc(exports.sizeof.int64);
  var uint64temp = Buffer.alloc(exports.sizeof.uint64);
  exports["readInt64" + opposite] = function(buffer, offset) {
    for (let i = 0; i < exports.sizeof.int64; i++) {
      int64temp[i] = buffer[offset + exports.sizeof.int64 - i - 1];
    }
    return exports.readInt64(int64temp, 0);
  };
  exports["readUInt64" + opposite] = function(buffer, offset) {
    for (let i = 0; i < exports.sizeof.uint64; i++) {
      uint64temp[i] = buffer[offset + exports.sizeof.uint64 - i - 1];
    }
    return exports.readUInt64(uint64temp, 0);
  };
  exports["writeInt64" + opposite] = function(buffer, offset, value) {
    exports.writeInt64(int64temp, 0, value);
    for (let i = 0; i < exports.sizeof.int64; i++) {
      buffer[offset + i] = int64temp[exports.sizeof.int64 - i - 1];
    }
  };
  exports["writeUInt64" + opposite] = function(buffer, offset, value) {
    exports.writeUInt64(uint64temp, 0, value);
    for (let i = 0; i < exports.sizeof.uint64; i++) {
      buffer[offset + i] = uint64temp[exports.sizeof.uint64 - i - 1];
    }
  };
  exports.ref = function ref2(buffer) {
    debug2("creating a reference to buffer", buffer);
    var type2 = exports.refType(exports.getType(buffer));
    return exports.alloc(type2, buffer);
  };
  exports.deref = function deref(buffer) {
    debug2("dereferencing buffer", buffer);
    return exports.get(buffer);
  };
  const kAttachedRefs = Symbol("attached");
  exports._attach = function _attach(buf, obj) {
    if (!buf[kAttachedRefs]) {
      buf[kAttachedRefs] = [];
    }
    buf[kAttachedRefs].push(obj);
  };
  exports.writeObject = function writeObject(buf, offset, obj) {
    debug2("writing Object to buffer", buf, offset, obj);
    exports._writeObject(buf, offset, obj);
    exports._attach(buf, obj);
  };
  exports.writePointer = function writePointer(buf, offset, ptr) {
    debug2("writing pointer to buffer", buf, offset, ptr);
    exports._writePointer(buf, offset, ptr, true);
  };
  exports.reinterpret = function reinterpret(buffer, size, offset) {
    debug2('reinterpreting buffer to "%d" bytes', size);
    const rtn = exports._reinterpret(buffer, size, offset || 0);
    exports._attach(rtn, buffer);
    return rtn;
  };
  exports.reinterpretUntilZeros = function reinterpretUntilZeros(buffer, size, offset) {
    debug2('reinterpreting buffer to until "%d" NULL (0) bytes are found', size);
    var rtn = exports._reinterpretUntilZeros(buffer, size, offset || 0);
    exports._attach(rtn, buffer);
    return rtn;
  };
  const types = exports.types = {};
  types.void = {
    size: 0,
    indirection: 1,
    get: function get(buf, offset) {
      debug2("getting `void` type (returns `null`)");
      return null;
    },
    set: function set(buf, offset, val) {
      debug2("setting `void` type (no-op)");
    }
  };
  types.int8 = {
    size: exports.sizeof.int8,
    indirection: 1,
    get: function get(buf, offset) {
      return buf.readInt8(offset || 0);
    },
    set: function set(buf, offset, val) {
      if (typeof val === "string") {
        val = val.charCodeAt(0);
      }
      return buf.writeInt8(val, offset || 0);
    }
  };
  types.uint8 = {
    size: exports.sizeof.uint8,
    indirection: 1,
    get: function get(buf, offset) {
      return buf.readUInt8(offset || 0);
    },
    set: function set(buf, offset, val) {
      if (typeof val === "string") {
        val = val.charCodeAt(0);
      }
      return buf.writeUInt8(val, offset || 0);
    }
  };
  types.int16 = {
    size: exports.sizeof.int16,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readInt16" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeInt16" + exports.endianness](val, offset || 0);
    }
  };
  types.uint16 = {
    size: exports.sizeof.uint16,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readUInt16" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeUInt16" + exports.endianness](val, offset || 0);
    }
  };
  types.int32 = {
    size: exports.sizeof.int32,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readInt32" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeInt32" + exports.endianness](val, offset || 0);
    }
  };
  types.uint32 = {
    size: exports.sizeof.uint32,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readUInt32" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeUInt32" + exports.endianness](val, offset || 0);
    }
  };
  types.int64 = {
    size: exports.sizeof.int64,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readInt64" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeInt64" + exports.endianness](val, offset || 0);
    }
  };
  types.uint64 = {
    size: exports.sizeof.uint64,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readUInt64" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeUInt64" + exports.endianness](val, offset || 0);
    }
  };
  types.float = {
    size: exports.sizeof.float,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readFloat" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeFloat" + exports.endianness](val, offset || 0);
    }
  };
  types.double = {
    size: exports.sizeof.double,
    indirection: 1,
    get: function get(buf, offset) {
      return buf["readDouble" + exports.endianness](offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf["writeDouble" + exports.endianness](val, offset || 0);
    }
  };
  types.Object = {
    size: exports.sizeof.Object,
    indirection: 1,
    get: function get(buf, offset) {
      return buf.readObject(offset || 0);
    },
    set: function set(buf, offset, val) {
      return buf.writeObject(val, offset || 0);
    }
  };
  types.CString = {
    size: exports.sizeof.pointer,
    alignment: exports.alignof.pointer,
    indirection: 1,
    get: function get(buf, offset) {
      const _buf = exports.readPointer(buf, offset);
      if (exports.isNull(_buf)) {
        return null;
      }
      return exports.readCString(_buf, 0);
    },
    set: function set(buf, offset, val) {
      let _buf;
      if (Buffer.isBuffer(val)) {
        _buf = val;
      } else {
        _buf = exports.allocCString(val);
      }
      return exports.writePointer(buf, offset, _buf);
    }
  };
  var utfstringwarned = false;
  Object.defineProperty(types, "Utf8String", {
    enumerable: false,
    configurable: true,
    get: function() {
      if (!utfstringwarned) {
        utfstringwarned = true;
        console.error('"Utf8String" type is deprecated, use "CString" instead');
      }
      return types.CString;
    }
  });
  [
    "bool",
    "byte",
    "char",
    "uchar",
    "short",
    "ushort",
    "int",
    "uint",
    "long",
    "ulong",
    "longlong",
    "ulonglong",
    "size_t"
  ].forEach((name) => {
    const unsigned = name === "bool" || name === "byte" || name === "size_t" || name[0] === "u";
    const size = exports.sizeof[name];
    assert2(size >= 1 && size <= 8);
    let typeName = "int" + size * 8;
    if (unsigned) {
      typeName = "u" + typeName;
    }
    const type2 = exports.types[typeName];
    assert2(type2);
    exports.types[name] = Object.create(type2);
  });
  Object.keys(exports.alignof).forEach((name) => {
    if (name === "pointer")
      return;
    exports.types[name].alignment = exports.alignof[name];
    assert2(exports.types[name].alignment > 0);
  });
  exports.types.bool.get = function(_get) {
    return function get(buf, offset) {
      return _get(buf, offset) ? true : false;
    };
  }(exports.types.bool.get);
  exports.types.bool.set = function(_set) {
    return function set(buf, offset, val) {
      if (typeof val !== "number") {
        val = val ? 1 : 0;
      }
      return _set(buf, offset, val);
    };
  }(exports.types.bool.set);
  /*!
   * Set the `name` property of the types. Used for debugging...
   */
  Object.keys(exports.types).forEach((name) => {
    exports.types[name].name = name;
  });
  /*!
   * This `char *` type is used by "allocCString()" above.
   */
  const charPtrType = exports.refType(exports.types.char);
  /*!
   * Set the `type` property of the `NULL` pointer Buffer object.
   */
  exports.NULL.type = exports.types.void;
  exports.NULL_POINTER = exports.ref(exports.NULL);
  Buffer.prototype.address = function address() {
    return exports.address(this, 0);
  };
  Buffer.prototype.hexAddress = function hexAddress() {
    return exports.hexAddress(this, 0);
  };
  Buffer.prototype.isNull = function isNull() {
    return exports.isNull(this, 0);
  };
  Buffer.prototype.ref = function ref2() {
    return exports.ref(this);
  };
  Buffer.prototype.deref = function deref() {
    return exports.deref(this);
  };
  Buffer.prototype.readObject = function readObject(offset) {
    return exports.readObject(this, offset);
  };
  Buffer.prototype.writeObject = function writeObject(obj, offset) {
    return exports.writeObject(this, offset, obj);
  };
  Buffer.prototype.readPointer = function readPointer(offset, size) {
    return exports.readPointer(this, offset, size);
  };
  Buffer.prototype.writePointer = function writePointer(ptr, offset) {
    return exports.writePointer(this, offset, ptr);
  };
  Buffer.prototype.readCString = function readCString(offset) {
    return exports.readCString(this, offset);
  };
  Buffer.prototype.writeCString = function writeCString(string, offset, encoding) {
    return exports.writeCString(this, offset, string, encoding);
  };
  Buffer.prototype.readInt64BE = function readInt64BE(offset) {
    return exports.readInt64BE(this, offset);
  };
  Buffer.prototype.writeInt64BE = function writeInt64BE(val, offset) {
    return exports.writeInt64BE(this, offset, val);
  };
  Buffer.prototype.readUInt64BE = function readUInt64BE(offset) {
    return exports.readUInt64BE(this, offset);
  };
  Buffer.prototype.writeUInt64BE = function writeUInt64BE(val, offset) {
    return exports.writeUInt64BE(this, offset, val);
  };
  Buffer.prototype.readInt64LE = function readInt64LE(offset) {
    return exports.readInt64LE(this, offset);
  };
  Buffer.prototype.writeInt64LE = function writeInt64LE(val, offset) {
    return exports.writeInt64LE(this, offset, val);
  };
  Buffer.prototype.readUInt64LE = function readUInt64LE(offset) {
    return exports.readUInt64LE(this, offset);
  };
  Buffer.prototype.writeUInt64LE = function writeUInt64LE(val, offset) {
    return exports.writeUInt64LE(this, offset, val);
  };
  Buffer.prototype.reinterpret = function reinterpret(size, offset) {
    return exports.reinterpret(this, size, offset);
  };
  Buffer.prototype.reinterpretUntilZeros = function reinterpretUntilZeros(size, offset) {
    return exports.reinterpretUntilZeros(this, size, offset);
  };
  var inspectSym = inspect.custom || "inspect";
  if (Buffer.prototype[inspectSym]) {
    Buffer.prototype[inspectSym] = overwriteInspect(Buffer.prototype[inspectSym]);
  }
  if (!(exports.NULL instanceof Buffer)) {
    debug2("extending SlowBuffer's prototype since it doesn't inherit from Buffer.prototype");
    /*!
     * SlowBuffer convenience methods.
     */
    var SlowBuffer = require$$6.SlowBuffer;
    SlowBuffer.prototype.address = Buffer.prototype.address;
    SlowBuffer.prototype.hexAddress = Buffer.prototype.hexAddress;
    SlowBuffer.prototype.isNull = Buffer.prototype.isNull;
    SlowBuffer.prototype.ref = Buffer.prototype.ref;
    SlowBuffer.prototype.deref = Buffer.prototype.deref;
    SlowBuffer.prototype.readObject = Buffer.prototype.readObject;
    SlowBuffer.prototype.writeObject = Buffer.prototype.writeObject;
    SlowBuffer.prototype.readPointer = Buffer.prototype.readPointer;
    SlowBuffer.prototype.writePointer = Buffer.prototype.writePointer;
    SlowBuffer.prototype.readCString = Buffer.prototype.readCString;
    SlowBuffer.prototype.writeCString = Buffer.prototype.writeCString;
    SlowBuffer.prototype.reinterpret = Buffer.prototype.reinterpret;
    SlowBuffer.prototype.reinterpretUntilZeros = Buffer.prototype.reinterpretUntilZeros;
    SlowBuffer.prototype.readInt64BE = Buffer.prototype.readInt64BE;
    SlowBuffer.prototype.writeInt64BE = Buffer.prototype.writeInt64BE;
    SlowBuffer.prototype.readUInt64BE = Buffer.prototype.readUInt64BE;
    SlowBuffer.prototype.writeUInt64BE = Buffer.prototype.writeUInt64BE;
    SlowBuffer.prototype.readInt64LE = Buffer.prototype.readInt64LE;
    SlowBuffer.prototype.writeInt64LE = Buffer.prototype.writeInt64LE;
    SlowBuffer.prototype.readUInt64LE = Buffer.prototype.readUInt64LE;
    SlowBuffer.prototype.writeUInt64LE = Buffer.prototype.writeUInt64LE;
    if (SlowBuffer.prototype[inspectSym]) {
      SlowBuffer.prototype[inspectSym] = overwriteInspect(SlowBuffer.prototype[inspectSym]);
    }
  }
  function overwriteInspect(inspect2) {
    if (inspect2.name === "refinspect") {
      return inspect2;
    } else {
      return function refinspect() {
        var v = inspect2.apply(this, arguments);
        return v.replace("Buffer", "Buffer@0x" + this.hexAddress());
      };
    }
  }
})(ref$1, ref$1.exports);
var refExports = ref$1.exports;
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs)
    return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type2 = typeof val;
    if (type2 === "string" && val.length > 0) {
      return parse(val);
    } else if (type2 === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type2 = (match[2] || "ms").toLowerCase();
    switch (type2) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon)
    return common;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    Object.keys(env).forEach(function(key) {
      createDebug[key] = env[key];
    });
    createDebug.instances = [];
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      var hash = 0;
      for (var i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      var prevTime;
      function debug2() {
        if (!debug2.enabled) {
          return;
        }
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var self = debug2;
        var curr = Number(/* @__PURE__ */ new Date());
        var ms2 = curr - (prevTime || curr);
        self.diff = ms2;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") {
            return match;
          }
          index++;
          var formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self, args);
        var logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }
      debug2.namespace = namespace;
      debug2.enabled = createDebug.enabled(namespace);
      debug2.useColors = createDebug.useColors();
      debug2.color = selectColor(namespace);
      debug2.destroy = destroy;
      debug2.extend = extend;
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      createDebug.instances.push(debug2);
      return debug2;
    }
    function destroy() {
      var index = createDebug.instances.indexOf(this);
      if (index !== -1) {
        createDebug.instances.splice(index, 1);
        return true;
      }
      return false;
    }
    function extend(namespace, delimiter) {
      return createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.names = [];
      createDebug.skips = [];
      var i;
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (i = 0; i < len; i++) {
        if (!split[i]) {
          continue;
        }
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          createDebug.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
      for (i = 0; i < createDebug.instances.length; i++) {
        var instance = createDebug.instances[i];
        instance.enabled = createDebug.enabled(instance.namespace);
      }
    }
    function disable() {
      createDebug.enable("");
    }
    function enabled(name) {
      if (name[name.length - 1] === "*") {
        return true;
      }
      var i;
      var len;
      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common = setup;
  return common;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser)
    return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports) {
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      var _console;
      return (typeof console === "undefined" ? "undefined" : _typeof(console)) === "object" && console.log && (_console = console).log.apply(_console, arguments);
    }
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports);
    var formatters = module.exports.formatters;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode)
    return node.exports;
  hasRequiredNode = 1;
  (function(module, exports) {
    var tty = require$$0;
    var util2 = require$$1;
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      var supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      var name = this.namespace, useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        var prefix = "  ".concat(colorCode, ";1m").concat(name, " \x1B[0m");
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log() {
      return process.stderr.write(util2.format.apply(util2, arguments) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon()(exports);
    var formatters = module.exports.formatters;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
  src.exports = requireBrowser();
} else {
  src.exports = requireNode();
}
var srcExports = src.exports;
var util = require$$1;
var assert$1 = require$$1$2;
var debug = srcExports("ref:struct");
var struct = function(ref2) {
  function Struct() {
    debug('defining new struct "type"');
    function StructType(arg2, data) {
      if (!(this instanceof StructType)) {
        return new StructType(arg2, data);
      }
      debug("creating new struct instance");
      var store;
      if (Buffer.isBuffer(arg2)) {
        debug("using passed-in Buffer instance to back the struct", arg2);
        assert$1(arg2.length >= StructType.size, "Buffer instance must be at least " + StructType.size + " bytes to back this struct type");
        store = arg2;
        arg2 = data;
      } else {
        debug("creating new Buffer instance to back the struct (size: %d)", StructType.size);
        store = Buffer.alloc(StructType.size);
      }
      store.type = StructType;
      this["ref.buffer"] = store;
      if (arg2) {
        for (var key in arg2) {
          this[key] = arg2[key];
        }
      }
      StructType._instanceCreated = true;
    }
    StructType.prototype = Object.create(proto, {
      constructor: {
        value: StructType,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    StructType.defineProperty = defineProperty;
    StructType.toString = toString;
    StructType.fields = {};
    var opt = arguments.length > 0 && arguments[1] ? arguments[1] : {};
    StructType.size = 0;
    StructType.alignment = 0;
    StructType.indirection = 1;
    StructType.isPacked = opt.packed ? Boolean(opt.packed) : false;
    StructType.get = get;
    StructType.set = set;
    var arg = arguments[0];
    if (Array.isArray(arg)) {
      arg.forEach(function(a) {
        var type2 = a[0];
        var name = a[1];
        StructType.defineProperty(name, type2);
      });
    } else if (typeof arg === "object") {
      Object.keys(arg).forEach(function(name) {
        var type2 = arg[name];
        StructType.defineProperty(name, type2);
      });
    }
    return StructType;
  }
  function get(buffer, offset) {
    debug('Struct "type" getter for buffer at offset', buffer, offset);
    if (offset > 0) {
      buffer = buffer.slice(offset);
    }
    return new this(buffer);
  }
  function set(buffer, offset, value) {
    debug('Struct "type" setter for buffer at offset', buffer, offset, value);
    var isStruct = value instanceof this;
    if (isStruct) {
      value["ref.buffer"].copy(buffer, offset, 0, this.size);
    } else {
      if (offset > 0) {
        buffer = buffer.slice(offset);
      }
      new this(buffer, value);
    }
  }
  function toString() {
    return "[StructType]";
  }
  function defineProperty(name, type2) {
    debug("defining new struct type field", name);
    type2 = ref2.coerceType(type2);
    assert$1(!this._instanceCreated, 'an instance of this Struct type has already been created, cannot add new "fields" anymore');
    assert$1.equal("string", typeof name, 'expected a "string" field name');
    assert$1(
      type2 && /object|function/i.test(typeof type2) && "size" in type2 && "indirection" in type2,
      'expected a "type" object describing the field type: "' + type2 + '"'
    );
    assert$1(
      type2.indirection > 1 || type2.size > 0,
      '"type" object must have a size greater than 0'
    );
    assert$1(!(name in this.prototype), 'the field "' + name + '" already exists in this Struct type');
    var field = {
      type: type2
    };
    this.fields[name] = field;
    var desc = { enumerable: true, configurable: true };
    desc.get = function() {
      debug('getting "%s" struct field (offset: %d)', name, field.offset);
      return ref2.get(this["ref.buffer"], field.offset, type2);
    };
    desc.set = function(value) {
      debug('setting "%s" struct field (offset: %d)', name, field.offset, value);
      return ref2.set(this["ref.buffer"], field.offset, value, type2);
    };
    recalc(this);
    Object.defineProperty(this.prototype, name, desc);
  }
  function recalc(struct2) {
    struct2.size = 0;
    struct2.alignment = 0;
    var fieldNames = Object.keys(struct2.fields);
    fieldNames.forEach(function(name) {
      var field = struct2.fields[name];
      var type2 = field.type;
      var alignment = type2.alignment || ref2.alignof.pointer;
      if (type2.indirection > 1) {
        alignment = ref2.alignof.pointer;
      }
      if (struct2.isPacked) {
        struct2.alignment = Math.min(struct2.alignment || alignment, alignment);
      } else {
        struct2.alignment = Math.max(struct2.alignment, alignment);
      }
    });
    fieldNames.forEach(function(name) {
      var field = struct2.fields[name];
      var type2 = field.type;
      if (null != type2.fixedLength) {
        field.offset = addType(type2.type);
        for (var i = 1; i < type2.fixedLength; i++) {
          addType(type2.type);
        }
      } else {
        field.offset = addType(type2);
      }
    });
    function addType(type2) {
      var offset = struct2.size;
      var align = type2.indirection === 1 ? type2.alignment : ref2.alignof.pointer;
      var padding = struct2.isPacked ? 0 : (align - offset % align) % align;
      var size = type2.indirection === 1 ? type2.size : ref2.sizeof.pointer;
      offset += padding;
      if (!struct2.isPacked) {
        assert$1.equal(offset % align, 0, "offset should align");
      }
      struct2.size = offset + size;
      return offset;
    }
    var left = struct2.size % struct2.alignment;
    if (left > 0) {
      debug("additional padding to the end of struct:", struct2.alignment - left);
      struct2.size += struct2.alignment - left;
    }
  }
  var proto = {};
  proto["ref.buffer"] = ref2.NULL;
  proto.toObject = function toObject() {
    var obj = {};
    Object.keys(this.constructor.fields).forEach(function(k) {
      obj[k] = this[k];
    }, this);
    return obj;
  };
  proto.toJSON = function toJSON() {
    return this.toObject();
  };
  proto.inspect = function inspect() {
    var obj = this.toObject();
    Object.keys(this).forEach(function(k) {
      obj[k] = this[k];
    }, this);
    return util.inspect(obj);
  };
  proto.ref = function ref3() {
    return this["ref.buffer"];
  };
  return Struct;
};
const path = require$$1$1;
const ref = refExports;
const assert = require$$1$2;
assert(ref.instance);
const bindings = nodeGypBuildExports(path.join(__dirname, ".."));
var bindings_1 = bindings.initializeBindings(ref.instance);
var type;
var hasRequiredType;
function requireType() {
  if (hasRequiredType)
    return type;
  hasRequiredType = 1;
  const ref2 = refExports;
  const assert2 = require$$1$2;
  const debug2 = srcExports$1("ffi:types");
  const Struct = struct(ref2);
  const bindings2 = bindings_1;
  const FFI_TYPE = Type.FFI_TYPE = Struct();
  FFI_TYPE.defineProperty("size", ref2.types.size_t);
  FFI_TYPE.defineProperty("alignment", ref2.types.ushort);
  FFI_TYPE.defineProperty("type", ref2.types.ushort);
  const ffi_type_ptr_array = ref2.refType(ref2.refType(FFI_TYPE));
  FFI_TYPE.defineProperty("elements", ffi_type_ptr_array);
  assert2.strictEqual(bindings2.FFI_TYPE_SIZE, FFI_TYPE.size);
  function Type(type2) {
    type2 = ref2.coerceType(type2);
    debug2("Type()", type2.name || type2);
    assert2(type2.indirection >= 1, 'invalid "type" given: ' + (type2.name || type2));
    let ret;
    if (type2.indirection === 1) {
      ret = type2.ffi_type;
    } else {
      ret = bindings2.FFI_TYPES.pointer;
    }
    if (!ret && type2.type) {
      ret = bindings2.FFI_TYPES.pointer;
    }
    if (!ret && type2.fields) {
      debug2('creating an `ffi_type` for given "ref-struct" type');
      const fields = type2.fields;
      const fieldNames = Object.keys(fields);
      const numFields = fieldNames.length;
      let numElements = 0;
      const ffi_type = new FFI_TYPE();
      let field;
      let ffi_type_ptr;
      ffi_type.size = 0;
      ffi_type.alignment = 0;
      ffi_type.type = 13;
      for (let i = 0; i < numFields; i++) {
        field = fields[fieldNames[i]];
        if (field.type.fixedLength > 0) {
          numElements += field.type.fixedLength;
        } else {
          numElements += 1;
        }
      }
      const size = ref2.sizeof.pointer * (numElements + 1);
      const elements = ffi_type.elements = Buffer.alloc(size);
      let index = 0;
      for (let i = 0; i < numFields; i++) {
        field = fields[fieldNames[i]];
        if (field.type.fixedLength > 0) {
          ffi_type_ptr = Type(field.type.type);
          for (var j = 0; j < field.type.fixedLength; j++) {
            elements.writePointer(ffi_type_ptr, index++ * ref2.sizeof.pointer);
          }
        } else {
          ffi_type_ptr = Type(field.type);
          elements.writePointer(ffi_type_ptr, index++ * ref2.sizeof.pointer);
        }
      }
      elements.writePointer(ref2.NULL, index * ref2.sizeof.pointer);
      ret = type2.ffi_type = ffi_type.ref();
    }
    if (!ret && type2.name) {
      if ("CString" == type2.name) {
        ret = type2.ffi_type = bindings2.FFI_TYPES.pointer;
      } else {
        let cur = type2;
        while (!ret && cur) {
          ret = cur.ffi_type = bindings2.FFI_TYPES[cur.name];
          cur = Object.getPrototypeOf(cur);
        }
      }
    }
    assert2(ret, "Could not determine the `ffi_type` instance for type: " + (type2.name || type2));
    debug2("returning `ffi_type`", ret.name);
    return ret;
  }
  type = Type;
  return type;
}
var cif;
var hasRequiredCif;
function requireCif() {
  if (hasRequiredCif)
    return cif;
  hasRequiredCif = 1;
  var Type = requireType();
  const assert2 = require$$1$2;
  const debug2 = srcExports$1("ffi:cif");
  const ref2 = refExports;
  const bindings2 = bindings_1;
  const POINTER_SIZE = ref2.sizeof.pointer;
  const ffi_prep_cif = bindings2.ffi_prep_cif;
  const FFI_CIF_SIZE = bindings2.FFI_CIF_SIZE;
  const FFI_DEFAULT_ABI = bindings2.FFI_DEFAULT_ABI;
  const FFI_OK = bindings2.FFI_OK;
  const FFI_BAD_TYPEDEF = bindings2.FFI_BAD_TYPEDEF;
  const FFI_BAD_ABI = bindings2.FFI_BAD_ABI;
  function CIF(rtype, types, abi) {
    debug2("creating `ffi_cif *` instance");
    assert2(!!rtype, 'expected a return "type" object as the first argument');
    assert2(Array.isArray(types), 'expected an Array of arg "type" objects as the second argument');
    const cif2 = Buffer.alloc(FFI_CIF_SIZE);
    const numArgs = types.length;
    const _argtypesptr = Buffer.alloc(numArgs * POINTER_SIZE);
    const _rtypeptr = Type(rtype);
    for (var i = 0; i < numArgs; i++) {
      const type2 = types[i];
      const ffiType = Type(type2);
      _argtypesptr.writePointer(ffiType, i * POINTER_SIZE);
    }
    cif2.rtnTypePtr = _rtypeptr;
    cif2.argTypesPtr = _argtypesptr;
    if (typeof abi === "undefined") {
      debug2("no ABI specified (this is OK), using FFI_DEFAULT_ABI");
      abi = FFI_DEFAULT_ABI;
    }
    const status = ffi_prep_cif(cif2, numArgs, _rtypeptr, _argtypesptr, abi);
    if (status !== FFI_OK) {
      switch (status) {
        case FFI_BAD_TYPEDEF: {
          const err = new Error("ffi_prep_cif() returned an FFI_BAD_TYPEDEF error");
          err.code = "FFI_BAD_TYPEDEF";
          err.errno = status;
          throw err;
        }
        case FFI_BAD_ABI: {
          const err = new Error("ffi_prep_cif() returned an FFI_BAD_ABI error");
          err.code = "FFI_BAD_ABI";
          err.errno = status;
          throw err;
        }
        default:
          throw new Error("ffi_prep_cif() returned an error: " + status);
      }
    }
    if (debug2.enabled || `${process.env.DEBUG}`.match(/\bffi\b/))
      ;
    return cif2;
  }
  cif = CIF;
  return cif;
}
var cif_var;
var hasRequiredCif_var;
function requireCif_var() {
  if (hasRequiredCif_var)
    return cif_var;
  hasRequiredCif_var = 1;
  const Type = requireType();
  const assert2 = require$$1$2;
  const debug2 = srcExports$1("ffi:cif_var");
  const ref2 = refExports;
  const bindings2 = bindings_1;
  const POINTER_SIZE = ref2.sizeof.pointer;
  const ffi_prep_cif_var = bindings2.ffi_prep_cif_var;
  const FFI_CIF_SIZE = bindings2.FFI_CIF_SIZE;
  const FFI_DEFAULT_ABI = bindings2.FFI_DEFAULT_ABI;
  const FFI_OK = bindings2.FFI_OK;
  const FFI_BAD_TYPEDEF = bindings2.FFI_BAD_TYPEDEF;
  const FFI_BAD_ABI = bindings2.FFI_BAD_ABI;
  function CIF_var(rtype, types, numFixedArgs, abi) {
    debug2("creating `ffi_cif *` instance with `ffi_prep_cif_var()`");
    assert2(!!rtype, 'expected a return "type" object as the first argument');
    assert2(Array.isArray(types), 'expected an Array of arg "type" objects as the second argument');
    assert2(numFixedArgs >= 1, "expected the number of fixed arguments to be at least 1");
    const cif2 = Buffer.alloc(FFI_CIF_SIZE);
    const numTotalArgs = types.length;
    const _argtypesptr = Buffer.alloc(numTotalArgs * POINTER_SIZE);
    const _rtypeptr = Type(rtype);
    for (let i = 0; i < numTotalArgs; i++) {
      const ffiType = Type(types[i]);
      _argtypesptr.writePointer(ffiType, i * POINTER_SIZE);
    }
    cif2.rtnTypePtr = _rtypeptr;
    cif2.argTypesPtr = _argtypesptr;
    if (typeof abi === "undefined") {
      debug2("no ABI specified (this is OK), using FFI_DEFAULT_ABI");
      abi = FFI_DEFAULT_ABI;
    }
    const status = ffi_prep_cif_var(cif2, numFixedArgs, numTotalArgs, _rtypeptr, _argtypesptr, abi);
    if (status !== FFI_OK) {
      switch (status) {
        case FFI_BAD_TYPEDEF: {
          const err = new Error("ffi_prep_cif_var() returned an FFI_BAD_TYPEDEF error");
          err.code = "FFI_BAD_TYPEDEF";
          err.errno = status;
          throw err;
        }
        case FFI_BAD_ABI: {
          const err = new Error("ffi_prep_cif_var() returned an FFI_BAD_ABI error");
          err.code = "FFI_BAD_ABI";
          err.errno = status;
          throw err;
        }
        default: {
          const err = new Error("ffi_prep_cif_var() returned an error: " + status);
          err.errno = status;
          throw err;
        }
      }
    }
    return cif2;
  }
  cif_var = CIF_var;
  return cif_var;
}
var callback;
var hasRequiredCallback;
function requireCallback() {
  if (hasRequiredCallback)
    return callback;
  hasRequiredCallback = 1;
  const ref2 = refExports;
  const CIF = requireCif();
  const assert2 = require$$1$2;
  const debug2 = srcExports$1("ffi:Callback");
  const _Callback = bindings_1.Callback;
  function errorReportCallback(err) {
    if (err) {
      process.nextTick(function() {
        if (typeof err === "string") {
          throw new Error(err);
        } else {
          throw err;
        }
      });
    }
  }
  function Callback(retType, argTypes, abi, func) {
    debug2("creating new Callback");
    if (typeof abi === "function") {
      func = abi;
      abi = void 0;
    }
    assert2(!!retType, 'expected a return "type" object as the first argument');
    assert2(Array.isArray(argTypes), 'expected Array of arg "type" objects as the second argument');
    assert2.equal(typeof func, "function", "expected a function as the third argument");
    retType = ref2.coerceType(retType);
    argTypes = argTypes.map(ref2.coerceType);
    const cif2 = CIF(retType, argTypes, abi);
    const argc = argTypes.length;
    const callback2 = _Callback(cif2, retType.size, argc, errorReportCallback, (retval, params) => {
      debug2("Callback function being invoked");
      try {
        const args = [];
        for (var i = 0; i < argc; i++) {
          const type2 = argTypes[i];
          const argPtr = params.readPointer(i * ref2.sizeof.pointer, type2.size);
          argPtr.type = type2;
          args.push(argPtr.deref());
        }
        const result = func.apply(null, args);
        try {
          ref2.set(retval, 0, result, retType);
        } catch (e) {
          e.message = "error setting return value - " + e.message;
          throw e;
        }
      } catch (e) {
        return e;
      }
    });
    callback2._cif = cif2;
    return callback2;
  }
  callback = Callback;
  return callback;
}
var _foreign_function;
var hasRequired_foreign_function;
function require_foreign_function() {
  if (hasRequired_foreign_function)
    return _foreign_function;
  hasRequired_foreign_function = 1;
  const assert2 = require$$1$2;
  const debug2 = srcExports$1("ffi:_ForeignFunction");
  const ref2 = refExports;
  const bindings2 = bindings_1;
  const POINTER_SIZE = ref2.sizeof.pointer;
  const FFI_ARG_SIZE = bindings2.FFI_ARG_SIZE;
  function ForeignFunction(cif2, funcPtr, returnType, argTypes) {
    debug2("creating new ForeignFunction", funcPtr);
    const numArgs = argTypes.length;
    const argsArraySize = numArgs * POINTER_SIZE;
    const resultSize = returnType.size >= ref2.sizeof.long ? returnType.size : FFI_ARG_SIZE;
    assert2(resultSize > 0);
    const proxy = function() {
      debug2("invoking proxy function");
      if (arguments.length !== numArgs) {
        throw new TypeError("Expected " + numArgs + " arguments, got " + arguments.length);
      }
      const result = Buffer.alloc(resultSize);
      const argsList = Buffer.alloc(argsArraySize);
      let i;
      try {
        for (i = 0; i < numArgs; i++) {
          const argType = argTypes[i];
          const val = arguments[i];
          const valPtr = ref2.alloc(argType, val);
          argsList.writePointer(valPtr, i * POINTER_SIZE);
        }
      } catch (e) {
        i++;
        e.message = "error setting argument " + i + " - " + e.message;
        throw e;
      }
      bindings2.ffi_call(cif2, funcPtr, result, argsList);
      result.type = returnType;
      return result.deref();
    };
    proxy.async = function() {
      debug2("invoking async proxy function");
      const argc = arguments.length;
      if (argc !== numArgs + 1) {
        throw new TypeError("Expected " + (numArgs + 1) + " arguments, got " + argc);
      }
      const callback2 = arguments[argc - 1];
      if (typeof callback2 !== "function") {
        throw new TypeError("Expected a callback function as argument number: " + (argc - 1));
      }
      const result = Buffer.alloc(resultSize);
      const argsList = Buffer.alloc(argsArraySize);
      let i;
      try {
        for (i = 0; i < numArgs; i++) {
          const argType = argTypes[i];
          const val = arguments[i];
          const valPtr = ref2.alloc(argType, val);
          argsList.writePointer(valPtr, i * POINTER_SIZE);
        }
      } catch (e) {
        e.message = "error setting argument " + i + " - " + e.message;
        return process.nextTick(callback2.bind(null, e));
      }
      bindings2.ffi_call_async(cif2, funcPtr, result, argsList, function(err) {
        if (err) {
          callback2(err);
        } else {
          result.type = returnType;
          callback2(null, result.deref());
        }
      });
    };
    return proxy;
  }
  _foreign_function = ForeignFunction;
  return _foreign_function;
}
var foreign_function;
var hasRequiredForeign_function;
function requireForeign_function() {
  if (hasRequiredForeign_function)
    return foreign_function;
  hasRequiredForeign_function = 1;
  const CIF = requireCif();
  const _ForeignFunction = require_foreign_function();
  const debug2 = srcExports$1("ffi:ForeignFunction");
  const assert2 = require$$1$2;
  const ref2 = refExports;
  function ForeignFunction(funcPtr, returnType, argTypes, abi) {
    debug2("creating new ForeignFunction", funcPtr);
    assert2(Buffer.isBuffer(funcPtr), "expected Buffer as first argument");
    assert2(!!returnType, 'expected a return "type" object as the second argument');
    assert2(Array.isArray(argTypes), 'expected Array of arg "type" objects as the third argument');
    returnType = ref2.coerceType(returnType);
    argTypes = argTypes.map(ref2.coerceType);
    const cif2 = CIF(returnType, argTypes, abi);
    return _ForeignFunction(cif2, funcPtr, returnType, argTypes);
  }
  foreign_function = ForeignFunction;
  return foreign_function;
}
var _function;
var hasRequired_function;
function require_function() {
  if (hasRequired_function)
    return _function;
  hasRequired_function = 1;
  const ref2 = refExports;
  const assert2 = require$$1$2;
  const bindings2 = bindings_1;
  const Callback = requireCallback();
  const ForeignFunction = requireForeign_function();
  const debug2 = srcExports$1("ffi:FunctionType");
  _function = Function;
  function Function(retType, argTypes, abi) {
    if (!(this instanceof Function)) {
      return new Function(retType, argTypes, abi);
    }
    debug2("creating new FunctionType");
    assert2(!!retType, 'expected a return "type" object as the first argument');
    assert2(Array.isArray(argTypes), 'expected Array of arg "type" objects as the second argument');
    this.retType = ref2.coerceType(retType);
    this.argTypes = argTypes.map(ref2.coerceType);
    this.abi = null == abi ? bindings2.FFI_DEFAULT_ABI : abi;
  }
  Function.prototype.ffi_type = bindings2.FFI_TYPES.pointer;
  Function.prototype.size = ref2.sizeof.pointer;
  Function.prototype.alignment = ref2.alignof.pointer;
  Function.prototype.indirection = 1;
  Function.prototype.toPointer = function toPointer(fn) {
    return Callback(this.retType, this.argTypes, this.abi, fn);
  };
  Function.prototype.toFunction = function toFunction(buf) {
    return ForeignFunction(buf, this.retType, this.argTypes, this.abi);
  };
  Function.prototype.get = function get(buffer, offset) {
    debug2('ffi FunctionType "get" function');
    const ptr = buffer.readPointer(offset);
    return this.toFunction(ptr);
  };
  Function.prototype.set = function set(buffer, offset, value) {
    debug2('ffi FunctionType "set" function');
    let ptr;
    if ("function" == typeof value) {
      ptr = this.toPointer(value);
    } else if (Buffer.isBuffer(value)) {
      ptr = value;
    } else {
      throw new Error("don't know how to set callback function for: " + value);
    }
    buffer.writePointer(ptr, offset);
  };
  return _function;
}
var foreign_function_var;
var hasRequiredForeign_function_var;
function requireForeign_function_var() {
  if (hasRequiredForeign_function_var)
    return foreign_function_var;
  hasRequiredForeign_function_var = 1;
  const CIF_var = requireCif_var();
  const Type = requireType();
  const _ForeignFunction = require_foreign_function();
  const assert2 = require$$1$2;
  const debug2 = srcExports$1("ffi:VariadicForeignFunction");
  const ref2 = refExports;
  const bindings2 = bindings_1;
  ref2.sizeof.pointer;
  bindings2.FFI_ARG_SIZE;
  function VariadicForeignFunction(funcPtr, returnType, fixedArgTypes, abi) {
    debug2("creating new VariadicForeignFunction", funcPtr);
    const cache = {};
    assert2(Buffer.isBuffer(funcPtr), "expected Buffer as first argument");
    assert2(!!returnType, 'expected a return "type" object as the second argument');
    assert2(Array.isArray(fixedArgTypes), 'expected Array of arg "type" objects as the third argument');
    const numFixedArgs = fixedArgTypes.length;
    fixedArgTypes = fixedArgTypes.map(ref2.coerceType);
    const fixedKey = fixedArgTypes.map(function(type2) {
      return getId(type2);
    });
    function variadic_function_generator() {
      debug2("variadic_function_generator invoked");
      const argTypes = fixedArgTypes.slice();
      let key = fixedKey.slice();
      for (let i = 0; i < arguments.length; i++) {
        const type2 = ref2.coerceType(arguments[i]);
        argTypes.push(type2);
        const ffi_type = Type(type2);
        assert2(ffi_type.name);
        key.push(getId(type2));
      }
      const rtnType = ref2.coerceType(variadic_function_generator.returnType);
      const rtnName = getId(rtnType);
      assert2(rtnName);
      key = rtnName + key.join("");
      let func = cache[key];
      if (func) {
        debug2("cache hit for key:", key);
      } else {
        debug2("creating the variadic ffi_cif instance for key:", key);
        const cif2 = CIF_var(returnType, argTypes, numFixedArgs, abi);
        func = cache[key] = _ForeignFunction(cif2, funcPtr, rtnType, argTypes);
      }
      return func;
    }
    variadic_function_generator.returnType = returnType;
    return variadic_function_generator;
  }
  foreign_function_var = VariadicForeignFunction;
  const idKey = "_ffiId";
  let counter = 0;
  function getId(type2) {
    if (!type2.hasOwnProperty(idKey)) {
      type2[idKey] = (counter++ * 65536 | 0).toString(16);
    }
    return type2[idKey];
  }
  return foreign_function_var;
}
var dynamic_library;
var hasRequiredDynamic_library;
function requireDynamic_library() {
  if (hasRequiredDynamic_library)
    return dynamic_library;
  hasRequiredDynamic_library = 1;
  const ForeignFunction = requireForeign_function();
  const assert2 = require$$1$2;
  const debug2 = srcExports$1("ffi:DynamicLibrary");
  const bindings2 = bindings_1;
  const funcs = bindings2.StaticFunctions;
  const ref2 = refExports;
  const read = require$$0$2.readFileSync;
  const int = ref2.types.int;
  const voidPtr = ref2.refType(ref2.types.void);
  const dlopen = ForeignFunction(funcs.dlopen, voidPtr, ["string", int]);
  const dlclose = ForeignFunction(funcs.dlclose, int, [voidPtr]);
  const dlsym = ForeignFunction(funcs.dlsym, voidPtr, [voidPtr, "string"]);
  const dlerror = ForeignFunction(funcs.dlerror, "string", []);
  function DynamicLibrary(path2, mode) {
    if (!(this instanceof DynamicLibrary)) {
      return new DynamicLibrary(path2, mode);
    }
    debug2("new DynamicLibrary()", path2, mode);
    if (null == mode) {
      mode = DynamicLibrary.FLAGS.RTLD_LAZY;
    }
    this._path = path2;
    this._handle = dlopen(path2, mode);
    assert2(Buffer.isBuffer(this._handle), "expected a Buffer instance to be returned from `dlopen()`");
    if (this._handle.isNull()) {
      var err = this.error();
      let match;
      if (match = err.match(/^(([^ \t()])+\.so([^ \t:()])*):([ \t])*/)) {
        const content = read(match[1], "ascii");
        if (match = content.match(/GROUP *\( *(([^ )])+)/)) {
          return DynamicLibrary.call(this, match[1], mode);
        }
      }
      throw new Error("Dynamic Linking Error: " + err);
    }
  }
  dynamic_library = DynamicLibrary;
  DynamicLibrary.FLAGS = {};
  Object.keys(bindings2).forEach(function(k) {
    if (!/^RTLD_/.test(k))
      return;
    const desc = Object.getOwnPropertyDescriptor(bindings2, k);
    Object.defineProperty(DynamicLibrary.FLAGS, k, desc);
  });
  DynamicLibrary.prototype.close = function() {
    debug2("dlclose()");
    return dlclose(this._handle);
  };
  DynamicLibrary.prototype.get = function(symbol) {
    debug2("dlsym()", symbol);
    assert2.strictEqual("string", typeof symbol);
    const ptr = dlsym(this._handle, symbol);
    assert2(Buffer.isBuffer(ptr));
    if (ptr.isNull()) {
      throw new Error("Dynamic Symbol Retrieval Error: " + this.error());
    }
    ptr.name = symbol;
    return ptr;
  };
  DynamicLibrary.prototype.error = function error() {
    debug2("dlerror()");
    return dlerror();
  };
  DynamicLibrary.prototype.path = function error() {
    return this._path;
  };
  return dynamic_library;
}
var library;
var hasRequiredLibrary;
function requireLibrary() {
  if (hasRequiredLibrary)
    return library;
  hasRequiredLibrary = 1;
  const DynamicLibrary = requireDynamic_library();
  const ForeignFunction = requireForeign_function();
  const VariadicForeignFunction = requireForeign_function_var();
  const debug2 = srcExports$1("ffi:Library");
  const RTLD_NOW = DynamicLibrary.FLAGS.RTLD_NOW;
  const EXT = Library.EXT = {
    "linux": ".so",
    "linux2": ".so",
    "sunos": ".so",
    "solaris": ".so",
    "freebsd": ".so",
    "openbsd": ".so",
    "darwin": ".dylib",
    "mac": ".dylib",
    "win32": ".dll"
  }[process.platform];
  function Library(libfile, funcs, lib) {
    debug2("creating Library object for", libfile);
    if (libfile && typeof libfile === "string" && libfile.indexOf(EXT) === -1) {
      debug2("appending library extension to library name", EXT);
      libfile += EXT;
    }
    if (!lib) {
      lib = {};
    }
    let dl;
    if (typeof libfile === "string" || !libfile) {
      dl = new DynamicLibrary(libfile || null, RTLD_NOW);
    } else {
      dl = libfile;
    }
    Object.keys(funcs || {}).forEach(function(func) {
      debug2("defining function", func);
      const fptr = dl.get(func);
      const info = funcs[func];
      if (fptr.isNull()) {
        throw new Error('Library: "' + dl.path() + '" returned NULL function pointer for "' + func + '"');
      }
      const resultType = info[0];
      const paramTypes = info[1];
      const fopts = info[2];
      const abi = fopts && fopts.abi;
      const async = fopts && fopts.async;
      const varargs = fopts && fopts.varargs;
      if (varargs) {
        lib[func] = VariadicForeignFunction(fptr, resultType, paramTypes, abi);
      } else {
        const ff = ForeignFunction(fptr, resultType, paramTypes, abi);
        lib[func] = async ? ff.async : ff;
      }
    });
    return lib;
  }
  library = Library;
  return library;
}
var errno_1;
var hasRequiredErrno;
function requireErrno() {
  if (hasRequiredErrno)
    return errno_1;
  hasRequiredErrno = 1;
  const DynamicLibrary = requireDynamic_library();
  const ForeignFunction = requireForeign_function();
  const bindings2 = bindings_1;
  const funcs = bindings2.StaticFunctions;
  const ref2 = refExports;
  const int = ref2.types.int;
  const intPtr = ref2.refType(int);
  let errno = null;
  if (process.platform == "win32") {
    const _errno = DynamicLibrary("msvcrt.dll").get("_errno");
    const errnoPtr = ForeignFunction(_errno, intPtr, []);
    errno = function() {
      return errnoPtr().deref();
    };
  } else {
    errno = ForeignFunction(funcs._errno, "int", []);
  }
  errno_1 = errno;
  return errno_1;
}
(function(exports) {
  const ref2 = refExports;
  const debug2 = srcExports$1("ffi:ffi");
  struct(ref2);
  const bindings2 = bindings_1;
  [
    "FFI_TYPES",
    "FFI_OK",
    "FFI_BAD_TYPEDEF",
    "FFI_BAD_ABI",
    "FFI_DEFAULT_ABI",
    "FFI_FIRST_ABI",
    "FFI_LAST_ABI",
    "FFI_SYSV",
    "FFI_UNIX64",
    "FFI_WIN64",
    "FFI_VFP",
    "FFI_STDCALL",
    "FFI_THISCALL",
    "FFI_FASTCALL",
    "RTLD_LAZY",
    "RTLD_NOW",
    "RTLD_LOCAL",
    "RTLD_GLOBAL",
    "RTLD_NOLOAD",
    "RTLD_NODELETE",
    "RTLD_FIRST",
    "RTLD_NEXT",
    "RTLD_DEFAULT",
    "RTLD_SELF",
    "RTLD_MAIN_ONLY",
    "FFI_MS_CDECL"
  ].forEach((prop) => {
    if (!bindings2.hasOwnProperty(prop)) {
      return debug2("skipping exporting of non-existant property", prop);
    }
    const desc = Object.getOwnPropertyDescriptor(bindings2, prop);
    Object.defineProperty(exports, prop, desc);
  });
  Object.keys(bindings2.FFI_TYPES).forEach((name) => {
    const type2 = bindings2.FFI_TYPES[name];
    type2.name = name;
    if (name === "pointer")
      return;
    ref2.types[name].ffi_type = type2;
  });
  ref2.types.size_t.ffi_type = bindings2.FFI_TYPES.pointer;
  const CString = ref2.types.CString || ref2.types.Utf8String;
  CString.ffi_type = bindings2.FFI_TYPES.pointer;
  ref2.types.Object.ffi_type = bindings2.FFI_TYPES.pointer;
  switch (ref2.sizeof.long) {
    case 4:
      ref2.types.ulong.ffi_type = bindings2.FFI_TYPES.uint32;
      ref2.types.long.ffi_type = bindings2.FFI_TYPES.int32;
      break;
    case 8:
      ref2.types.ulong.ffi_type = bindings2.FFI_TYPES.uint64;
      ref2.types.long.ffi_type = bindings2.FFI_TYPES.int64;
      break;
    default:
      throw new Error('unsupported "long" size: ' + ref2.sizeof.long);
  }
  exports.types = ref2.types;
  exports.version = bindings2.version;
  exports.CIF = requireCif();
  exports.CIF_var = requireCif_var();
  exports.Function = require_function();
  exports.ForeignFunction = requireForeign_function();
  exports.VariadicForeignFunction = requireForeign_function_var();
  exports.DynamicLibrary = requireDynamic_library();
  exports.Library = requireLibrary();
  exports.Callback = requireCallback();
  exports.errno = requireErrno();
  exports.ffiType = requireType();
  exports.LIB_EXT = exports.Library.EXT;
  exports.FFI_TYPE = exports.ffiType.FFI_TYPE;
})(ffi$1);
const ffi = /* @__PURE__ */ getDefaultExportFromCjs(ffi$1);
const filePath = require$$1$1.join("../rescources/AddDll(64).dll");
const libm = ffi.Library(filePath, {
  AddInt: ["int", ["int", "int"]]
});
console.log(libm.AddInt(5, 5));
electron.contextBridge.exposeInMainWorld("darkMode", {
  toggle: () => electron.ipcRenderer.invoke("dark-mode:toggle"),
  // dark-mode作为前缀：仅用作命名空间，提高代码可读性
  system: () => electron.ipcRenderer.invoke("dark-mode:system")
});
