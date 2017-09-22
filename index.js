"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
var redux_1 = require("redux");

function App() {
    this.models = [];
}
App.prototype.use = function(m) {
    this.models.push(m);
};
App.prototype.unUse = function(name) {
    var rst;
    this.models.forEach(function(m, index) {
        if (m.name === name) {
            rst = index;
        }
    });
    return this.models.splice(rst, 1)[0];
};
App.prototype.build = function() {
    var me = this;
    var rs = {};
    this.models.forEach(function(m, i) {
        rs[m.name] = function(state, action) {
            if (!state) {
                state = m.state;
            }
            if (m.name === action.type) {
                return __assign({}, state, action.newState);
            }
            return state;
        };
    });
    var reducer = redux_1.combineReducers(rs);
    var store = this.store = redux_1.createStore(reducer);
    var dispatch = async function(obj) {
        var _a = obj.type.split('/'),
            name = _a[0],
            func = _a[1];
        var model = me.models.filter(function(m) { return m.name === name; })[0];
        if (!model) {
            throw new Error("the action of " + obj.type + " not exists");
        }
        var reducer = model.reducer[func];
        if (typeof reducer === 'function') {
            var rst = reducer(__assign({}, obj, { type: func }));
            if (rst instanceof Promise) {
                rst = await rst;
            }
            await store.dispatch({
                type: name,
                newState: rst
            });
        }
    };
    return {
        dispatch: dispatch,
        store: store
    };
};

module.exports = App;