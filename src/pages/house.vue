<template>
  <div>
    <div v-if="init">
      <div class="table err" v-show="isBuild">
        <div class="boder">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" x="0" y="0" :width="width" :height="height" patternUnits="userSpaceOnUse">
                <path stroke="#b0b0b0" fill="none" d="M0,0 H49.5 V36.5"></path>
              </pattern>
            </defs>
            <rect :width="width" :height="height" v-for="(item,index) in rect" :x="item.x" :y="item.y" fill="url(#grid)" :class="{fill:item.isChose}" @click="chose(item,$event)"></rect>
            <g v-for="(g,index) in houseList">
              <rect :width="width" :height="height" v-for="rect in g.layoutPoints" :x='rect.px*50' :y="rect.py*50" fill="#b0b0b0"></rect>
              <image :x='g.imgPoint.px' :y='g.imgPoint.py' width="30" height="30" xlink:href="../assets/img/farm.png" />
              <image v-if="g.boxCode" :x='g.pigPoint.px' :y='g.pigPoint.py' width="30" height="30" xlink:href="../assets/img/piger.png" />
              <text style="color:#444444;font-size:14px;" :x='g.textPoint.px' :y='g.textPoint.py'>{{g.houseName}}</text>
            </g>
          </svg>
        </div>
      </div>
      <div class="table succ" v-show="!isBuild">
        <div class="boder">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <g v-for="(g,index) in houseList" @dblclick="goFence(g)" @click.stop.prevent="cNameShow(g,$event)">
              <rect :width="width" :height="height" v-for="rect in g.layoutPoints" :x='rect.px*50' :y="rect.py*50" fill="#b0b0b0"></rect>
              <image :x='g.imgPoint.px' :y='g.imgPoint.py' width="30" height="30" xlink:href="../assets/img/farm.png" />
              <image v-if="g.boxCode" :x='g.pigPoint.px' :y='g.pigPoint.py' width="30" height="30" xlink:href="../assets/img/piger.png" />
              <text style="color:#444444;font-size:14px;" :x='g.textPoint.px' :y='g.textPoint.py'>{{g.houseName}}</text>
            </g>
          </svg>
        </div>
        <div class="hover-box" v-show="cName">
          <i></i>
          <span @click.stop.prevent="water">调水</span>
          <span @click.stop.prevent="amendHouse">修改舍名</span>
          <span @click.stop.prevent="piger" v-show="!hasPiger">放置猪宝</span>
          <span @click.stop.prevent="delPiger" v-show="hasPiger">移除猪宝</span>
          <span @click.stop.prevent="deleteHouse">删除</span>
        </div>
      </div>
      <div>
        <p class="warn" v-show="showP"><span>注：</span>双击进入猪舍</p>
      </div>
      <div class="button">
        <router-link to="enterFence" tag="button" class="left">入栏称重</router-link>
        <router-link to="leaveFence" tag="button">出栏称重</router-link>
      </div>
      <div class="button">
          <button @click="backRect" v-show="isBuild">上一步</button>
        <button @click="back" v-show="isBuild">退出编辑</button>
        <button @click="build">{{btnText}}</button>
      </div>
      <transition name="fade">
        <div class="alert-box" v-show="isBuildFinish">
          <fence-type @saveFenceType="saveFarm" @on-close="myCloseFenceType"></fence-type>
        </div>
      </transition>
      <transition name="fade">
        <div class="alert" v-show="isAlert">
          <Alert @on-close="myCloseAlert">
            <p slot="delete">你确定要删除该猪舍吗？</p>
          </Alert>
        </div>
      </transition>
      <transition name="fade">
        <div class="alert" v-show="isAmend">
          <Alert @on-close="myCloseAlert">
            <p slot="delete">
              舍名：<input type="text" name="houseName" v-model="houseName" placeholder="输入新的舍名"/>
            </p>
          </Alert>
        </div>
      </transition>
      <transition name="fade">
        <div class="alert" v-show="isPiger">
          <Alert @on-close="myCloseAlert">
            <p slot="delete">
              猪宝编号：<input type="text" name="houseName" v-model="pigNum" placeholder="输入猪宝编号"/>
            </p>
          </Alert>
        </div>
      </transition>
    </div>
  </div>

