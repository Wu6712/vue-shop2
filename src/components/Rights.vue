<template>
  <div class="rights">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-table
        :data="rightsList"
        style="width: 100%" :border="true">
        <el-table-column type="index" :span="1"></el-table-column>
        <el-table-column 
          prop="authName"
          label="权限名称"
          :span="8">
        </el-table-column>
        <el-table-column 
          prop="path"
          label="路径"
          :span="8">
        </el-table-column>
        <el-table-column 
          prop="level"
          label="权限等级"
          :span="7">
          <template scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights',
  data() {
    return {
      // 所有权限数据
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const {data: result} = await this.$http.get(`rights/list`)
      if (result.meta.status !== 200) {
        return this.$message.error(`${result.meta.msg}`)
      }
      this.rightsList = result.data
    }
  },
  created() {
    // 获取所有权限
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped>

</style>