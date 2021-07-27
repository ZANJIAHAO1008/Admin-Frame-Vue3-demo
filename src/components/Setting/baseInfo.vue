<template>
  <el-drawer
      :before-close="close"
      :model-value="baseVisible"
      title="基本信息"
  >

  </el-drawer>
</template>

<script>
import {defineComponent, ref, reactive} from 'vue';

export default defineComponent({
  name: 'baseInfo',
  props: {
    baseVisible: Boolean
  },
  setup(props, context) {
    const close = () => {
      context.emit('update:baseVisible', false);
    };

    return {
      close
    }
  },
});
</script>