</template>
<style scoped>
  div.aside-left li {
    height:54px;
    line-height: 54px;
    border-bottom: 1px solid #b0b0b0;
    font-size: 1.1em;
  }
  div.aside-left li:last-child {
    border:none;
  }
  div.aside-right {
    width:820px;
    position:absolute;
    right:0;
    top:0;
    bottom:0;
  }
  div.table {
    width:900px;
    height:547.5px;
    /*border:1px solid #b0b0b0;*/
    font-size: 50px;
    position:relative;
    /*overflow:scroll;*/
  }
  div.boder {
    width:742.5px;
    height:547.5px;
    border:1px solid #b0b0b0;
  }
  svg {

  }
  div.button {
    margin-top: 30px;
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
  .fill {
    fill:#b0b0b0;
  }
  .alert-box {
    position:absolute;
    left:0;
    top:0;
    bottom:0;
    right:0;
    width:100%;
    height:100%;
    background-color:rgba(200,200,200,0.1);
  }
  .hover-box {
    position:absolute;
    padding:3px 7px;
    font-size: 14px;
    height:30px;
    line-height: 30px;
    background-color: #efc593;
    border-radius: 3px;
    left:-9999px;
    top:-9999px;
  }
  .hover-box span {
    padding:0 5px;
    cursor:pointer;
    border-right: 1px solid #fff;
  }
  .hover-box span:last-child {
    border-right: 1px solid transparent;
  }
  .hover-box i {
    position:absolute;
    top:-20px;
    left:35px;
    width:0;
    height:0;
    border:10px solid transparent;
    border-bottom-color: #efc593;
  }
  input[name=houseName] {
    height:24px;
    line-height: 24px;
    font-size: 16px;
    padding-left: 5px;
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
  import fenceType from '../components/fenceType.vue'
  import Alert from '../components/alert.vue'
  import { eventBus } from '../eventBus.js'
  export default {
    data () {
      return {
        ifLoad:true,
        init:false,
          noPig:false,
        isBuild:false,//是否正在创建
        width:49.5,//小方格宽度
        height:36.5,//小方格高度
        rect:[], //小方格数组
        isChoseRect:[],//选中的小格子数组
          rectId:0,
        isBuildFinish:false,   //是否完成创建
        btnText:'创建',
        g:[],//所有g标签的集合
        textPoint:[],//文字的坐标点
        cName:false,//是否显示修改舍名
        isAlert:false,//是否显示删除猪舍对话框
        isAmend:false,//修改舍名
        isPiger:false, //放置猪宝
        pigNum:'',//猪宝编号
        hasPiger:false,//是否有猪宝
        textFirstCol:[],  //第一例文字
          showP:true,    //是否提示双击进入
        houseList:[],
        creator:'',
        farmId:'',
        farmName:'',
        url:'',
        houseId:'',
        houseName:'',
        farmUrl:'',
        token:localStorage.getItem('token')
      }
    },
    components: {
      fenceType,Alert
    },
    created () {
      for(var i=0;i<15;i++){
        for(var t=0;t<15;t++){
          this.rect.push({x:i*this.width,y:t*this.height,canChose:true,isChose:false})
        }
      }
    },
    watch: {
      isChoseRect () {
        if(this.isChoseRect.length==0){
          for(var i=0;i<this.rect.length;i++){
            this.rect[i].canChose = true;
          }
        }else{
          for(var i=0;i<this.rect.length;i++){
            this.rect[i].canChose = false;
          }
          this.near(this.isChoseRect);
        }
      }
    },
    mounted: function () {
      eventBus.$on('reset-component',() => {
        this.cName = false;
      });
      ////console.log(this.farmName);
      this.farmId = this.$route.query.farmId;
      this.creator = this.$route.query.creator;

      this.farmName = this.$route.query.farmName;
      ////console.log(this.farmName);
      this.getHouse();
      setTimeout(()=>{
        this.init = true;
      },200);


    },
    methods:{
      tokenErr () {
        alert('登陆过期,请重新登陆');
        this.$router.push({path:'/log'});
      },
      chose (item,e) {              //点击画图
        //////console.log(e);
        var rect = e.target;
        //////console.log(rect);
        var fill = rect.getAttribute('fill');
        var x = $(rect).attr('x');
        var y = $(rect).attr('y');
        if(item.canChose){
          if(!item.isChose){
            for(var i=0;i<this.rect.length;i++){
              if(this.rect[i].x==x && this.rect[i].y==y){
                this.rect[i].isChose = true;
                this.isChoseRect.push(this.rect[i]);
                /*this.$set(this.isChoseRect[this.rectId],'crId',this.rectId+1);
                  this.rectId++;
                console.log(this.isChoseRect);*/
              }
            }
          }
          /*else {
              for(var i=0;i<this.rect.length;i++){
                  if(this.rect[i].x==x && this.rect[i].y==y){
                      this.rect[i].isChose = false;
                      for(var t=0; t<this.isChoseRect.length; t++) {
                          if(this.isChoseRect[t] == this.rect[i]) {
                              this.isChoseRect.splice(t, 1);
                              break;
                          }
                      }
                  }
              }
          }*/
        }else {
          //alert('请选择相邻的格子建立猪场');
        }
      },
        backRect () {
          let n = this.isChoseRect.length-1;
            if(n==-1){
                this.back();
                return;
            }
            for(var i=0;i<this.rect.length;i++){
                if(this.rect[i].x==this.isChoseRect[n].x && this.rect[i].y==this.isChoseRect[n].y){
                    this.rect[i].isChose = false;
                }
            }
            this.isChoseRect.pop();

        },
      textP () {             //获取文字  图片位置
        for(var i=0;i<this.houseList.length;i++){//确定文字位置
          this.$set(this.houseList[i],'textPoint',{px:'',py:''});
          this.$set(this.houseList[i],'imgPoint',{px:'',py:''});
          this.$set(this.houseList[i],'pigPoint',{px:'',py:''});
          var minX = 100;  //随意取一个大的数值
          var maxY = 0;
          var minY = 100;
          var maxX = 0;
          var textFirstCol = [];
          for(var t=0;t<this.houseList[i].layoutPoints.length;t++){
            minX = this.houseList[i].layoutPoints[t].px < minX ? this.houseList[i].layoutPoints[t].px : minX;
            maxX = this.houseList[i].layoutPoints[t].px > maxX ? this.houseList[i].layoutPoints[t].px : maxX;
          }
          this.houseList[i].textPoint.px = minX * 50 + 10;
          this.houseList[i].imgPoint.px = minX * 50 + 10;
          this.houseList[i].pigPoint.px = maxX * 50 + 10;
          for(var t=0;t<this.houseList[i].layoutPoints.length;t++){
            if(this.houseList[i].layoutPoints[t].px == minX){
              textFirstCol.push(this.houseList[i].layoutPoints[t]);
            }
          }
          //////console.log(textFirstCol);
          for(var j=0;j<textFirstCol.length;j++){

            maxY = textFirstCol[j].py > maxY ? textFirstCol[j].py : maxY;
            minY = textFirstCol[j].py < minY ? textFirstCol[j].py : minY;
          }
          //////console.log(minX+'-'+maxY);
          this.houseList[i].textPoint.py = maxY * 50 + 30;
          this.houseList[i].imgPoint.py = minY * 50 + 5;
          this.houseList[i].pigPoint.py = minY * 50 + 5;
        }
      },
      near (arr) {           //只能点击旁边的小方格
        var w = Number(this.width);
        var h = Number(this.height);
        if(arr.lenght = 0){return;}
        for(var i=0;i<arr.length;i++){
          var x = Number(arr[i].x);
          var y = Number(arr[i].y);
          for(var t=0;t<this.rect.length;t++){
            if((this.rect[t].x==x && this.rect[t].y==y) || (this.rect[t].x==x && this.rect[t].y==y-h) //只有相邻的上下左右和自己可以点击
                    || (this.rect[t].x==x && this.rect[t].y==y+h) || (this.rect[t].x==x+w && this.rect[t].y==y)
                    || (this.rect[t].x==x-w && this.rect[t].y==y)){
              this.rect[t].canChose = true;
            }
          }
        }
      },
      build () {               //  点击创建按钮
        if(this.btnText=='创建'){
          this.isBuild=true;
          this.btnText = '完成创建';
          this.showP = false;
        }else {
          this.isBuildFinish = true;
        }
      },
      saveFarm (n) {               //保存猪舍
        this.showP = true;
        //////console.log(n);
        ////console.log(this.isChoseRect);
        if(this.isChoseRect.length != 0){
          var layoutPoints = [];
          for(var i=0;i<this.isChoseRect.length;i++){
            layoutPoints.push({px:this.isChoseRect[i].x / 50,py:this.isChoseRect[i].y / 50});
          }
          var json = {houseName:n[1], typeNum:n[0], layoutPoints:layoutPoints,farmId:this.farmId, creator:this.creator};
          ////console.log(json);
            this.$emit('loadShow',true);
          this.axios.post('/house?token='+this.token,json).then((msg)=>{
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            ////console.log(msg);
            if(msg.data.message == 'ok'){

            }else{
              alert(msg.data.result.message);
            }
            this.clearChoseRect();
            this.getHouse();
          }).catch((err)=>{
            ////console.log(err);
              this.$emit('loadErrShow',true);
          });
        }else {
          alert('请选择猪舍位置');
        }
        this.clearChoseRect();
        this.isBuildFinish = false;
        this.isBuild=false;
        this.btnText = '创建';
      },
      goFence (g) {          //  去栏位
        ////console.log(g);
        this.farmUrl = window.location.href;
        localStorage.setItem('houseName',this.houseName);
        localStorage.setItem('feedType',g.houseType);
        this.$router.push({path:'fence',query:{'creator':this.creator,'farmId':this.farmId,'houseId':this.houseId}});
      },
      cNameShow (h,e) {    //显示修改猪舍对话框
        this.houseId = h.houseId;
        this.houseName = h.houseName;
        if(h.boxCode){
          this.hasPiger = true;
        }else {
          this.hasPiger = false;
        }
        var g = e.target.parentNode;
        var boxLeft = g.getBBox().x;
        var boxTop = g.getBBox().y + g.getBBox().height;
        this.cName = true;

        if(this.cName){
          $('.hover-box').attr('style','top:'+boxTop+'px;left:'+boxLeft+'px');
        }else {
          //$('.hover-box').attr('style','top:-9999px;left:-9999px;');
        }
      },
      amendHouse () {           // 弹出修改猪舍
        this.isAmend = true;
      },
      deleteHouse () {             //弹出删除猪舍
        this.isAlert = true;
      },
      myCloseAlert (data) {           //关闭弹框
        ////console.log(data);
        if(this.isAlert && data){             //删除猪舍
            this.$emit('loadShow',true);
          this.axios.post('/'+this.farmId+'/'+this.houseId+'/remove?token='+this.token).then((msg)=>{
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            ////console.log(msg);
            if(msg.data.message == '成功'){
              this.getHouse();
            }else {
              alert(msg.data.result.message);
            }
          }).catch((err)=>{
            ////console.log(err);
              this.$emit('loadErrShow',true);
          });
        }else if(this.isAmend && data){        //修改舍名字
          ////console.log(this.houseName);
            this.$emit('loadShow',true);
          this.axios.post('/'+this.farmId+'/'+this.houseId+'/update?token='+this.token,{'houseName':this.houseName}).then((msg)=>{
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            ////console.log(msg);
            if(msg.data.message == '成功'){
              this.getHouse();
            }else {
              alert(msg.data.result.message);
            }
          }).catch((err)=>{
            ////console.log(err);
              this.$emit('loadErrShow',true);
          });
        }else if(this.isPiger && data){          //放置猪宝
            this.$emit('loadShow',true);
          this.axios.post('/'+this.farmId+'/'+this.houseId+'/box-set?token='+this.token,{'box':this.pigNum}).then((msg)=>{
              this.$emit('loadShow',false);
              if(msg.data.code == 401){
                  this.tokenErr();
              }
            ////console.log(msg);
            if(msg.data.message == '成功'){
              this.getHouse();
            }else {
              alert(msg.data.result.message);
            }
          }).catch((err)=>{
            ////console.log(err);
              this.$emit('loadErrShow',true);
          });
        }
        this.isAlert = false;
        this.isAmend = false;
        this.isPiger = false;
        this.cName = false;
        this.pigNum = '';
      },
      myCloseFenceType () {         //关闭选择猪舍信息
        this.isBuildFinish=false;
      },
      getHouse () {             //获取猪舍信息
        this.farmName = this.$route.query.farmName;
        this.url = window.location.href;
        localStorage.setItem('farmName',this.farmName);
        localStorage.setItem('farmUrl',this.url);
        localStorage.setItem('farmId',this.farmId);
        localStorage.setItem('creator',this.creator);
        this.$emit('farmTitle');
          this.$emit('loadShow',true);
        this.axios.get('/'+this.farmId+'/house?token='+this.token).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          this.ifLoad = false;
          if(msg.data.result.message == '猪舍不存在'){
              this.noPig = true;
            this.isBuild = true;
            this.btnText = '完成创建';
            this.houseList = [];
            this.showP = false;
          }else{
            this.isBuild = false;
            this.noPig = false;
            this.showP = true;
            this.houseList = msg.data.result;
            ////console.log(this.houseList);
            this.textP();
            localStorage.setItem('house',JSON.stringify(this.houseList));
          }
        }).catch((err)=>{
          console.log(err);
            this.$emit('loadErrShow',true);
        });
      },
      clearChoseRect () {    //清除选中的小方格
        for(var t=0; t<this.rect.length; t++) {
          this.rect[t].isChose = false;
        }
        this.isChoseRect = [];
      },
      back () {
        this.isBuildFinish = false;
        this.isBuild=false;
        this.btnText = '创建';
        if(this.noPig){
            this.showP = false;
        }else {
            this.showP = true;
        }
        this.clearChoseRect();
      },
      water () {
        this.$router.push({path:'regWater',query:{'farmId':this.farmId,'houseId':this.houseId}});
      },
      piger () {
        this.isPiger = true;
      },
      delPiger () {
          this.$emit('loadShow',true);
        this.axios.post('/'+this.farmId+'/'+this.houseId+'/box-del?token='+this.token).then((msg)=>{
          ////console.log(msg);
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          if(msg.data.message == '成功'){
            this.getHouse();
            this.cName = false;
          }else {
            alert(msg.data.result.message);
          }
        }).catch((err)=>{
          ////console.log(err);
            this.$emit('loadErrShow',true);
        });
      }
    }
  }

</script>
