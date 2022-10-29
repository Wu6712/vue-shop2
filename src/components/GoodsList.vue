<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框按钮区域 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" width="100px" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table区域 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
        <el-table-column width="120" prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column width="100" prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column width="160" prop="add_time" label="创建时间">
          <template scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作">
          <template scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="removeById(scope.row.goods_id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>

    
  </div>
</template>

<script>
export default {
  name: 'GoodsList',
  data() {
    return {
      // 查询参数 对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页码数
        pagesize: 10 // 每页显示数据 
      }, 
      // 总数据
      total: 0,
      // 商品数据
      goodsList: []
    }
  },
  methods: { 
    // 获取商品列表数据
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.total = res.data.total
      this.goodsList = res.data.goods
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 pagenum 变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    async removeById(id) {
      const resConfirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (resConfirm !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const {data: res} = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      return this.$message.success(`${res.meta.msg}`)
    },
    // 添加商品按钮
    goAddpage() {
      this.$router.push('/goods/add')
    }

  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>

</style>