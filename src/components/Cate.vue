<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table class="treeTable" :data="cateList">
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="分类名称">
          <el-tree :data="cateList" :props="treeProps"></el-tree>
        </el-table-column>
        <!-- 是否有效 -->
        <el-table-column label="是否有效">
          <template scope="scope">
            <i class="el-icon-check" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-close" v-else style="color: red"></i>
          </template>
        </el-table-column>
        <!-- 排序 -->
        <el-table-column label="排序">
          <template scope="scope">
            <el-tag size="mini" type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1, //当前页码
        pagesize: 5 // 一页显示多少数据
      },
      // 数据总数
      total: 0,
      // 树形控件的树形绑定对象
      treeProps: {
        label: 'cat_name',
        children: 'children'
      },
      // 
      list: []
    }
  },
  methods: {
    // 获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听 pageSize 变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>>
