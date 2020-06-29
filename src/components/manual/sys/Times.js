import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import sys5 from "../../../style/ztt/imgs/manual/sys5.png";
class Times extends Component{
    render() {
        return(
            <div className="times">
                <div className="invasion-con">
                    1、时间设置页为配置服务器系统时间，获取时间方式分为自动设置和手动设置。
                </div>
                <img src={sys5} alt=""/>
            </div>
        )
    }
}
export default Times;