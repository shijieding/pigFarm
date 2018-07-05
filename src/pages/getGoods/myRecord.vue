<template>
  <div>
    <div class="title">
      <div class="left" :class="[cur=='inStorage'?'cur':'']" @click="toggle('inStorage')" v-if="this.export">
        商品入库
      </div>
      <div class="left" :class="[cur=='outStorage'?'cur':'']" @click="toggle('outStorage')" v-if="this.export">
        出库
      </div>
      <div class="left" :class="[cur=='getGoods'?'cur':'']" @click="toggle('getGoods')" v-if="this.shop">
        领购
      </div>
      <div class="left" :class="[cur=='myGetGoods'?'cur':'']" @click="toggle('myGetGoods')" v-if="this.shop">
        我的领购
      </div>
      <div class="left" :class="[cur=='myCheck'?'cur':'']" @click="toggle('myCheck')" v-if="this.check">
        我的审核
      </div>
    </div>
    <router-view v-on:loadShow="loadShow" v-on:loadErrShow="loadErrShow"></router-view>
      <Load v-show="loading"></Load>
      <LoadErr v-show="loaderr" v-on:loadErrShow="loadErrShow"></LoadErr>
  </div>
</template>
<style scoped>
  .list {
    background-color: #fff;
    margin-top: 30px;
  }
  .list li.title {
    border-bottom: 1px solid #cccccc;
    height:50px;
    line-height: 50px;
  }
  .list li {
    height:40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid #DDDDDD;
  }
  .list li>div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .w25 {
    width:25%;
  }
  .w20 {
    width:20%;
  }
  span.search {
    float:right;
    width:50px;
    line-height: 40px;
    height: 40px;
    border-left: 1px solid #ef8201;
    background:#fff url('../../assets/img/search1.png');
  }
  div.search {
    border:2px solid #ef8201;
    width:400px;
    height:40px;
    line-height: 40px;
    margin:10px auto;
  }
  input.search {
    border:none;
    width:330px;
    height:40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 16px;
    background-color: transparent;
  }
  .checkbox {
    width:25px;
    height:25px;
    border: 1px solid #b0b0b0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor:pointer;
    vertical-align: middle;
    margin:0 10px;
  }
  .checkbox:checked {
    background: url("../../assets/img/checkbox.png") no-repeat center center;
    background-size: 100% 100%;
  }
  div.input_box {
    width:50%;
    float:left;
    margin-bottom: 20px;
  }
  span.input_name {
    font-size: 16px;
    width:80px;
    float:left;
    height:30px;
    line-height: 30px;
  }
  div.form {
    position:relative;
    min-height: 300px;
    padding-bottom: 100px;
  }
  .btn_box {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .btn {
    padding:5px 10px;
    border:1px solid #b0b0b0;
    cursor:pointer;
    border-radius: 3px;
    font-size: 16px;
    background-color: #eeeeee;
  }
  select {
    height:30px;
    line-height: 30px;
    padding:0 10px;
    width:183px;
    font-size: 16px;
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    border:1px solid #b0b0b0;
    background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
    padding-right: 14px;
  }
  select::-ms-expand { display: none; }
  option {
    height:30px;
    line-height: 30px;
  }
  input {
    height:30px;
    line-height: 30px;
    padding-left: 10px;
  }
  div.title {
    border-bottom: 1px solid #ecb802;
    height: 40px;
    margin-top: 15px;
  }
  div.title>div {
    cursor:pointer;
    width:100px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    padding:0 10px;
    margin:0 20px;
    border:1px solid #ecb802;
    background-color: #ffe288;
    transform:translatey(-1px);
    font-size: 16px;
    letter-spacing: 3px;
  }
  div.title>div.cur {
    border-bottom: 1px solid #f0f0f0;
    background-color: #f0f0f0;
  }
  ul.nav {
    overflow: hidden;
    margin:30px 0;
    padding-left: 20px;
  }
  .nav li {
    width:100px;
    height:30px;
    line-height: 30px;
    text-align: center;
    margin-right: 60px;
    background-color: #d0d0d0;
    cursor: pointer;
  }
  .nav li.cur {
    background-color: #ef8201;
  }

</style>
<script type="es6">
    import Load from '../../components/loading'
    import LoadErr from '../../components/loadingErr'
  export default {
    data () {
      return {
        cur:'',
        shop:true,
        export:true,
        check:true,
          loading:false,
          loaderr:false,
        token: localStorage.getItem('token')
      }
    },
      components:{
          Load,LoadErr
      },
    mounted () {
       this.getQuery();
    },
    beforeRouteUpdate (to,from,next) {
      let c = to.query.c;
      this.cur = c;
      console.log(this.cur);
      console.log(c);
      next();
    },
    methods: {
      toggle (n) {
        this.$router.push(n);
        this.cur = n;
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
      getQuery () {
        this.shop = localStorage.getItem('shopAccess')==1?true:false;
        this.export =localStorage.getItem('exportAccess')==1?true:false;
        this.check = localStorage.getItem('checkAccess')==1?true:false;
        if(this.export){
          this.$router.push({path:'/farm/myRecord/inStorage'});
          this.cur = 'inStorage';
          return;
        }
        if(this.shop){
          this.$router.push({path:'/farm/myRecord/getGoods'});
          this.cur = 'getGoods';
          return;
        }
        if(this.check){
          this.$router.push({path:'/farm/myRecord/myCheck'});
          this.cur = 'myCheck';
          return;
        }
      }
    }
  }

</script>
