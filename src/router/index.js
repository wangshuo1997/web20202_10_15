import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    routes: [
               {
            path: '/',
            redirect: '/vehiclelist'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [



                {
                    path: '/vehiclelist',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/VehicleList.vue'),
                    meta: { title: '车辆信息' }
                },

                {
                    path: '/vehicledispatch',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Vehicledispatch.vue'),
                    meta: { title: '车辆调度' }
                },





                {
                    path: '/material_existing',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/MaterialExisting.vue'),
                    meta: { title: '订单详情' }
                },


            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        },

    ]
});
