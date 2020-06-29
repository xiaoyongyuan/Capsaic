import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import sys from "../../../style/ztt/imgs/manual/sys.png";
class SysAll extends Component{
    render() {
        return(
            <div className="sysAll">
                <div className="invasion-con">
                    1、系统概览页为获取当前服务器 CPU、物理内存、磁盘空间状态。
                </div>
                <img src={sys} alt=""/>
            </div>
        )
    }
}
export default SysAll;