<template>
  <!-- 遍历图片 -->
  <div class="blankFillStyle" :style="blankFillStyle" @scroll="resLisScroll" ref="resListRef">
      <div v-if="listShwo" class="pic">
          <div class="info" v-for="item in sliceLists" :key="item.cardId">
<!--             <input
              type="checkbox"
              class="delCheckItem"
              v-model="checkedId"
              :value="item"
            /> -->
            <div>
              <span class="workerImg">US</span>
            </div>
<!--             <div class="materailText name">
              <a class="workerTitle">姓名</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.name) || '-'"
              ></a>
            </div>
            <div class="materailText sex">
              <a class="workerTitle">性别</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.sex_text) || '-'"
              ></a>
            </div>
            <div class="materailText phone">
              <a class="workerTitle">联系方式</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.phone) || '-'"
              ></a>
            </div> -->
            <div class="materailText email">
              <a class="workerTitle">邮箱</a>
              <a class="workerTitleInfo">{{ item.email || "-" }}</a>
            </div>
<!--             <div class="materailText cardId">
              <a class="workerTitle">身份证</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.cardId) || '-'"
              ></a>
            </div> -->
            <div class="materailText timer">
              <a class="workerTitle">上次登录时间</a>
              <a class="workerTitleInfo">{{ item.date || "-" }}</a>
            </div>
            <el-button
              class="edit"
              type="primary"
              style="padding: 5px 6px"
              plain
              size="mini"
              @click="changeItem(item)"
              v-permission="'edit'"
              >编辑 <i style="margin-left: 0px"> </i
            ></el-button>
            <el-button
              class="deleteBtn"
              @click="delItem(item.id)"
              style="padding: 5px 6px"
              type="danger"
              plain
              size="mini"
              v-permission="'delete'"
              >删除</el-button
            >
          </div>
        </div>
      <!-- <div class="loading">
        <a class="fa fa-spinner" v-show="loading"></a>
        <span v-show="loading">{{ msg }}</span>
      </div>
      <div class="end">
        <a class="fa fa-exclamation-circle" v-show="end"></a>
        <span v-show="end">{{ loadingEndMsg }}</span>
      </div>  -->
    </div>
</template>

<script>
import permission from "@/directives/permission";

export default {
  name: "VirtuaScroll",
    // 自定义指令
  directives: { permission },
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
    listShwo: {
      required: true,
      default: () => true,
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
      default: () => 81,
      type: Number,
    },
    // 单列数据宽度
    blockWidth: {
      default: () => 1260,
      type: Number,
    },
    // 容器 top 被遮盖区域
    containPaddingTop: {
      default: () => 70,
      type: Number,
    },
    // 容器左右被遮盖区域
    containPaddingSide: {
      default: () => 140,
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
      toTop: 0,
    };
  },
  methods: {
    // resLisScroll(){
    //   this.toTop = this.$refs.resListRef.scrollTop;
    // },

    // 获取容器最多含有的元素个数
    getContainSize() {
      // 获取一行元素个数
      this.blockItem = ~~(
        (document.documentElement.clientWidth - this.containPaddingSide) /
        this.blockWidth
      );
      // 行数 * 单行个数
      this.containSize =
        (~~(document.documentElement.clientHeight / this.blockHeight) + 2) *
        this.blockItem;
    },

    // 鼠标滚动
    resLisScroll() {
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
      this.currentScrollTop = this.$refs.resListRef.scrollTop;
      this.startIndex = ~~(
          (this.$refs.resListRef.scrollTop - this.containPaddingTop) /
          this.blockHeight
        ) * this.blockItem;
        // console.log('this.startIndex',this.startIndex);
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
      // console.log('startIndex',startIndex);
      console.log('endIndex',this.endIndex);
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
  height: 300px;
    // position: relative;
.pic{
  overflow: auto;
  height: 300px;
  width: 1286px;
  margin: 0 auto;
  border-radius: 6px;
  border: 1px rgb(185, 27, 27) solid;
  padding: 20px 0 20px 0;
  margin-bottom: 10px;
  .info {
  overflow: hidden;
    display: flex;
    align-items: center;
    width: 1260px;
    height: 70px;
    border: 1px rgb(230, 230, 230) solid;
    border-radius: 6px;
    margin: 0 auto;
    margin-bottom: 16px;
    .delCheckItem {
      margin: 0 24px;
    }
    .workerImg {
      margin-right: 50px;
      padding: 10px;
      background-color: #6b50d9;
      border-radius: 50%;
      color: #fff;
    }
    .workerId,
    .email,
    .cardId,
    .timer {
      width: 340px;
    }
    .name,
    .sex {
      width: 150px;
      //   background-color: #ff6263;
    }
    .phone {
      width: 250px;
      //   background-color: #8f1b1b;
    }
    .workerTitle {
      display: block;
      font-size: 12px;
      color: rgb(167, 167, 167);
      line-height: 26px;
    }
    .workerTitleInfo {
      line-height: 26px;
      font-size: 14px;
      color: rgb(53, 53, 53);
    }
    .deleteBtn {
      margin-right: 30px;
    }
  
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