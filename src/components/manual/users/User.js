import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import user from "../../../style/ztt/imgs/manual/user.png";
import user2 from "../../../style/ztt/imgs/manual/user2.png";
import user3 from "../../../style/ztt/imgs/manual/user3.png";
import user4 from "../../../style/ztt/imgs/manual/user4.png";
class User extends Component{
    render() {
        return(
            <div className="user">
                <div className="invasion-con">
                    1、用户管理页显示现有用户列表。其中，账号为“admin”账户
                    为系统默认账户（请注意：此账户不能被编辑、删除、重置密码，如果忘记密码
                    请联系供应商），只有此账户可对别的账户进行新增、编辑、删除、重置密码等
                    操作，别的有“管理员”权限的账户只能对普通用户进行编辑，删除等操作（默
                    认管理员权限的账号可新增、查看所有设备，普通用户只能查看设备的相关信
                    息）。
                </div>
                <img src={user} alt=""/>
                <div className="invasion-con">
                    2、用户新增。<br/>
                    用户新增完成，初始密码为 888888
                    若需修改密码，可在页面上修改，修改完成后，可用新密码登录。
                    Admin 账户为最高权限，不可修改，不可编辑。
                </div>
                <img src={user2} alt=""/>
                <div className="invasion-con">
                    3、用户编辑。
                </div>
                <img src={user3} alt=""/>
                <div className="invasion-con">
                    3、用户删除。
                </div>
                <img src={user4} alt=""/>
            </div>
        )
    }
}
export default User;