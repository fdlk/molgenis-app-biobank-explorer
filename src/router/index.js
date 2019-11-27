import Vue from 'vue'
import VueRouter from 'vue-router'
import BiobankExplorerContainer from '../components/BiobankExplorerContainer'
import BiobankReportCard from '../components/cards/BiobankReportCard'
import CollectionReportCard from '../components/cards/CollectionReportCard'
import NetworkReportCard from '../components/cards/NetworkReportCard'
import { INITIAL_STATE } from '../store/state'

Vue.use(VueRouter)
export default new VueRouter({
  mode: 'history',
  base: INITIAL_STATE.baseUrl,
  routes: [
    {
      path: '/biobankexplorer',
      component: BiobankExplorerContainer
    },
    {
      path: '/biobank/report/:id',
      redirect: '/biobank/:id'
    },
    {
      path: '/biobank/:id',
      name: 'biobank',
      component: BiobankReportCard
    },
    {
      path: '/collection/:id',
      name: 'collection',
      component: CollectionReportCard
    },
    {
      path: '/network/:id',
      name: 'network',
      component: NetworkReportCard
    },
    { path: '/', redirect: '/biobankexplorer' }
  ]
})
