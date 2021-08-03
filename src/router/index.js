import {createRouter, createWebHashHistory} from 'vue-router'
import {ElMessage} from "element-plus";
import {getToken} from '../util/auth.js';
import NProgress from 'nprogress';//加载进度条
import 'nprogress/nprogress.css';
// 进度条配置项
NProgress.configure({
    showSpinner: false
})

//默认不需要权限的页面
const constantRouterMap = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: "/login",
        meta: {
            title: '登录'
        },
        component: () => import("../views/Login.vue")
    },
    {
        path: "/404",
        meta: {
            title: '404'
        },
        component: () => import("../views/404.vue")
    },
    {
        path: "/403",
        meta: {
            title: '403'
        },
        component: () => import("../views/403.vue")
    }, {
        path: "/home",
        meta: {
            title: '首页'
        },
        component: () => import("../views/Home.vue"),
        children: [
            {
                path: "/homePage",
                meta: {
                    title: '个人中心'
                },
                component: () => import("../views/homePage.vue")
            },
            {
                path: "/user",
                meta: {
                    title: '用户管理'
                },
                component: () => import("../views/setting/user.vue")
            },
            {
                path: "/role",
                meta: {
                    title: '角色管理'
                },
                component: () => import("../views/setting/role.vue")
            },
            {
                path: "/resource",
                meta: {
                    title: '资源管理'
                },
                component: () => import("../views/setting/resource.vue")
            },
            {
                path: "/dictionary",
                meta: {
                    title: '字典管理'
                },
                component: () => import("../views/setting/dictionary.vue")
            },
            {
                path: "/messageCenter",
                meta: {
                    title: '消息中心'
                },
                component: () => import("../views/messageCenter.vue")
            },
            //
            // {
            //     path: "/table",
            //     meta: {
            //         title: '基础表格'
            //     },
            //     component: () => import("../views/Table.vue")
            // },
            // {
            //     path: "/form",
            //     meta: {
            //         title: '基础表单'
            //     },
            //     component: () => import("../views/Form.vue")
            // },
        ]
    }
]

const asyncRouterMap = []

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRouterMap,
})

//手动跳转的页面白名单
const whiteList = ['/login', '/404', '/403'];

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} - Zan Admin Frame`; //添加title
    const user = getToken();//获取token to.path !== '/login'
    NProgress.start();// 路由跳转前钩子函数中 - 执行进度条开始加载
    if (!to.matched.length) {
        next('/404');
    }
    if (user) {
        if (to.path === '/') {
            next();
        } else {
            next();
        }
    } else {
        if (whiteList.includes(to.path)) {  //如果是白名单无须token则直接进入
            next();
        } else {
            ElMessage.error("无登陆凭证,无法访问,请先登陆!")
            next('/login')
        }

    }
});


// 路由跳转后钩子函数中 - 执行进度条加载结束
router.afterEach(() => {
    NProgress.done();
});

export default router;
