import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import security from "../../../style/ztt/imgs/manual/security.png";
import security2 from "../../../style/ztt/imgs/manual/security2.png";
class Personnel extends Component{
    render() {
        return (
            <div className="personnel">
                <div className="invasion-con">
                    1、安保人员页为所有安保人员列表页，单击“添加安保人员”按钮弹出弹框填
                    写相应信息单击“确定”保存安保人员信息，单击“编辑/删除”可对安保人员
                    进行编辑、删除操作。
                </div>
                <img src={security} alt=""/>
                <img src={security2} alt=""/>
            </div>
        )
    }
}
export default Personnel;
