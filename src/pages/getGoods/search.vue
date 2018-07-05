<template>
    <div>
      <!--<Loading v-show="ifLoad"></Loading>-->
      <div class="search">
        <input type="text" class="search" v-model="searchKey"/><span class="search"></span>
      </div>
    </div>
</template>

<script>
  import $axios from 'axios'
  import Loading from '../../components/loading'
  export default {
        name: "search",
      data () {
          return {
            ifLoad:true,
            searchKey:'',
            farmId:'',
            pList:[],
            token:localStorage.getItem('token')
          }
      },
      props:['vid'],
      mounted () {
        // Vue.prototype.$http = $axios;
        // console.log('token+++'+this.$http.defaults.headers.token);
        this.farmId = localStorage.getItem('farmId');
      },
    watch:{
      searchKey () {
          this.$emit('loadShow',true);
        $axios.get(
          'http://wqs.znswsse.com/store/stuff.search?farm='+this.farmId+'&vid='+this.vid+"&name="+this.searchKey+'&token='+this.token
        ).then((msg)=>{
            this.$emit('loadShow',false);
            if(msg.data.code == 401){
                this.tokenErr();
            }
          if(msg.data.code == 200){
            this.pList = msg.data.result;
            console.log(this.pList)
            this.$emit('sea',this.pList);
          }else {
            alert('token过期，请重新登陆');
            this.$router.push('/');
          }
        }).catch(err=>{
            this.$emit('loadErrShow',true);
        })
      }
    },
      methods:{
          tokenErr () {
              alert('登陆过期,请重新登陆');
              this.$router.push({path:'/log'});
          }
      }
    }
</script>

<style scoped>
  .list {
    background-color: #fff;
    margin-top: 30px;
  }
  .list li.title {
    border-bottom: 1px solid #cccccc;
    height:50px;
    line-height: 50px;
  }
  .list li {
    height:40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid #DDDDDD;
  }
  .list li>div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .w25 {
    width:25%;
  }
  .w20 {
    width:20%;
  }
  .w16 {
    width:16.6%;
  }
  span.search {
    float:right;
    width:50px;
    line-height: 40px;
    height: 40px;
    border-left: 1px solid #ef8201;
    background:#fff url('../../assets/img/search1.png');
  }
  div.search {
    border:2px solid #ef8201;
    width:400px;
    height:40px;
    line-height: 40px;
    margin:10px auto;
  }
  input.search {
    border:none;
    width:330px;
    height:40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 16px;
    background-color: transparent;
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
    background: url("../../assets/img/checkbox.png") no-repeat center center;
    background-size: 100% 100%;
  }
  div.input_box {
    width:50%;
    float:left;
    margin-bottom: 20px;
  }
  span.input_name {
    font-size: 16px;
    width:80px;
    float:left;
    height:30px;
    line-height: 30px;
  }
  div.form {
    position:relative;
    min-height: 300px;
    padding-bottom: 100px;
  }
  .btn_box {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .btn {
    padding:5px 10px;
    border:1px solid #b0b0b0;
    cursor:pointer;
    border-radius: 3px;
    font-size: 16px;
    background-color: #eeeeee;
  }
  select {
    height:30px;
    line-height: 30px;
    padding:0 10px;
    width:183px;
    font-size: 16px;
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    border:1px solid #b0b0b0;
    background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
    padding-right: 14px;
  }
  select::-ms-expand { display: none; }
  option {
    height:30px;
    line-height: 30px;
  }
  input {
    height:30px;
    line-height: 30px;
    padding-left: 10px;
  }
  div.title {
    border-bottom: 1px solid #ecb802;
    height: 40px;
    margin-top: 15px;
  }
  div.title>div {
    cursor:pointer;
    width:100px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    padding:0 10px;
    margin:0 20px;
    border:1px solid #ecb802;
    background-color: #ffe288;
    transform:translatey(-1px);
    font-size: 16px;
    letter-spacing: 3px;
  }
  div.title>div.cur {
    border-bottom: 1px solid #f0f0f0;
    background-color: #f0f0f0;
  }
  ul.nav {
    overflow: hidden;
    margin:30px 0;
    padding-left: 20px;
  }
  .nav li {
    width:100px;
    height:30px;
    line-height: 30px;
    text-align: center;
    margin-right: 60px;
    background-color: #d0d0d0;
    cursor: pointer;
  }
  .nav li.cur {
    background-color: #ef8201;
  }

</style>
