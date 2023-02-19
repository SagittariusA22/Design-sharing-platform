<template>
    <div class="show-imgs-container" @mouseover="isIn = true" @mouseout="isIn = false">
        <el-carousel
            :interval="cutTime"
            arrow="always"
            :autoplay="autoplay"
            trigger="click"
            :indicator-position="autoplay?'':'none'"
            @change="getIndex">
            <el-carousel-item v-for="(item,index) in videos" :key="index">
                <!--视频播放器 -->
                <video :ref="'videoPlayer' + index" :controls="isIn">
                    <source :src="item.src" type="video/mp4">
                    您的浏览器不支持Video标签。
                </video>
                <i v-show="!isPlay" class="play-btn el-icon-video-play" @click="playVideo"></i>
                <i v-show="isPlay && isIn" class="play-btn el-icon-video-pause" @click="pauseVideo"></i>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
<script>
import {videoPlayer} from "vue-video-player";
import "video.js/dist/video-js.css";
import "videojs-flash";

export default {
    components: {videoPlayer},
    props: {
        title: {//模块标题
            type: String,
            default: ""
        }
    },
    data() {
        return {
            autoplay: true,//是否自动切换
            isPlay:false,//播放状态
            isIn:false,//鼠标是否位于播放器内
            cutTime:5000,//轮播时间，单位毫秒
            nowIndex: 0,
            videos:[
                {
                    src:"https://www.runoob.com/try/demo_source/mov_bbb.mp4"
                },
                {
                    src:"https://www.runoob.com/try/demo_source/mov_bbb.mp4"
                },
                {
                    src:"https://www.runoob.com/try/demo_source/mov_bbb.mp4"
                },
            ]
        }
    },
    mounted() {
        //初始监听第一个视频
        this.listenVideo();
    },
    methods: {
        //获取走马灯的索引
        getIndex(nowIndex, oldIndex){
            //用户可能在上个视频未播放完毕就切换
            //此时需要暂停上个视频并把时间归零，否则影响对当前视频的监听逻辑
            let myVideo = this.$refs['videoPlayer' + oldIndex];
            myVideo[0].pause();
            myVideo[0].currentTime = 0;
            this.nowIndex = nowIndex;
            this.listenVideo();
        },
        //监听视频的播放、暂停、播放完毕等事件
        listenVideo(){
            //注意：这样获取的dom是一个数组，必须加上[0]索引才能正确的添加事件
            let myVideo = this.$refs['videoPlayer' + this.nowIndex];
            //监听播放
            myVideo[0].addEventListener("play",()=>{
                this.autoplay = false;
                this.isPlay = true;
            });
            //监听暂停
            myVideo[0].addEventListener("pause",()=>{
                this.autoplay = true;
                this.isPlay = false;
            });
            //监听播放完毕
            myVideo[0].addEventListener("ended",()=>{
                //时间归零
                myVideo[0].currentTime = 0;
                this.autoplay = true;
                this.isPlay = false;
            });
        },
        // 播放视频
        playVideo(){
            //注意：这样获取的dom是一个数组，必须加上[0]索引才能正确的添加事件
            let myVideo = this.$refs['videoPlayer' + this.nowIndex];
            myVideo[0].play();
        },
        //暂停视频
        pauseVideo(){
            //注意：这样获取的dom是一个数组，必须加上[0]索引才能正确的添加事件
            let myVideo = this.$refs['videoPlayer' + this.nowIndex];
            myVideo[0].pause();
        },
    },
}
</script>
<style lang="less">
.show-imgs-container {
    height: 100%;

    .el-carousel {
        width: 100%;
        height: 100%;
    }

    .el-carousel__container {
        width: 100%;
        height: 100%;
    }

    .el-carousel__item {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        video {
            width:100%;
            height:100%;
            position: fixed;
            display: inline-block;
            vertical-align: baseline;
            object-fit: fill; //消除留白
        }
        .play-btn{
            font-size: 60px;
            color: #fff;
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            &:hover{
                cursor: pointer;
            }
        }
    }
}
</style>