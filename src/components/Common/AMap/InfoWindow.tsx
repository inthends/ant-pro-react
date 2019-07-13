import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { rcss2hcss } from './utils/map';

let curProps;

export default class InfoWindow extends Component<any, any> {
  static defaultProps = {
    width: 350,
    height: 350,
    bgColor: 'white',
    style: {},
  };

  opened = false;
  infoWindow;
  constructor(props) {
    super(props);

    const { map, width, height, style } = props;
    const newStyle = Object.assign({}, style, {
      width: `${width}px`,
      height: `${height}px`,
    });

    const convertedStyle = rcss2hcss(newStyle);
    if (map) {
      // eslint-disable-next-line no-undef
      this.infoWindow = new (window as any).AMap.InfoWindow({
        isCustom: true,
        content: `<div id="infoWindow" style="${convertedStyle}"/>`,
        // eslint-disable-next-line no-undef
        offset: new (window as any).AMap.Pixel(width / 2, height),
        anchor: 'center',
        autoMove: false,
      });
    }
  }

  componentDidMount = () => {
    if (this.infoWindow) {
      this.infoWindow.on('open', () => {
        setTimeout(() => {
          const { children } = this.props;
          const infoWindowDOM = document.querySelector('#infoWindow');
          if (children) {
            ReactDOM.render(children as any, infoWindowDOM);
          }
        }, 50);
      });
    }
  };

  componentWillUnmount = () => {
    if (this.infoWindow) {
      this.infoWindow.close();
    }
  };

  close = () => {
    this.infoWindow.close();
    this.opened = false;
  };

  show = () => {
    if (this.infoWindow) {
      const { show, map, lng, lat } = this.props;

      if (curProps) {
        // 显示位置发生变化先关闭之前的 InfoWindow
        const { lng: curLng, lat: curLat } = curProps;
        if (curLng !== lng || curLat !== lat) {
          this.close();
        }
      }
      if (show && !this.opened) {
        if (!Number.isNaN(lng) && !Number.isNaN(lat)) {
          // eslint-disable-next-line no-undef
          const position = new (window as any).AMap.LngLat(lng, lat);
          this.infoWindow.open(map, position);
          this.opened = true;

          curProps = this.props;
        }
      } else {
        this.infoWindow.close();
      }
    }
  };

  recordPropsState = () => {};

  render() {
    this.show();

    return <div />;
  }
}
