<template>
  <div>
<!--    <div class="title">
      <router-link tag="div" to="inStorage" class="left">
        商品入库
      </router-link>
      <router-link tag="div" to="getGoods" class="left">
        领购
      </router-link>
      <router-link tag="div" to="myGetGoods" class="left cur">
        我的领购
      </router-link>
    </div>-->
    <div class="main">
      <ul class="nav">
        <li class="left" :class="[myCur=='check'?'cur':'']" @click="getMessage('check')">待审核</li>
        <li class="left" :class="[myCur=='draw'?'cur':'']" @click="getMessage('draw')">待领取</li>
        <li class="left" :class="[myCur=='fail'?'cur':'']" @click="getMessage('fail')">未通过</li>
        <li class="left" :class="[myCur=='done'?'cur':'']" @click="getMessage('done')">已完成</li>
      </ul>
      <div class="form">
        <div class="list">
          <div class="dsj_item" v-for="order in orderList">
            <p class="dsj_p_head">订单编号：{{order.orderCode}}</p>
            <p class="dsj_p_head">提交时间：{{order.submitTime}}</p>
            <div v-for="(s,index) in order.stuffs">
              <p class="dsj_p_li"><span class="dsj_p_text">{{index+1}}.{{s.stuffName}} </span><span class="dsj_p_num">数量：{{s.quantity}}</span></p>
            </div>
            <span class="dsj_mes" :class="[order.nowState=='申请失败'?'dsj_err':'',order.nowState=='申请成功'?'dsj_succ':'']">{{order.nowState}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .dsj_item {
    background-color: #f2f2f2;
    padding:12px;
    margin-bottom: 10px;
    position:relative;
  }
  .dsj_p_head {
    color:#575757;
    height:20px;
    line-height: 20px;
  }
  .dsj_p_li {
    font-size: 16px;
    line-height: 30px;
    height:30px;
    color:#454545;
  }
  .dsj_p_text {
    float:left;
    width:80%;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dsj_p_num {
    float:right;
    width:20%;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
  .dsj_mes {
    position:absolute;
    top:13px;
    right:13px;
    font-size: 1.3em;
  }
  .dsj_err {
    color:#f00;
  }
  .dsj_succ {
    color:#0e620d;
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
    background-color: #ddd;
    padding:30px 40px;
    position:relative;
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
  import $axios from 'axios'
  import Loading from '../../components/loading'
  export default {
    data () {
      return {
        ifLoad:true,
        myCur:'check',
        orderList:[],
        token: localStorage.getItem('token')
      }
    },
    components:{
      Loading
    },
    mounted () {
      this.farmId = localStorage.getItem('farmId');
      this.getMessage('check');
    },
    methods: {
        tokenErr () {
            alert('登陆过期,请重新登陆');
            this.$router.push({path:'/log'});
        },
      getMessage (c) {
        this.myCur = c;
          this.$emit('loadShow',true);
        $axios.get('http://wqs.znswsse.com/store/stuff.order.self?farm='+this.farmId+'&otype='+c+'&token='+this.token).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          console.log(msg);
          this.ifLoad = false;
          this.$emit('closeLoad');
          if(msg.data.code == 200){
            if(msg.data.result.length>0){
              this.orderList = msg.data.result;
            }else {
              this.orderList = [];
              alert('没有订单数据')
            }
          }else {
            alert('token过期，请重新登陆');
            this.$router.push('/');
          }
        }).catch((err)=>{
            this.$emit('loadErrShow',true);
        })
      }
    }
  }

</script>
