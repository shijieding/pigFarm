<template>
  <div class="logBack">
    <Loading v-show="ifLoad"></Loading>
    <div class="cen">
      <h1 @click="getToken">
        微信登陆
      </h1>
      <div class="img">
        <qrcode :value="qrValue" :options="{ size: 280 }"></qrcode>
      </div>
      <div class="msg">
        <div class="info">
          <div v-show="defalutQr">
            <p>请使用微信扫描</p>
            <p>二维码登陆</p>
          </div>
          <div v-show="waitQr">
            <i class="log succ"></i>
            <div class="status_txt">
              <h4>扫描成功</h4>
              <p>请在微信中点击确认即可登录</p>
            </div>
          </div>
          <div v-show="clickFalse">
            <i class="log err"></i>
            <div class="status_txt">
              <h4>您已取消本次登陆</h4>
              <p>您可再次扫描登陆，或关闭窗口</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import qrcode from '@xkeshi/vue-qrcode'
  import Loading from '../components/loading'
  export default {
    data () {
      return {
        ifLoad:true,
        defalutQr:true,  //刚加载页面的状态
        waitQr:false,     //扫描后
        clickTrue:false,      //点击确认
        clickFalse:false,     //点击取消
        rignardToken:false,     //过期
        qrValue:'',
        qrToken:'',
        d:'',
        token:''
      }
    },
    components:{
      qrcode,Loading
    },
    created () {
      this.getData();
    },
    methods:{
      getData () {
        this.axios.get('http://wqs.znswsse.com/fg/chat/wxchat/pc/qrcode/show').then((msg)=>{
          if(msg.data.message == 'ok'){
            this.ifLoad = false;
            this.qrValue = msg.data.result.url;
            this.qrToken = msg.data.result.key;
            this.d = window.setInterval(this.getToken,1000);
          }else {
            alert(msg.data.message);
          }
        }).catch((err)=>{

        });
      },
      getToken () {
        // this.$router.push('/farmList');
        this.axios.get('http://wqs.znswsse.com/fg/chat/wxchat/pc/qrcode/check?qrcode_token='+this.qrToken).then(msg=>{
          var n = 201;
          n = msg.data.code;
          switch(n){
            case 201:
              this.defalutQr = true;
              this.clickFalse = false;
              this.waitQr = false;
              break;
            case 202:
              this.waitQr = true;
              this.defalutQr = false;
              this.clickFalse = false;
              break;
            case 206:
              this.clickFalse = true;
              this.waitQr = false;
              this.defalutQr = false;
              break;
            case 203:
              this.token = msg.data.result;
              localStorage.setItem('token',this.token);
                window.clearInterval(this.d);
              setTimeout(()=>{
                this.$router.push('/farmList');
              },500);
              break;
            case 208:
              this.$router.go(0);
              return;
          }
        }).catch(err=>{

        })
      }
    }
  }
</script>

<style scoped>
  .logBack {
    background-color: #515151;
    position:fixed;
    left:0;
    top:0;
    bottom:0;
    right:0;
    height:100%;
    width:100%;
    color:#fff;
  }
  .cen {
    width:500px;
    margin:0 auto;
    text-align: center;
  }
  .cen h1 {
    font-size: 18px;
    padding-top: 50px;
    line-height: 30px;
  }
  div.img {
    width:300px;
    height:300px;
    margin:0 auto;
    margin-top: 15px;
  }
  div.msg {
    width:280px;
    margin:0 auto;
    height:54px;
  }
  div.info {
    height:54px;
    background-color: #232323;
    margin-top: 15px;
    box-sizing: border-box;
    -webkit-box-shadow: inset 0 5px 10px -5px #191919,0 1px 0 0 #444;
    -moz-box-shadow: inset 0 5px 10px -5px #191919,0 1px 0 0 #444;
    box-shadow: inset 0 5px 10px -5px #191919,0 1px 0 0 #444;
    border-radius: 100px;
    padding:7px 14px;
  }
  div.info p {
    font-size: 13px;
    font-weight: 400;
    line-height: 1.7;
  }
  div.info h4 {
    font-size: 16px;
  }
  i.log {
    display: inline-block;
    width:38px;
    height:38px;
    margin-right: 5px;
    vertical-align: middle;
  }
  i.succ {
    background:url("../assets/img/log.png") 0 -46px no-repeat;
  }
  i.err {
    background:url("../assets/img/log.png") 0 -87px no-repeat;
  }
  div.status_txt {
    display: inline-block;
    vertical-align: middle;
  }
</style>
