<template>
  <div class="role">
    <div class="zan-nav">
      <el-form
        :inline="true"
        :model="queryParams"
        class="demo-form-inline"
        label-position="right"
        label-width="84px"
      >
        <el-form-item label="宠物名：">
          <el-input
            v-model.trim="queryParams.petName"
            clearable
            placeholder="请输入宠物名"
            size="medium"
            @keyup.enter="getInfo(pagination)"
          ></el-input>
        </el-form-item>
        <el-form-item label="百科ID：">
          <el-input
            v-model.trim="queryParams.encyclopediaId"
            clearable
            placeholder="请输入百科ID"
            size="medium"
            @keyup.enter="getInfo(pagination)"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            icon="el-icon-search"
            type="primary"
            @click="getInfo(pagination)"
            >查 询</el-button
          >
          <el-button size="small" type="primary" @click="operation('add', {})"
            >新增百科</el-button
          >
          <el-button
            size="small"
            icon="el-icon-arrow-down"
            @click="isShow = !isShow"
            >展开</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="zan-table">
      <el-table
        :data="encyclopediaList"
        height="calc(100vh - 320px)"
        style="width: 100%"
      >
        <el-table-column prop="encyclopediaId" label="百科ID">
        </el-table-column>
        <el-table-column prop="petName" label="宠物名称"> </el-table-column>
        <el-table-column prop="petAlias" label="别名"> </el-table-column>
        <el-table-column prop="petCategory" label="类别"> </el-table-column>
        <el-table-column prop="petType" label="种类"> </el-table-column>
        <el-table-column prop="petImage" label="图片">
          <template #default="scope">
            <!--            :src="scope.row.petImage"-->
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.petImage"
              fit="cover"
              :preview-src-list="[scope.row.petImage]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="petIntroduction" label="基本介绍">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-space spacer="|" style="color: #dedede">
              <el-button type="text" @click="operation('edit', scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="toEnable(scope.row)">{{
                scope.row.enabled === "0" ? "启用" : "禁用"
              }}</el-button>
              <el-button type="text" @click="del(scope.row.encyclopediaId)"
                >删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
      <component
        :is="components.pagination"
        class="zan-pagination"
        @change="getInfo"
      ></component>
    </div>
    <el-dialog
      :title="logTitle"
      :before-close="close"
      v-model="addEncyclopedia"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="8vh"
    >
      <el-form
        :model="encyclopediaForm"
        ref="encyclopediaRef"
        :rules="encyclopediaRules"
        label-width="108px"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="宠物名称：" prop="petName">
              <el-input
                placeholder="请输入宠物名称"
                v-model="encyclopediaForm.petName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="别名：" prop="petAlias">
              <el-input
                placeholder="请输入宠物别名"
                v-model="encyclopediaForm.petAlias"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名：" prop="englishName">
              <el-input
                placeholder="请输入宠物英文名"
                v-model="encyclopediaForm.englishName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="类别：" prop="petCategory">
              <el-select
                v-model="encyclopediaForm.petCategory"
                placeholder="请选择宠物类别"
              >
                <el-option
                  v-for="item in petCategoryOptions"
                  :label="item.value"
                  :value="item.code"
                  :key="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="种类：" prop="petType">
              <el-select
                v-model="encyclopediaForm.petType"
                placeholder="请选择宠物种类"
              >
                <el-option
                  v-for="item in petTypeOptions"
                  :label="item.value"
                  :value="item.code"
                  :key="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="寿命：" prop="petAge">
              <el-input
                placeholder="请输入宠物的寿命"
                v-model="encyclopediaForm.petAge"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="身高（cm）：" prop="petHeight">
              <el-input
                placeholder="请输入宠物身高"
                v-model="encyclopediaForm.petHeight"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体重（kg）：" prop="petWeight">
              <el-input
                placeholder="请输入宠物体重"
                v-model="encyclopediaForm.petWeight"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市场参考价：" prop="petPrice">
              <el-input
                placeholder="请输入宠物的市场参考价"
                v-model="encyclopediaForm.petPrice"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="基本介绍：" prop="petIntroduction">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入宠物的基本介绍"
                v-model="encyclopediaForm.petIntroduction"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="宠物性格：" prop="petCharacter">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入宠物的性格"
                v-model="encyclopediaForm.petCharacter"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="饲养方法：" prop="petRear">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入宠物的饲养方法"
                v-model="encyclopediaForm.petRear"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="历史介绍：" prop="petHistory">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }"
                placeholder="请输入宠物的历史介绍"
                v-model="encyclopediaForm.petHistory"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注：" prop="marks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }"
                v-model="encyclopediaForm.marks"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="close">取 消</el-button>
          <el-button size="medium" type="primary" @click="ok">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  ref,
  provide,
  shallowRef,
} from "vue";
import {
  getEncyclopedia,
  saveEncyclopedia,
  editEncyclopedia,
  deleteEncyclopedia,
  startEnable,
} from "../../api/encyclopedia.js";
import { ElMessageBox } from "element-plus";
import Pagination from "../../components/Pagination/index.vue";
export default defineComponent({
  name: "encyclopedia",
  components: {
    Pagination,
  },
  setup() {
    const encyclopediaRef = ref(null);
    const state = reactive({
      isShow: false, //展开
      type: "add", //保存状态
      addEncyclopedia: false, //log开关
      logTitle: "新增宠物百科", //log title
      encyclopediaList: [],
      queryParams: {
        petName: "",
        encyclopediaId: "",
      },
      encyclopediaForm: {
        petName: "",
        petAlias: "",
        englishName: "",
        petCategory: "",
        petType: "",
        petAge: "",
        petHeight: "",
        petWeight: "",
        petPrice: "",
        petImage: "",
        petIntroduction: "",
        petHistory: "",
        petCharacter: "",
        petRear: "",
        marks: "",
      },
      pagination: {
        total: 1,
        page: 1,
      },
      encyclopediaRules: {
        petName: [
          { required: true, message: "请输入宠物名称", trigger: "blur" },
        ],
        petCategory: [
          { required: true, message: "请选择宠物类别", trigger: "change" },
        ],
        petType: [
          { required: true, message: "请选择宠物种类", trigger: "change" },
        ],
      },
      petCategoryOptions: [
        {
          code: "01",
          value: "犬类",
        },
        {
          code: "02",
          value: "猫类",
        },
      ],
      petTypeOptions: [
        {
          code: "01",
          value: "运动犬",
        },
        {
          code: "02",
          value: "狩猎犬",
        },
        {
          code: "03",
          value: "工作犬",
        },
        {
          code: "04",
          value: "梗类犬",
        },
        {
          code: "05",
          value: "玩赏犬",
        },
        {
          code: "06",
          value: "家庭犬",
        },
        {
          code: "07",
          value: "畜牧犬",
        },
        {
          code: "08",
          value: "其他犬种",
        },
      ],
    });

    provide("pagination", state.pagination); //父子传参
    const components = shallowRef({
      //子组件注册
      pagination: Pagination,
    });
    onMounted(() => {
      getInfo();
    });

    const getInfo = (val) => {
      //查询列表
      let dataWare = {
        encyclopediaId: state.queryParams.encyclopediaId,
        petName: state.queryParams.petName,
        pageSize: val?.pageSize ?? 10,
        page: val?.page ?? 1,
      };
      getEncyclopedia(dataWare).then((res) => {
        state.encyclopediaList = res?.data?.list ?? [];
        state.pagination.total = res?.data?.total ?? 1; //总条数
        state.pagination.page = res?.data?.page ?? 1; //当前页
      });
    };

    const operation = (type, target) => {
      //打开新增 编辑
      state.type = type;
      state.addEncyclopedia = true;
      const titleWare = {
        add: "新增宠物百科",
        edit: "编辑宠物百科",
      };
      state.logTitle = titleWare[type];
      if (type == "edit") {
        state.encyclopediaForm = { ...target };
      }
    };

    const ok = () => {
      //判断新增 编辑
      const item = {
        add: save,
        edit: edit,
      };
      encyclopediaRef.value.validate((vaild) => {
        if (vaild) {
          item[state.type]();
        }
      });
    };

    const save = () => {
      //新增
      saveEncyclopedia(state.encyclopediaForm).then((res) => {
        close();
        getInfo(state.pagination);
      });
    };

    const edit = () => {
      //编辑
      editEncyclopedia(state.encyclopediaForm).then((res) => {
        close();
        getInfo(state.pagination);
      });
    };

    const del = (id) => {
      //删除
      ElMessageBox.confirm("此操作将永久删除本条百科记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteEncyclopedia({
            encyclopediaId: id,
          }).then((res) => {
            getInfo(state.pagination);
          });
        })
        .catch(() => {});
    };

    const toEnable = (data) => {
      //启用 禁用

      if (data.enabled === "1") {
        data.enabled = 0;
      } else {
        data.enabled = 1;
      }
      startEnable(data).then((res) => {
        getInfo(state.pagination);
      });
    };

    const close = () => {
      //关闭
      encyclopediaRef.value.resetFields();
      state.encyclopediaForm = {
        petName: "",
        petAlias: "",
        englishName: "",
        petCategory: "",
        petType: "",
        petAge: "",
        petHeight: "",
        petWeight: "",
        petPrice: "",
        petImage: "",
        petIntroduction: "",
        petHistory: "",
        petCharacter: "",
        petRear: "",
        marks: "",
      };
      state.addEncyclopedia = false;
    };

    return {
      ...toRefs(state),
      encyclopediaRef,
      components,
      close,
      getInfo,
      operation,
      toEnable,
      ok,
      del,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>
