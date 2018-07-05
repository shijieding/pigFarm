<template>
  <div>
<!--    <div class="title">
      <router-link tag="div" to="inStorage" class="left cur">
        商品入库
      </router-link>
      <router-link tag="div" to="getGoods" class="left">
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
      <div class="form" v-show="case1">
        <div class="input_box">
          <span class="input_name">仔猪名称：</span>
          <input type="text" v-model="name"/>
        </div>
        <div class="input_box">
          <span class="input_name">来源：</span>
          <input type="text" v-model="from"/>
        </div>
        <div class="input_box">
          <span class="input_name">单价：</span>
          <input type="number" v-model="price"/>
        </div>
        <div class="input_box">
          <span class="input_name">规格：</span>
          <input type="text" v-model="specification"/>
        </div>
        <div class="input_box">
          <span class="input_name">入库数量：</span>
          <input type="number" v-model="quantity"/>
        </div>
        <div class="btn_box">
          <button class="btn" @click="saveMessage(1)">保存</button>
        </div>
      </div>
      <div class="form" v-show="case2">
        <div class="input_box">
          <span class="input_name">饲料名称：</span>
          <input type="text" v-model="name"/>
        </div>
        <div class="input_box">
          <span class="input_name">型号：</span>
          <input type="text" v-model="model"/>
        </div>
        <div class="input_box">
          <span class="input_name">单价：</span>
          <input type="number" v-model="price"/>
        </div>
        <div class="input_box">
          <span class="input_name">规格：</span>
          <input type="text" v-model="specification"/>
        </div>
        <div class="input_box">
          <span class="input_name">入库数量：</span>
          <input type="number" v-model="quantity"/>
        </div>
        <div class="btn_box">
          <button class="btn" @click="saveMessage(2)">保存</button>
        </div>
      </div>
      <div class="form" v-show="case3">
        <div class="input_box">
          <span class="input_name">药品名称：</span>
          <input type="text" v-model="name"/>
        </div>
        <div class="input_box">
          <span class="input_name">单位：</span>
          <input type="text" v-model="unit"/>
        </div>
        <div class="input_box">
          <span class="input_name">单价：</span>
          <input type="number" v-model="price"/>
        </div>
        <div class="input_box">
          <span class="input_name">规格：</span>
          <input type="text" v-model="specification"/>
        </div>
        <div class="input_box">
          <span class="input_name">入库数量：</span>
          <input type="number" v-model="quantity"/>
        </div>
        <div class="btn_box">
          <button class="btn" @click="saveMessage(3)">保存</button>
        </div>
      </div>
      <div class="form" v-show="case4">
        <div class="input_box">
          <span class="input_name">设备名称：</span>
          <input type="text" v-model="name"/>
        </div>
        <div class="input_box">
          <span class="input_name">型号：</span>
          <input type="text" v-model="model"/>
        </div>
        <div class="input_box">
          <span class="input_name">单价：</span>
          <input type="number" v-model="price"/>
        </div>
        <div class="input_box">
          <span class="input_name">规格：</span>
          <input type="text" v-model="specification"/>
        </div>
        <div class="input_box">
          <span class="input_name">入库数量：</span>
          <input type="number" v-model="quantity"/>
        </div>
        <div class="btn_box">
          <button class="btn" @click="saveMessage(4)">保存</button>
        </div>
      </div>
      <div class="form" v-show="case5">
        <div class="input_box">
          <span class="input_name">物品名称：</span>
          <input type="text" v-model="name"/>
        </div>
        <div class="input_box">
          <span class="input_name">来源：</span>
          <input type="text" v-model="from"/>
        </div>
        <div class="input_box">
          <span class="input_name">单价：</span>
          <input type="number" v-model="price"/>
        </div>
        <div class="input_box">
          <span class="input_name">规格：</span>
          <input type="text" v-model="specification"/>
        </div>
        <div class="input_box">
          <span class="input_name">入库数量：</span>
          <input type="number" v-model="quantity"/>
        </div>
        <div class="btn_box">
          <button class="btn" @click="saveMessage(5)">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
    height:300px;
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
  import Vue from 'vue'
  export default {
    data () {
      return {
        ifLoad:false,
        case1:true,
        case2:false,
        case3:false,
        case4:false,
        case5:false,
        farmId:'',
        name:'',
        varietyId:1,//1代表仔猪
        from:'',      //来源
        price:'',     //价格
        specification:'',    //规格
        model:'',       //型号
        unit:'',   //单位
        quantity:'',       //数量
        token:localStorage.getItem('token')
      }
    },
    components:{
      Loading
    },
    mounted () {
      this.farmId = localStorage.getItem('farmId');
    },
    methods: {
        tokenErr () {
            alert('登陆过期,请重新登陆');
            this.$router.push({path:'/log'});
        },
      clearMessage () {
        this.name = '';
        this.from = '';
        this.price = '';
        this.model = '';
        this.unit = '';
        this.quantity = '';
      },
      toggle (n) {
        this.clearMessage();
        switch (n) {
          case 1:
            this.case1 = true;
            this.case2 = false;
            this.case3 = false;
            this.case4 = false;
            this.case5 = false;
            this.specification = '头';
            break;
          case 2:
            this.case1 = false;
            this.case2 = true;
            this.case3 = false;
            this.case4 = false;
            this.case5 = false;
            this.specification = '袋';
            break;
          case 3:
            this.case1 = false;
            this.case2 = false;
            this.case3 = true;
            this.case4 = false;
            this.case5 = false;
            this.specification = '盒';
            break;
          case 4:
            this.case1 = false;
            this.case2 = false;
            this.case3 = false;
            this.case4 = true;
            this.case5 = false;
            this.specification = '台';
            break;
          case 5:
            this.case1 = false;
            this.case2 = false;
            this.case3 = false;
            this.case4 = false;
            this.case5 = true;
            this.specification = '个';
            break;
        }
      },
      saveMessage (typeId) {
        if(this.name && this.price && this.quantity){
          let json = {
            name:this.name,
            varietyId:typeId,
            from:this.from,
            price:this.price,
            specification:this.specification,
            model:this.model,
            unit:this.unit,
            quantity:this.quantity
          };
          this.ifLoad = true;
            this.$emit('loadShow',true);
          $axios.post('http://wqs.znswsse.com/store/stuff.add?farm='+this.farmId+'&token='+this.token,json).then((msg)=>{
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            console.log(msg.data.code);
            this.ifLoad = false;
            this.clearMessage();
            if(msg.data.code == 500){
              alert('token过期，请重新扫码登陆')
              this.$router.push('/');
            }
          }).catch((err)=>{
              this.$emit('loadErrShow',true);
          })
        }else {
          alert('* 号位必填项');
        }
      }
    }
  }

</script>
