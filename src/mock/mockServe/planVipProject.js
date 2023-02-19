import Mock from "mockjs";

// 项目数据
const { projectData } = Mock.mock({
  "projectData|60": [
    {
      id: "@id()",
      "proName|1": [
        "惠州华润小径湾",
        "都江堰万达文旅城",
        "保利昆明太平南城",
        "丽江·合力金虹置业金虹山",
        "成都港中旅金堂湾度假区",
        "陆川远辰世客城",
        "杭州艺尚小镇",
        "柳州李宁体育小镇",
      ],

      "projectType|1": [
        "1" /* 住宅规划 */,
        "2" /* 文旅城规划 */,
        "3" /* 商业街规划 */,
        "4" /* 学校规划 */,
        "5" /* 公园规划*/,
      ],

      "department|1": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],

      "displayImg|+1": [
          {"url": require("@/assets/planProjectImg/2.jpg")},
          {"url": require("@/assets/planProjectImg/3.jpg")},
          {"url": require("@/assets/planProjectImg/4.jpg")},
          {"url": require("@/assets/planProjectImg/5.jpg")},
          {"url": require("@/assets/planProjectImg/6.jpg")},
          {"url": require("@/assets/planProjectImg/7.jpg")},
          {"url": require("@/assets/planProjectImg/8.jpg")},
          {"url": require("@/assets/planProjectImg/9.jpg")},
          {"url": require("@/assets/planProjectImg/10.jpg")},
          {"url": require("@/assets/planProjectImg/1.jpg")},
      ],
      "schedule|1": [
        "1",
        "2",
        "3",
      ] /* "概念方案设计", "方案报批通过", "已建成" */,
      "detailUrl|1": ["/planProjectIntroduce"],
      "fromUrl|1": ["/planning"],
      // 项目描述
      paragraph: "@cparagraph(10)",
      date: '@date("yyyy-MM-dd")',
      projectUrl: "@url",
      "address|1": ["1", "2", "3", "4", "5"],
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

var searchData = [];
export default {
  getData: (query) => {
    let queryUrl = decodeURIComponent(query.url);
    getQuery(queryUrl);
    searchData = projectData.filter((item) => {
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
      message: "获取数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

  setData: (data) => {
    const newdata = JSON.parse(data.body);
    searchData.unshift(
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
      })
    );
    return {
      status: 200,
      msg: "添加数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

  changeData: (data) => {
    const { id, proName, department, projectType, schedule, paragraph, date, projectUrl, address, displayImg } =
    JSON.parse(data.body);
    searchData.forEach((item) => {
      if (item.id === id) {
        item.proName = proName;
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
      msg: "添加数据成功",
      data: searchData,
      total: searchData.length,
    };
  },

  delData: (query) => {
    getQuery(query.url);
    for (let i = 0; i < keywordStr.length; i++) {
      const index = searchData.findIndex((item) => item.id === keywordStr[i]);
      searchData.splice(index, 1);
    }
    keywordStr = [];
    return {
      status: 200,
      msg: "删除数据成功",
      data: searchData,
      total: searchData.length,
    };
  },
};
