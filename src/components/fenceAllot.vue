<template>
<div>
  <div>
    <h1 class="textcenter" style="font-size: 18px; line-height: 24px">{{pigList.houseName}}</h1>
    <ul v-if="pigList.pigQs.length>0">
      <li v-for="item in pigList.pigQs">
        <span>分配：{{item.fNum}}栏</span>
        <div class="right">
          数量：<i @click="changeNum(item,0)">-</i><input class="num" type="text" v-model="item.pQs"/><i @click="changeNum(item,1)">+</i>
        </div>
      </li>
    </ul>
    <ul v-if="!pigList.pigQs.length>0">
      <li>
        <span>这个舍没有栏位数据！</span>
      </li>
    </ul>
  </div>
  <div class="btn">
    <button class="langBtn" @click="continueAdd">继续添加栏位分配</button>
    <button class="right" @click="save">{{btnText}}</button>
  </div>
</div>
</template>
<style scoped>
  .btn {
    overflow:hidden;
    margin-top: 50px;
  }
  .langBtn {
    width:auto;
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
  ul {
    width:500px;
    height:600px;
    margin:0 auto;
    margin-top: 50px;
    overflow-y: scroll;
  }
  ul li {
    height:40px;
    line-height: 40px;
    font-size: 18px;
    border-bottom: 1px dotted #DDDDDD;
  }
  h1 {
    font-size: 16px;
    line-height: 30px;
  }
  i {
    display:inline-block;
    cursor: pointer;
    width:30px;
    height:30px;
    line-height: 30px;
    font-size: 26px;
    text-align: center;
    border:1px solid #b0b0b0;
  }
  input.num {
    width:40px;
    height:28px;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
    display:inline-block;
    border:none;
    border-top: 1px solid #b0b0b0;
    border-bottom: 1px solid #b0b0b0;
    transform: translatey(-5px);
  }
</style>
<script type="es6">
export default {
  data () {
    return {
      pigList:{
        houseName:'',
        houseId:'',
        pigQs:[]
      },
      allQ:0,   //猪总数
      i:0,
      btnText:'完成',
      pigArr:[]
    }
  },
  props:['houseDetailList','pigNum'],
  mounted () {
    this.$nextTick(function(){
      this.getPigList(this.i);
      //console.log('------');
      //console.log(this.houseDetailList.length);
      //console.log('------');
      if(this.houseDetailList.length == 1){
        this.btnText = '完成入栏';
      }else {
        this.btnText = '进入下一个';
      }
    });
  },
  methods:{
    getPigList (i) {
      i = Number(i);
      this.pigList = {
        houseName:'',
        pigQs:[]
      };
      this.pigList.houseName = this.houseDetailList[i].houseName;
      this.pigList.houseId = this.houseDetailList[i].houseId;
      for(var t=0;t<this.houseDetailList[i].fieldList.length;t++){
        this.pigList.pigQs.push({
          'fNum':this.houseDetailList[i].fieldList[t],
          'fieldName':this.houseDetailList[i].fieldNameList[t],
          'pQs':Number(this.pigNum)
        });
      }
    },
    changeNum (item,n) {
      if(n == 1){
        item.pQs++;
      }else {
        if(item.pQs == 1){
          item.pQs = 1;
        }else {
          item.pQs--;
        }
      }
    },
    save () {
      this.pigArr.push(this.pigList);
      for(var i=0;i<this.pigList.pigQs.length;i++){
        this.allQ += this.pigList.pigQs[i].pQs;
      }
      if(this.i + 1<this.houseDetailList.length-1){
        this.i++;
        this.getPigList(this.i);
        this.btnText = '进入下一个';
      }else if(this.i+1 == this.houseDetailList.length-1){
        this.i++;
        this.getPigList(this.i);
        this.btnText = '完成入栏';
      } else if(this.i+1 == this.houseDetailList.length){
        //console.log('完成入栏');
        var myDate = new Date();
        var yyyy = myDate.getFullYear();
        var MM = myDate.getMonth()+1<10?'0'+(myDate.getMonth()+1):myDate.getMonth()+1;
        var DD = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
        var hh = myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours();
        var mm = myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes();
        var ss = myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds();
        var time = yyyy+'-'+MM+'-'+DD+' '+hh+':'+mm+':'+ss;
        this.$emit('finishEnterFence',this.pigArr,time,this.allQ);
      }


      //console.log(this.pigList);
    },
    continueAdd () {
      alert('暂时没有这个功能');
    }
  }
}

</script>
