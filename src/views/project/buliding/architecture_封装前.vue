<template>
  <div class="architecture">
    <div class="search"></div>
    <!-- 遍历图片 -->
    <div class="blankFillStyle" :style="blankFillStyle">
      <div class="outerLoading">
        <div class="scroll-container" ref="scrollContainer">
          <div v-for="item in sliceLists" :key="item.name" class="cardItem">
            <router-link :to="item.url">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <div class="imgText">
                  <div class="imgOuter">
                    <img
                      :src="item.displayImg.url"
                      :alt="item.displayImg.alt"
                    />
                  </div>
                  <div class="text">
                    <p class="name">{{ item.proName }}</p>
                    <p class="type">{{ item.projectType }}</p>
                    <p class="schedule">{{ item.schedule }}</p>
                  </div>
                </div>
              </el-card>
            </router-link>
          </div>
        </div>
        <div class="loading">
          <a class="fa fa-spinner" v-show="loading"></a>
          <span v-show="loading">{{ msg }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVipProject } from "@/api/api.js";

export default {
  name: "architecture",
  data() {
    return {
      lists: [],
      loading: false,
      msg: "正在加载中",
      // 单行数据高度，含行距
      blockHeight: 372,
      // 单列数据宽度
      blockWidth: 332,
      // 容器 top 被遮盖区域
      containPaddingTop: 70,
      // 容器左右被遮盖区域
      containPaddingSide: 140,
      // 容器单行元素个数
      blockItem: 0,
      // 可视区元素总数
      containSize: 0,
      // 第一个图片
      startIndex: 0,
      // 当前滚动事件的状态
      isScrollStatus: true,
      // 当前滚动出去的高度,返回原位
      currentScrollTop: 0,
    };
  },
  methods: {
    // 获取数据存入vuex
    getData() {
      (this.loading = true),
        // 调用接口获取精品项目
        getVipProject().then((res) => {
          this.lists = [...this.lists, ...res.data.data];
          this.loading = false;
        });
    },
    // 获取容器最多含有的元素个数
    getContainSize() {
      // 获取一行元素个数
      this.blockItem = ~~(
        (document.documentElement.clientWidth - this.containPaddingSide) /
        this.blockWidth
      );
      this.blockItem = this.blockItem < 3 ? 3 : this.blockItem;
      // 行数 * 单行个数
      this.containSize =
        (~~(document.documentElement.clientHeight / this.blockHeight) + 2) *
        this.blockItem;
    },

    // 鼠标滚动
    handleScroll() {
      console.log("gd", this.currentScrollTop);
      if (this.isScrollStatus) {
        this.isScrollStatus = false;
        // 定时器，滚动事件的节流
        let scrollTimer = setTimeout(() => {
          this.isScrollStatus = true;
        }, 30);
        // 将滚动事件的具体行为抽离到外面
        this.setDataStartIndex();
      }
    },
    // 抽离滚动事件的具体行为：执行数据设置
    setDataStartIndex() {
      // 记录当前滚动出去的高度，一定不要减 this.containPaddingTop
      this.currentScrollTop = document.documentElement.scrollTop;
      // console.log(this.currentScrollTop);
      // 第一个元素的索引不变化时，直接return
      let currentIndex =
        ~~(
          (document.documentElement.scrollTop - this.containPaddingTop) /
          this.blockHeight
        ) * this.blockItem;
      if (this.startIndex === currentIndex) return;
      this.startIndex = currentIndex;
      // 判断是否到底
      if (
        this.startIndex + this.containSize > this.lists.length - 1 &&
        !this.loading
      ) {
        this.getData();
      }
    },
  },
  computed: {
    // 根据开始索引直接计算结束索引
    endIndex() {
      let endIndex = this.startIndex + this.containSize * 2 - 1;
      // 底部时特殊考虑
      if (!this.lists[endIndex]) {
        endIndex = this.lists.length - 1;
      }
      return endIndex;
    },
    // 可视区域内的数据
    sliceLists() {
      // 预留可视区上部一倍的渲染空间
      let startIndex = 0;
      if (this.startIndex <= this.containSize) {
        startIndex = 0;
      } else {
        startIndex = this.startIndex - this.containSize;
      }
      // 截取数据
      return this.lists.slice(startIndex, this.endIndex + 1);
    },

    // 空白填充
    blankFillStyle() {
      let startIndex = 0;
      if (this.startIndex <= this.containSize) {
        startIndex = 0;
      } else {
        startIndex = this.startIndex - this.containSize;
      }
      return {
        "padding-top": (startIndex / this.blockItem) * this.blockHeight + "px",
        "padding-bottom":
          Math.ceil((this.lists.length - this.endIndex - 1) / this.blockItem) *
            this.blockHeight +
          "px",
      };
    },
  },
  // 路由激活
  activated() {
    //在keep-alive路由模式下，切换路由时确保能够返回用户之前所在位置
    this.$nextTick(() => {
      // 监听元素滚动事件
      window.addEventListener("scroll", this.handleScroll, true);
      // 跳转到上一次浏览位置
      document.documentElement.scrollTop = this.currentScrollTop;
      console.log("激活", this.currentScrollTop);
    });
  },
  // 路由失活
  deactivated() {
    // 移出监听
    window.removeEventListener("scroll", this.handleScroll, true);
    console.log("失活", this.currentScrollTop);
  },
  created() {
    // 获取数据
    this.getData();
  },

  // 页面加载，dom结构渲染完成 mounted
  mounted() {
    // 监测窗口大小变化，获取容器最多含有的元素个数,
    this.getContainSize();
    window.onresize = this.getContainSize;
  },

  beforeDestroy() {
    console.log("销毁", this.currentScrollTop);
  },
};
</script>

<style lang="less" scoped>
.architecture {
  width: 100%;
  height: 100%;
  // overflow: auto;
  overflow-y: auto;
  .scroll-container {
    // overflow: auto;
    // height: 100%;
    padding: 0px 70px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .cardItem {
      width: 330px;
      margin-bottom: 50px;
      .imgOuter {
        width: 330px;
        height: 230px;
        overflow: hidden;
        margin-bottom: 10px;
      }
      img {
        width: 100%;
        height: 100%;
        transition: 1.5s;
        object-fit: cover;
      }
      img:hover {
        transform: scale(1.05);
      }
      .text {
        width: 100%;
        height: 100%;
        color: #101820;
        margin-left: 10px;
        .name {
          font-size: 18px;
          font-weight: 600;
        }
        .type {
          font-size: 14px;
          margin: 10px 0;
        }
        .schedule {
          margin-bottom: 14px;
          font-size: 14px;
        }
      }
    }
  }
  .loading {
    line-height: 50px;
    background-color: aqua;
    margin: 0 auto;
    span {
      margin-left: 8px;
      font-size: 15px;
      text-align: center;
    }
    a {
      animation: loading 1s linear infinite;
    }
    // 加载滚动
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