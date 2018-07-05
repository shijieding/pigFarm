<template>
<div>
  <div class="table svg" v-if="show">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <g v-for="(g,index) in house">
        <rect :width="width" :height="height" v-for="rect in g.layoutPoints" :x='rect.px*50' :y="rect.py*50" fill="#e0e0e0"></rect>
        <text style="color:#444444;font-size:14px;" :x='g.textPoint.px' :y='g.textPoint.py'>{{g.houseName}}</text>
        <circle :cx="g.cirl.cx" :cy="g.cirl.cy" r="15" stroke="#b0b0b0" stroke-width="1" fill="#fff"
                :class="{'curCirl':g.selectCirl}" @click="choseCirl(g,fence)"/>
      </g>
    </svg>
    <div class="button">
      <button class="right" style="font-size: 16px" @click="finishHouse">完成</button>
    </div>
  </div>


</div>
</template>
<style scoped>
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
  .curCirl {
    fill:#e4393c;
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
  import Loading from '../components/loading'
export default {
  data () {
    return {
      ifLoad:false,
      width:49.5,//小方格宽度
      height:36.5,//小方格高度
      houseType:'',//舍类型
      newHouse:[],
      farmId:'',
      house:'',
      show:'',
      token:localStorage.getItem('token')
    }
  },
  components:{
    Loading
  },
  props:['fence'],
  mounted () {
    this.farmId = localStorage.getItem('farmId');
    this.house = JSON.parse(localStorage.getItem('house'));
    this.getHouse();
    setTimeout(()=>{
      this.show = true;
    },500);
  },
  methods:{
    tokenErr () {
      alert('登陆过期,请重新登陆');
      this.$router.push({path:'/log'});
    },
    choseCirl (item,fence) {           //选择要适用的猪舍
      if(fence == 0){


        if(item.selectCirl){
          var noC = true;
          item.selectCirl = false;
          for(var i=0;i<this.house.length;i++){
            if(this.house[i].selectCirl == true){
              noC = false;
            }
          }
          if(noC){
            this.houseType = '';
          }
          this.newHouse.splice(this.newHouse.indexOf(item),1);
        }else {        //选中
          if(item.noFence == false){
            if(item.canSelectCirl == true){
              if(item.houseType == this.houseType || this.houseType == ''){
                this.houseType = item.houseType;
                item.selectCirl = true;
                for(var i=0;i<this.house.length;i++){
                  if(this.house[i].houseType == this.houseType && this.house[i].canSelectCirl && !this.house[i].noFence){
                    this.house[i].selectCirl = true;
                    this.newHouse.push(this.house[i]);
                  }
                }

              }else {
                alert('请选择相同类型的猪舍入栏');
              }
            }else {
              alert('这个猪舍已经入过栏了');
            }
          }else {
            alert('这个猪舍没有栏位信息');
          }
        }


      }else {

        if(item.selectCirl){
          var noC = true;
          item.selectCirl = false;
          for(var i=0;i<this.house.length;i++){
            if(this.house[i].selectCirl == true){
              noC = false;
            }
          }
          if(noC){
            this.houseType = '';
          }
          this.newHouse.splice(this.newHouse.indexOf(item),1);
        }else {        //选中
          if(item.noFence == false){
            if(item.canSelectCirl == false){
              if(item.houseType == this.houseType || this.houseType.toString() == ''){
                this.houseType = item.houseType;
                item.selectCirl = true;
                for(var i=0;i<this.house.length;i++){
                  if(this.house[i].houseType == this.houseType && !this.house[i].canSelectCirl && !this.house[i].noFence){
                    this.house[i].selectCirl = true;
                    this.newHouse.push(this.house[i]);
                  }
                }
              }else {
                alert('请选择相同类型的猪舍出栏');
              }
            }else {
              alert('这个猪舍没有入栏信息');
            }
          }else {
            alert('这个猪舍没有栏位信息');
          }

        }


      }
    },
    getHouse () {            //获得猪舍信息是否入栏
      this.ifLoad = true;
        this.$emit('loadShow',true);
      this.axios.get('/'+this.farmId+'/house-select?token='+this.token).then((msg)=>{
          this.$emit('loadShow',false);
          if(msg.data.code == 401){
              this.tokenErr();
          }
        this.ifLoad = false;
        for(var i=0;i<this.house.length;i++){
          this.$set(this.house[i],'cirl',{cx:'',cy:''});
          this.$set(this.house[i],'selectCirl',false);
          this.$set(this.house[i],'noFence',false);
          this.$set(this.house[i],'canSelectCirl',true);
          this.$set(this.house[i],'blongBatId','');
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
        for(var i=0;i<msg.data.result.length;i++){
          for(var t=0;t<this.house.length;t++){
            if(msg.data.result[i].houseId == this.house[t].houseId){
              if(msg.data.result[i].blongBatId){
                this.house[t].blongBatId = msg.data.result[i].blongBatId;
                this.house[t].canSelectCirl = false;
              }
              if(!msg.data.result[i].hasFields){
                this.house[t].noFence = true;
              }
            }
          }
        }
        //console.log(this.house);

      }).catch((err)=>{
        //console.log(err);
          this.$emit('loadErrShow',true);
      });
    },
    finishHouse () {
      if(this.newHouse.length != 0){
        this.$emit('fnHouse',this.newHouse);
      }else {
        if(this.fence == 0){
          alert('请选择要入栏的猪舍');
        }else {
          alert('请选择要出栏的猪舍');
        }
      }
    }
  }
}

</script>
