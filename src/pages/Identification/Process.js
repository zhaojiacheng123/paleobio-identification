import React from 'react';
import { Card, Table } from 'antd';
import { stepMap, statusMap } from "@/const";

const columns = [
  {
    title: '节点名称',
    dataIndex: 'step',
    key: 'step',
    render: text => stepMap[text].name,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: t => statusMap[t].name,
  },
  {
    title: '办理人',
    dataIndex: 'persion',
    key: 'perions',
  },
  {
    title: '办理意见',
    key: 'info',
    dataIndex: 'info',
    // render: tags => (
    //   <span>
    //     {tags.map(tag => {
    //       let color = tag.length > 5 ? 'geekblue' : 'green';
    //       if (tag === 'loser') {
    //         color = 'volcano';
    //       }
    //       return (
    //         <Tag color={color} key={tag}>
    //           {tag.toUpperCase()}
    //         </Tag>
    //       );
    //     })}
    //   </span>
    // ),
  },
  {
    title: '开始时间',
    dataIndex: 'startTime'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime'
  }
];

export default function process(prop) {
  const {processes} = prop;
  return (
    <div>
      <Card title="办理过程">
        <Table columns={columns} dataSource={processes} style={{wordBreak: 'break-all'}} />
      </Card>
    </div>
  );
}
