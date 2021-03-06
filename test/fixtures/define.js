var _modules = {};
var _moduleId = '';

/**
 * 定义模块
 *
 * @param {string=} id 模块标识
 * @param {Array=} dependencies 依赖模块列表
 * @param {Function=} factory 创建模块的工厂方法
 */
function define(id, dependencies, factory) {
    // define(factory)
    // define(dependencies, factory)
    // define(id, factory)
    // define(id, dependencies, factory)
    if (factory == null) {
        if (dependencies == null) {
            factory = id;
            id = null;
        }
        else {
            factory = dependencies;
            dependencies = null;
            if (id instanceof Array) {
                dependencies = id;
                id = null;
            }
        }
    }

    if (factory == null) {
        return;
    }
    if (!id) {
        id = _moduleId;
    }
    _modules[id] = {
        deps: dependencies,
        exports: {},
        value: null,
        factory: null

    };

    if (_modules.toString.call(factory) === '[object Object]') {
        _modules[id]['value'] = factory;
    } else if (typeof factory === 'function') {
        _modules[id]['factory'] = factory;
    }
}
define.amd = true;

function require(id) {
    var module = _modules[id];
    var exports = null;

    if (!module) {
        return null;
    }
    if (module.value) {
        return module.value;
    }
    if (module.deps) { // 存在依赖
        var params = [];
        for (var i = 0; i < module.deps.length; i++) {
            var value = module.deps[i];
            if (value === 'exports') {
                value = module.exports;
            } else if (value === 'require') {
                value = require;
            } else if (value === 'module') {
                value = module;
            } else {
                value = require(value);
            }
            params.push(value);
        }
        exports = module.factory.apply(null, params);
    } else {
        exports = module.factory.call(null, require, module.exports, module);
    }

    // return 值不为空， 则以return值为最终值
    if (exports) {
        module.exports = exports;
    }

    module.value = module.exports;
    return module.value;
}