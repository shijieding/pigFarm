<template>
<div>
  <h1 class="housename">{{houseName}}</h1>
  <ul class="createList" :style="{width:ulWidth + 'px'}">
    <li v-for="(item,index) in creFence" :class="{ca:!item.fencecChecked,cf:item.fencecChecked,minHeight:item.RowH,minWidth:item.genBug}">
      <div>
        {{item.fieldName}}
      </div>
      <input class="cir" type="checkbox" v-if="item.hasSelect" v-model="item.selectFence"/>
    </li>
  </ul>
  <div class="bottom">
    <button @click="allChose">全选</button>
    <button class="right" @click.prevent="allot">{{btnText}}</button>
  </div>
  <transition name="fade">
    <div class="alert" v-show="isAllot">
      <Alert @on-close="myCloseAlertAllot">
        <p slot="delete" v-if="fence == 0">
          <span v-for="item in this.houseDetailList">
            {{item.houseName}}:
            {{item.fieldList.length}}
            <br/>
          </span>
          每只栏位分配数量：<i @click="changeNum(0)">-</i><input class="num" type="number" v-model="pigNum"/><i @click="changeNum(1)">+</i>
        </p>
        <p slot="delete" v-if="fence == 1">
          <span v-for="item in this.houseDetailList">
            {{item.houseName}}转出数量:
            {{item.fieldList.length}}
            <br/>
          </span>
        </p>
      </Alert>
    </div>
  </transition>
