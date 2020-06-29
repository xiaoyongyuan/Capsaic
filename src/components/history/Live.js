import React, { Component } from 'react';
import flash from "../../style/ztt/imgs/flash.png";
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
var ActiveXObject=window.ActiveXObject;
class Live extends Component {
  /*  componentWillReceiveProps(nextProps) {
        if (nextProps.datachange == "urlchange") {
           this.openVideo(nextProps.eid);
        }
    }
    openVideo=(eid)=>{
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = window.flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            autoplay: true,
            hasAudio: false,
            hasVideo: true,
            autoDisable: true,
            enableStashBuffer: true,
            url:eid
            //url:'http://47.94.252.115:8080/live?port=1935&app=live&stream=test'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    };*/
    // componentDidMount() {
    componentWillReceiveProps(nextProps) {
        if (nextProps.datachange == "urlchange") {
            if(this.player){
               this.player.reset();
                this.player.src({
                    src: nextProps.eid,
                    type: 'rtmp/flv'
                });
                this.player.load();
                this.player.play();
               console.log(nextProps.eid)
            }else {
                this.openVideo(nextProps.eid);
            }
        }
    }
    openVideo=(eid)=> {
        //判断浏览器是否有flash插件
        this.props.resetDatachange()
        var isIE = false;
        let _this=this;
        if (window.ActiveXObject) {
            isIE = true;
        }
        var has_flash = false;
        try {
            if (isIE) {
                var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                has_flash = true;
            } else {
                var flash = navigator.plugins["Shockwave Flash"];
                if (flash) {
                    has_flash = true;
                }
            }
        } catch (e) {
            console.log(e);
        }
        if (has_flash) {
            videojs.options.flash.swf = require('videojs-swf/dist/video-js.swf');
            this.player = videojs('myvideo', {
                preload: 'auto',// 预加载
                bigPlayButton: {},// 大按钮
                controls: true,// 是否开启控制栏
                width: 800,// 播放器宽度
                height: 600,// 播放器高度
                playbackRates: [1, 1.5, 2],
                muted: true, //是否循环播放
                loop: true, //是否静音
                autoplay: true, //是否自动播放
            }, function onPlayerReady() {
                this.src({
                    src: eid,
                    type: 'rtmp/flv'
                });
                _this.player.load();
                _this.player.play();
            });
        } else {
            this.player = videojs('myvideo', {
                preload: 'none',// 预加载
                width: 800,// 播放器宽度
                height: 600,// 播放器高度
                playbackRates: [1, 1.5, 2],
            });
        }
    };
    componentWillUnmount() {
        this.player.dispose();
    }
    render() {
        return (
            <div>
                <div data-vjs-player>
                    <video ref={ node => this.videoNode = node } className="video-js" id="myvideo" poster={flash}></video>
                </div>
            </div>
        );
    }
}
export default Live;
