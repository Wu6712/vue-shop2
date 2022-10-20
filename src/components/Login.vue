<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="touxiang">
        <img src="../assets/logo.png" alt="图片加载失败">
      </div>
      <!-- 输入框区域 -->
      <el-form ref="loginFormRef" :model="loginInfo" :rules="loginRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
        <el-input prefix-icon="el-icon-user-solid" v-model="loginInfo.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
        <el-input show-password prefix-icon="el-icon-lock" v-model="loginInfo.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="denglu">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 输入的登录信息
      loginInfo: {
        username: 'admin',
        password: '123456'
      },
      // 登录校验规则
      loginRules: {
        username: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 2, max: 10, message: '用户名长度在2到10个字符之间', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度在6到16个字符之间', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 重置按钮
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录按钮
    denglu() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const {data: result} = await this.$http.post(`login`, this.loginInfo)
        if (result.meta.status !== 200) {
          return this.$message.error(`${result.meta.msg}`)
        }
        this.$message.success('登录成功')
        // 保存token
        window.sessionStorage.setItem('token', result.data.token)
        // 页面跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.touxiang {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: 1px solid black;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #EEE;
  }
}

.inputs {
  margin-top: 100px;
  el-input__inner {
    margin-bottom: 10px;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

</style>