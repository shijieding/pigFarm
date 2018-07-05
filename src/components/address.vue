<template>
  <div class="address-list">
    <div class="top">
      <span class="textcenter">省</span>
      <span class="textcenter">市</span>
      <span class="textcenter">区</span>
    </div>
    <div class="box">
      <div class="province left">
        <span class="left textcenter" v-for="p in provincelist" @click.stop="getProvince(p)">{{p.area}}</span>
      </div>
      <div class="city left">
        <span class="left textcenter" v-for="c in citylist" @click.stop="getCity(c)" v-if="citylist">{{c.area}}</span>
        <span class="left textcenter" v-if="!citylist">请选择省</span>
      </div>
      <div class="area left">
        <span class="left textcenter" v-for="a in arealist" v-if="arealist" @click.stop="getArea(a)">{{a.area}}</span>
        <span class="left textcenter" v-if="!arealist">请选择市</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.top {
  display:flex;
}
.top span {
  flex: 1;
  height:34px;
  line-height: 34px;
  font-size: 1.1em;
}
.box {
  height:154px;
  overflow-y:scroll;
}
.box>div {
  width:33%;
  overflow-y: scroll;
  overflow-x: hidden;
}
  .box span {
    height:20px;
    width:100%;
    line-height: 20px;
    margin:0 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
<script type="es6">
export default {
  data () {
    return {
      provincelist:'',
      citylist:'',
      arealist:'',
      list:'',
        token:localStorage.getItem('token')
    }
  },
  beforeCreate () {
    this.axios.get('http://ssfile.znswsse.com/farm/pc/area.json').then((res) => {
      this.list = res.data.lists;
      this.provincelist = res.data.lists;
    });
  },
  methods:{
    getProvince (p) {
      this.citylist = p.city;
      this.$emit('has-province',p);
      this.arealist = '';
    },
    getCity (c) {
      this.arealist = c.city;
      this.$emit('has-city',c);
    },
    getArea (a) {
      this.$emit('has-area',a);
    }
  }
}

</script>
