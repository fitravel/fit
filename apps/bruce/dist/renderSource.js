"use strict";
exports.__esModule = true;
exports.renderSource = void 0;
var createBranch_1 = require("./createBranch");
var renderSlot_1 = require("./renderSlot");
exports.renderSource = (0, createBranch_1["default"])({
    path: function (i) { return i.path; },
    children: function (i) { return i.slots; },
    child: renderSlot_1["default"],
    index: function () { return ''; }
});
exports["default"] = exports.renderSource;
