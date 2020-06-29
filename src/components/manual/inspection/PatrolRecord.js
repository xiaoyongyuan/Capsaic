import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import patrol3 from "../../../style/ztt/imgs/manual/patrol3.png";
class PatrolRecord extends Component{
    render() {
        return(
            <div className="patrolRecord">
                <div className="invasion-con">
                    1、巡更记录页面为巡更人员所有巡更计划生成记录列表页，值班审核人员可通
                    过左侧图片来观察是否有异常。 如巡更没有异常可单击“通过”图标，巡更出现异常则单击“不通过”图标。
                </div>
                <img src={patrol3} alt=""/>
            </div>
        )
    }
}
export default PatrolRecord;