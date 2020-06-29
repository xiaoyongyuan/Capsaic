import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import sys2 from "../../../style/ztt/imgs/manual/sys2.png";
import sys3 from "../../../style/ztt/imgs/manual/sys3.png";
import sys4 from "../../../style/ztt/imgs/manual/sys4.png";
class Grouping extends Component{
    render() {
        return(
            <div className="grouping">
                <div className="invasion-con">
                    1、分组管理页为用于分布式系统配置各节点 IP。
                </div>
                <img src={sys2} alt=""/>
                <div className="invasion-con">
                    2、单击“添加分组”在弹框内添加分组名称、IP（例如：分组名称：分组 1、
                    IP：192.168.1.100）
                </div>
                <img src={sys3} alt=""/>
                <div className="invasion-con">
                    3、单击“编辑/删除”可对该分组进行“编辑、删除”操作。
                </div>
                <img src={sys4} alt=""/>
            </div>
        )
    }
}
export default Grouping;