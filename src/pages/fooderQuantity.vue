<template>
  <div>
    <div class="fooder">
      <h1 class="textcenter">单词料量(标定):{{food}}(克)</h1>
      <div class="update-food">
        单词料量：
        <i class="dec" @click="upN(-1)"></i>

        <input type="food" v-model="food"/>

        <i class="add" @click="upN(1)"></i>
      </div>
      <div class="bottom">
        <button class="btn" @click="enFood">确定</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
div.fooder {
  background-color: #e0e0e0;
  padding: 20px;
}
  h1 {
    height:50px;
  }
  div.update-food {
    margin:0 auto 100px;
  }
  div.bottom {
    text-align: right;
  }
  i {
    background-size:100% 100%;
    display:inline-block;
    width:20px;
    height: 22px;
    margin:0 5px;
    color:#fff;
    cursor: pointer;
    vertical-align: middle;
    transform: translatey(-1px);
  }
  i.dec {
    background-image: url('../assets/img/dec.png');
  }
  i.add {
    background-image: url('../assets/img/add.png');
  }
  input  {
    width:60px;
    height: 21px;
    text-align: center;
    border:1px solid #b0b0b0;
    border-radius: 2px;
    background-color: #e0e0e0;
  }
input[type=food] {
  -moz-appearance:textfield;
}
input[type=food]::-webkit-inner-spin-button,
input[type=food]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.btn {
    padding:5px 10px;
    border:1px solid #b0b0b0;
    cursor:pointer;
    border-radius: 3px;
  }
</style>
<script type="es6">
  import port from '../data_json/port.vue'
export default {
  data () {
    return {
        food:0,
      farmId:'',
      houseId:'',
      fieldNum:'',
      token:localStorage.getItem('token')
    }
  },
  watch:{
    food () {
      if(this.food < 1){
        this.food = 1;
      }
    }
  },
  mounted () {
    this.food = this.$route.query.food;
    this.houseId = this.$route.query.houseId;
    this.fieldNum = this.$route.query.fieldNum;
    this.farmId = localStorage.getItem('farmId');
  },
  methods:{
    tokenErr () {
      alert('登陆过期,请重新登陆');
      this.$router.push({path:'/log'});
    },
    upN (n) {
      if(n>0){
        this.food ++;
      }else {
        this.food --;
        if(this.food < 1){
          this.food = 1;
        }
      }
    },
    enFood () {
      var json = {
        farmId:this.farmId,
        houseId:this.houseId,
        fieldNum:this.fieldNum,
        food:this.food
      };
        this.$emit('loadShow',true);
      this.axios.post('/field/food-set?token='+this.token,json).then((msg)=>{
        //console.log(msg);
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        this.$router.go(-1);
      }).catch((err)=>{
        //console.log(err);
          this.$emit('loadErrShow',true);
      });
    }
  }
}

</script>
