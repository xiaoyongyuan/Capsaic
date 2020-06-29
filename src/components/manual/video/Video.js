import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import video from "../../../style/ztt/imgs/manual/video.png";
import video2 from "../../../style/ztt/imgs/manual/video2.png";
class Video extends Component{
    render() {
        return(
            <div className="video">
                <div className="invasion-con">
                    1、实时视频页面实时查看每个设备的实时画面。
                </div>
                <img src={video} alt=""/>
                <div className="invasion-con">
                    2、播放需要加载 flash 插件，加载过后即可观看，若加载后无法观看，请下载
                    最新浏览器客户端。
                </div>
                <img src={video2} alt=""/>
            </div>
        )
    }
}
export default Video;