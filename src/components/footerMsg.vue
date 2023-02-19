<template>
  <div class="footer">
    <img src="@/assets/img/foot.png" />
    <span
      >Copyright 1998~2023 ALL Righted 版权所有：PTAD（深圳）有限公司
      <a href="https://beian.miit.gov.cn/#/Integrated/index">粤 ICP 备 14050230号</a>
    </span>
  </div>
</template>

<script>
export default {
  name: "footerMsg",
};
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  color: #988c8c;
  font-size: 14px;
  background-color: #ebebeb;
  height: 100%;
  width: 100%;
  align-items: center;

  img {
    height: 30px;
    margin-left: 74px;
  }
  span {
    margin-right: 30px;
    a {
      color: #988c8c;
      text-decoration: none;
    }
  }
}
</style>