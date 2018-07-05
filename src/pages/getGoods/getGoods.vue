<template>
  <div>
<!--    <div class="title">
      <router-link tag="div" to="inStorage" class="left">
        商品入库
      </router-link>
      <router-link tag="div" to="getGoods" class="left cur">
        领购
      </router-link>
      <router-link tag="div" to="myGetGoods" class="left">
        我的领购
      </router-link>
    </div>-->
    <div class="main">
      <ul class="nav">
        <li class="left" :class="{cur:case1}" @click="toggle(1)">仔猪</li>
        <li class="left" :class="{cur:case2}" @click="toggle(2)">饲料</li>
        <li class="left" :class="{cur:case3}" @click="toggle(3)">兽药疫苗</li>
        <li class="left" :class="{cur:case4}" @click="toggle(4)">器械设备</li>
        <li class="left" :class="{cur:case5}" @click="toggle(5)">其他</li>
      </ul>
      <component :is="typeName" v-on:loadShow="loadShow" v-on:loadErrShow="loadErrShow"></component>
    </div>
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
  import pig from '../../pages/getGoods/pig'
  import fodder from '../../pages/getGoods/fodder'
  import vaccine from '../../pages/getGoods/vaccine'
  import instrument from '../../pages/getGoods/instrument'
  import other from '../../pages/getGoods/other'
  import Load from '../../components/loading'
  import LoadErr from '../../components/loadingErr'

  export default {
    data () {
      return {
        case1:true,
        case2:false,
        case3:false,
        case4:false,
        case5:false,
        getType:true,
        getNumber:false,
        btnText:'领取',
        isSucc:false,
        isErr:false,
          loading:'',
          loaderr:'',
        typeName:'pig',
        token: localStorage.getItem('token')
      }
    },
    components: {
      pig,fodder,vaccine,instrument,other,Load,LoadErr
    },
    mounted () {

    },
    methods: {
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
      toggle (n) {
        switch (n) {
          case 1:
            this.case1 = true;
            this.case2 = false;
            this.case3 = false;
            this.case4 = false;
            this.case5 = false;
            this.typeName = 'pig';
            break;
          case 2:
            this.case1 = false;
            this.case2 = true;
            this.case3 = false;
            this.case4 = false;
            this.case5 = false;
            this.typeName = 'fodder';
            break;
          case 3:
            this.case1 = false;
            this.case2 = false;
            this.case3 = true;
            this.case4 = false;
            this.case5 = false;
            this.typeName = 'vaccine';
            break;
          case 4:
            this.case1 = false;
            this.case2 = false;
            this.case3 = false;
            this.case4 = true;
            this.case5 = false;
            this.typeName = 'instrument';
            break;
          case 5:
            this.case1 = false;
            this.case2 = false;
            this.case3 = false;
            this.case4 = false;
            this.case5 = true;
            this.typeName = 'other';
            break;
        }
      },
      btn () {
        if(this.btnText == '领取'){
          this.getType = false;
          this.getNumber = true;
          this.btnText = '提交';
        }else {
          this.isErr = true;
        }
      },
      myCloseAlert () {
        this.isSucc = false;
        this.isErr = false;
      }
    }
  }

</script>
