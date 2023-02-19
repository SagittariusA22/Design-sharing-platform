<template>
  <div class="proDisplay">
    <div class="title">
      <p>
        <span class="title1">最新项目</span>
        <span class="title2">NEW PROJECTS</span>
      </p>
      <span class="title3" @click="toProject">MORE+</span>
    </div>
    <!-- 遍历图片 -->
    <div class="card">
      <div
        v-for="item in lists"
        :key="item.name"
        class="cardItem"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        @click="toDetail(item)"
      >
        <div
          class="img"
          :style="{ backgroundImage: 'url(' + item.displayImg.url + ')' }"
        >
          <div class="text">
            <p class="type">{{ item.projectType_text }}</p>
            <p class="name">{{ item.proName }}</p>
          </div>
        </div>
      </div>
      <div class="loading">
        <a class="fa fa-spinner" v-show="loading"></a>
        <span>{{ loading ? "加载中" : "已经到底了" }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getVipProject } from "@/api/api.js";
let sliceLists = [];
let sliceListsKey = 0;
import { delay } from "@/Utils/upLoadFile.js";

export default {
  name: "proDisplay",
  data() {
    return {
      lists: [],
      loading: true,
    };
  },
  watch: {
    // 监听store中的数据，避免刷新清空
    "$store.state.vipProject.homeProject": {
      handler: function (newVal) {
        if (newVal.length > 6) {
          // 长列表懒加载，切分数组，先放入第一组
          for (let i = 0; i < Math.ceil(newVal.length / 6); i++) {
            sliceLists[i] = newVal.slice(6 * i, 6 * (i + 1));
          }
          this.lists = sliceLists[sliceListsKey];
        } else {
          this.lists = newVal;
          this.loading = false;
        }
      },
    },
  },
  methods: {
    // 获取数据存入vuex
    getData() {
      getVipProject().then((res) => {
        const lists = res.data.data;
        lists.forEach((item) => {
          // 不要修改原数据
          item.department === "1"
            ? (item.department_text = "建筑设计一部")
            : item.department === "2"
            ? (item.department_text = "建筑设计三部")
            : item.department === "3"
            ? (item.department_text = "建筑设计四部")
            : item.department === "4"
            ? (item.department_text = "建筑设计五部")
            : item.department === "5"
            ? (item.department_text = "建筑设计六部")
            : item.department === "6"
            ? (item.department_text = "建筑设计九部")
            : item.department === "7"
            ? (item.department_text = "建筑设计十部")
            : item.department === "8"
            ? (item.department_text = "事业一部")
            : (item.department_text = "事业二部");
          item.projectType === "1"
            ? (item.projectType_text = "教育建筑")
            : item.projectType === "2"
            ? (item.projectType_text = "居住建筑")
            : item.projectType === "3"
            ? (item.projectType_text = "文化建筑")
            : item.projectType === "4"
            ? (item.projectType_text = "体育建筑")
            : item.projectType === "5"
            ? (item.projectType_text = "酒店建筑")
            : item.projectType === "6"
            ? (item.projectType_text = "医疗建筑")
            : (item.projectType_text = "室内设计");
          item.address === "1"
            ? (item.address_text = "华南地区")
            : item.address === "2"
            ? (item.address_text = "华东地区")
            : item.address === "3"
            ? (item.address_text = "华北地区")
            : item.address === "4"
            ? (item.address_text = "中部地区")
            : (item.address_text = "西部地区");
          item.schedule === "1"
            ? (item.schedule_text = "概念方案设计")
            : item.schedule === "2"
            ? (item.schedule_text = "方案报批通过")
            : (item.schedule_text = "已建成");
        });
        this.$store.commit("vipProject/setProjectData", lists);
        // 重新发送请求时重置状态
        this.loading = true;
        sliceLists = [];
        sliceListsKey = 0;
      });
    },
    toProject() {
      this.$router.push("/architecture");
    },
    // 鼠标滚动事件
    async scrollFn() {
      let winHeight = document.documentElement.clientHeight; /* 视窗高度 */
      let scrollHeight =
        document.documentElement.scrollTop; /* 滚动出去的高度 */
      let txetHeight = document.documentElement.scrollHeight; /* 文本高度 */
      // 可添加的项超过数组长度时返回
      if (sliceListsKey >= sliceLists.length - 1) {
        this.loading = false;
        return;
      }

      await delay(400)
      // 滚动出去的长度大于文本长度时继续加载
      if (winHeight + scrollHeight + 1 >= txetHeight) {
        sliceListsKey++;
        // 并入数组
        this.lists = this.lists.concat(sliceLists[sliceListsKey]);
      }
    },

  toDetail(val){
      this.$router.push({
        path:val.detailUrl,
        query: {
          from: "/Home",
          imgUrl: val.displayImg.url,
          proName: val.proName,
          projectType: val.projectType_text,
          schedule: val.schedule_text,
          department: val.department_text,
          paragraph: val.paragraph,
          date: val.date,
          projectUrl: val.projectUrl,
          address:val.address_text,
        },
      });
    },
  },
  mounted() {
    // 获取数据
    this.getData();
    // 监听鼠标事件
    window.addEventListener("scroll", this.scrollFn);
  },
  beforeDestroy() {
    // 移出监听
    window.removeEventListener("scroll", this.scrollFn);
  },
};
</script>

<style lang="less" scoped>
.proDisplay {
  margin-top: 100px;
  .title {
    color: #101820;
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin-bottom: 10px;
    .title1 {
      font-size: 30px;
      margin: 0 10px 0 40px;
      font-weight: bold;
    }
    .title2 {
      font-size: 15px;
    }
    .title3 {
      //鼠标移入变小手
      cursor: pointer;
      line-height: 20px;
      font-size: 14px;
      border: #333 1px solid;
      border-radius: 20px;
      padding: 8px 14px;
      margin-right: 40px;
      position: relative;
      top:-5px
    }
    .title3:hover {
      color: #fff;
      background-color: #101820;
    }
  }
  .card {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .cardItem {
      width: 49.8%;
      border-radius: 10px;
      overflow: hidden;
      height: 16vw;
      margin-bottom: 5px;
      position: relative;
      .img {
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: cover;
        // background-size:100%;
        background-repeat: no-repeat;
        background-position: center;
        transition: 2s;
        // object-fit: cover;
      }
      .img:hover {
        transform: scale(1.05);
      }
      .text {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.7) 10%,
          rgba(0, 0, 0, 0) 50%
        );
        color: #fff;
        opacity: 0;
        // pointer-events: none;
        .name {
          bottom: 30px;
          left: 50px;
          position: absolute;
          font-size: 20px;
        }
        .type {
          bottom: 54px;
          left: 50px;
          font-size: 14px;
          position: absolute;
        }
      }
      .text:hover {
        opacity: 1;
        transition: all 0.8s;
      }
    }
    .loading {
      line-height: 50px;
      margin: 0 auto;
      span {
        margin-left: 8px;
        font-size: 15px;
        // text-align: center;
      }
    }
    // 加载滚动
    a {
      animation: loading 1s linear infinite;
    }
    @keyframes loading {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>