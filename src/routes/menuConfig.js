export default {
    menuList: [
        {
            title: "数据看板",
            key: "/dashboard",
            component: "Dashboard",
            icon: "fund",
            //rank:["admin","others"]
        },
        /*{
            title: "首页",
            key: "/main/index",
            component: "Index",
            icon: "home",
            //rank:["admin"]
        },*/
        {
            title: "智能识别",
            icon: "alert",
            //rank:["admin"],
            key:"police",
            children: [
                {
                    title: "围界入侵",
                    key: "/main/police/policeInformation",
                    component: "PoliceInformation",
                }, {
                    title: "围界入侵统计",
                    key: "/main/police/userIndex",
                    component: "UserIndex"
                },{
                    title: "人脸预警",
                    key: "/main/face/faceWarning",
                    component: "FaceWarning"
                },
                /*{
                    title: "人脸检测",
                    key:"face",
                    children: [
                        {
                            title: "重点人员",
                            key: "/main/face/faceDetection",
                            component: "FaceDetection"
                        },
                        {
                            title: "人脸预警",
                            key: "/main/face/faceWarning",
                            component: "FaceWarning"
                        },
                    ]
                },*/
            ]
        },
        {
            title: "实时视频",
            key: "/main/broadcast",
            component: "Broadcast",
            icon: "play-square",
            //rank:["admin","others"]
        }, {
            title: "设备管理",
            key: "/main/raspberry",
            component: "Raspberry",
            icon: "tablet",
           // rank:["admin"]
        },
        {
            title: "人员管理",
            icon: "user",
           // rank:["admin","others"],
            key:"user",
            children: [
                {
                    title: "重点人员",
                    key: "/main/face/faceDetection",
                    component: "FaceDetection"
                },
                {
                    title: "安保人员",
                    key: "/main/security/security",
                    component: "Security"
                },{
                    title: "考勤管理",
                    key:"security",
                    children: [
                        {
                            title: "考勤排班",
                            key: "/main/security/scheduling",
                            component: "SchedulingIndex"
                        },
                       {
                            title: "人脸巡更",
                            key: "/main/security/facepatrol",
                            component: "FacePatrol"
                        }
                    ]
                }
            ]
        },
        {
            title:"文保巡检",
            icon:"hourglass",
            key:"relic",
            children:[
                {
                    title: "巡更记录",
                    key: "/main/relic/patrolrecord",
                    component: "Patrolrecord",
                }, {
                    title: "巡更计划",
                    key: "/main/relic/patrolplan",
                    component: "Patrolplan"
                },{
                    title: "点名历史",
                    key: "/main/relic/rollcallhistory",
                    component: "Rollcallhistory"
                }, {
                    title: "点名任务",
                    key: "/main/relic/rollcalltask",
                    component: "Rollcalltask"
                }
            ]
        },{
            title: "操作日志",
            key: "/main/operational",
            icon:"book",
            component: "Operational",
            //rank:["admin","others"],
        },

        {
            title: "系统管理",
            icon: "bars",
            //rank:["admin","others"],
            key:"system",
            children: [
                {
                    title: "系统总览",
                    key: "/main/system/overview",
                    component: "Overview"
                },
                {
                    title: "用户管理",
                    key: "/main/system/userInfo",
                    component: "UserInfo",
                },
                {
                    title: "节点分组",
                    key: "/main/system/groupManagement",
                    component: "GroupManagement"
                },
                {
                    title: "时间设置",
                    key: "/main/system/timesSettings",
                    component: "TimesSettings"
                },
                {
                    title: "回收站",
                    key: "/main/system/recycleBin",
                    component: "RecycleBin"
                },
            ]
        }
    ],
    other: [
        {
            key: "/main/equipset:add",
            component: "EquipSet"
        }, {
            key: "/main/historyVideo",
            component: "Historymovies"
        }, {
            key: "/main/equipset",
            component: "EquipSet"
        },
        {
            key: "/login",
            component: "Login"
        },
        {
            key: "/main/live",
            component: "Live"
        }, {
            key: "/main/addRaspberry",
            component: "AddRaspberry"
        }, {
            key: "/main/userEquipment",
            component: "UserEquipment"
        },{
            key: "/main/addRollcallTask",
            component: "AddRollcallTask"
        },{
            key: "/main/rollcallDetail",
            component: "RollcallDetail"
        }, {
            key: "/main/system/developer",
            component: "Developer"
        },
    ]
};
