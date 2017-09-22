import test from 'ava';

import App from '../index';


let app = new App();

app.use({
    name: 'a',
    state: {
        xx: 1
    },
    reducer: {
        f1: function(state, action) {
            return Object.assign({}, state, action);
        },
        f2: async function(state, action) {
            return Object.assign({}, state, action);
        }
    }
});

let { store, dispatch } = app.build();

test('同步', async t => {
    let s = store.getState();
    t.is(s.a.xx, 1);
    let rdm = Math.random().toString(32).substring(2);
    await dispatch({
        type: 'a/f1',
        xx: rdm
    });
    let ns = store.getState();
    t.is(ns.a.xx, rdm);
    t.pass();
});

test('异步', async t => {
    let s = store.getState();
    t.is(s.a.type, 'f1');
    let rdm = Math.random().toString(32).substring(2);
    await dispatch({
        type: 'a/f2',
        oo: rdm
    });

    let ns = store.getState();
    t.is(ns.a.oo, rdm);
});