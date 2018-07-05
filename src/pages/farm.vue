<template>
  <div class="farm">
    <h1>
      当前位置：
      <span><a :href="farmUrl" @click="remove">{{farmName}}</a></span>
      <span v-if="houseName"> > </span>
      <span><a :href="houseUrl" @click="clearClass">{{houseName}}</a></span>
    </h1>
    <div class="farm-content">
      <div class="aside-left">
        <ul class="textcenter">
          <li @click="toggle(1)" :class="[addClass==1?'cur':'']">
            查询统计
          </li>
          <li @click="toggle(2)" :class="[addClass==2?'cur':'']">
            数据分析
          </li>
          <li @click="toggle(3)" :class="[addClass==3?'cur':'']">
            领购
          </li>
        </ul>
      </div>
      <div class="aside-right right">
          <router-view @farmTitle="fTitle" @houseTitle="hTitle" v-on:loadShow="loadShow" v-on:loadErrShow="loadErrShow"></router-view>
      </div>
    </div>
      <Load v-show="loading"></Load>
      <LoadErr v-show="loaderr" v-on:loadErrShow="loadErrShow"></LoadErr>
  </div>
</template>
<style scoped>
  .cur {
    color:#ef8201;
  }
  .farm {
    height:100%;
    display:flex;
    flex-flow: column;
    flex:1;
  }
  h1 {
    height:50px;
    line-height: 50px;
    margin-bottom: 10px;
  }
  div.farm-content {
    height:100%;
    position:relative;
  }
  div.aside-left {
    border-top: 1px solid #b0b0b0;
    border-right: 1px solid #b0b0b0;
    width:168px;
    position:absolute;
    left:0;
    top:0;
    bottom:0;
  }
  div.aside-left li {
    height:54px;
    line-height: 54px;
    border-bottom: 1px solid #b0b0b0;
    font-size: 1.1em;
    cursor:pointer;
  }
  div.aside-left li:last-child {
    border:none;
  }
  div.aside-right {
    width:820px;
    position:absolute;
    right:0;
    top:0;
    bottom:0;
  }
</style>
<script type="es6">
  import $axios from 'axios'
  import Load from '../components/loading'
  import LoadErr from '../components/loadingErr'
export default {
  data () {
    return {
      ifLoad:false,
        farmName:'',
        farmUrl:'',
        houseName:'',
        houseUrl:'',
      farmId:'',
      addClass:'',
      case1:false,
      case2:false,
      case3:false,
        loading:false,
        loaderr:false,
      token: localStorage.getItem('token')
    }
  },
    components:{
        Load,LoadErr
    },
  mounted () {
    this.farmId = localStorage.getItem('farmId');
    this.fTitle();
  },
  methods:{
    fTitle () {
      this.farmName = localStorage.getItem('farmName');
      this.farmUrl = localStorage.getItem('farmUrl');
    },
    hTitle () {
      this.houseName = localStorage.getItem('houseName');
      this.houseUrl = localStorage.getItem('houseUrl');
    },
    remove () {
      this.houseName = '';
      this.houseUrl = '';
      this.addClass = '';
    },
      loadShow (bool) {
          if(bool){
              this.loading = true;
          }else {
              this.loading = false;
          }
      },
      loadErrShow (bool) {
          if(bool){
              this.loaderr = true;
          }else {
              this.loaderr = false;
              this.$router.go(0);
          }
      },
      clearClass () {
        this.addClass = '';
      },
    toggle (n) {
      switch (n) {
        case 1:
          this.addClass = 1;

              break;
        case 2:
          this.addClass = 2;
              break;
        case 3:
          this.addClass = 3;
          $axios.get('http://wqs.znswsse.com/store/store.pc.access?farm='+this.farmId+'&token='+this.token).then((msg)=>{
            console.log(msg);
            let d = msg.data.result;
            localStorage.setItem('checkAccess',d.checkAccess);
            localStorage.setItem('shopAccess',d.shopAccess);
            localStorage.setItem('exportAccess',d.exportAccess);
            if(d.exportAccess == 1){
              this.$router.push({path:'/farm/myRecord/inStorage',query:{'c':'inStorage'}});
            }else if(d.shopAccess == 1){
              this.$router.push({path:'/farm/myRecord/getGoods',query:{'c':'getGoods'}});
            }else if(d.checkAccess == 1){
              this.$router.push({path:'/farm/myRecord/check',query:{'c':'check'}});
            }
          })
              break;
      }
    }
  }
}

</script>
