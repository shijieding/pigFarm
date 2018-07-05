<template>
<div>
  <div class="top">
    <div class="num">
      <input type="number" v-model="weighNum"/><span>kg</span>
    </div>
    <div class="btn">
      <span>日期：{{myDate}}</span>
      <button class="right" @click.prevent="saveWeigh">保存</button>
    </div>
  </div>
  <div class="center">
    <ul class="weigh">
      <li class="left">
        <p class="left">次数</p>
        <p class="left">重量</p>
      </li>
      <li class="left">
        <p class="left">次数</p>
        <p class="left">重量</p>
      </li>
      <li class="left">
        <p class="left">次数</p>
        <p class="left">重量</p>
      </li>
      <li class="left" v-for="(item,index) in weighList">
        <p class="left">{{index+1}}</p>
        <p class="left">{{item}}</p>
      </li>
    </ul>
    <div class="all">
      <p class="left">总次数：{{allNum}}</p>
      <p class="left">总重量：{{allWeigh}}kg</p>
    </div>
  </div>
  <div class="bottom">
    <button @click.prevent="finishWeigh">秤完分配</button>
  </div>
  <transition name="fade">
    <div class="alert" v-show="isAlert">
      <Alert @on-close="myCloseAlert">
        <p slot="delete">总重量为{{allWeigh}}kg，是否作为最终数据</p>
      </Alert>
    </div>
  </transition>
</div>
</template>
<style scoped>
  input[type=number] {
    -moz-appearance:textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  div.num {
  height:50px;
  line-height: 50px;
  font-size: 26px;
  text-align: center;
}
div.num input {
  height:50px;
  line-height: 50px;
  font-size: 50px;
  text-align: center;
  width: 150px;
}
  div.top div.btn {
    margin-top: 50px;
    padding:0 100px;
    height:44px;
    line-height: 44px;
    font-size: 16px;
  }
  button {
    width:90px;
    height:44px;
    background-color: #e5e5e5;
    border:1px solid #a9a9a9;
    border-radius: 3px;
    font-size: 1.1em;
    cursor:pointer;
  }
  .weigh {
    min-height: 300px;
    border-left: 1px solid #b0b0b0;
    border-right: 1px solid #b0b0b0;
    border-top: 1px solid #b0b0b0;
    margin-top: 50px;
    overflow:hidden;
  }
  .weigh li {
    width:33.333%;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
.weigh li p {
  width:50%;
  border-right: 1px solid #b0b0b0;
  border-bottom: 1px solid #b0b0b0;
  box-sizing: border-box;
}
div.all {
  border:1px solid #b0b0b0;
  overflow: hidden;
  height:30px;
  line-height: 30px;
}
  div.all p {
    text-align: center;
    width:50%;
  }
  div.bottom {
    text-align: right;
    margin-top: 50px;
  }
</style>
<script type="es6">
  import Alert from '../components/alert.vue'
export default {
  data () {
    return {
      allNum:0,
      allWeigh:0,
      isAlert:false,
        myDate:'',
      weighNum:''
    }
  },
  props:['weighList'],
  components: {
    Alert
  },
  watch:{

  },
  mounted () {
      var myDate = new Date();
      var yyyy = myDate.getFullYear();
      var MM = myDate.getMonth()+1<10?'0'+(myDate.getMonth()+1):myDate.getMonth()+1;
      var DD = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
      this.myDate =  yyyy+'-'+MM+'-'+DD;
    this.weigh();
  },
  methods:{
    weigh () {
      this.allNum = this.weighList.length;
      for(var i=0;i<this.weighList.length;i++){
        this.allWeigh += Number(this.weighList[i]);
      }
    },
    finishWeigh () {
      this.isAlert = true;
    },
    myCloseAlert (data) {
      if(data){
       //console.log('提交');
        this.$emit('allot',this.allWeigh);
      }else {
        //console.log('不提交');
      }
      this.isAlert = false;
    },
    saveWeigh () {
      if(this.weighNum == ''){
        alert('错误的数据');
      }else{
        var myDate = new Date();
        var yyyy = myDate.getFullYear();
        var MM = myDate.getMonth()+1<10?'0'+(myDate.getMonth()+1):myDate.getMonth()+1;
        var DD = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
        var hh = myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours();
        var mm = myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes();
        var ss = myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds();
        var time = yyyy+'-'+MM+'-'+DD+' '+hh+':'+mm+':'+ss;
        this.$emit('reWeigh',this.weighNum,time);
        this.allNum = this.weighList.length;
        this.allWeigh += Number(this.weighNum);
        this.weighNum = '';
      }
    }
  }
}

</script>
