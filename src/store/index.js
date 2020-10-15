import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict:true,  // 开启严格模式  确保state 中的数据只能 mutations 修改
    state:{
        vehicleList:[]
    },
//     mutations:{ // 更改数据的方法
//         add(state){
//             state.count++
//         },
//         //提交载荷用法
// //     add(state,n){
// //      state.count += n
// //    },
//         sub(state){
//             state.count--
//         }
//     }
})

export default store;