<template>
  <div>
    <Loading v-show="ifLoad"></Loading>
    <Search v-show="showSearch" :vid="vid" @sea="searchKey"></Search>
    <div class="form">
      <div class="table">
        <ul class="list" v-show="getType">
          <li class="title">
            <div class="left w20">名称</div>
            <div class="left w20">型号</div>
            <div class="left w20">单价(元)</div>
            <div class="left w20">规格</div>
            <div class="left w20">库存</div>
          </li>
          <li v-for="p in pList">
            <div class="left w20"><div class="c_box"><input type="checkbox" class="checkbox" v-model="p.isChose"/>{{p.name}}</div></div>
            <div class="left w20">{{p.model}}</div>
            <div class="left w20">{{p.price}}</div>
            <div class="left w20">{{p.specification}}</div>
            <div class="left w20">{{p.quantity}}</div>
          </li>
        </ul>
        <ul class="list" v-show="getNumber">
          <li class="title">
            <div class="left w16">名称</div>
            <div class="left w16">型号</div>
            <div class="left w16">单价(元)</div>
            <div class="left w16">规格</div>
            <div class="left w16">库存</div>
            <div class="left w16">数量</div>
          </li>
          <li v-for="c in choseList">
            <div class="left w16">{{c.name}}</div>
            <div class="left w16">{{c.model}}</div>
            <div class="left w16">{{c.price}}</div>
            <div class="left w16">{{c.specification}}</div>
            <div class="left w16">{{c.quantity}}</div>
            <div class="left w16"><input type="number" v-model="c.num" class="w50" style="width:50%;transform: translatey(-2px)"/></div>
          </li>
        </ul>
      </div>
      <div class="btn_box">
        <button class="btn" @click="getPList(-1)"> < </button>
        <button class="btn" @click="getPList(1)"> > </button>
        <button class="btn" @click="btn">{{btnText}}</button>
      </div>
    </div>
    <transition name="fade">
      <div class="alert" v-show="isErr">
        <Alert @on-close="myCloseAlert">
          <p slot="delete">商品领取失败，请核实商品数量后再次提交.</p>
        </Alert>
      </div>
    </transition>
    <transition name="fade">
      <div class="alert" v-show="isSucc">
        <Alert @on-close="myCloseAlert">
          <p slot="delete">您已成功领取物品</p>
        </Alert>
      </div>
    </transition>
  </div>
</template>

<script>
  import $axios from 'axios'
  import Alert from '../../components/alert.vue'
  import Search from '../../pages/getGoods/search'
  import Loading from '../../components/loading'
  export default {
    data () {
      return {
        ifLoad:true,
        getType:true,
        getNumber:false,
        btnText:'领取',
        isSucc:false,
        isErr:false,
        showSearch:true,  //显示搜索框
        pList:[],//加载的产品列表
        choseList:[],//选中的产品列表
        farmId:'',
        vid:2,
        index:0,//第几页
        token: localStorage.getItem('token')
      }
    },
    components:{
      Alert,Search,Loading
    },
    mounted () {
      this.farmId = localStorage.getItem('farmId');
      this.getPList(-1);
    },
    methods:{
        tokenErr () {
            alert('登陆过期,请重新登陆');
            this.$router.push({path:'/log'});
        },
      getPList (n) {
        if(n>0){
          this.index += 10;
        }else {
          this.index -= 10;
          if(this.index < 0){
            this.index = 0;
          }
        }
          this.$emit('loadShow',true);
        $axios.get('http://wqs.znswsse.com/store/stuff.variety?farm='+this.farmId+'&vid='+this.vid+'&index='+this.index+'&token='+this.token).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          if(msg.data.code == 200){
            this.ifLoad = false;
            if(msg.data.result.length>0){
              this.pList = msg.data.result;
              for(var i=0;i<this.pList.length;i++){
                this.$set(this.pList[i],'isChose',false);
                this.$set(this.pList[i],'num',1);
              }
            }else {
              alert('没有更多数据了');
              this.index -= 10;
            }
          }else if(msg.data.code == 500){
            alert('token过期，请重新登陆');
            this.$router.push('/');
          }
        }).catch((err)=>{
            this.$emit('loadErrShow',true);
        })
      },
      btn () {
        if(this.btnText == '领取'){
          for(var i=0;i<this.pList.length;i++){
            if(this.pList[i].isChose){
              this.choseList.push(this.pList[i]);
              this.pList[i].isChose = false;
            }
          }
          if(this.choseList.length >= 1){
            this.getType = false;
            this.getNumber = true;
            this.showSearch = false;
            this.btnText = '提交';
          }else {
            alert('请选择要领取的商品');
          }
        }else {
          let json = {farm:this.farmId,stuffs:[]};
          console.log(this.choseList);
          for(var i=0;i<this.choseList.length;i++){
            if(this.choseList[i].num>0 && this.choseList[i].num<=this.choseList[i].quantity){
              json.stuffs.push({sid:this.choseList[i].id,count:this.choseList[i].num});
            }else {
              this.isErr = true;
              json.stuffs = [];
            }
          }
            this.$emit('loadShow',true);
          $axios.post('http://wqs.znswsse.com/store/stuff.order?token='+this.token,json).then((msg)=>{
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            console.log(msg);
            if(msg.data.code == 200){
              this.choseList = [];
              this.isSucc = true;
              this.getType = true;
              this.getNumber = false;
              this.showSearch = true;
              this.btnText = '领取';
            }else {
              this.isErr = true;
            }
          }).catch((err)=>{
              this.$emit('loadErrShow',true);
          })
        }
      },
      myCloseAlert (t) {
        this.getPList();
        this.isSucc = false;
        this.isErr = false;
      },
      searchKey (s) {
        console.log(s);
        this.pList = s;
      }
    }
  }
</script>

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
  .w16 {
    width:16.6%;
  }
  .c_box {
    width:150px;
    margin:0 auto;
    text-align: left;
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
