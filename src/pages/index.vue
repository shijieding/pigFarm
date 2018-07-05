<template>
    <div class="html" @click="resetComponent">
      <div class="body">
            <div class="header">
              <router-link class="left" to="/farmList">
                我的猪场
              </router-link>
              <div class="right">
                <div class="nav-top">
                  <span class="">用户名称</span>
                  <span class="">用户管理</span>
                </div>
              </div>
            </div>
            <div class="container">
              <router-view v-on:loadShow="loadShow" v-on:loadErrShow="loadErrShow"></router-view>
            </div>
        </div>
        <Load v-show="loading"></Load>
        <LoadErr v-show="loaderr" v-on:loadErrShow="loadErrShow"></LoadErr>
    </div>
</template>

<script type="es6">
    import { eventBus } from '../eventBus.js'
    import Load from '../components/loading'
    import LoadErr from '../components/loadingErr'
    export default {
      data () {
        return {
            loading:false,
            loaderr:false
        }
      },
        components:{
          Load,LoadErr
        },
      mounted () {

      },
      methods:{
        resetComponent () {
            eventBus.$emit('reset-component');
        },
          loadShow (bool) {
            if(bool){
                this.loading = true;
            }else {
                this.loading = false;
            }
          },
          loadErrShow (bool) {
            if(bool){
                this.loaderr = true;
            }else {
                this.loaderr = false;
                this.$router.go(0);
            }
          }
      }
    }

</script>
<style>
    .html {
        height:100%;
    }
    .body {
        width:1024px;
        margin:0 auto;
        height:100%;
        display:flex;
        padding-bottom: 20px;
        box-sizing: border-box;
        flex-flow: column;
    }
    .container {
        flex:1;
        height:100%;
        display:flex;
        flex-flow: column;
    }
    body,html {
        height:100%;
    }
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 12px;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
        background-color: #f0f0f0;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    button,input {
        outline:none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
    body {
        font-family: "Microsoft YaHei","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
        font-size: 14px;
        color: #444;
    }
    .left {
        float:left;
    }
    .right {
        float:right;
    }
    .textcenter {
        text-align: center;
    }
    #app {
        width:1024px;
    }


    .header {
        height:46px;
        line-height: 46px;
        padding:0 45px;
        background-color: #ef8201;
        color:#fff;
        font-size: 1.1em;
    }
    .header .left {
        width:30%;
    }
    .header .right {
        width:70%;
    }
    .right div.nav-top {
        text-align: right;
    }
    .right div.nav-top span {
        margin-left: 60px;
    }

    /*过渡动画*/
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
        opacity: 0
    }
    .slide-enter-active {
        transition: all .3s;
        position:relative;
        z-index: -99;
    }
    .slide-leave-active {
        transition: all .3s;
        position:relative;
        z-index: -99;
    }
    .slide-enter, .slide-leave-to {
        transform: translateY(-50px);
        position:relative;
        z-index: -99;
    }
    input[type=number] {
        -moz-appearance:textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
