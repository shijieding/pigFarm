<template>
<div>
  <weigh v-if="isShowWeigh" @allot="finsishAllot" @reWeigh="postWeigh" :weighList="weighList"></weigh>
  <houseList v-if="isShowHouseList" @fnHouse="finishHouse" :fence="sign"></houseList>
  <fenceList v-if="isShowFenceList" :newHouse="newHouse" @fList="finishFence" :fence="sign"></fenceList>
  <fenceAllot v-if="isShowFenceAllot" :houseDetailList="houseDetailList" :pigNum="pigNum" @finishEnterFence="fef"></fenceAllot>
</div>
</template>
<style scoped>

</style>
<script type="es6">
  import Alert from '../components/alert.vue'
  import weigh from '../components/weigh.vue'
  import houseList from '../components/houseList.vue'
  import fenceList from '../components/fenceList.vue'
  import fenceAllot from '../components/fenceAllot.vue'
export default {
  data () {
    return {
        isShowWeigh:true,
        isShowHouseList:false,
        isShowFenceList:false,
        isShowFenceAllot:false,
      farmId:'',
      sign:0,  //入栏
      houseId:'',
      weighList:[],   //称重列表
      allWeigh:0,  //总重
      newHouse:[],
      houseDetailList:[],
      nowPigList:[],
      pigNum:'',   //猪初始化数量
      token:localStorage.getItem('token')
    }
  },
  components: {
    weigh,houseList,fenceList,fenceAllot
  },
  mounted () {
    this.farmId = localStorage.getItem('farmId');
  },
  methods:{
    tokenErr () {
      alert('登陆过期,请重新登陆');
      this.$router.push({path:'/log'});
    },
    finsishAllot(){
      for(var i=0;i<this.weighList.length;i++){
        this.allWeigh += Number(this.weighList[i]);
      }
      //console.log(this.allWeigh);
      if(this.allWeigh){
        this.isShowWeigh = false;
        this.isShowHouseList = true;
      }else {
        alert('请输入称重结果，并保存');
      }
    },
    postWeigh (data,time) {
      this.weighList.push(data);
      var json = {
        recordId:this.weighList.length-1,
        farmId:this.farmId,
        weightData:data,
        handleTime:time,
        currentSign:0  //0入栏   1出栏
      };
        this.$emit('loadShow',true);
      this.axios.post('/house/record-set?token='+this.token,json).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
      }).catch((err)=>{
          this.$emit('loadErrShow',true);
      })
    },
    finishHouse (newHouse) {
      this.newHouse = newHouse;
      //console.log(this.houseIds);
      this.isShowHouseList = false;
      this.isShowFenceList = true;
    },
    finishFence (houseDetailList,pigNum) {
      this.houseDetailList = houseDetailList;
      this.pigNum = pigNum;
      this.isShowFenceList = false;
      this.isShowFenceAllot = true;
    },
    fef (pigArr,time,allQ) {
      for(var i=0;i<this.houseDetailList.length;i++){
        this.$delete(this.houseDetailList[i],'houseName');
        this.$delete(this.houseDetailList[i],'fieldNameList');
      }
      for(var i=0;i<pigArr.length;i++){
        this.$delete(pigArr[i],'houseName');
      }
      this.nowPigList = pigArr;
      var json = {
        farmId:this.farmId,
        pigType:this.newHouse[0].houseType,
        inHouseInfor:{
          houseDetailList:this.houseDetailList,
          allQuantity:Number(allQ),
          allWeight:Number(this.allWeigh),
          handleTime:time
        },
        nowPigInfor:{
          allSick:0,
          allDead:0,
          nowPigList:this.nowPigList
        }
      };
      //console.log(json);
        this.$emit('loadShow',true);
      this.axios.post('/house/in?token='+this.token,json).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        if(msg.data.message == 'ok'){
          alert('入栏成功');
          this.isShowFenceAllot = false;
          this.isShowWeigh = true;
          this.$router.go(-1);
        }
      }).catch((err)=>{
          this.$emit('loadErrShow',true);
      })
      /*{
        farmId.
                pigType:饲喂类型 1
        inHouseInfor:{
          houseDetailList:[{
            houseId:舍号
            fieldList:[1,2,3,...]栏号
          }],
                  allQuantity:总数
          allWeight:总重
          handleTime:出入栏时间
        },
        nowPigInfor: {
          allSick:弱数量
          allDead: 死数量
          nowPigList:[{
            houseId,
            pigQs:[{
              fNum:栏号
              pQs:猪个数
            }]
          }]
        }
      }*/
    }
  }
}

</script>
