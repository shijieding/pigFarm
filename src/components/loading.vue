<template>
    <div class="myloader">
        <!--<div class="loader loader1">-->
            <!--<div></div>-->
            <!--<div></div>-->
            <!--<div></div>-->
        <!--</div>-->
        <img src="../assets/img/loading.gif" style="width:70%;margin:0 auto;" alt="">
    </div>
</template>

<script>
    export default {
        name: "loading"
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
    }
    img {
        margin:0 auto;
    }
</style>
