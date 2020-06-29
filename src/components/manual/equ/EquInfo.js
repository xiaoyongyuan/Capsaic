import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import Equ from "../../../style/ztt/imgs/manual/equ.png";
import Equ2 from "../../../style/ztt/imgs/manual/equ2.png";
class EquInfo extends Component{
    render() {
        return(
            <div className="equinfo">
                <div className="invasion-con">
                    1、设备页为系统所有绑定与未绑定设备列表页。
                </div>
                <img src={Equ} alt=""/>
                <div className="invasion-con">
                    2、配置 - 在对应的框内输入相应的设备信息，单击“确定”摄像头添加成功
                </div>
                <img src={Equ2} alt=""/>
            </div>
        )
    }
}
export default EquInfo;