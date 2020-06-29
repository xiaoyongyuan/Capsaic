import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import Equ4 from "../../../style/ztt/imgs/manual/equ4.png";
import Equ5 from "../../../style/ztt/imgs/manual/equ5.png";
class FalseSetting extends Component{
    render() {
        return(
            <div className="falseSetting">
                <div className="invasion-con">
                    1、误报设置 - 摄像头获取底图后在底图添加误报设置可将绘制区域无法进行
                    算法识别。<br/>
                    误报添加：在左侧图片上，鼠标点击并移动绘制误报对象区域，形成矩形后
                    点击右下方"误报添加"按钮即可添加成功。<br/>
                    误报删除：直接点击右下方"误报删除"按钮，即可删除左边图片上所有的误
                    报对象区域。<br/>
                    清除画布：当左边图片上无暂未提交的误报对象区域（黄色线条区域）时，
                    “清除画布”按钮不可点击；点击“清除画布”按钮后会清除当前左边图片上暂
                    未提交的误报对象区域，不会清除已提交的误报对象区域。
                </div>
                <img src={Equ4} alt=""/>
                <img src={Equ5} alt=""/>
            </div>
        )
    }
}
export default FalseSetting;