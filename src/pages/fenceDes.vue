<template>
  <div>
    <div class="top">
      <h1 class="title">
        饲喂设备运行状态
        <span class="right" v-if="err.length == 0">正常</span>
        <span class="right" v-if="err.length!=0" @click="showErr" style="cursor: pointer;">异常 <i>{{err.length}}</i> <s></s> </span>
      </h1>
      <transition name="slide">
        <div v-show="isShowErr" class="errMsg">
          <h1 v-for="item in err" style="border-top: 1px solid #b0b0b0;" @click="isShowDes(item)">
            {{item.exception_msg}}
            <span class="right">{{item.exception_get}}</span>
          </h1>
        </div>
      </transition>
      <transition name="slide">
        <div class="errDes" v-show="messageErr">
          <h1 style="border-top: 1px solid #b0b0b0;">1、检查设备是否有电</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">2、尝试关机重启</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">3、排除以上状况仍无效，请联系省饲儿售后服务人员</h1>
        </div>
      </transition>
      <transition name="slide">
        <div class="errDes" v-show="waterErr">
          <h1 style="border-top: 1px solid #b0b0b0;">1、检查是否停水</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">2、手动触摸按键，如下水仍异常，请联系省饲儿售后服务人员</h1>
        </div>
      </transition>
      <transition name="slide">
        <div class="errDes" v-show="foodErr">
          <h1 style="border-top: 1px solid #b0b0b0;">1、尝试关机重启</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">2、检查料桶内是否有异物卡住旋转轴</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">3、排除以上状况仍无效，请联系省饲儿售后服务人员</h1>
        </div>
      </transition>
      <transition name="slide">
        <div class="errDes" v-show="pigErr">
          <h1 style="border-top: 1px solid #b0b0b0;">1、检查猪宝供电是否正常</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">2、将猪宝拔掉电源1分钟后重新插上电源</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">3、猪宝安装位置手机信号是否良好，如手机信号偏弱，请将猪宝固定值信号好的地方</h1>
          <h1 style="border-top: 1px solid #b0b0b0;">4、保证SIM卡不欠费，不停机，可以正常使用</h1>
        </div>
      </transition>
    </div>
    <div class="center">
      <div class="title textcenter">基本信息</div>
      <div class="item">
        <div class="left key">设备编号</div>
        <div class="left value">{{boundNum}}</div>
      </div>
      <div class="item">
        <div class="left key">绑定1栏</div>
        <router-link :to="{path:'pigQuantity',query:{'houseId':houseId,'fieldNum':fieldNum,'maxNum':fieldPqs1,'feedType':feedType}}" class="left value click" tag="div">
          {{fieldPqs1}}头</router-link>
      </div>
      <div class="item">
        <div class="left key">绑定2栏</div>
        <router-link :to="{path:'pigQuantity',query:{'houseId':houseId,'fieldNum':fieldNum2,'maxNum':fieldPqs2,'feedType':feedType}}" class="left value click" tag="div">
          {{fieldPqs2}}头</router-link>
      </div>
      <div class="item">
        <div class="left key">猪只总数</div>
        <div class="left value">{{allPigQs}}头</div>
      </div>
      <div class="item">
        <div class="left key">单词料量(标定)</div>
        <router-link :to="{path:'fooderQuantity',query:{'houseId':houseId,'fieldNum':fieldNum,'food':food}}" class="left value click" tag="div">{{food}}（克）</router-link>
      </div>
      <div class="item">
        <div class="left key">入栏日期</div>
        <div class="left value">{{inTime}}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <router-link :to="{path:'foodDay',query:{'device':boundNum,'indate':inTime}}"  tag="button" class="btn">日采食</router-link>
      </div>
      <div class="right">
        <router-link :to="{path:'feedInfor',query:{'device':boundNum}}" tag="button" class="btn">投料信息</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  h1 span {
    margin-right: 20px;
  }
  .errMsg {
    position:relative;
    z-index: 3;
    cursor: pointer;
  }
  .errDes {
    position:relative;
    z-index: 2;
  }
  h1 i {
    color:#fff;
    background-color: red;
    border-radius: 50%;
    width:16px;
    height:16px;
    line-height: 16px;
    text-align: center;
    display:inline-block;
  }
  h1 s {
    display:inline-block;
    width: 19px;
    height: 8px;
    background: url("../assets/img/bottom.png");
    background-size: 100% 100%;
  }
  div.top {
    margin-bottom: 20px;
    height:50px;
  }
  div.top h1 {
    height:50px;
    line-height: 50px;
    background-color: #e9e9e9;
    font-size: 16px;
    padding:0 10px;
  }
  div.top h1.title {
    font-weight: 600;
    position:relative;
    z-index: 5;
  }
  div.center {
    border-top: 1px solid #b9b9b9;
    border-left: 1px solid #b9b9b9;
    border-right: 1px solid #b9b9b9;
    margin-bottom: 200px;
    margin-top: 50px;
  }
  div.center>div {
    border-bottom: 1px solid #b9b9b9;
    height:50px;
    line-height: 50px;
    font-size: 16px;
  }
  div.item>div.left {
    width:50%;
    padding:0 10px;
    box-sizing: border-box;
  }
  .click {
    background: url("../assets/img/right.png") no-repeat;
    background-position: 370px center;
    background-size: 10px 19px;
    cursor: pointer;
  }
  div.bottom>div {
    width:50%;
    box-sizing: border-box;
    padding:0 10px;
  }
  div.bottom>div.right {
    text-align: right;
  }
  .btn {
    width:120px;
    height:48px;
    line-height: 48px;
    background-color: #c5c5c5;
    border-radius: 5px;
    border:none;
    cursor: pointer;
  }
  .btn:hover {
    background-color: #b0b0b0;
  }
