import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import key from "../../../style/ztt/imgs/manual/key.png";
import key2 from "../../../style/ztt/imgs/manual/key2.png";
import key3 from "../../../style/ztt/imgs/manual/key3.png";
import key4 from "../../../style/ztt/imgs/manual/key4.png";
import key5 from "../../../style/ztt/imgs/manual/key5.png";
class KeyPerson extends Component{
    render() {
        return(
            <div className="keyPerson">
                <div className="invasion-con">
                    1、重点人员列表页显示基本信息、姓名、性别、身份证号、类型。
                </div>
                <img src={key} alt=""/>
                <div className="invasion-con">
                    2、单击“添加”按钮弹出弹框填
                    写相应信息单击“确定”保存安保人员信息，单击“编辑/删除”图标可对安保人员
                    进行编辑、删除操作。可使用人员名称、身份证号进行查询。
                </div>
                <img src={key2} alt=""/>
                <img src={key3} alt=""/>
                <img src={key4} alt=""/>
                <img src={key5} alt=""/>
            </div>
        )
    }
}
export default KeyPerson;