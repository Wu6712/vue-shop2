<template>
    <div class="home">

        <el-container class="home_container">
            <!-- 头部区域 -->
            <el-header>
                <div class="header_left">
                    <img src="../assets/heima.png" alt="图片加载失败">
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="tuichu">退出</el-button>
            </el-header>
            <el-container>
                <!-- 左边区域 -->
                <el-aside :width="!isCollapse ? '200px' : '64px'">
                    <div class="toggle-button" @click="toggle_change">| | |</div>
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened
                        :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                        <!-- 一级菜单 -->
                        <el-submenu :index="item1.id + ''" v-for="item1 in this.menuList" :key="item1.id">
                            <!-- 一级菜单模板区域 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i :class="iconsObj[item1.id]"></i>
                                <!-- 文本 -->
                                <span>{{item1.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="'/' + item2.path" v-for="item2 in item1.children" :key="item2.id"
                                @click="saveNavStatus('/' + item2.path)">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{item2.authName}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 右边区域 -->
                <el-main>
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            // 菜单数据
            menuList: [],
            // 字体图标对象
            iconsObj: {
                '125': 'el-icon-s-custom',
                '103': 'el-icon-present',
                '101': 'el-icon-shopping-bag-1',
                '102': 'el-icon-document',
                '145': 'el-icon-data-analysis'
            },
            // 是否水平折叠
            isCollapse: false,
            // 被激活的用户链接
            activePath: ''
        }
    },
    methods: {
        // 退出按钮
        tuichu() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取所有菜单列表
        async getMenuList() {
            const { data: result } = await this.$http.get(`menus`)
            if (result.meta.status !== 200) {
                return this.$message.error(`${result.msg}`)
            }
            this.menuList = result.data
        },
        // 点击和收缩侧边栏
        toggle_change() {
            this.isCollapse = !this.isCollapse
        },
        // 
        saveNavStatus(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }

    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    }
}
</script>

<style lang="less" scoped>
.home {
    height: 100%;
}

.home_container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    div {
        display: flex;
        align-items: center;

        span {
            margin-left: 10px;
        }
    }
}

.el-aside {
    background-color: #333744;
}

.el-main {
    background-color: #eaedf1;
}

.toggle-button {
    background-color: #4a5064;
    text-align: center;
    font-size: 10px;
    line-height: 20px;
    color: #fff;
    cursor: pointer;
}

.el-menu {
    border-right: 0;
}
</style>