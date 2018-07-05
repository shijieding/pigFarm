<template>
    <div>
        <div v-if="hasFarm">
            <div class="box">
                <a href="javascript:;" @click="show">新建猪场</a>
            </div>
            <div class="farm-list-box">
                <router-link :to="{path:'farm/house',query:{farmId:f.farmId,creator:f.creator,farmName:f.farmName}}" class="farm-item left" v-for="f in farmList" tag="div">
                        <div>
                            <div class="key left">猪场名称:</div>
                            <div class="value left">{{f.farmName}}</div>
                        </div>
                        <div>
                            <div class="key left">猪场地址:</div>
                            <div class="value left">
                                {{f.farmProvince}}{{f.farmCity}}{{f.farmArea}}{{f.farmAddress}}{{f.farm}}
                            </div>
                        </div>
                        <div class="button-box">
                            <button @click.stop.prevent="amend(f)">修改</button>
                            <button @click.stop.prevent="deleteFarm(f)">删除</button>
                        </div>
                </router-link>
            </div>
        </div>
        <div v-if="!hasFarm">
            <div class="box">
                <a href="javascript:;" @click="show" :class="{noFarm:!hasFarm}">新建猪场</a>
            </div>
        </div>
        <transition name="fade">
            <div class="alert-box" v-if="isShowForm">
                <farm-form :farmDes="farmDes" @on-close="myCloseArea" @save="saveFarm"></farm-form>
            </div>
        </transition>
        <transition name="fade">
            <div class="alert" v-show="isAlert">
                <Alert @on-close="myCloseAlert">
                    <p slot="delete">你确定要删除该猪场的信息吗？</p>
                </Alert>
            </div>
        </transition>
    </div>

</template>
<style scoped>
    .box {
        margin:30px 45px;
        position:relative;
    }
    .box a {
        background-color: #ffc05f;
        padding:10px 15px;
        border-radius: 3px;
    }
    .box a.noFarm {
        position:absolute;
        top:300px;
        left:50%;
        background-color: #ffc05f;
        padding:10px 15px;
        border-radius: 3px;
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
    .farm-list-box {
        margin:0 14px;
        overflow: hidden;
    }
    .farm-item {
        width:280px;
        height:146px;
        border:1px dashed #ef8201;
        border-radius: 3px;
        margin:15px;
        padding:10px;
        position:relative;
        font-size: 1.1em;
        cursor:pointer;
    }
    .farm-item:hover {
        box-shadow: 0 0 3px #ef8201;
    }
    .key {
        width:30%;
    }
    .value {
        width:70%;
    }
    .farm-item>div {
        height:30px;
        line-height: 30px;
        margin:5px 0;
    }
    .farm-item>div.button-box {
        position:absolute;
        bottom: 0;
        right: 0;
        text-align: right;
    }
    button {
        border:none;
        background-color: transparent;
        margin:5px 5px 5px 20px;
        cursor:pointer;
        outline:none;
    }
    button:hover {
        box-shadow: 3px 3px 3px #ddd;
    }
</style>
<script type="es6">
    import FarmForm from '../components/farmForm.vue'
    import Alert from '../components/alert.vue'
    import Loading from '../components/loading'
    export default {
        data () { return {
            hasFarm:true,//是否有猪场
            farmList:[], // 猪场列表
            farmId:'', //猪场id  删除猪场
            farmDes:'',   //猪场信息
            isShowForm: false,//显示新增猪场表单
            isAlert: false,//显示删除对话框
            token:localStorage.getItem('token')
        }
        },
        components: {
            FarmForm,Alert,Loading
        },
        mounted () {
            this.getFarm();
        },
        methods: {
            show () {    //弹出新建猪场对话框
                this.isShowForm = !this.isShowForm;
                this.farmDes = '';
            },
            myCloseArea () {    //关闭猪场创建
                this.isShowForm = false;
            },
            tokenErr () {
              alert('登陆过期,请重新登陆');
              this.$router.push({path:'/log'});
            },
            saveFarm (json) {      //保存猪场创建
                //console.log(json);
                if(json[1]){     //新建猪场

                    this.axios.post('?token='+this.token,json[0]).then((msg)=>{
                        this.$emit('loadShow',false);
                        if(msg.data.code == 401){
                            _this.tokenErr();
                        }
                        if(msg.data.message == 'ok'){
                            this.getFarm();
                        }else {
                            alert(msg.data.message);
                        }
                    }).catch((err)=>{
                        this.$emit('loadErrShow',true);
                    });
                }else {    //修改猪场
                    //console.log('修改猪场');
                    this.$set(json[0],'farmId',this.farmId);
                    //console.log(json[0]);
                    this.axios.post('/update?token='+this.token,json[0]).then((msg)=>{
                        this.$emit('loadShow',false);
                        if(msg.data.code == 401){
                            _this.tokenErr();
                        }
                        if(msg.data.message == '成功'){
                            this.getFarm();
                        }else {
                            alert(msg.data.message);
                        }
                    }).catch((err)=>{
                        this.$emit('loadErrShow',true);
                    });
                    this.getFarm();
                }

                this.isShowForm = false;
            },
            myCloseAlert (bool) {     //删除猪场
                //console.log(bool);
                if(bool == true){
                    this.axios.post('/'+this.farmId+'/remove?token='+this.token).then((msg)=>{
                        this.$emit('loadShow',false);
                        if(msg.data.code == 401){
                            _this.tokenErr();
                        }
                        if(msg.data.message == '成功'){

                        }else {
                          alert(msg.data.message);
                        }
                        this.isAlert = false;
                        this.getFarm();
                    }).catch((err)=>{
                        this.$emit('loadErrShow',true);
                    });
                }else {
                    this.isAlert = false;
                }
            },
            deleteFarm (f) {    //弹出删除猪场对话框
                this.isAlert = true;
                this.farmId = f.farmId;
            },
            amend (f) {     //弹出修改猪场对话框
                this.isShowForm = true;
                this.farmDes = f;
                this.farmId = f.farmId;
            },
            getFarm () {
                this.$emit('loadShow',true);
              var _this = this;
                this.$nextTick(
                        function(){
                            _this.axios.get('/farm-list?token='+_this.token).then((msg) => {
                                this.$emit('loadShow',false);
                                if(msg.data.code == 401){
                                    _this.tokenErr();
                                }
                                if(msg.data.message == 'ok'){
                                    //console.log('重新加载');
                                  this.ifLoad = false;
                                    _this.hasFarm = true;
                                    _this.farmList = msg.data.result;
                                }else {
                                    _this.hasFarm = false;
                                }
                            }).catch(function (err) {
                                this.$emit('loadErrShow',true);
                            });
                        }
                );
            }
        }
    }

</script>