</div>
</template>
<style scoped>
  h1.housename {
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    margin-bottom: 30px;
  }
  input[type=number] {
    -moz-appearance:textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  i {
    display:inline-block;
    width:20px;
    height:20px;
    line-height: 20px;
    font-size: 16px;
    text-align: center;
    border:1px solid #b0b0b0;
    cursor:pointer;
  }
  input.num {
    width:40px;
    height:18px;
    font-size: 16px;
    text-align: center;
    line-height: 20px;
    display:inline-block;
    border:none;
    border-top: 1px solid #b0b0b0;
    border-bottom: 1px solid #b0b0b0;
    -webkit-transform: translatey(-1px);
    -moz-transform: translatey(-1px);
    -ms-transform: translatey(-1px);
    -o-transform: translatey(-1px);
    transform: translatey(-1px);
  }
  .createList {
    overflow: hidden;
  }
  .createList>li {
    float:left;
    box-sizing: border-box;
    text-align: center;
    line-height: 90px;
    position:relative;
  }
  .cir {
    position:absolute;
    top: 5px;
    right: 5px;
    width:20px;
    height: 20px;
    border-radius: 50%;
  }
  .cf {
    border:1px solid #b0b0b0;
    box-sizing: border-box;
    width:140px;
    height:90px;
    position:relative;
  }
  .ca {
    background-color: #e0e0e0;
    width:50px;
    height:90px;
  }
  .ca.minWidth {
    width:140px;
  }
  .ca.minHeight {
    height:50px;
  }
  .bottom {
    width:100%;
    margin-top: 50px;
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
</style>
<script type="es6">
  import Alert from '../components/alert.vue'
  import Loading from '../components/loading'
export default {
  data () {
    return {
      creFence:'',
      ifLoad:false,
      farmId:'',
      ulWidth:'',
      houseId:'',
      houseIdList:[],
      isAllot:false,
      houseDetailList:[],
      fType:'',
      fieldList:[],
      fieldNameList:[],
      houseName:'',   //栏位列表里的栏位名字
      outFenceList:[],   //请求结果
      outFence:[],   //可出栏的栏位
      pigNum:18,
      allPigNum:[],
      btnText:'',
      i:1,
      token:localStorage.getItem('token')
    }
  },
  props:['newHouse','fence'],
  components: {
    Alert,Loading
  },
  mounted () {
    //console.log(this.newHouse);
    if(this.newHouse.length == 1){
      this.btnText = '完成';
    }else {
      this.btnText = '进入下一个';
    }
    this.farmId = localStorage.getItem('farmId');
    this.getAllFence();
    this.getFence(this.newHouse[0]);
  },
  methods:{
    tokenErr () {
      alert('登陆过期,请重新登陆');
      this.$router.push({path:'/log'});
    },
    getAllFence () {
      for(var i=0;i<this.newHouse.length;i++){
        this.houseIdList.push(this.newHouse[i].houseId);
        this.fType = this.newHouse[i].houseType;
      }
      var json = {
        farmId:this.farmId,
        houseIds:this.houseIdList,
        fdType:this.fType
      };
        this.$emit('loadShow',true);
      this.axios.post('/house/out-list?token='+this.token,json).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        //console.log('*******');
        //console.log(msg);
        this.outFenceList = msg.data.result;
      }).catch((err)=>{
        //console.log(err);
          this.$emit('loadErrShow',true);
      });
    },
    getFence (h) {//获得栏位信息
      var houseId = h.houseId;
      this.houseName = h.houseName;
      var b = h.blongBatId;
      var number = [];
      if(this.fence == 1){
          this.$emit('loadShow',true);
        this.axios.get('/'+b+'/'+houseId+'/pigs?token='+this.token).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
            number = msg.data.result.pigQs;
        }).catch((err)=>{
          //console.log(err);
            this.$emit('loadErrShow',true);
        });
      }
      this.ifLoad = true;
        this.$emit('loadShow',true);
      this.axios.post('/field/layout?token='+this.token,{'farmId':this.farmId,'houseId':houseId}).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        ////console.log(msg);
        this.ifLoad = false;
        if(msg.data.message == '获取失败'){
        }else {
          ////console.log('获取成功');
          var data = JSON.parse(decodeURI(msg.data.result.layoutStr));
          // //console.log('+-+-+-+-');
          // //console.log(data);
          // this.ulWidth = (data[0].direction.maxCol - data[0].direction.minCol + 1) * 140;//构建完后ul的宽度
          this.creFence = data;
          this.MakeCreFence();
          //console.log(this.creFence);
          this.make
          var f = [];
          for(var j=0;j<this.outFenceList.length;j++){
            if(this.outFenceList[j].uHouseFields[0].houseId == houseId){
              f = this.outFenceList[j].uHouseFields[0].fieldList;
            }
          }
          //console.log(f);
          for(var t=0;t<f.length;t++){
            for(var n=0;n<number.length;n++){
              if(f[t] == number[n].fNum){
                this.outFence.push({'fNum':number[n].fNum,'pQs':number[n].pQs});
              }
            }
          }
          //console.log('----------');
          //console.log(this.outFence);
          for(var i=0;i<this.creFence.length;i++){
            this.$set(this.creFence[i],'hasSelect',false);
            this.$set(this.creFence[i],'selectFence',false);
            if(this.fence == 0){
              if(this.creFence[i].fencecChecked){
                this.creFence[i].hasSelect = true;
                this.creFence[i].selectFence = false;
              }
            }else {
              for(var s=0;s<this.outFence.length;s++){
                if(this.creFence[i].value == this.outFence[s].fNum){
                  this.creFence[i].hasSelect = true;
                  this.creFence[i].selectFence = false;
                  this.$set(this.creFence[i],'pQs',this.outFence[s].pQs);
                }
              }
            }
          }
        }
      }).catch((err)=>{
        ////console.log(err);
          this.$emit('loadErrShow',true);
      });
    },
    allChose () {
      for(var i=0;i<this.creFence.length;i++){
        if(this.creFence[i].hasSelect){
          this.creFence[i].selectFence = true;
        }
      }
    },
    allot () {
/*      var c = false;     //如果没有选择栏位则不能点击完成或者下一个
      for(var i=0;i<this.creFence.length;i++){
        if(this.creFence[i].selectFence){
          c = true;
        }
      }*/
var c = true;
      if(c){
        var p = [];
        var n = 0;
        this.outFence = [];
        this.fieldList = [];
        this.fieldNameList = [];
        //console.log(this.creFence);
        for(var i=0;i<this.creFence.length;i++){
          if(this.creFence[i].selectFence){
            p.push(this.creFence[i].pQs);
            this.fieldList.push(this.creFence[i].value);
            this.fieldNameList.push(String(this.creFence[i].fieldName));
          }
        }
        //console.log(this.fieldList);
        for(var i=0;i<p.length;i++){
          n+=p[i];
        }
        this.allPigNum.push(n);
        this.houseDetailList.push({
          houseId:this.newHouse[this.i-1].houseId,
          houseName:this.newHouse[this.i-1].houseName,
          fieldNameList:this.fieldNameList,
          fieldList:this.fieldList
        });
        if(this.i == this.newHouse.length-1){
          this.btnText = '完成';
          this.getFence(this.newHouse[this.i]);

        }else if(this.i < this.newHouse.length-1){
          this.btnText = '进入下一个';
          this.getFence(this.newHouse[this.i]);
        }else {
            this.isAllot = true;
        }
        this.i++;
        ////console.log(this.houseDetailList);
      }else {
        alert('您还没有选择栏位，如果没有可选栏位，则该猪舍已经全部出栏，请返回重新选择猪舍');
      }
    },
    myCloseAlertAllot (data) {
      if(data){
        this.$emit('fList',this.houseDetailList,this.pigNum,this.allPigNum);
      }else {
        //console.log('取消');
        this.houseDetailList.pop();
        this.allPigNum.pop();
        this.i--;
      }
      this.isAllot = false;
    },
    MakeCreFence () {          //创建以后ul的宽度
      var width = 0;
      var n = this.creFence[0].direction.maxCol - this.creFence[0].direction.minCol + 1;
      for(var i=0;i<n;i++){
        if(this.creFence[i].fencecChecked){
          width += 140;
        }else {
          width += 50
        }
      }
      this.ulWidth = width;
    },
    changeNum (n) {
      if(n == 1){
        this.pigNum++;
      }else {
        if(this.pigNum == 1){
          this.pigNum = 1;
        }else {
          this.pigNum--;
        }
      }
    }
  }
}

</script>

