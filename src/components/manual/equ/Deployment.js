import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import Equ6 from "../../../style/ztt/imgs/manual/equ6.png";
import Equ7 from "../../../style/ztt/imgs/manual/equ7.png";
import Equ8 from "../../../style/ztt/imgs/manual/equ8.png";
class Deployment extends Component{
    render() {
        return(
            <div className="deployment">
                <div className="invasion-con">
                    1、设防时间 - 摄像头在设置时间内进行报警，鼠标单击移动至需要设防的时
                    间段，单击“保存并应用”，单击“清除全部”即可对所有设防时间进行清除操
                    作。
                </div>
                <img src={Equ6} alt=""/>
                <div className="invasion-con">
                    2、单击时间轴后面的红色设置按钮弹出弹框，将你设置好的时间段复制到你要
                    复制的时间（例如：星期二）单击勾选（也可勾选“全选”），单击“确定”按
                    钮。
                </div>
                <img src={Equ7} alt=""/>
                <div className="invasion-con">
                    3、单击勾选红色框内“删除布防时间”删除相应日期的布防时间例如：星期二。
                </div>
                <img src={Equ8} alt=""/>
            </div>
        )
    }
}
export default Deployment;