<template>
<div>
  <h1 class="textcenter">请将下水量调至盘中料为粥状</h1>
  <h1 class="textcenter">(调节后15分钟观察)</h1>
  <div class="wtype">
    <div :class="{cur:normal}" @click="changeType">常压饲喂</div>
    <div :class="{cur:!normal}" @click="changeType">低压饲喂</div>
  </div>
  <ul class="wnum">
    <li class="left textcenter" v-for="item in water" :class="{cur:item.isCur}" @click="changeNum(item.type)">
      {{item.type}}档
    </li>
  </ul>
  <div class="btn_box">
    <button @click="postWater">确定</button>
  </div>
</div>
</template>
<style scoped>
  h1 {
    font-size: 16px;
    line-height: 30px;
  }
  div.wtype {
    margin:20px auto;
    width:300px;
    height:50px;
    border:1px solid #b0b0b0;
    display:flex;
    border-radius: 8px;
  }
  div.wtype>div {
    width:50%;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }
  div.wtype>div.cur {
    background-color: #ef8301;
    color:#fff;
  }
  ul.wnum {
    margin:20px auto;
    display:flex;
    width:200px;
    height:40px;
    line-height: 40px;
    border:1px solid #b0b0b0;
  }
  ul.wnum li {
    width:20%;
    cursor: pointer;
  }
  ul.wnum li.cur {
    background-color: #b0b0b0;
    color:#fff;
  }
  div.btn_box {
    text-align: center;
  }
  button {
    background-color: #ef8301;
    color:#fff;
    border:none;
    width:80px;
    text-align: center;
    height:30px;
    line-height: 30px;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
<script type="es6">
export default {
  data () {
    return {
      normal:true,
      farmId:'',
      houseId:'',
      norNum:'',  //常压档位
      deNum:'',   //低压档位
      water:[{type:1,num:20,low:120,isCur:false},
            {type:2,num:30,low:130,isCur:false},
            {type:3,num:40,low:140,isCur:false},
            {type:4,num:50,low:150,isCur:false},
            {type:5,num:60,low:160,isCur:false}],
      token:localStorage.getItem('token')
    }
  },
  mounted () {
    this.getWater();
  },
  methods:{
    tokenErr () {
      alert('登陆过期,请重新登陆');
      this.$router.push({path:'/log'});
    },
    changeType () {
      this.normal = !this.normal;
      if(this.normal){
        this.changeNum(this.norNum);
      }else {
        this.changeNum(this.deNum);
      }
    },
    changeNum (n) {
      for(var i=0;i<this.water.length;i++){
        this.water[i].isCur = false;
        if(this.water[i].type == n){
          this.water[i].isCur = true;
        }
      }
    },
    getWater () {
      this.farmId = this.$route.query.farmId;
      this.houseId = this.$route.query.houseId;
        this.$emit('loadShow',true);
      this.axios.get('/'+this.farmId+'/house/'+this.houseId+'/water-common?token='+this.token).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        //console.log(msg);
        if(msg.data.message != 'ok'){
          alert(msg.data.message);
        }else {
          var n = msg.data.result.water;
          switch (n){
            case 20:
              this.norNum = 1;
              break;
            case 30:
              this.norNum = 2;
              break;
            case 40:
              this.norNum = 3;
              break;
            case 50:
              this.norNum = 4;
              break;
            case 60:
              this.norNum = 5;
              break;
          }
          this.changeNum(this.norNum);
        }
      }).catch((err)=>{
        //console.log(err);
          this.$emit('loadErrShow',true);
      });
        this.$emit('loadShow',true);
      this.axios.get('/'+this.farmId+'/house/'+this.houseId+'/water-low?token='+this.token).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        //console.log(msg);
        if(msg.data.message != 'ok'){
          alert(msg.data.message);
        }else {
          var n = msg.data.result.water;
          switch (n){
            case 120:
              this.deNum = 1;
              break;1
            case 130:
              this.deNum = 2;
              break;
            case 140:
              this.deNum = 3;
              break;
            case 150:
              this.deNum = 4;
              break;
            case 160:
              this.deNum = 5;
              break;
          }
        }
      }).catch((err)=>{
        //console.log(err);
          this.$emit('loadErrShow',true);
      });
    },
    postWater () {
      if(this.normal){
        var waterCount = '';
        for(var i=0;i<this.water.length;i++){
          if(this.water[i].isCur){
            waterCount = this.water[i].num;
            this.norNum = this.water[i].type;
          }
        }
        var json = {
          farmId:this.farmId,
          houseId:this.houseId,
          waterCount:waterCount
        };
          this.$emit('loadShow',true);
        this.axios.post('/house/water-common?token='+this.token,json).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          //console.log(msg);
          this.changeNum(this.norNum);
          if(msg.data.result == 0){
            alert('修改成功');
          }else {
            alert('修改失败');
          }
        }).catch((err)=>{
          //console.log(err);
            this.$emit('loadErrShow',true);
        });
      }else {
        var waterCount = '';
        for(var i=0;i<this.water.length;i++){
          if(this.water[i].isCur){
            waterCount = this.water[i].low;
            this.deNum = this.water[i].type;
          }
        }
        var json = {
          farmId:this.farmId,
          houseId:this.houseId,
          waterCount:waterCount
        };
          this.$emit('loadShow',true);
        this.axios.post('/house/water-low?token='+this.token,json).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          //console.log(msg);
          this.changeNum(this.deNum);
          if(msg.data.result == 0){
            alert('修改成功');
          }else {
            alert('修改失败');
          }
        }).catch((err)=>{
          //console.log(err);
            this.$emit('loadErrShow',true);
        });
      }
    }
  }
}

</script>
