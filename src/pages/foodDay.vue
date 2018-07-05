<template>
  <div>
    <h1 style="text-align: right;height:24px;line-height: 24px;font-size: 16px">采食总量：{{allFood}}kg</h1>
    <div id="main" style="width: 800px;height:600px;"></div>
  </div>
</template>
<style>

</style>
<script type="es6">
  import Vue from 'vue'
import echarts from 'echarts'
  import port from '../data_json/port.vue'
  Vue.prototype.$echarts = echarts;

  export default {
    data () {
      return {
        allFood:0,
        day:[],
        food:[],
        myChart:'',
        token:localStorage.getItem('token')
      }
    },
    mounted(){
      this.myChart = this.$echarts.init(document.getElementById('main'));
      this.myChart.showLoading();
      this.getData();
    },
    methods: {
      tokenErr () {
        alert('登陆过期,请重新登陆');
        this.$router.push({path:'/log'});
      },
      getData () {
        var json = {
          device:this.$route.query.device,
          inDate:this.$route.query.indate
          /*device:10000141,
          inDate:"2017-09-01"*/
        };
        //console.log(json);
          this.$emit('loadShow',true);
        this.axios.post('/field/scope-food?token='+this.token,json).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          //console.log(msg);
          if(msg.data.message == '成功'){
            var data = msg.data.result.everydayfoodlist;
            for(var i=0;i<data.length;i++){
              this.day.push(data[i].currentday);
              this.food.push(data[i].fooddata);
            }
            //console.log(this.day);
            this.allFood = msg.data.result.allfooddata;
            // 绘制图表
            this.myChart.hideLoading();
            this.myChart.setOption({
              title: { text: '采食情况' },
              tooltip: {},
              xAxis: {
                data: this.day,
                name:'入栏天数',
                nameLocation:'center',
                nameTextStyle:{
                  fontSize:16
                },
                nameGap:30
              },
              yAxis: {
                name:'采食量:(kg)',
                nameLocation:'center',
                nameTextStyle:{
                  fontSize:16
                },
                nameGap:30
              },
              color:['#e4393c'],
              series: [{
                name: '采食量',
                type: 'bar',
                data: this.food
              }]
            });
          }else {
            alert('您还没有入栏信息');

          }
        }).catch((err)=>{
          //console.log(err);
            this.$emit('loadErrShow',true);
        })
      }
    }
  }

</script>
