"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.renderBanner = void 0;
var fn_1 = require("fn");
var isExt_1 = require("fn/isExt");
var promises_1 = require("fs/promises");
var ntl_1 = require("ntl");
var banners_config_1 = require("./banners.config");
var createIndex_1 = require("./createIndex");
function renderBanner(i) {
    return __awaiter(this, void 0, void 0, function () {
        function upload(i) {
            var _this = this;
            var path = "".concat(media, "/").concat(i);
            var options = {
                folder: 'bruce',
                overwrite: false,
                use_filename: true,
                unique_filename: false
            };
            return function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, url;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, fn_1.uploadToCloudinary)(path, options)];
                        case 1:
                            _a = (_b.sent()).secure_url, url = _a === void 0 ? i : _a;
                            edits.push((0, fn_1.replace)(new RegExp(i, 'gi'), url));
                            return [2 /*return*/];
                    }
                });
            }); };
        }
        var path, zip, media, index, edits, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = banners_config_1["default"].BASE + i.path;
                    zip = "".concat(path, "/banner.zip");
                    media = "".concat(path, "/media");
                    index = "".concat(path, "/index.html");
                    return [4 /*yield*/, (0, ntl_1.createDir)(path)];
                case 1:
                    _a.sent();
                    if (!(0, isExt_1["default"])('zip')(i.file))
                        return [2 /*return*/, (0, createIndex_1["default"])(path, '')];
                    return [4 /*yield*/, (0, ntl_1.downloadFile)(zip)(i.file)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, ntl_1.extractZip)(zip)(path)];
                case 3:
                    _a.sent();
                    edits = [
                        (0, fn_1.replace)(/<\/head>/i, "    ".concat(banners_config_1["default"].HEAD_SCRIPT, "\n    </head>")),
                        (0, fn_1.replace)(/<\/body>/i, "".concat(banners_config_1["default"].TRACKING_SCRIPT, "</body>")),
                        (0, fn_1.replace)(/"imgLocalPath":"media\/"/gi, '"imgLocalPath":""')
                    ];
                    return [4 /*yield*/, (0, promises_1.readdir)(media)];
                case 4:
                    files = _a.sent();
                    return [2 /*return*/, (0, fn_1.queue)(__spreadArray(__spreadArray([], (0, fn_1.map)(upload)(files), true), [
                            function () { return (0, ntl_1.editFile)(index, edits); }
                        ], false))];
            }
        });
    });
}
exports.renderBanner = renderBanner;
exports["default"] = renderBanner;
