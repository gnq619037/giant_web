import React, { Component } from 'react';
import { Chart, Geom, Axis, Coord, Guide, Shape } from 'bizcharts';
import { getData } from '../../services/ajaxServer';

const { Arc, Html } = Guide;

// 自定义Shape 部分
Shape.registerShape('point', 'pointer', {
  drawShape(cfg, group) {
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint(point);
    const center = this.parsePoint({ // 获取极坐标系下画布中心点
      x: 0,
      y: 0,
    });
      // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 5,
        lineCap: 'round',
      },
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 12,
        stroke: cfg.color,
        lineWidth: 4.5,
        fill: '#fff',
      },
    });
  },
});

class AjaxPanelBoard extends Component {
  constructor(props) {
    super(props);
    const { ajaxUrl, aoData, height } = this.props;
    this.state = {
      rate: 0,
      height,
      aoData,
      ajaxUrl,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { ajaxUrl, aoData } = this.state;
    const ajaxData = getData(ajaxUrl, aoData);
    // 获取rate值,用于渲染界面
    ajaxData.then((json) => {
      this.setState({
        rate: json.result,
      });
    });
  }

  render() {
    const { rate, height } = this.state;
    const data = [
      { value: rate * 10 },
    ];
    const cols = {
      value: {
        min: 0,
        max: 10,
        ticks: [],
        nice: false,
      },
    };
    return (
      <div>
        <Chart height={height} data={data} scale={cols} padding={['auto', 'auto', 'auto', 'auto']} forceFit>
          <Coord type="polar" startAngle={(-9 / 8) * Math.PI} endAngle={(1 / 8) * Math.PI} radius={0.75} />
          <Axis
            name="value"
            zIndex={2}
            line={null}
            label={null}
          />
          <Axis name="1" visible={false} />
          <Guide>
            <Arc
              zIndex={0} start={[0, 0.965]} end={[10, 0.965]}
              style={{ // 底灰色
                stroke: '#000',
                lineWidth: 18,
                opacity: 0.09,
              }}
            />
            <Arc
              zIndex={1} start={[0, 0.965]} end={[data[0].value, 0.965]}
              style={{ // 底灰色
                stroke: '#1890FF',
                lineWidth: 18,
              }}
            />
            <Html
              position={['50%', '95%']}
              html={() => {
                return (`<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.75em; color: rgba(0,0,0,0.43);margin: 0;"></p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">${(rate * 100).toFixed(2)}%</p></div>`);
              }}
            />
          </Guide>
          <Geom
            type="point" position="value*1" shape="pointer" color="#1890FF"
            active={false}
            style={{ stroke: '#fff', lineWidth: 1 }}
          />
        </Chart>
      </div>
    );
  }
}

export default AjaxPanelBoard;
