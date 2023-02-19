import Mock from "mockjs";
export default {
  getImg: (config) => {
    return {
      status: 200,
      message: "获取数据成功",
      data: {
        displayImg: [
          {
            url: require("@/assets/displayImg/1.jpg"),
            alt: "商场",
          },
          {
            url: require("@/assets/displayImg/2.jpg"),
            alt: "售楼处",
          },
          {
            url: require("@/assets/displayImg/4.jpg"),
            alt: "别墅",
          },
          {
            url: require("@/assets/displayImg/6.jpg"),
            alt: "室内",
          },
          {
            url: require("@/assets/displayImg/7.jpg"),
            alt: "商场",
          },
        ],
      },
    };
  },
};
