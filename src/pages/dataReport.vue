<template>
  <div style="overflow: hidden">
    <div v-show="!inFence">
      没有入栏信息！
    </div>
    <div class="title" v-show="inFence">
      <div @click="hideData">
        <div class="item" :class="{cur:inFence.cur}">
          <h1>入栏信息</h1>
          <div>
            <span>入栏总数：{{inFence.count}}头</span>
            <span>入栏总重：{{inFence.weight}}kg</span>
          </div>
          <div>
            <span>入栏时间：{{inFence.time}}</span>
          </div>
        </div>
      </div>
      <div v-for="(item,index) in outFence">
        <div class="left" style="margin:0 10px;width:50px;height: 120px;">
          <img src="../assets/img/next.png" alt="" style="width:50px;margin-top: 40px"/>
        </div>
        <div class="item left" @click="getData(item)" :class="{cur:item.cur}">
          <h1> <span class="left">{{index+1}}</span>出栏记录</h1>
          <div>
            <span>出栏总数：{{item.count}}头</span>
            <span>出栏总重：{{item.weight}}kg</span>
          </div>
          <div>
            <span>出栏时间：{{item.time}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="report" v-if="hasData">
          <div class="w25">舍号</div>
          <div class="w75">
            <span v-for="item in fenceDes.outHouseInfor">{{item}} </span>
          </div>
        <div class="w50">
          <div class="key">饲喂天数</div>
          <div class="val">{{fenceDes.fDays}}天</div>
        </div>
        <div class="w50">
          <div class="key">料肉比</div>
          <div class="val" style="line-height: 25px">{{fenceDes.fck}}%   <span style="color:#999">料肉比=耗料总量/猪在这段时间内增加的总重</span></div>
        </div>
        <div class="w50">
          <div class="key">入栏日期</div>
          <div class="val">{{fenceDes.inDate}}</div>
        </div>
        <div class="w50">
          <div class="key">出栏日期</div>
          <div class="val">{{fenceDes.outDate}}</div>
        </div>
        <div class="w50">
          <div class="key">入栏总重</div>
          <div class="val">{{fenceDes.inAllWeight}}kg</div>
        </div>
        <div class="w50">
          <div class="key">出栏总重</div>
          <div class="val">{{fenceDes.outAllWeight}}kg</div>
        </div>
        <div class="w50">
          <div class="key">入栏总数</div>
          <div class="val">{{fenceDes.inAllCount}}头</div>
        </div>
        <div class="w50">
          <div class="key">出栏总数</div>
          <div class="val">{{fenceDes.outAllCount}}头</div>
        </div>
        <div class="w50">
          <div class="key">入栏均重</div>
          <div class="val">{{Number(fenceDes.inAverageWeight).toFixed(2)}}kg</div>
        </div>
        <div class="w50">
          <div class="key">出栏均重</div>
          <div class="val">{{Number(fenceDes.outAverageWeight).toFixed(2)}}kg</div>
        </div>
        <div class="w50">
          <div class="key">出栏率</div>
          <div class="val">{{fenceDes.outRate * 100}}%</div>
        </div>
        <div class="w50">
          <div class="key">耗料总量</div>
          <div class="val">{{fenceDes.currentFood}}kg</div>
        </div>
        <div class="w50">
          <div class="key">弱仔数</div>
          <div class="val">{{fenceDes.sickPigs}}头</div>
        </div>
        <div class="w50">
          <div class="key">弱仔率</div>
          <div class="val">{{fenceDes.sickRate}}%</div>
        </div>
        <div class="w50">
          <div class="key">死淘数</div>
          <div class="val">{{fenceDes.deadPig}}头</div>
        </div>
        <div class="w50">
          <div class="key">死淘率</div>
          <div class="val">{{fenceDes.deadRate}}%</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  div.title {
    white-space:nowrap;
    overflow-y: hidden;
    overflow-x: scroll;
    width: 100%;
    height:140px;
  }
  div.title>div {
    display: inline-table;
    vertical-align: top;
  }
  div.item {
    cursor:pointer;
    height: 120px;
    line-height: 30px;
    padding:0 10px;
    margin:0 10px;
    border:1px solid #ddd;
    font-size: 12px;
  }
  div.item h1 {
    height:40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
  }
  div.item h1 span {
    width:20px;
    height:20px;
    background-color: #ecb802;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color:#fff;
    margin-top: 10px;
    margin-right: 5px;
    font-size: 16px;
    font-weight: 600;
  }
  div.item.cur {
    border:1px solid #ecb802;
  }
  .report {
    margin:0 auto;
    width:500px;
    overflow: hidden;
    border-left:1px solid #b0b0b0;
    border-top: 1px solid #b0b0b0;
  }
  .report {
    margin-top: 100px;
  }
  .report div {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    float:left;
    text-align: center;
  }
  .w100 {
    width:100%;
    border-bottom: 1px solid #b0b0b0;
    border-right: 1px solid #b0b0b0;
  }
  .w50 {
    width:50%;
  }
  .w25 {
    width:25%;
    border-bottom: 1px solid #b0b0b0;
    border-right: 1px solid #b0b0b0;
  }
  .w75 {
    width:75%;
    border-bottom: 1px solid #b0b0b0;
    border-right: 1px solid #b0b0b0;
  }
  .key,.val {
    border-right: 1px solid #b0b0b0;
    border-bottom: 1px solid #b0b0b0;
  }
  .key {
    width:30%;
  }
  .val {
    width:70%;
  }
</style>
<script type="es6">
  import Loading from '../components/loading'
  export default {
  data () {
    return {
      hasData:false,
        ifLoad:true,
      farmId:'',
      houseId:'',
      belongBatch:'',
      statisId:'',
      inFence:'',
      fenceDes:'',
      outFence:[],
      token:localStorage.getItem('token')
    }
  },
    components:{
    Loading
    },
  mounted () {
    this.farmId = this.$route.query.farmId;
    this.houseId = this.$route.query.houseId;
    this.belongBatch = this.$route.query.belongBatch;
    this.getBtId();
  },
  methods:{
    tokenErr () {
      alert('登陆过期,请重新登陆');
      this.$router.push({path:'/log'});
    },
    getData (item) {
      for(var i=0;i<this.outFence.length;i++){
        this.outFence[i].cur = false;
      }
        this.$emit('loadShow',true);
      this.inFence.cur = false;
      item.cur = true;
      this.hasData = true;
      //console.log(item);
      this.statisId = item.statisId;
      this.axios.get('/'+this.farmId+'/'+this.statisId+'/info?token='+this.token).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        this.fenceDes = msg.data.result;
      }).catch((err)=>{
          this.$emit('loadErrShow',true);
      });
    },
    getBtId () {
        this.$emit('loadShow',true);
      this.axios.get('/'+this.farmId+'/'+this.houseId+'/brief?token='+this.token).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        if(msg.data.result.inHouseInfo){
          this.inFence = msg.data.result.inHouseInfo;
          this.outFence = msg.data.result.outHouseBaseInfos;
          this.$set(this.inFence,'cur',true);
          for(var i=0;i<this.outFence.length;i++){
            this.$set(this.outFence[i],'cur',false);
          }
        }
      }).catch((err)=>{
          this.$emit('loadErrShow',true);
      });
    },
    hideData () {
      for(var i=0;i<this.outFence.length;i++){
        this.outFence[i].cur = false;
      }
      this.inFence.cur = true;
      this.hasData = false;
    }
  }
}

</script>
