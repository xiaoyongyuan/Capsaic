/**
 * 路由组件出口文件

 */

import Index from "./homePage/index";
//直播
import Broadcast from "./broadcast/Broadcast";
import Live from "./live/Live";
//设备
import Equipment from "./equipment/Equipment";
//树莓派绑定
import Raspberry from "./equipment/raspberry/Raspberry";
import AddRaspberry from "./equipment/raspberry/AddRaspberry";
//添加设备
import EquipSet from "./equipment/EquipSet";
//报警信息
import PoliceInformation from "./police/PoliceInformation";
//重点人员
import FaceDetection from "./police/face/FaceDetection";
//人脸预警
import FaceWarning from "./police/face/FaceWarning";
//数据看板
import Dashboard from "./Dashboard/Dashboard";
//报警跟踪
// import AlarmTracking from "./police/AlarmTracking";
//系统
import Overview from "./system/Overview";
import SysReset from "./system/SysReset";
import UserInfo from "./personnelManage/UserInfo";
import NetworkSettings from "./system/NetworkSettings";
import TimesSettings from "./system/TimesSettings";
import RecycleBin from "./system/RecycleBin";
import CloudSynchr from "./system/CloudSynchr.js";
import UpgradeSystem from "./system/UpgradeSystem.js";
import ElectronicMap from "./system/ElectronicMap.js";
import Operational from "./operational/Operational";
import GroupManagement from "./system/GroupManagement";
import UserIndex from "./system/userStatistics/UserIndex";
import UserEquipment from "./system/userStatistics/UserEquipment";
import Developer from "./system/Developer";
//登录
import Login from "./login/index";
//巡更
import Patrolrecord from "./patrol/Patrolrecord";
import Patrolplan from "./patrol/Patrolplan";
//点名
import Rollcallhistory from "./rollcall/Rollcallhistory";
import Rollcalltask from "./rollcall/Rollcalltask";
import AddRollcallTask from "./rollcall/AddRollcallTask";
import RollcallDetail from "./rollcall/RollcallDetail";
//历史视频
import Historymovies from "./history/Historymovies";
//安保人员
import Security from "./personnelManage/security/Security";
//安保排班
import SchedulingIndex from "./personnelManage/scheduling/SchedulingIndex";
//人脸巡更
import FacePatrol from "./personnelManage/FacePatrol";
export default {
  Index,
  PoliceInformation,
  Broadcast,
  Equipment,
  EquipSet,
  Overview,
  SysReset,
  UserInfo,
  NetworkSettings,
  TimesSettings,
  RecycleBin,
  CloudSynchr,
  UpgradeSystem,
  ElectronicMap,
  Operational,
  Login,
  Live,
  GroupManagement,
  Raspberry,
  AddRaspberry,
  UserIndex,
  UserEquipment,
  Patrolrecord,
  Patrolplan,
  Rollcallhistory,
  Rollcalltask,
  AddRollcallTask,
  RollcallDetail,
  Historymovies,
  Security,
  SchedulingIndex,
  Developer,
  Dashboard,
  FaceDetection,
  FaceWarning,
  FacePatrol
};
