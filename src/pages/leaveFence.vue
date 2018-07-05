<template>
  <div>
    <weigh v-if="isShowWeigh" @allot="finsishAllot" @reWeigh="postWeigh" :weighList="weighList"></weigh>
    <houseList v-if="isShowHouseList" @fnHouse="finishHouse" :fence="sign"></houseList>
    <fenceList v-if="isShowFenceList" :newHouse="newHouse" @fList="finishFence" :fence="sign"></fenceList>
  </div>
</template>
<style scoped>

</style>
<script type="es6">
  import weigh from '../components/weigh.vue'
  import houseList from '../components/houseList.vue'
  import fenceList from '../components/fenceList.vue'
  export default {
    data () {
      return {
        isShowWeigh:false,
        isShowHouseList:true,
        isShowFenceList:false,
        sign:1,      //出栏
        farmId:'',
        houseId:'',
        weighList:[],   //称重列表
        allWeigh:0,  //总重
        newHouse:[],
        houseDetailList:[],
        batId:'',
        allPigNum:0,   //猪只总数
        nowPigList:[],
        pigNum:'',   //猪初始化数量
        token:localStorage.getItem('token')
      }
    },
    components: {
      weigh,houseList,fenceList
    },
    mounted () {
      this.farmId = localStorage.getItem('farmId');
    },
    methods:{
      tokenErr () {
        alert('登陆过期,请重新登陆');
        this.$router.push({path:'/log'});
      },
      finishHouse (newHouse) {
        this.newHouse = newHouse;
        this.batId = newHouse[0].blongBatId;
        //console.log(this.houseIds);
        this.isShowHouseList = false;
        this.isShowFenceList = true;
      },
      finishFence (houseDetailList,pigNum,allPigNum) {
        for(var i=0;i<allPigNum.length;i++){
          this.allPigNum += allPigNum[i];
        }
        this.houseDetailList = houseDetailList;
        this.pigNum = pigNum;
        this.isShowFenceList = false;
        this.isShowWeigh = true;
      },
      finsishAllot () {
        for(var i=0;i<this.weighList.length;i++){
          this.allWeigh += Number(this.weighList[i]);
        }
        if(this.allWeigh){
          for(var i=0;i<this.houseDetailList.length;i++){
            this.$delete(this.houseDetailList[i],'houseName');
            this.$delete(this.houseDetailList[i],'fieldNameList');
          }
          var json = {
            batId:this.batId,
            outHouseInfor:{
              houseDetailList:this.houseDetailList,
              allQuantity:Number(this.allPigNum),
              allWeight:Number(this.allWeigh),
              handleTime:this.getTime()
            }
          };
          //console.log(json);
            this.$emit('loadShow',true);
          this.axios.post('/'+this.farmId+'/house/out?token='+this.token,json).then((msg)=>{
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            //console.log(msg);
            if(msg.data.message == 'ok'){
              alert('出栏成功');
              this.$router.go(-1);
            }
          }).catch((err)=>{
            //console.log(err);
              this.$emit('loadErrShow',true);
          })
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
          //console.log(msg);
        }).catch((err)=>{
          //console.log(err);
            this.$emit('loadErrShow',true);
        })
      },
      getTime () {
        var myDate = new Date();
        var yyyy = myDate.getFullYear();
        var MM = myDate.getMonth()+1<10?'0'+(myDate.getMonth()+1):myDate.getMonth()+1;
        var DD = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
        var hh = myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours();
        var mm = myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes();
        var ss = myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds();
        return yyyy+'-'+MM+'-'+DD+' '+hh+':'+mm+':'+ss;
      }
      /*,

      finishHouse (houseType,houseIds,houseNames) {
        this.houseType = houseType;
        this.houseIds = houseIds;
        this.houseNames = houseNames;
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
          pigType:this.houseType,
          inHouseInfor:{
            houseDetailList:this.houseDetailList,
            allQuantity:Number(allQ),
            allWeight:this.allWeigh,
            handleTime:time
          },
          nowPigInfor:{
            allSick:0,
            allDead:0,
            nowPigList:this.nowPigList
          }
        };
        //console.log(json);
        this.axios.post('/house/in?token='+this.token,json).then((msg)=>{
          //console.log(msg);
          if(msg.data.message == 'ok'){
            alert('入栏成功');
            this.isShowFenceAllot = false;
            this.isShowWeigh = true;
            this.$router.go(-1);
          }
        }).catch((err)=>{
          //console.log(err);
          this.tokenErr();
        })
        /!*{
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
         }*!/
      }*/
    }
  }

</script>
