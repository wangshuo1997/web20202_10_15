import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import "babel-polyfill"
//为了兼容IE浏览器 axios
import promise from 'es6-promise';
promise.polyfill();
import VueI18n from 'vue-i18n';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import VCharts from 'v-charts';
import { request } from './network/request';
//传入全局配置对象
Vue.use(VCharts);
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,

    render: h => h(App)
}).$mount('#app');
// 1.axios的基本使用
// axios({
//     url: 'http://123.207.32.32:8000/home/multidata',
//     methods: 'get'
// }).then(res=>{
//     console.log('单独------'+res);
// });
// axios({
//     url: 'http://123.207.32.32:8000/home/data',
//     params:{
//         type:'pop',
//         page:1
//     },
//     methods: 'get'
// }).then(res=>{
//     console.log('单独--'+res);
// });


// // 2.axios发送并发请求
// axios.defaults.baseURL='http://123.207.32.32:8000';
// axios.defaults.timeout=5000;
// axios.all([axios({
//     url:'/home/multidata'
// }),axios({
//     url:'/home/data',
//     params: {
//         type: 'pop',
//         page:1
//     }
// })
// ]).then(axios.spread((res1,res2)=>{
//     console.log('并发-----'+res1);
//     console.log('并发----'+res2);
// }))

// 3.创建对应的axios实例
// const instance1 = axios.create({
//     baseURL: 'http://123.207.32.32:8000',
//     timeout: 5000
// });
// instance1({
//     url:'/home/multidata'
// }).then(res=>{
//     console.log(res);
// })
// instance1({
//     url: '/home/data',
//     params:{
//         type:'pop',
//         page:1
//     }
// }).then(res=>{
//     console.log(res);
// })

// // 4.封装后调用
// request({
//     url:'/vehicle/selectAllState'
// }).then(res=>{
//     // console.log(res);
// }).catch(err=>{
//     console.log(err);
// })