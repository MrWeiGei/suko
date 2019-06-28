/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
* 注意:子菜单只在路由子菜单时出现。长度> = 1
*
* hidden:true              如果设置为true，项目将不会显示在侧栏中(默认为false)
* alwaysShow: true         如果设置为true，将始终显示根菜单
*                          如果不设置alwaysShow，当项目有多个子路由时，它将成为嵌套模式，否则不显示根菜单
* redirect: noRedirect     如果设置noRedirect，则在面包屑中不会重定向
* name:'router-name'       这个名称由<keep-alive>使用(必须设置!!)
* meta: {
    title: 'title'               侧边栏和面包屑中显示的名称(推荐设置)
    icon:“svg-name”              图标显示在侧边栏
    noCache: true                如果设置为true，页面将不会被缓存(默认为false)
    affix:true                   如果设置为true，则标记将附加在标记视图中
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中(默认为true)
    activeMenu: '/example/list'  如果设置了路径，侧边栏将突出显示您设置的路径
  }
*/

/**
 * constantRoutes
 *没有权限要求的基本页
 *所有角色都可以访问
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: 'dashboard',
        icon: 'index',
        affix: true
      }
    }]
  }, {
    path: '/setting',
    component: Layout,
    hidden: true,
    redirect: '/setting/setting',
    children: [{
      path: 'setting',
      component: () => import('@/views/setting/index'),
      name: 'setting',
      meta: {
        title: 'setting',
      }
    }]
  }, {
    path: '/addHome',
    component: () => import('@/views/goods/homestay/addHome'),
    hidden: true,
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */



// export const asyncRoutes = [{
//     path: '/example',
//     component: Layout,
//     redirect: '/example/list',
//     name: 'Example',
//     meta: {
//       title: 'example',
//       icon: 'example'
//     },
//     children: [{
//         path: 'create',
//         component: () => import('@/views/example/create'),
//         name: 'CreateArticle',
//         meta: {
//           title: 'createArticle',
//           icon: 'edit'
//         }
//       },
//       {
//         path: 'edit/:id(\\d+)',
//         component: () => import('@/views/example/edit'),
//         name: 'EditArticle',
//         meta: {
//           title: 'editArticle',
//           noCache: true,
//           activeMenu: '/example/list'
//         },
//         hidden: true
//       },
//       {
//         path: 'list',
//         component: () => import('@/views/example/list'),
//         name: 'ArticleList',
//         meta: {
//           title: 'articleList',
//           icon: 'list'
//         }
//       }
//     ]
//   },
//   {
//     path: '*',
//     redirect: '/404',
//     hidden: true
//   }
// ]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes,
  mode: "history" // require service support
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
