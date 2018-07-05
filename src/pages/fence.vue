<template>
  <div class="farm">
    <div v-show="!buildFinish && !isShowSelectHouse">
      <div class="selectFence">
        <div class="left">
          栏位：<span class="fence textcenter" @click="selectFence">✔</span>
        </div>
        <div class="left">
          通道：<span class="aisle textcenter" @click="selectFence"> </span>
        </div>
      </div>

      <div class="table">
        <div>
          <ul class="rect-list">
            <li v-for="(item,index) in fences" class="rect-item" :class="{a:item.aisle,f:item.fence}" :id="index+1"
                @dblclick="showUpdateFence(item,$event)" @click="unclick && chooseFence(item,index+1,$event)">
              {{item.value}}
            </li>
          </ul>
          <!--修改栏位编号-->
          <transition name="fade">
            <div class="alert" v-show="updateFenceName">
              <Alert @on-close="myCloseAlertUpdate">
                <p slot="delete">
                  栏位号：<input type="text" class="myInput" v-model="fenceName" placeholder="输入新的栏位号"/>
                </p>
              </Alert>
            </div>
          </transition>
        </div>
      </div>
      <div v-show="isShowNote">
        <p class="warn"><span>注：</span>双击进入修改栏位编号</p>
      </div>
      <div class="button">
        <button @click.prevent="build">{{btn}}</button>
      </div>
    </div>


    <div v-show="buildFinish && !isShowSelectHouse">
      <!--点击创建时出现的html片段 -->
      <div v-show="buildFinish">
        <div class="data-report">
          <router-link :to="{path:'dataReport',query:{farmId:this.farmId,houseId:this.houseId,belongBatch:this.belongBatch}}" tag="button" class="btn data-btn">数据报告</router-link>
        </div>
        <ul class="createList" :style="{width:ulWidth + 'px'}">
          <li v-for="(item,index) in creFence" :class="{ca:!item.fencecChecked,cf:item.fencecChecked,minHeight:item.RowH,minWidth:item.genBug}"
                  @mouseenter="showBound(item)" @mouseleave="hideBound(item)">
            <div v-if="item.value && !item.details.deviceNum">
              {{item.fieldName}}
            </div>
            <div class="fenceDes" v-if="item.value && item.details.deviceNum" :style="{width:item.width,height:item.height,left:item.cssLeft,top:item.cssTop}">
              <div class="left">
                <div class="top">
                  <span>{{item.details.temperature}}℃</span>
                </div>
                <div class="center">
                  <span>{{item.details.days}}天</span>
                </div>
                <div class="bottom">
                  <span @click="goFenceDes(item)" style="cursor:pointer">详情</span>
                </div>
              </div>
              <div class="right">
                <div class="img" style="line-height: 20px">
                  <div v-if="item.details.deviceExcepts.length == 0">
                    <img src="../assets/img/farm.png" width="30px" height="30px" alt="" style="line-height: 20px"/>
                  </div>
                  <div v-if="item.details.deviceExcepts.length > 0" style="position:relative">
                    <span class="number">{{item.details.deviceExcepts.length}}</span>
                    <img src="../assets/img/err.png" width="30px" height="30px" alt="" style="line-height: 20px"/>
                  </div>
                  <p style="font-size: 10px;line-height: 20px">{{item.details.deviceNum}}</p>
                </div>
              </div>
            </div>
            <div v-show="item.showBound" class="bound">
              <span v-if="!item.details.deviceNum" @click="bound(item,0)">绑定</span>
              <span v-if="item.details.deviceNum" @click="unBound(item)">解绑</span>
              <span v-if="item.top && !item.details.deviceNum" @click="bound(item,1)">向上合并</span>
              <span v-if="item.right && !item.details.deviceNum" @click="bound(item,2)">向右合并</span>
              <span v-if="item.bottom && !item.details.deviceNum" @click="bound(item,3)">向下合并</span>
              <span v-if="item.left && !item.details.deviceNum" @click="bound(item,4)">向左合并</span>
            </div>
          </li>
        </ul>
      </div>
    </div>


    <div class="table svg" v-if="isShowSelectHouse && buildFinish">
      <svg xm//www.w3.org/2000/svg" width="100%" height="100%">
        <g v-for="(g,index) in house">
          <rect :width="width" :height="height" v-for="rect in g.layoutPoints" :x='rect.px*50' :y="rect.py*50" fill="#e0e0e0"></rect>
          <text style="color:#444444;font-size:14px;" :x='g.textPoint.px' :y='g.textPoint.py'>{{g.houseName}}</text>
          <circle :cx="g.cirl.cx" :cy="g.cirl.cy" r="10" stroke="#b0b0b0" stroke-width="1" fill="#fff" @click="choseCirl(g,$event)"/>
        </g>
      </svg>
      <div class="button">
        <button style="font-size: 16px" @click="finish">完成</button>
      </div>
    </div>


    <transition name="fade">
      <div class="alert" v-show="isShowAlertSelectHouse">
        <Alert @on-close="myCloseAlertHouse">
          <p slot="delete">是否将此布局应用于其他猪舍？</p>
        </Alert>
      </div>
    </transition>
    <transition name="fade">
      <div class="alert" v-show="isShowBound">
        <Alert @on-close="myCloseAlertBound">
          <p slot="delete">
            绑定设备号：
            <input type="text" class="myInput" v-model="boundNum" placeholder="要绑定的设备号"/>
          </p>
        </Alert>
      </div>
    </transition>
  </div>
