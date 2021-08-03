<template>
  <div class="sidebar">
    <el-menu
        :default-active="onRoutes"
        class="sidebar-el-menu"
        :collapse="collapse"
        collapse-transition
        unique-opened
        background-color="#001529"
        active-text-color="#ffffff"
        text-color="#C0C4CC"
        router
    >
      <template v-for="item in menuItem">
        <template v-if="item.children.length > 0">
          <el-submenu :key="item.resourceUrl" :index="item.resourceUrl">
            <template #title>
              <i :class="item.resourceIcon"></i>
              <span class="sidebar-title">{{ item.resourceName }}</span>
            </template>
            <template v-for="childItem in item.children">
              <el-submenu
                  v-if="childItem.children.length >0"
                  :key="childItem.resourceUrl"
                  :index="childItem.resourceUrl"
              >
                <template #title>
                  <i :class="childItem.resourceIcon"></i>
                  <span class="sidebar-title">{{ childItem.resourceName }}</span>
                </template>
                <el-menu-item
                    v-for="(grandsonItem, i) in childItem.children"
                    :key="i"
                    :index="grandsonItem.resourceUrl"
                >
                  <span class="sidebar-title">{{ grandsonItem.resourceName }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                  v-else
                  :key="childItem.resourceUrl"
                  :index="childItem.resourceUrl"
              >
                <template #title>
                  <i :class="childItem.resourceIcon"></i>
                  <span class="sidebar-title">{{ childItem.resourceName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item :key="item.resourceUrl" :index="item.resourceUrl">
            <i :class="item.resourceIcon"></i>
            <template #title class="sidebar-title">{{ item.resourceName }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { defineComponent, toRefs, reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "sidebar",
  setup() {
    const store = useStore();
    const router = useRouter(); //路由
    const route = useRoute(); //路由

    const state = reactive({
      menuItem: computed(() => store.state.user.resourceList), //查询菜单栏
      onRoutes: computed(() => route.path),
      collapse: computed(() => store.state.collapse),
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="less">
.sidebar {
  height: 100%;

  .zan-title {
    display: block;
    height: 71px;
    line-height: 71px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    background: #303133;
    color: hsla(0, 0%, 100%, .7);
  }

  .fa {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    color: #c0c4cc;
  }
}
</style>
