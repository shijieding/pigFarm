<template>
  <div>
    <h1 class="title">投料信息</h1>
    <div class="date">
      <h2>点击查询指定日期投料量</h2>
      <vue-datepicker-local v-model="time" />
    </div>
    <div class="canvas">
      <div id="main" style="width: 600px;height:400px;"></div>
    </div>
    <div class="bottom" v-show="putList.length!=0">
      <div class="feed-title" style="height:28px;line-height: 28px">
        <span class="left textcenter">投放时间</span>
        <span class="left textcenter">投料量(kg)</span>
        <span class="left textcenter">温度(℃)</span>
      </div>
      <ul class="feed-list">
        <li class="feed-item" v-for="item in putList">
          <span class="left textcenter">{{item.ftime}}</span>
          <span class="left textcenter">{{item.food}}kg</span>
          <span class="left textcenter">{{item.ftemp}}℃</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
  .bottom span {
    width:33%;
  }
  .feed-title span {
    font-weight: 600;
  }
  h1.title {
    height:50px;
    line-height: 50px;
    font-size: 18px;
    margin-bottom: 20px;
    border-bottom: 1px solid #b0b0b0;
  }
  div.date {
    margin:20px auto;
    text-align: center;
  }
  h2 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  #main {
    margin:0 auto;
  }
  .feed-item {
    color:#999;
    height:28px;
    line-height: 28px;
    cursor: pointer;
  }
  .feed-item:hover {
    height:32px;
    line-height: 32px;
    box-shadow: 0 0 5px #b0b0b0;
  }
</style>
<script type="es6">
  import Vue from 'vue'
  import echarts from 'echarts'
  import VueDatepickerLocal from 'vue-datepicker-local'
  import port from '../data_json/port.vue'

  Vue.prototype.$echarts = echarts;

  export default {
    data () {
      return {
        time: new Date(),
        foundTime:'',
        food:[],
        hour:[],
        tempre:[],
        putList:[],
        token:localStorage.getItem('token')
      }
    },
    components: {
      VueDatepickerLocal
    },
    watch : {
      time () {
        this.getTime();
      }
    },
    mounted(){
      this.myChart = this.$echarts.init(document.getElementById('main'));
      this.myChart.showLoading();
      this.getTime();
    },
    methods: {
      tokenErr () {
        alert('登陆过期,请重新登陆');
        this.$router.push({path:'/log'});
      },
      getTime () {
        var year = this.time.getFullYear();
        var MM = this.time.getMonth()+1 < 10 ? '0'+(this.time.getMonth()+1) : this.time.getMonth()+1;
        var day = this.time.getDate() <10 ? '0'+this.time.getDate() : this.time.getDate();
        this.foundTime = year+'-'+MM+'-'+day;
        this.getData();
      },
      getData () {
        this.food = [];
        this.hour = [];
        this.tempre = [];
        var json = {
          device:this.$route.query.device,
          time:this.foundTime
          /*device:10000141,
          time:this.foundTime*/
        };
          this.$emit('loadShow',true);
        this.axios.post('/field/day-food?token='+this.token,json).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          if(msg.data.message = '成功'){
            var data = msg.data.result.temfoodlist;
            this.putList = msg.data.result.food_list;
            for(var i=0;i<data.length;i++){
              this.food.push(data[i].food);
              this.hour.push(data[i].hour);
              this.tempre.push(data[i].tempre);
            }
            this.myChart.hideLoading();
            this.myChart.setOption({
              title: {
                text: '投料量：柱形图，温度：折线图',
                textStyle:{
                  align:'center'
                }},
              tooltip: {},
              xAxis: {
                data: this.hour,
                name:'小时数',
                nameLocation:'center',
                nameTextStyle:{
                  fontSize:16
                },
                nameGap:30
              },
              yAxis: [{
                name:'采食量:(kg)',
                nameLocation:'center',
                nameTextStyle:{
                  fontSize:16
                },
                nameGap:30
              },
                {
                  name:'温度:(℃)',
                  position:'right',
                  nameLocation:'center',
                  nameTextStyle:{
                    fontSize:16
                  },
                  nameGap:30
                }],
              color:['#e4393c'],
              series: [{
                name: '投料量',
                type: 'bar',
                data: this.food
              },
                {
                  name: '温度',
                  type: 'line',
                  data: this.tempre
                }]
            });
          }else {
            alert('您还没有入栏');
          }
        }).catch((err)=>{
            this.$emit('loadErrShow',true);
        })
      }
    }
  }

</script>
