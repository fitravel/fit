"use strict";
exports.__esModule = true;
exports.createIndex = void 0;
var promises_1 = require("fs/promises");
var createIndex = function (path, html) {
    var index = "".concat(path, "/index.html");
    console.log("Creating index file ".concat(index));
    return (0, promises_1.writeFile)(index, html);
};
exports.createIndex = createIndex;
exports["default"] = exports.createIndex;
