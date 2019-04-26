import { parse } from 'url';

const users = [
  {
    uid: 'admin',
    fullName: 'admin',
    password: '123456',
    roleName: 'admin',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    email: 'tes65@qq.com',
    mobile: '15732177433',
    updatedAt: new Date(),
  },
  {
    uid: 'identifier',
    fullName: 'identifier',
    password: '123456',
    roleName: 'identifier',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    email: 'tes65@qq.com',
    mobile: '15732177433',
    updatedAt: new Date(),
  },
  {
    uid: 'member',
    fullName: 'member',
    password: '123456',
    roleName: 'member',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    email: 'tes65@qq.com',
    mobile: '15732177433',
    updatedAt: new Date(),
  },
  {
    uid: 'member2',
    fullName: 'member2',
    password: '123456',
    roleName: 'member',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    email: 'tes65@qq.com',
    mobile: '15732177433',
    updatedAt: new Date(),
  },
];

let tableListDataSource = users; 
// for (let i = 0; i < 46; i += 1) {
//   tableListDataSource.push({
//     key: i,
//     disabled: i % 6 === 0,
//     href: 'https://ant.design',
//     avatar: [
//       'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
//       'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
//     ][i % 2],
//     uid: `uid ${i}`,
//     fullName: `fullName ${i}`,
//     title: `一个任务名称 ${i}`,
//     owner: '曲丽丽',
//     desc: '这是一段描述',
//     callNo: Math.floor(Math.random() * 1000),
//     role: ['admin', 'identifier', 'member'][Math.floor(Math.random() * 10) % 3],
//     updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
//     createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
//     progress: Math.ceil(Math.random() * 100),
//   });
// }
function getUsers(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.role) {
    const roles = params.role.split(',');
    let filterDataSource = [];
    roles.forEach(s => {
      filterDataSource = filterDataSource.concat(dataSource.filter(data => data.role === s));
    });
    dataSource = filterDataSource;
  }

  if (params.fullName) {
    dataSource = dataSource.filter(data => data.fullName.indexOf(params.fullName) > -1);
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
function postUser(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, roleName, uid, fullName, email, mobile, password, key } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        callNo: Math.floor(Math.random() * 1000),
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
        roleName,
        uid,
        fullName,
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, {roleName, fullName, email, mobile, password});
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getUsers(req, res, u);
}
function getCurrentUser(req, res) {
  res.send(users[0]);
}
export default {
  'POST /api/user/getUsers': getUsers,
  'POST /api/user/add': (req, res, u, b) => {
    req.body.method = 'post';
    postUser(req, res, u, b);
  },
  'POST /api/user/update': (req, res, u, b) => {
    req.body.method = 'update';
    postUser(req, res, u, b);
  },
  'POST /api/user/remove': (req, res, u, b) => {
    req.body.method = 'delete';
    postUser(req, res, u, b);
  },
  'POST /api/login/account': (req, res) => {
    const { password, uid, type } = req.body;
    const user = users.find(d => (d.uid === uid && d.password === password));
    if (user) {
      res.send({
        status: 'ok',
        type,
        currentAuthority: user.roleName || 'member',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'GET /api/user/getCurrentUser': getCurrentUser,
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