</template>
<style scoped>
  .fenceDes span.number {
    width: 15px;
    height: 15px;
    line-height: 15px;
    color:#fff;
    font-size: 10px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top:-15px;
    right: 3px;
    text-align: center;
  }
  .data-report {
    margin:20px 0;
    text-align: right;
  }
  .data-btn {
    width:100px;
    height:30px;
    border:none;
    font-size: 14px;
    color: #ffffff;
    border-radius: 5px;
    background-color: #f39c29;
    cursor:pointer;
  }
  .fenceDes {
    position: absolute;
    background: #f0f0f0;
    z-index: 2;
  }
  .fenceDes>div {
    height:100%;
    width:48%;
  }
  .fenceDes .top,.fenceDes .bottom,.fenceDes .center {
    height:33%;
    padding-left: 5px;
    text-align: center;
    display:flex;
    align-items: center;
  }
  .fenceDes span,.fenceDes a {
    line-height: 30px;
    width:100%;
    text-align: center;
  }
  .fenceDes .right {
    padding-right: 5px;
    display:flex;
    height:100%;
    text-align: center;
    align-items: center;
  }
  .img img {
    align-items: center;
  }
  div.selectFence {
    height:40px;
    line-height: 40px;
    font-size: 16px;
    margin-bottom: 30px;
    padding-left: 30px;
  }
  .selectFence .left {
    width:30%;
  }
  .selectFence span {
    width:49.5px;
    height:36.5px;
    display:inline-block;
    vertical-align: middle;
    cursor:pointer;
  }
  span.fence {
    background-color: #fde6c6;
  }
  span.aisle {
    background-color: #e0e0e0;
  }
  .farm {
    height:100%;
    display:flex;
    flex-flow: column;
    flex:1;
  }
  div.aside-left li {
    height:54px;
    line-height: 54px;
    border-bottom: 1px solid #b0b0b0;
    font-size: 1.1em;
  }
  div.aside-left li:last-child {
    border:none;
  }
  div.table {
    width:742.5px;
    height:547.5px;
    border-left: 1px solid #d0d0d0;
    border-top: 1px solid #d0d0d0;
    font-size: 50px;
    position:relative;
  }
  div.table.svg {
    border:none;
  }
  .rect-list {
    width:742.5px;
    height:547.5px;
  }
  .rect-item {
    width:49.5px;
    height:36.5px;
    box-sizing: border-box;
    float:left;
    border-right:1px solid #d0d0d0;
    border-bottom: 1px solid #d0d0d0;
    cursor: pointer;
    font-size: 14px;
  }
  .bound {
    position:absolute;
    z-index: 99;
    bottom: 1px;
    left:0;
    height:25px;
    line-height: 25px;
    background-color: #F0F0F0;
    white-space: nowrap;
  }
  .bound span {
    background-color: #f39c29;
    color:#fff;
    padding:3px 5px;
    margin-right: -3px;
    cursor:pointer;
  }
  .bound span:first-child {
    border-top-left-radius:8px;
    border-bottom-left-radius:8px;
  }
  .bound span:last-child {
    border-top-right-radius:8px;
    border-bottom-right-radius:8px;
  }
  .rect-item.f {
    background-color: #fde6c6;
  }
  .rect-item.a {
    background-color: #e0e0e0;
  }
  .createList>li {
    float:left;
    box-sizing: border-box;
    text-align: center;
    line-height: 90px;
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
  div.button {
    margin-top: 100px;
    text-align: right;
  }
  div.button button {
    width:90px;
    height:44px;
    background-color: #e5e5e5;
    border:1px solid #a9a9a9;
    border-radius: 3px;
    font-size: 1.1em;
    cursor:pointer;
  }
  .table>div {
    position:relative;
  }
  .alert {
    font-size: 14px;
  }
  input.myInput {
    height:24px;
    line-height: 24px;
    font-size: 16px;
    padding-left: 5px;
    width:130px;
  }
  p.warn {
    height:30px;
    line-height: 30px;
    font-size: 16px;
  }
  p.warn span {
    color:red;
    padding:0 10px;
  }
</style>
<script type="es6">
  import $ from 'jquery'
  import Alert from '../components/alert.vue'
  import Loading from '../components/loading'
  export default {
    data () {
      return {
        ifLoad:true,
        isFence:true,//是否在构建栏位，或者通道
        buildFinish:false,//是否构建完成
        fences:[],//所有li
        unclick:true,  //是否可以点击
        classFence:false,
        classAisle:false,
        btn:'创建',
        width:49.5,//小方格宽度
        height:36.5,//小方格高度
        ulWidth:'', //创建好的ul的宽度
        farr:[],//选中的栏位
        aarr:[], //选中的通道
        allArr:[],//选中的栏位和通道
        maxX:'',
        minX:'',//最大最小栏位
        maxY:'',
        minY:'',
        colArr:[],  //说有栏位的col集合
        rowArr:[],  //说有栏位的row集合
        allColArr:[], //所有栏位和通道的col
        allRowArr:[],  //所有栏位和通道的row
        frowArr:[],   //说有栏位的row   reverser集合
        creFence:[],   //创建好的栏位
        updateFenceName:false,//显示修改栏位
        isShowNote:false,  //显示注释
        isShowSelectHouse:false,    //显示应用到其他猪舍
        isShowAlertSelectHouse:false,
        fenceName:'',
        fenceNum:'',
        house:'',  //猪舍的数据
        farmId:'',
        farmName:'',
        houseId:'',
        houseName:'',
        farmUrl:'',
        houseUrl:'',
        houseIds:[],
        fenceList:[],
        creator:'',
        feedType:'',       //舍类型
        isShowBound:false,     //显示绑定设备弹框
        boundNum:'',         //设备号
        boundType:'',         //绑定类型
        fieldNum:'',          //绑定栏位号
        fieldNum2:'',         //绑定栏位号
        belongBatch:'',            //批次号
        token:localStorage.getItem('token')
      }
    },
    components: {
        Alert,Loading
    },
    created () {
      var rowset;
      var colset;
      for(var i=1;i<226;i++){
        rowset = Math.ceil(i/15);
        if(i%15==0){//每一行最后一列
          colset = 15;
        }else{//普通列
          colset = i%15;
        }
        var json  ={'bool':false ,'row':rowset,'col':colset,'fence':false,'aisle':false,'value':'',"num":'','id':i,'minWidth':false,'minHeight':false};

        this.fences.push(json);
      }
    },
    watch: {

    },
    mounted: function () {
      this.house = JSON.parse(localStorage.getItem('house'));
      this.farmName = localStorage.getItem('farmName');
      this.farmUrl = localStorage.getItem('farmUrl');
      this.houseName = localStorage.getItem('houseName');
      this.houseUrl = localStorage.getItem('houseUrl');
      this.feedType = localStorage.getItem('feedType');
      this.farmId = this.$route.query.farmId;
      this.creator = this.$route.query.creator;
      this.houseId = this.$route.query.houseId;
      localStorage.setItem('farmId',this.farmId);
      localStorage.setItem('creator',this.creator);
      localStorage.setItem('houseId',this.houseId);
      this.getHouse();
      this.getFence();
      this.getRunning();
    },
    methods:{
      tokenErr () {
        alert('登陆过期,请重新登陆');
        this.$router.push({path:'/log'});
      },
      chooseFence (item,id,e) {
        //var json = {'num':id,'row':item.row,'col':item.col,'value':item.value};
        var target = e.target;
        if(this.isFence) {
          item.aisle = false;
          for(var i=0;i<this.aarr.length;i++){
            if(this.aarr[i].id == id){
              this.aarr.splice(i,1)
            }
          }
          if(item.fence == true){
            item.fence = false;
            for(var i=0;i<this.farr.length;i++){
              if(this.farr[i].id == id){
                this.farr.splice(i,1)
              }
            }
          }else {
            item.fence = true;
            this.farr.push(item);
          }
        }else {
          item.fence = false;
          for(var i=0;i<this.farr.length;i++){
            if(this.farr[i].id == id){
              this.farr.splice(i,1)
            }
          }
          if(item.aisle == true){
            item.aisle = false;
            for(var i=0;i<this.aarr.length;i++){
              if(this.aarr[i].id == id){
                this.aarr.splice(i,1)
              }
            }
          }else {
            item.aisle = true;
            this.aarr.push(item);
          }
        }
      },
      selectFence (e) {
        var target = e.target;
        target.textContent = '✔';
        if($(target).hasClass('fence')){
          this.isFence = true;
          $('.aisle').html('');
        }else {
          this.isFence = false;
          $('.fence').html('');
        }
      },
      build () {
        if(this.btn == '创建' && this.farr.length != 0){
          this.btn = '创建完成';
          this.unclick = false;
          this.isShowNote = true;
          this.minX = this.farr[0].col;
          this.maxX = this.farr[0].col;
          this.minY = this.farr[0].row;
          this.maxY = this.farr[0].row;
          for(var i=0;i<this.farr.length;i++){    //找到四个角
            this.minX = this.farr[i].col<this.minX ? this.farr[i].col : this.minX;
            this.maxX = this.farr[i].col>this.maxX ? this.farr[i].col : this.maxX;
            this.minY = this.farr[i].row<this.minY ? this.farr[i].row : this.minY;
            this.maxY = this.farr[i].row>this.maxY ? this.farr[i].row : this.maxY;
            this.colArr.push(this.farr[i].col);
            this.rowArr.push(this.farr[i].row);
            this.allArr.push(this.farr[i]);
          }
          // this.ulWidth = (this.maxX - this.minX +1) * 140; //构建完后ul的宽度
          for(var i=0;i<this.fences.length;i++){    //给中间填充通道
            if(this.fences[i].col>=this.minX && this.fences[i].col<=this.maxX && this.fences[i].row>=this.minY && this.fences[i].row<=this.maxY){
              if(this.farr.indexOf(this.fences[i]) == -1 && this.aarr.indexOf(this.fences[i]) == -1){
                this.aarr.push(this.fences[i]);
                var a = this.aarr.indexOf(this.fences[i]);
                this.aarr[a].aisle = true;
              }
            }
          }
          for(var i=0;i<this.aarr.length;i++){  //所有通道和栏位的集合
            this.allArr.push(this.aarr[i]);
          }
          this.colArr = this.unique(this.colArr).sort((a,b)=>{return a-b});
          this.rowArr = this.unique(this.rowArr).sort((a,b)=>{return a-b});
          this.frowArr = this.unique(this.rowArr).sort((a,b)=>{return b-a});
          var n = 0;
          for(var i=0;i<this.colArr.length;i++){  //蛇形排列。。。。
            if(i%2 == 0){
              for(var t=0;t<this.rowArr.length;t++){
                //n++;
                for(var f=0;f<this.farr.length;f++){
                  if(this.farr[f].col == this.colArr[i] && this.farr[f].row == this.rowArr[t]){
                    n++;
                    this.farr[f].value = n;
                    this.farr[f].num = n;
                  }
                }
              }
            }else {
              for(var t=0;t<this.frowArr.length;t++){
                //n++;
                for(var f=0;f<this.farr.length;f++){
                  if(this.farr[f].col == this.colArr[i] && this.farr[f].row == this.frowArr[t]){
                    n++;
                    this.farr[f].value = n;
                    this.farr[f].num = n;
                  }
                }
              }
            }
          }
          for(var i=0;i<this.allArr.length;i++){   //所有通道和栏位的row  col
            this.allColArr.push(this.allArr[i].col);
            this.allRowArr.push(this.allArr[i].row);
          }
          this.allColArr = this.unique(this.allColArr).sort((a,b)=>{return a-b});
          this.allRowArr = this.unique(this.allRowArr).sort((a,b)=>{return a-b});
          for(var i=0;i<this.allRowArr.length;i++){    //构建完猪舍后的所有通道和栏位
            for(var t=0;t<this.allColArr.length;t++){
              for(var a=0;a<this.allArr.length;a++){
                if(this.allArr[a].row == this.allRowArr[i] && this.allArr[a].col == this.allColArr[t]){
                  ////console.log(this.allArr);
                  var json ={
                    'row':i+1,
                    'col':t+1,
                    'fencecChecked':this.allArr[a].fence,
                    'aisleChecked':this.allArr[a].aisle,
                    "value":this.allArr[a].num,     //对应的是栏位号fieldNum
                    'fieldName':this.allArr[a].value,
                    'fieldName2':'',
                    'RowH':'',
                    'genBug':'',
                    'urdl':'',
                    'device':'',
                    'belongBatch':'',
                    'details':{
                      'temperature':'',    //单个猪栏内部温度
                      'days':'',           //猪仔入栏的天数
                      'deviceNum':'',      //设备号
                      'deviceError':'',    //猪栏设备的异常数
                      'deviceExcepts':[],   //猪栏栏位异常详情
                      'lairageTimes':'',   //入栏日期
                      'feedNum':'100',         //单次料量
                      'belongBatch':'',
                      'tempSign':'1',
                      'bound':{}         //绑定的栏位
                    },
                    'offBound':{},
                    'direction':{"minCol":this.minX,"maxCol":this.maxX,"minRow":this.minY,"maxRow":this.maxY}
                  };
                  this.creFence.push(json);
                }
              }
            }
          }
          this.MakeCreFence();
        }else if(this.btn == '创建完成') {
          for(var i=0,t=0;i<this.allRowArr.length;i++){
            if(this.allRowArr[i] == this.rowArr[t]){
            }else {
              for(var j=0;j<this.creFence.length;j++){     //上下是栏位的通道   高度变小  删掉边上的栏位
                if(this.creFence[j].row == i+1){
                  if(this.allRowArr.indexOf(this.allRowArr[i]-1) != -1 && this.allRowArr.indexOf(this.allRowArr[i]+1) != -1){
                    //this.creFence[j].minHeight = true;
                    this.creFence[j].RowH = true;
                    this.creFence[j].genBug = true;
                  }else {
                    this.creFence.splice(j,1);
                    j--;
                  }
                }
              }
              t--;
            }
            t++;
          }

          for(var i=0,t=0;i<this.allColArr.length;i++){
            if(this.allColArr[i] == this.colArr[t]){
            }else {
              for(var j=0;j<this.creFence.length;j++){    //左右是栏位的通道 宽度变小   删掉边上的通道
                if(this.creFence[j].col == i+1){

                  if(this.allColArr.indexOf(this.allColArr[i]-1) != -1 && this.allColArr.indexOf(this.allColArr[i]+1) != -1){

                    this.creFence[j].genBug = false;
                  }else {

                    this.creFence.splice(j,1);
                    j--;
                  }
                }
              }
              t--;
            }
            t++;
          }

          //this.buildFinish = true;
          ////console.log(this.creFence);
          this.isShowAlertSelectHouse = true;
        }else {
          alert('请选择栏位');
        }
      },
      unique (arr) { //数组去重
        var res = [];
        var obj = {};
        for(var i=0;i<arr.length;i++){
          if(!obj[arr[i]]){
            res.push(arr[i]);
            obj[arr[i]] = 1;
          }
        }
        return res;
      },
      showUpdateFence (item,e) {     //弹出修改舍名
        ////console.log(item);
        if(this.btn == '创建完成' && item.fence == true){
          this.updateFenceName = true;
          this.fenceName = item.value;
          this.fenceNum = item.num;
        }
      },
      myCloseAlertUpdate (msg) {        //修改舍名
          let t = false;
        if(msg){
          /*this.axios.post('/field/update?token='+this.token,{'farmId':this.farmId,'houseId':this.houseId,'fieldNum':this.fenceNum,'fieldName':this.fenceName}).then((msg)=>{
            ////console.log(msg);
          }).catch((err)=>{
            ////console.log(err);
            this.tokenErr;
          });*/
          console.log(this.creFence);
          console.log(this.fenceName);
          console.log(this.allArr);
          for(var i=0;i<this.allArr.length;i++){
              console.log(this.allArr[i].value);
              if(this.fenceName == this.allArr[i].value){
                  console.log(this.allArr[i].value);
                  alert('舍名不能重复');
                  t = false;
                  return;
              }else {
                  t = true;
              }
          }
            if(t){
                console.log('else');
                for(var i=0;i<this.allArr.length;i++){
                    if(this.allArr[i].num == this.fenceNum){
                        this.allArr[i].value = this.fenceName;
                    }
                }

                for(var i=0;i<this.creFence.length;i++){
                    if(this.creFence[i].value == this.fenceNum){
                        this.creFence[i].fieldName = this.fenceName;
                    }
                }

                this.updateFenceName = false;
            }

        }else{
          this.updateFenceName = false;
        }
      },
      myCloseAlertHouse (msg) {              //是否应用于其他猪舍
        ////console.log(msg);
        this.isShowAlertSelectHouse = false;
        if(msg){
          this.isShowSelectHouse = true;
          this.buildFinish = true;
        }else {
          var html = encodeURI(JSON.stringify(this.creFence));
          var fieldNames = [];
          for(var i=0;i<this.creFence.length;i++){
            fieldNames.push({'fieldNum':this.creFence[i].value,'fieldName':this.creFence[i].fieldName});
          }
          this.houseIds.push(this.houseId);
          var json = {
            'houseIds':this.houseIds,
            'farmId':this.farmId,
            'htmlStr':html,
            'fieldNames':fieldNames,
            'creator':this.creator
          };
            this.$emit('loadShow',true);
          this.axios.post('/field/create?token='+this.token,json).then((msg)=>{
            ////console.log(msg);
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
          }).catch((err)=>{
            ////console.log(err);
              this.$emit('loadErrShow',true);
          });
          this.buildFinish = true;
          this.getFence();
        }
      },
      choseCirl (item,e) {           //选择要适用的猪舍
        //console.log(item);
        item.selectCirl = !item.selectCirl;
        var cirl = e.target;
        if(item.selectCirl){
          this.houseIds.push(item.houseId);
          cirl.setAttributeNS(null, "fill", "#e4393c");
        }else {
          for(var i=0;i<this.houseIds.length;i++){
            if(this.houseIds[i] == item.houseId){
              this.houseIds.split(i,1);
            }
          }
          cirl.setAttributeNS(null, "fill", "#fff");
        }

      },
      getHouse () {            //获得猪舍信息
        this.ifLoad = false;
        for(var i=0;i<this.house.length;i++){
          this.$set(this.house[i],'selectCirl',false);
          this.$set(this.house[i],'cirl',{cx:'',cy:''});
          var maxX = 0;  //随意取一个大的数值
          var minY = 100;
          var cirlFirstCol = [];
          for(var t=0;t<this.house[i].layoutPoints.length;t++){
            maxX = this.house[i].layoutPoints[t].px > maxX ? this.house[i].layoutPoints[t].px : maxX;
          }
          this.house[i].cirl.cx = maxX * 50 + 32;
          for(var t=0;t<this.house[i].layoutPoints.length;t++){
            if(this.house[i].layoutPoints[t].px == maxX){
              cirlFirstCol.push(this.house[i].layoutPoints[t]);
            }
          }
          for(var j=0;j<cirlFirstCol.length;j++){

            minY = cirlFirstCol[j].py < minY ? cirlFirstCol[j].py : minY;
          }
          this.house[i].cirl.cy = minY * 50 + 16;
        }
      },
      getFence () {             //获得栏位信息
        this.ifLoad = true;
        this.houseUrl = window.location.href;
        localStorage.setItem('houseUrl',this.houseUrl);
        this.$emit('farmTitle',[this.farmName,this.farmUrl]);
        this.$emit('houseTitle',[this.houseName,this.houseUrl]);
          this.$emit('loadShow',true);
        this.axios.post('/field/layout?token='+this.token,{'farmId':this.farmId,'houseId':this.houseId}).then((msg)=>{
          this.ifLoad = false;
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          ////console.log(msg);
          if(msg.data.message == '获取失败'){
            this.isFence = true;
          }else {
            ////console.log('获取成功');
            var data = JSON.parse(decodeURI(msg.data.result.layoutStr));
            ////console.log('------');
            ////console.log(data);
            this.creFence = data;
            for(var i=0;i<data.length;i++){
              if(data[i].fencecChecked){
                this.fenceList.push(data[i].value)
              }
            }
            localStorage.setItem('fenceList',JSON.stringify(this.fenceList));
            this.MakeCreFence();
            this.isFence = false;
            this.buildFinish = true;
          }
        }).catch((err)=>{
          console.log(err);
            this.$emit('loadErrShow',true);
        });
      },
      getRunning () {
        this.ifLoad = true;
          this.$emit('loadShow',true);
        this.axios.post('/field/running?token='+this.token,{'farmId':this.farmId,'houseId':this.houseId,'feedType':this.feedType}).then((msg)=>{
          //console.log(msg);
          this.ifLoad = false;
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          if(msg.data.message == '成功'){
           var data = msg.data.result.fieldSummary;
            //console.log('***');
            if(data.length != 0){
              this.belongBatch = data[0].belongBatch;
            }
            //console.log(this.creFence);
            //console.log('***');
            if(data.length != 0){
              for(var t=0;t<this.creFence.length;t++){
                this.$set(this.creFence[t],'width','');
                this.$set(this.creFence[t],'height','');
                this.$set(this.creFence[t],'cssTop','');
                this.$set(this.creFence[t],'cssLeft','');
                for(var i=0;i<data.length;i++){
                  if(data[i].fieldNum == this.creFence[t].value){
                    this.creFence[t].fieldName2 = this.creFence[t].fieldName;
                    this.creFence[t].fieldName = '';
                    this.judgeFence(this.creFence[t]);
                    var json1Num = {"fieldNum":data[i].fieldNum,"fieldNum2":data[i].fieldNum2};
                    var json1Dir = {"bindLeft":data[i].bindLeft,"bindTop":data[i].bindTop,"bindSign":data[i].bindSign};
                    this.creFence[t].details.days = data[i].feedDays;
                    this.creFence[t].details.temperature = data[i].tempreture;
                    this.creFence[t].details.deviceNum = data[i].deviceCode;
                    if(data[i].deviceExcepts!=null){
                      this.creFence[t].details.deviceError = data[i].deviceExcepts.length;
                      this.creFence[t].details.deviceExcepts = data[i].deviceExcepts;
                    }
                    switch(data[i].bindSign){
                      case 1:
                        this.creFence[t].cssTop = '-90px';
                        this.creFence[t].cssLeft = 0;
                        this.creFence[t].width = '138px';
                        this.creFence[t].height = '178px';
                        break;
                      case 2:
                        this.creFence[t].cssLeft = 0;
                        this.creFence[t].cssTop = 0;
                        this.creFence[t].width = '278px';
                        this.creFence[t].height ='88px';
                        break;
                      case 3:
                        this.creFence[t].cssTop = 0;
                        this.creFence[t].cssLeft = 0;
                        this.creFence[t].width = '138px';
                        this.creFence[t].height = '178px';
                        break;
                      case 4:
                        this.creFence[t].cssLeft = '-140px';
                        this.creFence[t].cssTop = 0;
                        this.creFence[t].width = '278px';
                        this.creFence[t].height ='88px';
                        break;
                      default:
                        this.creFence[t].cssLeft = 0;
                        this.creFence[t].cssTop = 0;
                        this.creFence[t].width = '138px';
                        this.creFence[t].height ='88px';
                    };
                    this.creFence[t].details.feedNum = data[i].food;
                    this.creFence[t].belongBatch = data[i].belongBatch;
                    this.creFence[t].details.belongBatch = data[i].belongBatch;
                    this.creFence[t].details.tempSign = data[i].tempSign;
                    this.creFence[t].details.bound = json1Num;
                    this.creFence[t].offBound = json1Dir;
                  }
                  if(data[i].fieldNum2 == this.creFence[t].value){
                    this.creFence[t].fieldName2 = this.creFence[t].fieldName;
                    this.creFence[t].fieldName = '';
                    this.judgeFence(this.creFence[t]);
                  }
                }
              }
            }
          }
        }).catch((err)=>{
          console.log(err);
            this.$emit('loadErrShow',true);
        });
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
      finish () {      //创建完成
        var html = encodeURI(JSON.stringify(this.creFence));
        var fieldNames = [];
        for(var i=0;i<this.creFence.length;i++){
          fieldNames.push({'fieldNum':this.creFence[i].value,'fieldName':this.creFence[i].fieldName});
        }
        this.houseIds.push(this.houseId);
        var json = {
          'houseIds':this.houseIds,
          'farmId':this.farmId,
          'htmlStr':html,
          'fieldNames':fieldNames,
          'creator':this.creator
        };
          this.$emit('loadShow',true);
        this.axios.post('/field/create?token='+this.token,json).then((msg)=>{
          //console.log(msg);
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
        }).catch((err)=>{
          ////console.log(err);
            this.$emit('loadErrShow',true);
        });
        this.isShowSelectHouse = false;
      },
      showBound (item) {
        if(item.fencecChecked){
          this.judgeFence(item);
          item.showBound = true;
        }
      },
      hideBound (item) {
        if(item.fencecChecked){
          item.showBound = false;
        }
      },
      bound (item,f) {
        this.boundType = f;
        this.fieldNum = item.value;
        switch(f)
        {
          case 1:
            this.fieldNum2 = item.top;
            break;
          case 2:
            this.fieldNum2 = item.right;
            break;
          case 3:
            this.fieldNum2 = item.bottom;
            break;
          case 4:
            this.fieldNum2 = item.left;
            break;
          default:
            this.fieldNum2 = '';
        }
        //console.log(item);
        this.isShowBound = true;
      },
      myCloseAlertBound (msg) {
        var json = {
          farmId:this.farmId,
          houseId:this.houseId,
          fieldNum:this.fieldNum,
          fieldNum2:this.fieldNum2,
          deviceNum:this.boundNum,
          bindType:this.boundType,
          creator:this.creator
        };
        if(msg){
            this.$emit('loadShow',true);
          this.axios.post('/field/bind?token='+this.token,json).then((msg)=>{
            //console.log(msg);
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            this.getRunning();
            this.boundNum = '';
          }).catch((err)=>{
            //console.log(err)

              this.$emit('loadErrShow',true);
          });
          this.isShowBound = false;
        }else {
          this.isShowBound = false;
        }
      },
      judgeFence (f) {               //判断栏位的上下左右绑定
        this.$set(f,'top','');
        this.$set(f,'left','');
        this.$set(f,'right','');
        this.$set(f,'bottom','');
        this.$set(f,'showBound',false);
        var row = f.row;
        var col = f.col;
        var val = f.value;
        for(var i=0;i<this.creFence.length;i++){
          if(row == this.creFence[i].row){
            if(this.creFence[i].col == col-1 && this.creFence[i].fieldName){
                f.left = this.creFence[i].value;
            }
            if(this.creFence[i].col == col+1 && this.creFence[i].fieldName){
              f.right = this.creFence[i].value;
            }
          }
        }

        for(var i=0;i<this.creFence.length;i++){
          if(col == this.creFence[i].col){
            if(this.creFence[i].row == row-1 && this.creFence[i].fieldName){
              f.top = this.creFence[i].value;
            }
            if(this.creFence[i].row == row+1 && this.creFence[i].fieldName){
              f.bottom = this.creFence[i].value;
            }
          }
        }

      },
      unBound (item) {
        //console.log(item);
        var json = {
          farmId:this.farmId,
          houseId:this.houseId,
          fieldNum:item.value,
          deviceNum:item.details.deviceNum
        };
          this.$emit('loadShow',true);
        this.axios.post('/field/unbind?token='+this.token,json).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          //console.log(msg);
          item.details.deviceNum = '';
          this.getFence();
          this.getRunning();
        }).catch((err)=>{
          //console.log(err);
            this.$emit('loadErrShow',true);
        })
      },
      goFenceDes (item) {
        var fd = JSON.stringify(item);
        localStorage.setItem('fenceDes',fd);
        this.$router.push({path:'fenceDes',query:{'belongBatch':item.belongBatch,feedType:this.feedType,fieldNum:item.details.bound.fieldNum,fieldNum2:item.details.bound.fieldNum2,'boundNum':item.details.deviceNum}});
      }
    }
  }

</script>
