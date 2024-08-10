"use client";

import React, {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import mapData from "../public/json/mapdata.json";
import customData from "../data.json"

const json: any = mapData;

const Map: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初始化 ECharts 实例
    const chart = echarts.init(chartRef.current!);

    // 注册地图数据
    echarts.registerMap("china", json);

    // 将 data.json 相应的区域标出
    const mapSeriesData = customData.map((item: any) => ({
      name: item.area,
      itemStyle: {
        areaColor: '#F5C6AD',
      },
    }));

    // ECharts 选项
    const option = {
      tooltip: {
        trigger: "item", // 触发类型，设置为 'item'，即鼠标悬停在地图区域时触发
        formatter: (params: any) => {
          const data = customData.find((item: any) => item.area === params.name);
          if (data) {
            const infoContent = data.info.join("<br/>");
            return `${data.area}<br/>${infoContent}`;
          }
          return `${params.name}`;
        },
        backgroundColor: "rgba(50, 50, 50, 0.7)",
        borderColor: "#333",
        borderWidth: 1,
        textStyle: {
          color: "#FFF",
          fontSize: 14,
        },
      },
      series: [
        {
          name: "map",
          type: "map",
          map: "china",
          roam: true,
          zoom: 1.2,
          scaleLimit: {
            min: 1,
            max: 5,
          },
          label: {
            show: false,
          },
          data: mapSeriesData,
        },
      ],
    };

    chart.setOption(option);

    // 在组件卸载时销毁 ECharts 实例，避免内存泄漏
    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-screen" />;
};

export default Map;
