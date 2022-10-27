<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" :border="true" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children"
              :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children"
                  :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable>
                      {{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                      @close="removeRightById(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框区域 -->
    <el-dialog title="分配权限" 
      :visible.sync="setRightDialogVisible" 
      width="50%" 
      @close="setRightDialogClosed">
      <el-tree 
        :data="rightsList"
        :props="treeProps" 
        show-checkbox 
        node-key="id" 
        default-expand-all 
        :default-checked-keys="defKeys" 
        ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UsersList',
  data() {
    return {
      // 所有角色列表
      roleList: [],
      // 分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 树形权限数据
      rightsList: [],
      // 树形控件的树形绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的key值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  methods: {
    // 获取所用角色列表
    async getRoleList() {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) {
        return this.$message.error(`${result.meta.msg}`)
      }
      this.roleList = result.data
    },
    // 根据id删除指定权限
    async removeRightById(role, rightId) {
      // 消息提示
      const confirmReault = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmReault !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 删除请求
      const { data: result } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (result.meta.status !== 200) {
        return this.$message.error(`${result.meta.msg}`)
      }
      return this.$message.success(`${result.meta.msg}`)
      role.children = this.result.data
    },
    // 展示分配权限对话框
    async showSetRight(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: result } = await this.$http.get('rights/tree')
      if (result.meta.status !== 200) {
        return this.$message.error(`${result.meta.msg}`)
      }
      this.rightsList = result.data

      // 递归获得三级权限id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )
    },
    // 监听分配权限对话框关闭
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if (res.meta.status !== 200) {
        return this.$message.error(`${res.meta.msg}`)
      }
      this.$message.success(`${res.meta.msg}`)
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>