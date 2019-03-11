import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import ExcelExport from '@/components/excelExport'
import ExcelExport from '@/views/excelExport'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/exportexcel',
      name: 'ExcelExport',
      component: ExcelExport
    }
  ]
})
