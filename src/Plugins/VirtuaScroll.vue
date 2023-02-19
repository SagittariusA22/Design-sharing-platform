<template>
  <!-- 遍历图片 -->
  <div class="blankFillStyle" :style="blankFillStyle">
    <div class="outerLoading">
      <div class="scroll-container" ref="scrollContainer">
        <div v-for="item in sliceLists" :key="item.name" class="cardItem">
          <slot :sendItem="item"></slot>
        </div>
      </div>
      <div class="loading">
        <a class="fa fa-spinner" v-show="loading"></a>
        <span v-show="loading">{{ msg }}</span>
      </div>
      <div class="end">
        <a class="fa fa-exclamation-circle" v-show="end"></a>
        <span v-show="end">{{ loadingEndMsg }}</span>
      </div> 
    </div>
  </div>
</template>

<script>

export default {
  name: "VirtuaScroll",
  props: {
    lists: {
      required: true,
      default: () => [],
      type: Array,
    },
    end: {
      required: true,
      default: () => false,
      type: Boolean,
    },
    msg: {
      default: () => "正在加载中...",
      type: String,
    },
    loadingEndMsg: {
      default: () => "无更多数据",
      type: String,
    },
    // 单行数据高度，含行距
    blockHeight: {
      default: () => 372,
      type: Number,
    },
    // 单列数据宽度
    blockWidth: {
      default: () => 332,
      type: Number,
    },
    // 容器 top 被遮盖区域
    containPaddingTop: {
      default: () => 70,
      type: Number,
    },
    // 容器左右被遮盖区域
    containPaddingSide: {
      default: () => 80,
      type: Number,
    },
    // 请求状态
    loading: {
      required: true,
      default: () => true,
      type: Boolean,
    },
  },
  data() {
    return {
      // 容器单行元素个数
      blockItem: 0,
      // 可视区元素总数
      containSize: 0,
      // 第一个图片索引
      startIndex: 0,
      // 当前滚动事件的状态,节流
      isScrollStatus: true,
      // 当前滚动出去的高度,返回原位
      currentScrollTop: 0,
    };
  },
  methods: {
    // 获取容器最多含有的元素个数
    getContainSize() {
      // 获取一行元素个数
      this.blockItem = ~~(
        (document.documentElement.clientWidth - this.containPaddingSide) /
        this.blockWidth
      );
      console.log(document.documentElement.clientWidth,this.containPaddingSide);
      this.blockItem = this.blockItem < 3 ? 3 : this.blockItem;
      // 行数 * 单行个数
      this.containSize =
        (~~(document.documentElement.clientHeight / this.blockHeight) + 2) *
        this.blockItem;
    },

    // 鼠标滚动
    handleScroll() {
      console.log(this.startIndex);
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
      // 记录当前滚动出去的高度，用于返到原位，一定不要减 this.containPaddingTop
      this.currentScrollTop = document.documentElement.scrollTop;
      // 第一个元素的索引不变化时，直接return,优化性能，但有bug
      // let currentIndex =
      //   ~~(
      //     (document.documentElement.scrollTop - this.containPaddingTop) /
      //     this.blockHeight
      //   ) * this.blockItem;
      // if (this.startIndex === currentIndex && this.lists.length > this.containSize) return;
      this.startIndex = ~~(
          (document.documentElement.scrollTop - this.containPaddingTop) /
          this.blockHeight
        ) * this.blockItem;
      // 判断是否到底
      if (
        (this.startIndex + this.containSize > this.lists.length - 1 &&
        !this.loading) || this.lists.length <= this.containSize
      ){
        this.$emit("getMoreProjectData");
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
    });
  },
  // 路由失活
  deactivated() {
    // 移出监听
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  created() {
    // 获取数据
    this.$emit("getProjectData");
  },

  // 页面加载，dom结构渲染完成 mounted
  mounted() {
    // 监测窗口大小变化，获取容器最多含有的元素个数,
    this.getContainSize();
    window.onresize = this.getContainSize;
    // 监听元素滚动事件
      window.addEventListener("scroll", this.handleScroll, true);
  },
};
</script>

<style lang="less" scoped>
.blankFillStyle {
  width: 100%;
  .scroll-container {
    padding: 0px 40px;
    padding-top: 200px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .cardItem {
      // width: 330px;
      margin-bottom: 50px;
    }
  }
  .loading {
    line-height: 50px;
    margin-left: 50%;
    margin-bottom: 10px;
    position: relative;
    right: 50px;
    span {
      margin-left: 8px;
      font-size: 16px;
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
  .end {
    line-height: 50px;
    margin-left: 50%;
    margin-bottom: 10px;
    position: relative;
    right: 50px;
    span {
      margin-left: 8px;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>