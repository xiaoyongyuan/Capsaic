import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import patrol from "../../../style/ztt/imgs/manual/patrol.png";
import patrol2 from "../../../style/ztt/imgs/manual/patrol2.png";
class PatrolPlan extends Component{
    render() {
        return(
            <div className="patrolPlan">
                <div className="invasion-con">
                    1、巡更计划页为安保人员巡更计划列表页，单击“添加”按钮选择时间段添加
                    巡更计划（巡更计划最多可增加六个），单击“生成巡更计划”可将该页面所有
                    巡更计划同步到巡更记录页。
                </div>
                <img src={patrol} alt=""/>
                <img src={patrol2} alt=""/>
            </div>
        )
    }
}
export default PatrolPlan;