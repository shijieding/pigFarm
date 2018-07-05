<template>
    <div class="myloader">
        <img src="../assets/img/loadingErr.png" style="width:10%;margin:0 auto;" alt="">
    </div>
</template>

<script>
    export default {
        data () {
            return {

            }
        },
        methods: {
            loaderr () {
                this.$emit('loadErrShow',false)
            }
        }
    }
</script>

<style scoped src="../assets/css/loading.css"></style>
<style>
    .myloader {
        width:100%;
        height:100%;
        position: fixed;
        left:0;
        top:0;
        z-index: 999;
        text-align: center;
        display:flex;
        align-items: center;
    }
    img {
        margin:0 auto;
    }
</style>
