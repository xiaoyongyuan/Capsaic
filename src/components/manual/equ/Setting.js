import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import Equ3 from "../../../style/ztt/imgs/manual/equ3.png";
class Setting extends Component{
    render() {
        return(
            <div className="setting">
                <div className="invasion-con">
                    1、防区设置 - 摄像头信息添加成功后单击切换到“防区设置”获取摄像头底
                    图，选择其中一个防区，单击“添加”左侧图片出现防区，鼠标拖动防区放至图
                    中需要设防的位置单击“提交”按钮。
                </div>
                <img src={Equ3} alt=""/>
            </div>
        )
    }
}
export default Setting;