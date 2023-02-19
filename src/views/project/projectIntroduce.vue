<template>
  <div class="projectIntroduce">
    <div class="img">
      <img :src="this.$route.query.imgUrl" />
    </div>
    <div @click="back" class="back">
      <span @click="back">BACK</span>
    </div>
    <div class="title text">
      <span>{{ this.$route.query.proName }}</span>
      <a>Architectural scheme planning and design</a>
    </div>
    <div class="line"></div>
    <div class="info">
      <div>
        <div class="text">
          <a>项目类型 Architectural Design Type </a>
          <span>{{ this.$route.query.projectType }}</span>
        </div>
        <div class="text">
          <a>项目地区 address</a>
          <span>{{ this.$route.query.address }}</span>
        </div>
        <div class="text">
          <a>项目服务范围/建设情况 SERVICE & Building progress</a>
          <span>{{ this.$route.query.schedule }}</span>
        </div>
        <div class="text">
          <a>设计团队 TEAM</a>
          <span>{{ this.$route.query.department }}</span>
        </div>
        <div class="text">
          <a>设计完成时间 DESIGN COMPLETION</a>
          <span>{{ this.$route.query.date }}</span>
        </div>
        <div class="text">
          <a>
            项目服务器地址 server address
            <el-tooltip
              class="item"
              effect="dark"
              content="复制项目链接"
              placement="right-end"
            >
              <span
                class="fa fa-copy"
                id="copy"
                :data-clipboard-text="this.$route.query.projectUrl"
                data-clipboard-action="copy"
                @click="copyUrl"
              ></span>
            </el-tooltip>
          </a>
          <span id="url">{{ this.$route.query.projectUrl }}</span>
        </div>
      </div>
      <div class="introduction">
        <a>项目简介 Project Description</a>
        <span>{{ this.$route.query.paragraph }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";

export default {
  name: "projectIntroduce",
  methods: {
    back() {
      this.$router.push({
        path: this.$route.query.from,
      });
    },
    // 复制任务名称
    copyUrl() {
      let clipboard = new Clipboard("#copy");
      clipboard.on("success", (e) => {
        this.$message.success("已复制至剪切板"); // 利用Element组件给予成功提示
        clipboard.destroy(); // 释放内存
      });
      clipboard.on("error", (e) => {
        this.$message.error("该浏览器不支持自动复制"); // 给予错误提示信息
        clipboard.destroy(); // 释放内存
      });
    },
  },
};
</script>

<style lang="less" scoped>
.projectIntroduce {
  overflow: hidden;
  position: relative;
  .img {
    width: 100%;
    height: 600px;
    margin-bottom: 40px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .back {
    position: absolute;
    right: 40px;
    top: 640px;
    text-decoration: none;
    margin-left: 40px;
    span {
      padding: 5px 10px;
      font-size: 14px;
      border: rgb(116, 116, 116) 1px solid;
      border-radius: 20px;
      user-select: none;
      color: rgb(116, 116, 116);
    }
    span:hover {
      color: #fff;
      background-color: #101820;
    }
  }
  .title {
    font-weight: bold;
    margin: 0 40px;
    span {
      font-size: 24px;
      margin-bottom: 9px;
      display: block;
    }
    a {
      font-size: 18px;
    }
  }
  .line {
    height: 1px;
    background-color: rgba(78, 78, 78, 0.2);
    margin: 20px 40px;
  }
  .info {
    margin: 0 32px 40px 40px;
    display: flex;
    justify-content: space-between;
    .text {
      padding: 12px 0;
      a {
        font-size: 14px;
        color: rgb(116, 116, 116);
        text-transform: uppercase;
        display: block;
        margin-bottom: 9px;
        span {
          color: #4b4b4b;
          font-size: 15px;
          font-weight: bold;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      span {
        font-size: 16px;
        color: rgb(27, 27, 27);
        text-transform: uppercase;
      }
    }
    .introduction {
      width: 40%;
      a {
        display: block;
        margin: 12px 0;
        font-size: 14px;
        color: rgb(116, 116, 116);
        text-transform: uppercase;
      }
      span {
        color: rgb(27, 27, 27);
        line-height: 24px;
      }
    }
  }
}
</style>