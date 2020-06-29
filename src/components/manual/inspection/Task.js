import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import patrol5 from "../../../style/ztt/imgs/manual/patrol5.png";
import patrol6 from "../../../style/ztt/imgs/manual/patrol6.png";
class Task extends Component{
    render() {
        return(
            <div className="task">
                <div className="invasion-con">
                    1、点名任务页为重点保护对象进行定时的智能识别，查看重点保护对象是否存在。
                </div>
                <img src={patrol5} alt=""/>
                <img src={patrol6} alt=""/>
            </div>
        )
    }
}
export default Task;