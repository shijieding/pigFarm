<template>
    <div class="farm-form">
        <h2 class="textcenter">新建猪场</h2>
        <p class="close" @click="closeMyself">x</p>
        <div class="f-form">
            <div class="f-form-line">
                <span class="f-form-label left">猪场名称：</span>
                <div class="f-form-input right">
                    <input type="text" v-model="farmName" placeholder="请输入猪场名称">
                </div>
            </div>
            <div class="f-form-line">
                <span class="f-form-label left">所属地区：</span>
                <div class="f-form-input right">
                    <input @click.stop="isShow" v-model="areas.join('')" type="text" placeholder="点击输入框选择地区">
                </div>
            </div>
            <div class="addr" v-show="showArea">
                <myAddress @has-province="getProvince" @has-city="getCity" @has-area="getArea"></myAddress>
            </div>
            <div class="f-form-line">
                <span class="f-form-label left">详细地址：</span>
                <div class="f-form-input right">
                    <input type="text" v-model="detailAddr" placeholder="详细地址">
                </div>
            </div>
            <div class="f-form-line">
                <button class="btn textcenter right" @click="goFarmList">保存</button>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    import { eventBus } from '../eventBus.js'
import myAddress from '../components/address'
export default {
    data () {
        return {
            showArea:false,  //是否显示地址列表
            isAdd:true,   //是否是新建
            province:'',  //省名
            provinceId:'',  //省编码
            city:'',  // 市名
            cityId:'',  //市编码
            area:'',  // 区域名
            areaId:'',  //区域编码
            farmName:'',  //猪场名字
            areas:[], //省市区 所属地区
            detailAddr:'' //详细地址
        }
    },
    props:['farmDes'],
    components: {
        myAddress
    },
    mounted () {
        eventBus.$on('reset-component',() => {
            this.showArea = false;
        });
        this.$nextTick(function () {
            //console.log(this.farmDes);
            if(this.farmDes){
                this.isAdd = false;
                this.getFarm();
            }else {
                this.isAdd = true;
            }
        })
    },
    methods:{
        getProvince (p) {
            this.province = p.area;
            this.provinceId = p.code;
            this.areas.splice(0,3);
            this.areas.push(this.province);
        },
        getCity (c) {
            this.city = c.area;
            this.cityId = c.code;
            this.areas.splice(1,2);
            this.areas.push(this.city);
        },
        getArea (a) {
            this.area = a.area;
            this.areaId = a.code;
            this.areas.splice(2,1);
            this.areas.push(this.area);
            this.showArea = false;
        },
        isShow () {
            this.showArea = !this.showArea;
        },
        goFarmList () {
          if(this.farmName){
            var json = {creator:103,farmAddress:this.detailAddr,farmArea:this.area,farmCity:this.city,farmName:this.farmName,farmProvince:this.province};
            this.$emit('save',[json,this.isAdd]);
            this.clearFarm();
          }else {
            alert('猪场名字不能为空');
          }
        },
        closeMyself () {
            this.$emit('on-close');
            this.clearFarm();
        },
        clearFarm () {
            this.farmName = '';
            this.areas = [];
            this.detailAddr = '';
        },
        getFarm () {
            this.farmName = this.farmDes.farmName;
            this.province = this.farmDes.farmProvince;
            this.city = this.farmDes.farmCity;
            this.area = this.farmDes.farmArea;
            this.areas = [this.farmDes.farmProvince,this.farmDes.farmCity,this.farmDes.farmArea];
            this.detailAddr = this.farmDes.farmAddress;
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    div.farm-form {
        width:684px;
        height:380px;
        background-color: #fff;
        margin:280px auto;
        padding:5px;
        border-radius: 10px;
        position:relative;
    }
    h2 {
        line-height: 60px;
        font-size: 1.4em;
    }
    .f-form-line {
        margin:20px auto;
        height:48px;
        line-height: 48px;
    }
    .f-form-label {
        font-size: 1.2em;
        text-align: right;
    }
    .left {
        width:30%;
    }
    .right {
        width:70%;
    }
    input {
        width:350px;
        height:46px;
        border:1px solid #b6b6b6;
        border-radius: 3px;
        font-size: 1.2em;
        padding-left: 1em;
    }
    .btn {
        width:90px;
        height:46px;
        background-color: #e5e5e5;
        margin-right: 30px;
        margin-top: 30px;
        border:1px solid #b6b6b6;
        border-radius: 5px;
        cursor:pointer;
    }
    .addr {
        margin-top:-20px;
        margin-left: 205px;
        position:absolute;
        width:367px;
        height:188px;
        border:1px solid #b6b6b6;
        background-color: #f7f7f7;
    }
    p.close {
        position:absolute;
        right:10px;
        top:5px;
        font-size: 1.5em;
        cursor:pointer;
    }
</style>
