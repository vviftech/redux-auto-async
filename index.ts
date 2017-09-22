import {createStore,combineReducers,compose,applyMiddleware} from 'redux';

class App {
	constructor(){
	}

	public store : IStore

	private models:IModel[] = []

	use(m:IModel):void{
		this.models.push(m);
	}


	unUse(name:string):IModel{
		let rst:number;
		this.models.forEach((m,index)=>{
			if(m.name === name){
				rst = index
			}
		});
		return this.models.splice(rst,1)[0];
	}

	build():IAsync{
		let me = this;

		let rs = {};

		this.models.forEach((m,i)=>{
			rs[m.name] = function(state,action){
				if(m.name === action.type){
					return {...state,...action.newState};
				}
				return state;
			};
		});


		let reducer = combineReducers(rs);

		let store = this.store = createStore(reducer);

		let dispatch =async function(obj:IAction){
			let [name,func] = obj.type.split('/');
			let model = me.models.filter(m=>m.name === name)[0];
			if(!model){
				throw new Error(`the action of ${obj.type} not exists`);
			}
			let reducer = model.reducer[func];
			if(typeof reducer ===  'function'){
				let rst = reducer({
					...obj,
					type:func
				});
				if(rst instanceof Promise){
					rst = await rst;
				}
				store.dispatch({
					type:name,
					newState : rst
				});
			}
		}

		return {
			dispatch:dispatch,
			store:store
		}
	}

}


interface IAsync{
	//connect:(mapStateToProps?:(state:object)=>object,mapDispatchToProps?:(obj:{dispatch:(obj:IAction)=>void})=>object)=>(component:any)=>any,
	dispatch?:any,
	store?:any
}


interface IModel{
	name:string,
	reducer:{}
}


interface IAction{
	type:string
}

interface IStore {
	getState:()=>any,
	dispatch:(action:IAction)=>void
}


export default App;
