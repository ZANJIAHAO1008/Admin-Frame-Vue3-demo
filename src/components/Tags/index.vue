<template>
  <div class="tags" v-if="tagsList.length > 0">
    <el-tag
      :key="tag"
      v-for="(tag, index) in tagsList"
      closable
      size="medium"
      :effect="path === tag.path ? 'dark' : 'plain'"
      @close="aClosingTag(tag, index)"
      @click="triggerTag(tag, 'go')"
      :disable-transitions="false"
    >
      {{ tag.title }}
    </el-tag>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  toRefs,
  reactive,
  ref,
  watch,
  computed,
  onMounted,
} from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import router from "../../router";

export default defineComponent({
  name: "tags",
  setup() {
    const store = useStore(); //vuex仓库
    const route = useRoute(); //路由
    const router = useRouter(); //路由
    let { proxy } = getCurrentInstance(); // vue原型
    const state = reactive({
      tagsList: computed(() => store.state.tagsList), //标签仓库
      path: "", //选中标签
    });

    const setTags = (route) => {
      // 设置标签
      const isExist = state.tagsList.some((item) => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        if (state.tagsList.length >= 10) {
          //如果标签到10个再选择就将最初的删除
          store.commit("delTags", { index: 0 });
        }
        store.commit("setTags", {
          name: route.name,
          title: route.meta.title,
          path: route.fullPath,
        });
      }
    };
    const aClosingTag = (tag, index) => {
      //删除标签
      if (state.tagsList.length <= 1) {
        //最后一个标签不能删
        ElMessage.warning({
          message: "最后一个标签了哦！",
          type: "warning",
        });
        return false;
      }
      store.commit("delTags", { index: index });
      triggerTag(state.tagsList[state.tagsList.length - 1], "go");
    };
    const triggerTag = (tag, type) => {
      //选择标签
      // debugger
      proxy._public.debounce(() => {
        state.path = tag.path;
        if (type) {
          //如果是点击标签则进行路由跳转
          router.push(tag.path);
        }
      }, 100);
    };
    onBeforeRouteUpdate((to) => {
      //监听路由变动
      setTags(to);
      triggerTag(to);
    });
    onMounted(() => {
      //监听路由变动
      setTags(route);
      triggerTag(route);
    });

    return {
      ...toRefs(state),
      setTags,
      aClosingTag,
      triggerTag,
    };
  },
});
</script>
<style lang="scss" scoped>
.tags {
  padding: 6px 0px;
  margin: 0px 12px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: auto;
  .el-tag {
    cursor: pointer;
    margin-right: 8px;
    //height: 30px;
    //padding: 0px 13px 0 9px;
    //line-height: 28px;
    //border-radius: 0;
  }
}
</style>
