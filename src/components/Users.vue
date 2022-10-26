<template>
  <div class="users">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 搜索 -->
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList">
            </el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="usersList" :border="true" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配权限按钮 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="50%" @close="addUserDialog">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框区域 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%" @close="setRoleDialogClose">
      <div>
        <p>当前的用户是: {{userInfo.username}}</p>
        <p>当前的角色是: {{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
  // 验证邮箱的规则
  let checkEmail = (rule, value, callback) => {
    // 邮箱的正则表达式
    const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (regEmail.test(value)) {
      // success
      return callback()
    }
    // error
    return callback(new Error('请输入合法的邮箱'))
  }

  // 验证手机号的规则
  let checkMObile = (rule, value, callback) => {
    const regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ 
    if (regMobile.test(value)) {
      // success
      return callback()
    }
    // error
    callback(new Error('请输入合法的手机号码'))
  }

    return {
      // 用户数据列表请求对象
      queryInfo: {
        // 搜索的关键字
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 用户数据列表
      usersList: [],
      // 用户总数
      total: 0,
      // 添加用户对话框的显示与隐藏
      addUserDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加验证规则
      addFormRules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: ['blur', 'change']},
          {min: 2, max: 10, message: '用户名在2-10个字符之间', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: ['blur', 'change']},
          {min: 6, max: 16, message: '密码在6-16个字符之间', trigger: ['blur', 'change']}
        ],
        email: [
          {required: true, message: '邮箱不能为空', trigger: ['blur', 'change']},
          {validator: checkEmail, trigger: ['blur', 'change']}
        ],
        mobile: [
          {required: true, message: '手机不能为空', trigger: ['blur', 'change']},
          {validator: checkMObile, trigger: ['blur', 'change']}
        ]
      },
      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的用户信息
      editForm: {},
      // 分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 角色列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: ''
    }
  },
  methods: {
    // 获取用户数据列表
    async getUsersList() {
      const { data: result } = await this.$http.get('users', { params: this.queryInfo })
      this.usersList = result.data.users
      this.total = result.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听当前页码数改变
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 修改用户状态
    async userStateChanged(userInfo) {
      // console.log(userInfo);
      const { data: result } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(`${result.meta.msg}`)
      }
      this.$message.success(`${result.meta.msg}`)
    },
    // 添加用户
    addUser() {
      this.addUserDialogVisible = true
    },
    // 监听对话框的关闭功能
    addUserDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    // 因为我不确定它是数据合格还是不合格之后点击确认按钮，所以要进行判断
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data: result} = await this.$http.post(`users`, this.addForm)
        if (result.meta.status !== 201) {
          return this.$message.error(`${result.meta.msg}`)
        }
        this.$message.success(`${result.meta.msg}`)
        this.addUserDialogVisible = false
        this.getUsersList()
      })
    },
    // 点击修改按钮
    async showEditDialog(id) {
      const {data: result} = await this.$http.get(`users/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error(`${result.meta.msg}`)
      }
      this.editForm = result.data
      this.editDialogVisible = true
    },
    // 确认提交用户修改信息
    editUserInfo() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return
        const {data: result} = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (result.meta.status !== 200) {
          return this.$message.error(`${result.meta.msg}`)
        }
        this.editDialogVisible = false
        this.getUsersList()
        return this.$message.success(`${result.meta.msg}`) 
        })
    },
    // 删除用户
    async deleteUser(id) {
      const consfirResult = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (consfirResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }  
      const {data: result} = await this.$http.delete(`users/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error(`${result.meta.msg}`)
      }
      return this.$message.success(`${result.meta.msg}`)
      this.getUsersList()
    },
    // 展示分配角色的对话框 
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 显示对话框之前获取角色列表
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色!')
      }
      const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.$message.success(`${res.meta.msg}`)
      this.getUsersList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClose() {
      this.selectedRoleId = ''
    }
  },
  created() {
    // 获取用户列表
    this.getUsersList()
  }
}
</script>

<style lang="less" scoped>
.el-table__header {
  text-align: center;
}
</style>