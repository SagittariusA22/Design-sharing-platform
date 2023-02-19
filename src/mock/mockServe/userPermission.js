import Mock from "mockjs";
// 登录拦截，生成token

const { workerInfo } = Mock.mock({
  "workerInfo|2": [
    {
      'id': "@id()",

      'name|+1': ['Admin','Staff'],

      'sex|1': ['0','1'],

      'password|+1': ['Admin123#','Staff123#'],

      'email': '@email',
      
      'date': '@date("yyyy-MM-dd HH:mm:ss")',
      
      'phone': '-',
      
      'phoneBandAccount': false,
      'emailBandAccount': true,

      'cardId': /^4[385][1-9]\d{12}/,

      'power|+1': ['2','2','2','2','2','1','2','2','0','1',],

      'key|+1': 1 ,
    },
  ],
});

export default {
  getMenu: (config) => {
    // 读取用户名和密码并进行判断
    const { username, password } = JSON.parse(config.body);
    if (username === "Admin" && password === "Admin123#") {
      return {
        status: 200,
        message: "登录成功",
        token: Mock.Random.guid(),
        username,
        info: workerInfo[0],
        permission:{ 
          add:true,
          delete:true,
          edit:true,
        },
        data: {
          menu: [
            {
              path: "/Home",
              name: "精品项目",
              url: "Home",
              children: [
                {
                  path: "/building",
                  name: "建筑设计",
                  url: "project/buliding/index",
                  redirect: "/architecture",
                  children: [
                    {
                      path: "/architecture",
                      name: "建筑项目列表",
                      url: "project/buliding/architecture",
                    },
                    {
                      path: "/arcProjectIntroduce",
                      name: "建筑项目介绍",
                      url: "project/projectIntroduce",
                      hidden: "false",
                    },
                  ]
                },
                {
                  path: "/planning",
                  name: "规划设计",
                  url: "project/planning/index",
                  redirect: "/planningList",
                  children: [
                    {
                      path: "/planningList",
                      name: "规划项目列表",
                      url: "project/planning/planning",
                    },
                    {
                      path: "/planProjectIntroduce",
                      name: "规划项目介绍",
                      url: "project/projectIntroduce",
                      hidden: "false",
                    },
                  ]
                },
              ],
            },
            {
              path: "/Home",
              name: "项目资料",
              url: "Home",
              children: [
                {
                  path: "/projectList",
                  name: "项目列表",
                  url: "projectInfo/projectList",
                },
              ],
            },
            {
              path: "/Home",
              name: "建筑材料库",
              url: "Home",
              children: [
                {
                  path: "/MaterialList",
                  name: "材料检索",
                  url: "Material/MaterialList",
                },
                {
                  path: "/case",
                  name: "材料案例精选",
                  url: "Material/case",
                },
              ],
            },
            {
              path: "/Home",
              name: "用户管理",
              url: "Home",
              children: [
                {
                  path: "/workerList",
                  name: "员工列表",
                  url: "users/workerList",
                },
                {
                  path: "/administrator",
                  name: "管理员列表",
                  url: "users/administrator",
                },
              ],
            },
            {
              path: "*",
              name: "NotFound",
              url: "NotFound/NotFound",
              hidden: "false",
            },
          ],
        },
      };
    } else if (username === "Staff" && password === "Staff123#") {
      return {
        status: 200,
        message: "登录成功",
        token: Mock.Random.guid(),
        username,
        info: workerInfo[1],
        permission:{ 
          add:false,
          delete:false,
          edit:false,
        },
        data: {
          menu: [
            {
              path: "/Home",
              name: "精品项目",
              url: "Home",
              children: [
                {
                  path: "/building",
                  name: "建筑设计",
                  url: "project/buliding/index",
                  redirect: "/architecture",
                  children: [
                    {
                      path: "/architecture",
                      name: "建筑项目列表",
                      url: "project/buliding/architecture",
                    },
                    {
                      path: "/arcProjectIntroduce",
                      name: "建筑项目介绍",
                      url: "project/projectIntroduce",
                      hidden: "false",
                    },
                  ]
                },
                {
                  path: "/planning",
                  name: "规划设计",
                  url: "project/planning/index",
                  redirect: "/planningList",
                  children: [
                    {
                      path: "/planningList",
                      name: "规划项目列表",
                      url: "project/planning/planning",
                    },
                    {
                      path: "/planProjectIntroduce",
                      name: "规划项目介绍",
                      url: "project/projectIntroduce",
                      hidden: "false",
                    },
                  ]
                },
              ],
            },
            {
              path: "/Home",
              name: "项目资料",
              url: "Home",
              children: [
                {
                  path: "/projectList",
                  name: "项目列表",
                  url: "projectInfo/projectList",
                },
              ],
            },
            {
              path: "/Home",
              name: "建筑材料库",
              url: "Home",
              children: [
                {
                  path: "/MaterialList",
                  name: "材料检索",
                  url: "Material/MaterialList",
                },
                {
                  path: "/case",
                  name: "材料案例精选",
                  url: "Material/case",
                },
              ],
            },
            {
              path: "*",
              name: "NotFound",
              url: "NotFound/NotFound",
              hidden: "false",
            },
          ],
        },
      };
    } else {
      return {
        status: 404,
        message: "账号或密码不正确",
      };
    }
  },

  changeData: (data) => {
    const { id, name, sex, email, phone, cardId, } = JSON.parse(data.body);
    workerInfo.forEach((item) => {
      if (item.id === id) {
        item.name = name;
        item.sex = sex;
        item.email = email;
        item.phone = phone;
        item.cardId = cardId;
      }
    });
    return {
      status: 200,
      msg: "添加数据成功",
      data: workerInfo,
      total: workerInfo.length,
    };
  },
};
