import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import sys6 from "../../../style/ztt/imgs/manual/sys6.png";
class Bin extends Component{
    render() {
        return(
            <div className="bin">
                <div className="invasion-con">
                    1、回收站页面为该系统所删除摄像头配置信息在回收站显示，
                    删除摄像头 7 天后自动清除，删除摄像头 7 天内可在回收站单击“恢复”可该恢
                    复摄像头配置信息。
                </div>
                <img src={sys6} alt=""/>
            </div>
        )
    }
}
export default Bin;