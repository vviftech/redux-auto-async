# redux-auto-async
redux异步解决方案，目的是尽量降低冗余的异步模板代码，自动生成方便的可维护的状态树


# use
```javascript


// raa.js
	const App = require('redux-auto-async');
	let app =new App();
	app.use({
		name:'a',
		state:{//the initStates

		},
		reducer:{//the reducers
			method1:function(state,action){
				return Object.assign({},...state,
					...action.newState
				)
			},
			method2:async(state,action)=>{
				let x = await Promise.resolve(1);
				return Object.assign({},
					...state,
					{x:x}
				);//replace the oldstate
			}
		}
	});

	app.use({
		name:'b',
		state:{},
		reducer:{}
	});

	module.exports = app.build();

// app.jsx

import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';

import React from 'react';

import {store} from './raa'//上面的raa.js


// import store from './store';
import getRouter  from './router/index.jsx'

ReactDOM.render(
	<Provider store={store}>
		{getRouter({store})}
	</Provider>,document.getElementById("app"));


//coneect component

import React,{Component} from 'react';

import {dispatch} from './raa';//上面的raa.js


function X(obj){
	return (
		<div>
			<div onClick={dispatch.bind(obj,{type:'a/method1'})}  onDoubleClick={dispatch.bind(obj,{type:'a/method2'})}>
				click me {JSON.stringify(obj)}
			</div>
		</div>
	)
}






```
