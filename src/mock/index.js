import Mock from "mockjs";
import permissionApi from "./mockServe/userPermission";
import imgApi from "./mockServe/displayImg";
import vipProjectApi from "./mockServe/vipProject";
import planVipProjectApi from "./mockServe/planVipProject";
import materailApi from "./mockServe/materail";
import workerInfoApi from "./mockServe/workerInfo";

//Random方法是mockjs的核心方法，可以生成各种占位符
const Random = Mock.Random;

Mock.setup({
  // 随机延时
  timeout: "500",
});

// 登录拦截
Mock.mock(/\/api\/login/, "post", permissionApi.getMenu);
Mock.mock(/\/api\/login/, "put", permissionApi.changeData);

// 轮播图
Mock.mock(/\/api\/img/, "get", imgApi.getImg);

// 精品建筑项目
Mock.mock(/\/api\/vipProject/, "get", vipProjectApi.getData);
Mock.mock(/\/api\/vipProject/, "delete", vipProjectApi.delData);
Mock.mock(/\/api\/vipProject/, "post", vipProjectApi.setData);
Mock.mock(/\/api\/vipProject/, "put", vipProjectApi.changeData);
// 精品规划项目
Mock.mock(/\/api\/planVipProject/, "get", planVipProjectApi.getData);
Mock.mock(/\/api\/planVipProject/, "delete", planVipProjectApi.delData);
Mock.mock(/\/api\/planVipProject/, "post", planVipProjectApi.setData);
Mock.mock(/\/api\/planVipProject/, "put", planVipProjectApi.changeData);
// 材料接口
Mock.mock(/\/api\/materail/, "get", materailApi.getData);
Mock.mock(/\/api\/materail/, "delete", materailApi.delData);
Mock.mock(/\/api\/materail/, "post", materailApi.setData);
Mock.mock(/\/api\/materail/, "put", materailApi.changeData);
// 员工接口
Mock.mock(/\/api\/workerInfo/, "get", workerInfoApi.getData);
Mock.mock(/\/api\/workerInfo/, "delete", workerInfoApi.delData);
Mock.mock(/\/api\/workerInfo/, "post", workerInfoApi.setData);
Mock.mock(/\/api\/workerInfo/, "put", workerInfoApi.changeData);
// 管理员接口
Mock.mock(/\/api\/adminInfo/, "get", workerInfoApi.getadminData);
Mock.mock(/\/api\/adminInfo/, "delete", workerInfoApi.delAdmin);

// 项目数据
const { allProjects } = Mock.mock({
  "allProjects|200": [
    {
      id: "@id()",
      "proName|1": [
        "梦幻腾冲",
        "深圳蔚蓝海岸",
        "南京仁恒江湾城",
        "成都鹭岛国际",
        "厦门海峡国际小区",
        "贵阳中铁逸都国际",
        "杭州金色海岸",
        "深圳香蜜湖水榭花都",
        "万科第五园",
        "华侨城波托菲诺",
        "北京天著春秋",
        "东莞松山湖湖岸花园",
      ],

      "owner|1": [
        "碧桂园	",
        "万科	",
        "融创中国",
        "保利发展",
        "中海",
        "华润置地",
        "世茂集团",
        "龙湖集团",
        "招商蛇口",
        "金地集团",
        "阳光城集团",
        "华侨城集团",
        "美的置业",
        "越秀地产",
      ],

      "projectType|1": [
       "1", /* 教育建筑 */
       "2", /* 居住建筑 */
       "3", /* 文化建筑 */
       "4", /* 体育建筑 */
       "5", /* 酒店建筑 */
       "6", /* 医疗建筑 */
       "7", /* 室内设计 */
      ],

      "department|1": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],

      "schedule|1": [
        "1",
        "2",
        "3",
      ] /* "概念方案设计", "方案报批通过", "已建成" */,

      // 项目描述
      paragraph: "@cparagraph(5)",
      date: "@date('yyyy-MM-dd')",
      projectUrl: "@url",
      "address|1": ["1", "2", "3", "4", "5"],

      "displayImg|+1": [
        {"url": require("@/assets/projectImg/2.jpg")},
        {"url": require("@/assets/projectImg/3.jpg")},
        {"url": require("@/assets/projectImg/4.jpg")},
        {"url": require("@/assets/projectImg/5.jpg")},
        {"url": require("@/assets/projectImg/6.jpg")},
        {"url": require("@/assets/projectImg/7.jpg")},
        {"url": require("@/assets/projectImg/8.jpg")},
        {"url": require("@/assets/projectImg/9.jpg")},
        {"url": require("@/assets/projectImg/10.jpg")},
        {"url": require("@/assets/projectImg/11.jpg")},
        {"url": require("@/assets/projectImg/12.jpg")},
        {"url": require("@/assets/projectImg/13.jpg")},
        {"url": require("@/assets/projectImg/15.jpg")},
    ],
    },
  ],
});

