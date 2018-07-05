<template>
  <div>
    <div class="pigNum">
      <h1 class="textcenter">1栏猪只数量：{{maxNum}}头</h1>
      <div class="update-number">
        <p>调整猪只数量：</p>
        <div>
          <p class="type"><input type="radio" @click="show1" v-model="changeType" name="1" value="1" class="radio"/>
            正常
            <input type="number" v-model="changeCount" v-if="changeType==1" placeholder="输入要操作的数量"/>
          </p>
          <p class="type"><input type="radio" @click="show1" v-model="changeType" name="1" value="2" class="radio"/>
            弱仔
            <input type="number" v-model="changeCount" v-if="changeType==2" placeholder="输入要操作的数量"/>
          </p>
          <p class="type"><input type="radio" @click="hide1" v-model="changeType" name="1" value="3" class="radio"/>
            死亡淘汰
            <input type="number" v-model="changeCount" v-if="changeType==3" placeholder="输入要操作的数量"/>
          </p>
        </div>
        <div class="center" v-show="isShow1">
          <p class="type"><input type="radio" name="2" @click="show2(1)" class="checkbox"/>转入</p>
          <p class="type"><input type="radio" name="2" @click="show2(2)" class="checkbox"/>转出</p>
        </div>
        <div class="center" style="padding-left: 200px" v-show="isShow2">
          <p class="type">
            {{text}}
            <select name="" id="" v-model="fieldNum2">
              <option value="">选择栏位</option>
              <option v-for="item in fenceList" :value="item">{{item}}</option>
            </select>
          </p>
        </div>
      </div>
      <div class="bottom">
        <button class="btn" @click="save">确定</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
  select {
    height:24px;
    line-height: 24px;
    font-size: 14px;
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    border:1px solid #b0b0b0;
    background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
    padding-right: 14px;
  }
  select::-ms-expand { display: none; }
  input[type=number] {
    margin-left: 100px;
    height:24px;
    line-height: 24px;
    padding-left: 10px;
  }
  .radio {
    width:25px;
    height:25px;
    border-radius: 50%;
    border: 1px solid #b0b0b0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor:pointer;
    vertical-align: middle;
    margin:0 10px;
  }
  .radio:checked {
    background: url("../assets/img/checkbox.png") no-repeat center center;
    background-size: 100% 100%;
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
    background: url("../assets/img/checkbox.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .center {
    padding-left: 100px;
  }
  .type {
    padding-left: 100px;
    height:40px;
    line-height: 40px;
    font-size: 16px;
    vertical-align: middle;
  }
  div.pigNum {
    background-color: #e0e0e0;
    padding: 20px;
  }
  h1 {
    height:50px;
  }
  div.update-number {
    margin:0 auto 100px;
  }
  div.bottom {
    text-align: right;
  }
  .btn {
    padding:5px 10px;
    border:1px solid #b0b0b0;
    cursor:pointer;
    border-radius: 3px;
  }
</style>
<script type="es6">
  import Loading from '../components/loading'
  export default {
    data () {
      return {
        ifLoad:false,
        fieldNum:'',
        fieldNum2:'',
        houseId:'',
        farmId:'',
        feedType:'',
        changeCount:'',
        changeType:'',
        handler:'',
        maxNum:'',
        isShow1:false,
        isShow2:false,
        fenceList:[],
        text:'',
        token:localStorage.getItem('token')
      }
    },
    components:{
      Loading
    },
    watch:{
      changeCount () {
        if(this.changeCount>=this.maxNum){
          this.changeCount = this.maxNum;
        }else if(this.changeCount<=1){
          this.changeCount = 1;
        }
      }
    },
    mounted () {
        this.handler = localStorage.getItem('creator');
      this.farmId = localStorage.getItem('farmId');
      this.fieldNum = this.$route.query.fieldNum;
      this.houseId = this.$route.query.houseId;
      this.feedType = this.$route.query.feedType;
      this.maxNum = this.$route.query.maxNum;
      this.fenceList = JSON.parse(localStorage.getItem('fenceList'));
    },
    methods:{
      tokenErr () {
        alert('登陆过期,请重新登陆');
        this.$router.push({path:'/log'});
      },
      show1 () {
        this.isShow1 = true;
      },
      hide1 () {
        this.isShow1 = false;
        this.changeCount = '';
        this.fieldNum2 = '';
      },
      show2 (n) {
        this.isShow2 = true;
        if(n == 1){
          this.text = '转入';
        }else {
          this.text = '转出';
        }
      },
      save () {

        var _this = this;
        if(this.changeType){
          if(this.changeCount){
            var json = {
              farmId:this.farmId,
              houseId:this.houseId,
              feedType:this.feedType,
              fieldNum:this.fieldNum,
              fieldNum2:this.fieldNum2,
              changeType:this.changeType,
              changeCount:this.changeCount,
              handler:this.handler
            };
            //console.log(json);
            this.ifLoad = true;
              this.$emit('loadShow',true);
            this.axios.post('/field/pig-change?token='+this.token,json).then((msg)=>{
                this.$emit('loadShow',false);
                if(msg.data.code == 401){
                    this.tokenErr();
                }
              this.ifLoad = false;
            }).catch((err)=>{
              //console.log(err);
                this.$emit('loadErrShow',true);
            });
            _this.$router.go(-1);
          }else {
            alert('请输入要转移的猪只数量');
          }
        }else {
          alert('请选择调整类型');
        }
      }
    }
  }

</script>
