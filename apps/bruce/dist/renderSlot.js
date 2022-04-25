"use strict";
exports.__esModule = true;
exports.renderSlot = void 0;
var renderBanner_1 = require("./renderBanner");
var createBranch_1 = require("./createBranch");
exports.renderSlot = (0, createBranch_1["default"])({
    path: function (i) { return i.path; },
    children: function (i) { return i.banners; },
    child: renderBanner_1["default"],
    index: function () { return ''; }
});
exports["default"] = exports.renderSlot;