// 根据url获取query参数
let keywordStr = [];
const getQuery = (url) => {
  const index = url.indexOf("?");
  if (index !== -1) {
    const queryStrArr = url.substr(index + 1).split("&");
    // const queryStrArrItem = queryStrArr.split(",");
    queryStrArr.forEach((item) => {
      const itemArr = item.split("=");
      keywordStr.push(itemArr[1]);
    });
  } else {
    keywordStr = ["", "", "", "", ""];
  }
};

var searchDataLists = []
// get获取项目信息
Mock.mock(/\/api\/projects/, "get", (query) => {
  let queryUrl = decodeURIComponent(query.url);
  getQuery(queryUrl);
  searchDataLists = allProjects.filter((item) => {
    if (
      item.department.indexOf(keywordStr[0]) !== -1 &&
      item.projectType.indexOf(keywordStr[1]) !== -1 &&
      item.schedule.indexOf(keywordStr[2]) !== -1 &&
      item.address.indexOf(keywordStr[3]) !== -1 &&
      item.proName.indexOf(keywordStr[4]) !== -1 
    )
      return true;
    return false;
  });
  keywordStr = [];
  return {
    status: 200,
    msg: "获取数据成功",
    data: searchDataLists,
    total: searchDataLists.length,
  };
});

// post添加项目信息
Mock.mock(/\/api\/projects/, "post", (data) => {
  const newdata = JSON.parse(data.body);
  allProjects.unshift(
    Mock.mock({
      id: "@id()",
      proName: newdata.proName,
      department: newdata.department,
      projectType: newdata.projectType,
      schedule: newdata.schedule,
      detailUrl: "/projectIntroduce",
      paragraph: newdata.paragraph,
      date: newdata.date,
      projectUrl: newdata.projectUrl,
      displayImg: newdata.displayImg,
      address: newdata.address,
      owner: newdata.owner,
    })
  );
  return {
    status: 200,
    msg: "添加数据成功",
    data: allProjects,
    total: allProjects.length,
  };
});

//删除项目信息
Mock.mock(/\/api\/projects/, "delete", (query) => {
  getQuery(query.url);
  for (let i = 0; i < keywordStr.length; i++) {
    const index = searchDataLists.findIndex((item) => item.id === keywordStr[i]);
    searchDataLists.splice(index, 1);
  }
  keywordStr = [];
  return {
    status: 200,
    msg: "删除数据成功",
    data: searchDataLists,
    total: searchDataLists.length,
  };
});

// put修改项目信息
Mock.mock(/\/api\/projects/, "put", (data) => {
  const { id, proName, owner, department, projectType, schedule, paragraph, date, projectUrl, address, displayImg } =
    JSON.parse(data.body);
    searchDataLists.forEach((item) => {
      if (item.id === id) {
        item.proName = proName;
        item.owner = owner;
        item.department = department;
        item.projectType = projectType;
        item.schedule = schedule;
        item.paragraph = paragraph;
        item.date = date;
        item.projectUrl = projectUrl;
        item.displayImg = displayImg;
        item.address = address;
      }
    });
  return {
    status: 200,
    msg: "修改数据成功",
    data: searchDataLists,
    total: searchDataLists.length,
  };
});
