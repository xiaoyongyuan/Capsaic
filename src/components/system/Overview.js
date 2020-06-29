/**
 * @copyright mikeJang
 */
import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import {
  Row,
  Col,
  Card,
  Progress,
  Descriptions,
  List,
  Radio,
  Button,
  Switch,
  message,
  Breadcrumb,
  Statistic,
} from "antd";
import axios from "../../axios";
import "../../style/jhy/less/overview.less";
import echarts from "echarts"

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datalist: {},
      alarmcheck: false,
      syscheck: false,
      servcheck: false,
      playcheck: false
    };
  }

  componentDidMount() {
    this.getData();
  }
  getData = () => {
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/system/overview",
        data: {}
      })
      .then(res => {
        if (res.success) {
          const surplusDisksMemories = res.data.surplusDisksMemories.match(/[\d.]+/g)[0];
          const couldUseMemories = res.data.couldUseMemories.match(/[\d.]+/g)[0];
          this.setState({
            alarmcheck: res.data.voiceFlag,
            datalist: res.data,
            surplusDisksMemories,
            couldUseMemories
          });
        }
      });
  };
  // handleAlarmSound = checked => {
  //   axios
  //     .ajax({
  //       method: "get",
  //       url: window.g.loginURL + "/api/system/alaVoiceSet",
  //       data: {
  //         flag: checked
  //       }
  //     })
  //     .then(res => {
  //       if (res.success) {
  //         message.success(checked === true ? "报警声音开启" : "报警声音关闭");
  //         this.setState({
  //           alarmcheck: res.msg.replace("/\"/g,'")
  //         });
  //       }
  //     });
  // };
  sys_setInitInfo = () => {
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/redisinfo/setinfo",
        data: {}
      })
      .then(res => {
        if (res.success) {
          message.success("重置系统成功,请重启服务器");
        } else {
          message.error("重置系统失败,请联系管理员");
        }
      });
  };
  render() {
    const funconfig = [
      <Radio
        checked={this.state.syscheck}
        onClick={() => {
          this.setState({ syscheck: !this.state.syscheck });
        }}
      >
        云端同步服务器是否运行
      </Radio>,
      <Radio
        checked={this.state.servcheck}
        onClick={() => {
          this.setState({ servcheck: !this.state.servcheck });
        }}
      >
        删除服务器是否运行
      </Radio>,
      <Radio
        checked={this.state.playcheck}
        onClick={() => {
          this.setState({ playcheck: !this.state.playcheck });
        }}
      >
        直播服务器是否运行
      </Radio>
    ];
    const datalist = this.state.datalist;
    const CpuEchart = {
      title: {
        text: `${datalist.cpuUsed}%`,
        x: 'center',
        y: 'center',
        textStyle: {
          color: "#333333",
          fontSize: 14,
          fontWeight: 'normal'
        },
      },
      series: [
        {
          type: "pie",
          hoverAnimation: false,
          label: [],
          radius: ["83%", "95%"],
          data: [{ value: datalist.cpuUnused }, { value: datalist.cpuUsed }]
        }
      ],
      color: ["#F0F0F0", "#3661FF"]
    }
    const cpupie = {
      tooltip: {},
      backgroundColor: "#FFF",
      series: [
        {
          type: 'gauge',
          name: '第二层',
          radius: '100%',
          startAngle: '225',
          endAngle: '-45',
          splitNumber: 4,
          itemStyle: {
            color: '#3661FF',
          },
          pointer: {
            show: true,
            length: '80%',
            width: 2,
          },
          data: [{
            value: parseFloat(datalist.cpuUsed / datalist.cpuUnused).toFixed(2) * 100,
            name: 'CPU使用率'
          }],
          title: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: [
                // 有数值的部分
                [parseFloat(datalist.cpuUsed / datalist.cpuUnused).toFixed(2), new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: '#5E92FD' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#3661FF' // 100% 处的颜色
                }
                ])],
                // 底色
                [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: '#F0F0F0' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#F0F0F0' // 100% 处的颜色
                }
                ])]
              ],
              width: 50,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              opacity: 1
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          detail: {
            show: false
          },
          axisLabel: {
            show: false,
          },
          animationDuration: 2000,
        },
        {
          name: '与div背景色相同模拟axisTick',
          type: 'gauge',
          radius: '77%',
          startAngle: '225',
          endAngle: '-45',
          splitNumber: 1,
          pointer: {
            show: false
          },
          title: {
            show: false,
          },
          detail: {
            show: true,
            offsetCenter: [0, '80%'],
            formatter: (value) => {
              return [
                `{a|${value}}{b|%}`,
                `{c|当前CPU使用率}`
              ].join('\n')
            },
            rich: {
              a: {
                color: '#333333',
                fontWeight: 600,
                fontSize: 20,
              },
              b: {
                color: '#333333',
                fontWeight: 600,
                fontSize: 20,
              },
              c: {
                color: '#cccccc',
                fontWeight: 600,
                fontSize: 12,
              },
            }
          },
          data: [{
            value: parseFloat(datalist.cpuUsed / datalist.cpuUnused).toFixed(2) * 100,
            name: '当前CPU使用率'
          }],
          axisLine: {
            show: false,
            lineStyle: {
              width: 1,
              opacity: 0
            }
          },
          axisTick: {
            show: true,
            splitNumber: 120,
            length: 30, // 刻度线宽度
            lineStyle: {
              // 与div背景色相同
              color: '#FFF',
              width: 5,
            }
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false
          }
        },
      ]
    };
    const physpie = {
      backgroundColor: "#ffffff",
      title: {
        text: `${datalist.totalMemories}GB`,
        subtext: '磁盘总空间',
        x: 'center',
        y: 'center',
        textStyle: {
          color: "#333333",
          fontSize: 20,
          fontWeight: 'normal'
        },
        subtextStyle: {
          color: "#cccccc",
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      calculable: true,
      series: [{
        name: '面积模式',
        type: 'pie',
        radius: [70, 82],
        center: ['50%', '50%'],
        tooltip: {},
        hoverAnimation: false,
        labelLine: {
          show: false
        },
        data: [{
          value: datalist.usedMemories,
          name: '物理内存',
          itemStyle: {
            color: "#3661FF"
          },
          label: {
            show: false,
          }
        },
        {
          value: datalist.surplusMemories,
          name: '物理内存',
          itemStyle: {
            color: "transparent"
          }
        }
        ]
      },
      {
        name: '面积模式',
        type: 'pie',
        radius: [73, 79],
        center: ['50%', '50%'],
        hoverAnimation: false,
        tooltip: {},
        labelLine: {
          show: false
        },
        data: [{
          value: datalist.usedMemories,
          name: '物理内存',
          itemStyle: {
            color: "transparent"
          }
        },
        {
          value: datalist.surplusMemories,
          name: '物理内存',
          itemStyle: {

            color: "#FF6D79"
          },
          label: {
            show: false,
          }
        }
        ]
      }
      ]
    };
    const diskpie = {
      backgroundColor: "#ffffff",
      title: {
        text: `${datalist.MaxDisksMemories}B`,
        subtext: '磁盘总空间',
        x: 'center',
        y: 'center',
        textStyle: {
          color: "#333333",
          fontSize: 20,
          fontWeight: 'normal'
        },
        subtextStyle: {
          color: "#cccccc",
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      calculable: true,
      series: [{
        name: '面积模式',
        type: 'pie',
        radius: [70, 82],
        center: ['50%', '50%'],
        tooltip: {},
        hoverAnimation: false,
        labelLine: {
          show: false
        },
        data: [{
          value: this.state.couldUseMemories,
          name: '物理内存',
          itemStyle: {
            color: "#3661FF"
          },
          label: {
            show: false,
          }
        },
        {
          value: this.state.surplusDisksMemories,
          name: '物理内存',
          itemStyle: {
            color: "transparent"
          }
        }
        ]
      },
      {
        name: '面积模式',
        type: 'pie',
        radius: [73, 79],
        center: ['50%', '50%'],
        hoverAnimation: false,
        tooltip: {},
        labelLine: {
          show: false
        },
        data: [{
          value: this.state.couldUseMemories,
          name: '物理内存',
          itemStyle: {
            color: "transparent"
          }
        },
        {
          value: this.state.surplusDisksMemories,
          name: '物理内存',
          itemStyle: {

            color: "#FF6D79"
          },
          label: {
            show: false,
          }
        }
        ]
      }
      ]
    };
    let xianCun = datalist.videoRam ? datalist.videoRam.toString().replace("MB", "") : "0";  //显存
    let freeXianCun = datalist.freeVideoRam ? datalist.freeVideoRam.toString().replace("MB", "") : "0"  //空闲显存
    let totalXiancun = parseInt(xianCun) + parseInt(freeXianCun) //总显存
    return (
      <div className="overview">
        <Breadcrumb className="crumbs">
          <Breadcrumb.Item>系统管理</Breadcrumb.Item>
          <Breadcrumb.Item>
            <span className="crumbs-item">系统总览</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="topwrap">
          <Row gutter={24}>
            <Col span={8}>
              <Card title="CPU使用率" bordered={false} className="cpu">
                <div className="pie">
                  <ReactEcharts
                    id="cpuech"
                    option={cpupie}
                    style={{ height: "180px" }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 16, color: '#333333' }}>已使用{parseFloat(datalist.cpuUsed / datalist.cpuUnused).toFixed(2) * 100}%</span>
                  <span className="dot bluedot" />
                  <span style={{ fontSize: 16, color: '#cccccc' }}>未使用{100 - (parseFloat(datalist.cpuUsed / datalist.cpuUnused).toFixed(2) * 100)}%</span>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="物理内存" bordered={false} className="physics">
                <div className="pie">
                  <ReactEcharts
                    option={physpie}
                    style={{ height: "180px" }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="dot bluedot" />
                  <span>已使用{datalist.usedMemories}GB</span>
                  <span className="dot orangedot" />
                  <span>未使用{datalist.surplusMemories}GB</span>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="磁盘空间" bordered={false} className="disk">
                <div className="pie">
                  <ReactEcharts
                    option={diskpie}
                    style={{ height: "180px" }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="dot bluedot" />
                  <span>已使用{this.state.couldUseMemories}GB</span>
                  <span className="dot orangedot" />
                  <span>未使用{this.state.surplusDisksMemories}GB</span>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <Row className="midwrap">
          <Card title="" bordered={false} className="ossys">
            <Row>
              <Col span={5}>
                <div className='rightLine'>
                  <div className='totalXiancheng'>
                    <Statistic title="总线程数" value={datalist.TotalthreadNum} />
                  </div>
                  <div className='totalContent'>
                    总数{datalist.TotalthreadNum}
                  </div>
                </div>
              </Col>
              <Col span={5}>
                <div className='rightLine'>
                  <div className='ant-statistic-title'>
                    CPU使用率
                </div>
                  <ReactEcharts
                    option={CpuEchart}
                    style={{ height: "80px" }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <span className="dot bluedot" />
                    <span>已使用{datalist.cpuUsed}%</span>
                    <span className="dot orangedot" />
                    <span>未使用{datalist.cpuUnused}%</span>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className='ant-statistic-title'>
                  显存
                </div>
                <div className='progressLine'>
                  <Progress percent={parseFloat(xianCun / totalXiancun).toFixed(2) * 100} showInfo={false} />
                </div>
                <div>
                  当前显存{datalist.videoRam}
                </div>
              </Col>
              <Col span={6}>
                <div className='ant-statistic-title'>
                  空闲显存
                </div>
                <div className='progressLine'>
                  <Progress percent={parseFloat(freeXianCun / totalXiancun).toFixed(2) * 100} showInfo={false} strokeColor="#37C1D0" />
                </div>
                <div>
                  当前空闲显存{datalist.freeVideoRam}
                </div>
              </Col>
            </Row>
          </Card>
        </Row>
        <Row className="botwrap" >
          <Col span={24}>
            <Card title="功能设置" className="funset">
              <Row style={{width:'70%'}}>
                <Col span={8}>
                  <div>
                    <p className='ant-statistic-title' style={{padding:'3px 0px'}}>系统持续运营时间</p>
                    <div className='funSetItem'>{datalist.Runningtime}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <p className='ant-statistic-title'  style={{padding:'3px 0px'}}>软件版本</p>
                    <div className='funSetItem'>{datalist.softVersion}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <p className='ant-statistic-title'  style={{padding:'3px 0px'}}>SERVER版本</p>
                    <div className='funSetItem'>{datalist.SERVERVersion}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <p className='ant-statistic-title'  style={{padding:'3px 0px'}}>一次算法处理警报数量</p>
                    <div className='funSetItem'>{datalist.firstCalculationNum?datalist.firstCalculationNum:0}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <p className='ant-statistic-title'  style={{padding:'3px 0px'}}>二次算法处理警报数量</p>
                    <div className='funSetItem'>{datalist.secondCalculationNum?datalist.secondCalculationNum:0}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <p className='ant-statistic-title'  style={{padding:'3px 0px'}}>一次算法版本</p>
                    <div className='funSetItem'>{datalist.firstCalculationVersion}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <p className='ant-statistic-title'  style={{padding:'3px 0px'}}>二次算法版本</p>
                    <div className='funSetItem'>{datalist.secondCalculationVersion}</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Overview;
