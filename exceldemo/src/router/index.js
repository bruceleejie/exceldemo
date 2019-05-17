import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import ExcelExport from '@/components/excelExport'
import ExcelExport from '@/views/excelExport'
import importExcel from '@/views/excelImport'
import OrgImport from '@/views/orgImport'
import OrgExport from '@/views/orgExport'

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
    },
    {
      path: '/importexcel',
      name: 'importExcel',
      component: importExcel
    },
    {
      path: '/importorg',
      name: 'OrgImport',
      component: OrgImport
    },
    {
      path: '/exportorg',
      name: 'OrgExport',
      component: OrgExport
    }
  ]
})
