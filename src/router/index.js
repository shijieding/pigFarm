import Vue from 'vue'
import Router from 'vue-router'
import FarmList from '../pages/farmList.vue'
import Farm from '../pages/farm.vue'
import Fence from '../pages/fence.vue'
import FenceDes from '../pages/fenceDes.vue'
import house from '../pages/house.vue'
import foodDay from '../pages/foodDay.vue'
import feedInfor from '../pages/feedInfor.vue'
import dataReport from '../pages/dataReport.vue'
import fooderQuantity from '../pages/fooderQuantity.vue'
import pigQuantity from '../pages/pigQuantity.vue'
import enterFence from '../pages/enterFence.vue'
import leaveFence from '../pages/leaveFence.vue'
import regWater from '../pages/regWater.vue'
import log from '../pages/log.vue'
import myRecord from '../pages/getGoods/myRecord'
import getGoods from '../pages/getGoods/getGoods.vue'
import myGetGoods from '../pages/getGoods/myGetGoods.vue'
import inStorage from '../pages/getGoods/inStorage.vue'
import myCheck from '../pages/getGoods/myCheck'
import outStorage from '../pages/getGoods/outStorage'

Vue.use(Router)


export default new Router({
  //mode:'history',
  routes: [
    {path: '/', component: log},
    {path: '/farmList', component: FarmList},
    {path: '/log', component: log},
    {path: '/farm', component:Farm,children: [
      {path: 'house', component:house},
      {path: 'fence', component:Fence},
      {path: 'fenceDes', component:FenceDes},
      {path: 'foodDay', component:foodDay},
      {path: 'feedInfor', component:feedInfor},
      {path: 'dataReport', component:dataReport},
      {path: 'fooderQuantity', component:fooderQuantity},
      {path: 'pigQuantity', component:pigQuantity},
      {path: 'enterFence', component:enterFence},
      {path: 'leaveFence', component:leaveFence},
      {path: 'myRecord', component:myRecord, children:[
          {path: 'inStorage', component:inStorage},
          {path: 'getGoods', component:getGoods},
          {path: 'myGetGoods', component:myGetGoods},
          {path: 'myCheck', component:myCheck},
          {path: 'outStorage', component:outStorage}
        ]},
      {path: 'regWater', component:regWater}
    ]}

  ]
})


