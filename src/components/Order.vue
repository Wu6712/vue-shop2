<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单表格数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column width="100px" label="订单价格" prop="order_price"></el-table-column>
        <el-table-column width="100px" label="是否付款" prop="pay_status">
          <template scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100px" label="是否发货" prop="is_send"></el-table-column>
        <el-table-column width="170px" label="下单时间" prop="create_time">
          <template scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column width="120px" label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total">
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%" @close="addressDialogClose">
      <el-form :model="ruleForm" :rules="addressRules" ref="addressRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityDate" v-model="ruleForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="ruleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <!-- 时间线 -->
      <span>这里后台接口没有数据</span>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from './citydata.js'
export default {
  name: 'Order',
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 获取到的订单数据
      orderList: [],
      // 订单总数
      total: 0,
      // 修改地址对话框的显示与隐藏
      addressVisible: false,
      // 修改地址表单数据规则
      addressRules: {
        address1: [
          {required: true, message: '请选择地址', trigger: 'blur'}
        ],
        address2: [
          {required: true, message: '请填写详细地址', trigger: 'blur'}
        ]
      },
      // 修改地址表单数据
      ruleForm: {
        address1: [],
        address2: ''
      },
      // 城市资料
      cityDate,
      // 物流对话框的显示与隐藏
      progressVisible: false,
      // 获取的物流信息
      progressInfo: []
    }
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const {data: res} = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(`res.meta.msg`)
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList);
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听 pagenum 改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改按钮
    showBox() {
      this.addressVisible = true
    },
    // 监听对话框关闭事件
    addressDialogClose() {
      this.$refs.addressRef.resetFields()
    },
    // 物流进度按钮
    showProgressBox() {
      this.progressVisible = true
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>