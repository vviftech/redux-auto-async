const model = {
    state: {
        a: 111
    },
    reducer: {
        a: function(state, action) {
            return Object.assign({}, state, action.newState);
        },
        b: async function(state, action) {
            return Object.assign({}, state, action.newState);
        }
    }
}

console.log(typeof model.reducer.a)
console.log(typeof model.reducer.b)

let act = {
    type: 'a',
    newState: {
        a: 'a'
    }
}

let a = model.reducer.a(model.state, act);
let b = model.reducer.b(model.state, act);

console.log(a instanceof Promise);
console.log(b instanceof Promise);


console.log('success');