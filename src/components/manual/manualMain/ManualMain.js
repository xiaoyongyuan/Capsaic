import React, {Component} from "react";
import {Menu} from "antd";
import "./manualMain.less";
import { HashRouter as Router,Route,Switch ,Redirect,Link} from 'react-router-dom';
import Invasion from "../device/Invasion";
import Statistics from "../device/Statistics";
import EquInfo from "../equ/EquInfo";
import Setting from "../equ/Setting";
import FalseSetting from "../equ/FalseSetting";
import Deployment from "../equ/Deployment";
import SysAll from "../sys/SysAll";
import Grouping from "../sys/Grouping";
import Times from "../sys/Times";
import Bin from "../sys/Bin";
import Record from "../record/Record";
import Video from "../video/Video";
import KeyPerson from "../device/KeyPerson";
import Face from "../device/Face";
import PatrolRecord from "../inspection/PatrolRecord";
import PatrolPlan from "../inspection/PatrolPlan";
import History from "../inspection/History";
import Task from "../inspection/Task";
import User from "../users/User";
import Personnel from "../users/Personnel";
import Scheduling from "../users/Scheduling";
const {SubMenu} = Menu;
class ManualMain extends Component {

    render() {
        return (
            <div className="manualMain">
                <div className="manualTitle">
                    <span>联机帮助</span>
                    <a onClick={()=>{window.location.href ="/#/main/police/policeInformation"}} className="next">上一步</a>
                </div>
                <div className="manuaContext">
                    <div className="manualMenu">
                    <Menu
                        defaultSelectedKeys={['/manual/equ/enclosure']}
                        defaultOpenKeys={['/manual/equ']}
                        mode="inline"
                        theme="dark"
                                >
                                <SubMenu
                                    key="/manual/equ"
                                    title="设备管理"
                                >
                                    <Menu.Item key="/manual/equ/enclosure"><Link to="/manual/equ/enclosure">围界入侵</Link></Menu.Item>
                                    <Menu.Item key="/manual/equ/statistics"><Link to="/manual/equ/statistics">围界入侵统计</Link></Menu.Item>
                                    <SubMenu
                                        key="/manual/face"
                                        title="人脸检测"
                                    >
                                <Menu.Item key="/manual/face/key"><Link to="/manual/face/key">重点人员</Link></Menu.Item>
                                <Menu.Item key="/manual/face/warning"><Link to="/manual/face/warning">人脸预警</Link></Menu.Item>
                            </SubMenu>
                        </SubMenu>
                        <Menu.Item key="/manual/timeVideo">
                            <span><Link to="/manual/timeVideo">实时视频</Link></span>
                        </Menu.Item>
                        <SubMenu
                            key="/manual/device"
                            title="设备管理"
                        >
                            <Menu.Item key="/manual/device/info"><Link to="/manual/device/info">基本信息</Link></Menu.Item>
                            <Menu.Item key="/manual/device/setting"><Link to="/manual/device/setting">防区设置</Link></Menu.Item>
                            <Menu.Item key="/manual/device/falseSetting"><Link to="/manual/device/falseSetting">误报设置</Link></Menu.Item>
                            <Menu.Item key="/manual/device/deployment"><Link to="/manual/device/deployment">布防时间</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="/manual/users"
                            title="人员管理"
                        >
                            <Menu.Item key="/manual/users/administration"><Link to="/manual/users/administration">用户管理</Link></Menu.Item>
                            <SubMenu
                                key="/manual/security"
                                title="安保管理"
                            >
                                <Menu.Item key="/manual/security/personnel"><Link to="/manual/security/personnel">安保人员信息</Link></Menu.Item>
                                <Menu.Item key="/manual/security/scheduling"><Link to="/manual/security/scheduling">安保排班</Link></Menu.Item>
                            </SubMenu>
                        </SubMenu>
                        <SubMenu
                            key="/cultural"
                            title="文保巡检"
                        >
                            <Menu.Item key="/manual/cultural/patrolrecord"><Link to="/manual/cultural/patrolrecord">巡更记录</Link></Menu.Item>
                            <Menu.Item key="/manual/cultural/patrolplan"><Link to="/manual/cultural/patrolplan">巡更计划</Link></Menu.Item>
                            <Menu.Item key="/manual/cultural/rollhistory"><Link to="/manual/cultural/rollhistory">点名历史</Link></Menu.Item>
                            <Menu.Item key="/manual/cultural/rolltask"><Link to="/manual/cultural/rolltask">点名任务</Link></Menu.Item>
                        </SubMenu>
                        <Menu.Item key="/manual/record">
                            <span><Link to="/manual/record">操作日志</Link></span>
                        </Menu.Item>
                        <SubMenu
                            key="/manual/system"
                            title="系统管理"
                        >
                            <Menu.Item key="/manual/system/overview"><Link to="/manual/system/overview">系统总览</Link></Menu.Item>
                            <Menu.Item key="/manual/system/group"><Link to="/manual/system/group">节点分组</Link></Menu.Item>
                            <Menu.Item key="/manual/system/times"><Link to="/manual/system/times">时间设置</Link></Menu.Item>
                            <Menu.Item key="/manual/system/recycle"><Link to="/manual/system/recycle">回收站</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                    </div>
                    <div className="context">
                        <Router>
                            <Switch>
                                <Route exact path="/manual" render={() => <Redirect to="/manual/equ/enclosure" push />}/>
                                <Route path="/manual/equ/enclosure" component={Invasion}/>
                                <Route path="/manual/equ/statistics" component={Statistics}/>
                                <Route path="/manual/device/info" component={EquInfo}/>
                                <Route path="/manual/device/setting" component={Setting}/>
                                <Route path="/manual/device/falseSetting" component={FalseSetting} />
                                <Route path="/manual/device/deployment" component={Deployment} />
                                <Route path="/manual/system/overview" component={SysAll} />
                                <Route path="/manual/system/group" component={Grouping} />
                                <Route path="/manual/system/times" component={Times} />
                                <Route path="/manual/system/recycle" component={Bin} />
                                <Route path="/manual/record" component={Record} />
                                <Route path="/manual/timeVideo" component={Video}/>`
                                <Route path="/manual/face/key" component={KeyPerson}/>
                                <Route path="/manual/face/warning" component={Face}/>
                                <Route path="/manual/cultural/patrolrecord" component={PatrolRecord} />
                                <Route path="/manual/cultural/patrolplan" component={PatrolPlan} />
                                <Route path="/manual/cultural/rollhistory" component={History} />
                                <Route path="/manual/cultural/rolltask" component={Task} />
                                <Route path="/manual/users/administration" component={User} />
                                <Route path="/manual/security/personnel" component={Personnel} />
                                <Route path="/manual/security/scheduling" component={Scheduling} />
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}
export default ManualMain;
