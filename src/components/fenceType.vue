<template>
  <div>
    <div class="fence">
      <p class="close" @click="closeMySelf">x</p>
      <div>
        <h1 class="textcenter">舍属信息</h1>
        <h2>1.选择舍属</h2>
        <ul>
          <li class="left textcenter" @click="select(h)" v-for="h in houseType" :class="{cur:h.cur}">{{h.typeName}}</li>
        </ul>
        <h2>2.舍属名称</h2>
        <input type="text" v-model="houseName"/>
        <div class="btn-box">
          <button class="btn textcenter" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  div.fence {
    width:420px;
    height:430px;
    background-color: #fff;
    margin:200px auto;
    padding:5px;
    border-radius: 10px;
    position:relative;
  }
  div.fence>div {
    padding:0 50px;
  }
  h1  {
    font-size: 1.3em;
    line-height: 2.5em;
  }
  h2  {
    font-size: 1.2em;
    line-height: 3em;
  }
  ul {
    height:118px;
    width:308px;
    border-left: 1px solid #afafaf;
    border-top: 1px solid #afafaf;
  }
  li {
    border-right: 1px solid #afafaf;
    border-bottom: 1px solid #afafaf;
    width:76px;
    height:58px;
    line-height: 58px;
    font-size: 1.1em;
    cursor:pointer;
  }
  li.cur {
    background-color: #efc593;
  }
  input {
    width:310px;
    height:56px;
    border:1px solid #afafaf;
    text-align: center;
    font-size: 1.3em;
  }

  p.close {
    position:absolute;
    right:10px;
    top:5px;
    font-size: 1.5em;
    cursor:pointer;
  }
  .btn-box {
    margin-top: 30px;
    text-align: right;
  }
  .btn {
    width:80px;
    height:48px;
    line-height: 48px;
    font-size: 1.1em;
    border:1px solid #afafaf;
    border-radius: 5px;
    background-color: #e5e5e5;
    cursor:pointer;
  }
</style>
<script type="es6">
export default {
  data () {
    return {
        houseName:'保育1舍',
        houseType:[
          {typeName:'保育',typeNum:'0','cur':true},
          {typeName:'育肥',typeNum:'1','cur':false},
          {typeName:'产房',typeNum:'2','cur':false},
          {typeName:'妊娠',typeNum:'3','cur':false},
          {typeName:'公猪',typeNum:'4','cur':false},
          {typeName:'怀孕',typeNum:'5','cur':false},
          {typeName:'配种',typeNum:'6','cur':false},
          {typeName:'后备',typeNum:'7','cur':false}
        ]
    }
  }, 
  methods:{
    closeMySelf () {
      this.$emit('on-close')
    },
    save () {
      if(this.houseName){
        var n = 0;
        for(var i=0;i<this.houseType.length;i++){
          if(this.houseType[i].cur  == true){
            n = this.houseType[i].typeNum;
          }
        }
        this.$emit('saveFenceType',[n,this.houseName])
      }else {
        alert('请填写舍名');
      }

    },
    select (h) {
      for(var i=0;i<this.houseType.length;i++){
        this.houseType[i].cur = false;
      }
      h.cur = true;
      this.houseName = h.typeName + '1舍'
    }
  }
}

</script>