</style>

<script type="es6">
  import Loading from '../components/loading'
export default {
  data () {
    return {
      ifLoad:true,
        belongBatch:'',
      houseId:'',
      fieldNum:'',      //1栏位号
      fieldPqs1:0,       //1栏位猪只数
      fieldNum2:'',      //2栏位号
      fieldPqs2:0,    //2栏位猪只数
      boundNum:'',     //设备号
      allPigQs:0,       //猪总数
      inTime:'',        //创建时间
      fenceDes:'',     //栏位详情
      err:'',         //是否异常
      isShowErr:false,      //显示错误
      messageErr:false,      //通讯异常
      waterErr:false,        //下水
      foodErr:false,       //下料
      pigErr:false,        //猪宝
      food:'',         //单次料量
      feedType:'',     //饲喂类型
      token:localStorage.getItem('token')
    }
  },
  components:{
    Loading
  },
  mounted () {
    this.getData();
    this.getDes();
    this.getRun();
  },
  methods:{
    tokenErr () {
      alert('登陆过期,请重新登陆');
      this.$router.push({path:'/log'});
    },
    getDes () {
      this.ifLoad = true;
      var json = {
        batchId:this.belongBatch,
        houseId:this.houseId,
        fieldNum:this.fieldNum,
        fieldNum2:this.fieldNum2
      };
      //console.log(json);
        this.$emit('loadShow',true);
      this.axios.post('/'+this.farmId+'/field/detail?token='+this.token,json).then((msg)=>{
        //console.log(msg);
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        this.ifLoad = false;
        if(msg.data.message == '成功'){
          this.fieldPqs1 = msg.data.result.fieldPigs[0].pQs;
          this.fieldPqs2 = msg.data.result.fieldPigs[1].pQs;
          this.allPigQs = msg.data.result.allPigQs;
          this.inTime = msg.data.result.inTime;
        }else {
          this.inTime = '抱歉，这个猪舍没有入栏信息...';
        }
      }).catch((err)=>{
        //console.log(err);
          this.$emit('loadErrShow',true);
      });
    },
    getData () {
      this.belongBatch = this.$route.query.belongBatch;
      this.feedType = this.$route.query.feedType;
      this.boundNum = this.$route.query.boundNum;
      this.houseId = localStorage.getItem('houseId');
      this.fenceDes = JSON.parse(localStorage.getItem('fenceDes'));
      this.fieldNum = this.$route.query.fieldNum;
      this.fieldNum2 = this.$route.query.fieldNum2;
      this.farmId = localStorage.getItem('farmId');
      this.boundNum = this.$route.query.boundNum;
      this.err = this.fenceDes.details.deviceExcepts;
      //console.log(this.fenceDes);
    },
    getRun () {
      this.ifLoad = true;
        this.$emit('loadShow',true);
      this.axios.post('/field/running?token='+this.token,{'farmId':this.farmId,'houseId':this.houseId,'feedType':this.feedType}).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        this.ifLoad = false;
        var a = msg.data.result.fieldSummary;
        for(var i=0;i<a.length;i++){
          if(a[i].fieldNum == this.fieldNum){
            this.food = a[i].food;
          }
        }
      }).catch((err)=>{
        console.log(err);
          this.$emit('loadErrShow',true);
      });
    },
    showErr () {
      this.isShowErr = !this.isShowErr;
      this.messageErr = false;
      this.waterErr = false;
      this.foodErr = false;
      this.pigErr = false;
    },
    isShowDes (item) {
      this.messageErr = false;
      this.waterErr = false;
      this.foodErr = false;
      this.pigErr = false;
      switch(item.exception_msg){
        case '通讯异常' :
                this.messageErr = !this.messageErr;
              break;
        case '下水异常' :
                this.waterErr = !this.waterErr;
              break;
        case '下料异常' :
          this.foodErr = !this.foodErr;
          break;
        case '猪宝异常' :
          this.pigErr = !this.pigErr;
          break;
      }
    }
  }
}

</script>
