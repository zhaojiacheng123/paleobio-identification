/* eslint-disable no-fallthrough */
import { parse } from 'url';

// mock tableListDataSource
let identifications = [];

function genProcess(step, status, startTime, endTime, info, persion) {
  return {
    step,
    status,
    startTime,
    endTime,
    info,
    persion,
  };
}

for (let i = 0; i < 50; i += 1) {
  identifications.push({
    key: i,
    classification: '大类',
    leader: '组长',
    user: 'user',
    email: 'email@gmail.com',
    phoneNo: '13700000000',
    obtainWays: `获取途径${i}`,
    discoveryLocation: '发现地',
    detailedDiscoveryLocation: '详细发现地',
    identificationType: `鉴定类型xxx`,
    identificationObject: '送检需求',
    resultId: null,
    // processes: [genProcess(`step${Math.round(Math.random() * 4)}`, Math.round(Math.random() * 4))],
    processes: [genProcess('step1', 0)],
  });
}

function getIdentification(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = identifications;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.steps) {
    const steps = params.steps.split(',');
    let filterDataSource = [];
    steps.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => {
          const { processes } = data;
          return processes[processes.length - 1].step === s;
        })
      );
    });
    dataSource = filterDataSource;
  }

  if (params.statuses) {
    const statuses = params.statuses.split(',');
    let filterDataSource = [];
    statuses.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => {
          const { processes } = data;
          // eslint-disable-next-line eqeqeq
          return processes[processes.length - 1].status == s;
        })
      );
    });
    dataSource = filterDataSource;
  }

  if (params.showType) {
    switch (params.showType) {
      case 'member-todo':
        dataSource = dataSource.filter(d => {
          const { processes } = d;
          return processes[processes.length - 1].step === 'step1';
        });
        break;
      case 'member-done':
        dataSource = dataSource.filter(d => {
          const { processes } = d;
          return processes[processes.length - 1].step !== 'step1';
        });
        break;
      case 'identifier-todo':
        dataSource = dataSource.filter(d => {
          const { processes } = d;
          // eslint-disable-next-line no-bitwise
          return ~',step2,step3,step4,'.indexOf(`,${processes[processes.length - 1].step},`);
        });
        break;
      case 'identifier-done':
        dataSource = dataSource.filter(d => {
          const { processes } = d;
          // eslint-disable-next-line no-bitwise
          return !~',step2,step3,step4,'.indexOf(`,${processes[processes.length - 1].step},`);
        });
        break;
      default:
        break;
    }
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postIdentification(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, type, keys, info } = body;
  let { key } = body;
  delete body.type;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      identifications = identifications.filter(item => keys.indexOf(item.key) === -1);
      break;
    case 'post': // post 然后 update
      const i = Math.ceil(Math.random() * 10000);
      identifications.unshift(
        Object.assign(
          {
            key: i,
            classification: '大类',
            leader: '组长',
            user: 'user',
            email: 'email@gmail.com',
            phoneNo: '13700000000',
            obtainWays: `获取途径${i}`,
            discoveryLocation: '发现地',
            detailedDiscoveryLocation: '详细发现地',
            identificationType: `鉴定类型xxx`,
            identificationObject: '送检需求',
            resultId: null,
            processes: [],
          },
          body
        )
      );
      // eslint-disable-next-line prefer-destructuring
      key = i;
    case 'update':
      identifications = identifications.map(item => {
        if (item.key === key) {
          const { processes } = item;
          const lastProcesses = processes[processes.length - 1];
          const step4 = processes.find(d => d.step === 'step4');
          const step3 = processes.find(d => d.step === 'step3');
          switch (type) {
            case 'save':
              processes.push(genProcess('step1', 0, new Date(), 0, 0, '申请人'));
              break;
            case 'submit':
              // save
              if (lastProcesses) {
                Object.assign(lastProcesses, {
                  status: 1,
                  persion: '申请人',
                  endTime: new Date(),
                });
              }
              item.processes.push(genProcess('step2', 0, new Date()));
              break;
            case 'undo':
              if (lastProcesses) {
                Object.assign(lastProcesses, {
                  status: 2,
                  persion: '申请人',
                  endTime: new Date(),
                });
              }
              item.processes.push(genProcess('step1', 0, new Date()));
              break;
            case 'pass':
              if (lastProcesses) {
                Object.assign(lastProcesses, {
                  status: 3,
                  persion: '鉴定人',
                  endTime: new Date(),
                });
              }
              item.processes.push(genProcess('step3', 0, new Date()));
              item.processes.push(genProcess('step4', 0, new Date()));
              break;
            case 'back':
              if (lastProcesses) {
                Object.assign(lastProcesses, {
                  status: 4,
                  persion: '鉴定人',
                  endTime: new Date(),
                  info,
                });
              }
              item.processes.push(genProcess('step1', 0, new Date()));
              break;
            case 'identify':
              if (step3) {
                Object.assign(step3, {
                  status: 1,
                  persion: '鉴定人',
                  endTime: new Date(),
                });
              }
              // step0
              // eslint-disable-next-line no-unused-expressions
              step4 &&
                step4.status === 1 &&
                item.processes.push(genProcess('step0', 1, new Date()));
              break;
            case 'contribute':
              if (step4) {
                Object.assign(step4, {
                  status: 1,
                  persion: '鉴定人',
                  endTime: new Date(),
                });
              }
              // step0
              // eslint-disable-next-line no-unused-expressions
              step3 &&
                step3.status === 1 &&
                item.processes.push(genProcess('step0', 1, new Date()));
              break;
            default:
              break;
          }
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getIdentification(req, res, u);
}

export default {
  'GET /api/identification': getIdentification,
  'POST /api/identification': postIdentification,
};
