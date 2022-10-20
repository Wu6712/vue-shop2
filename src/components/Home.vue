<template>
  <div class="home">
    <el-button type="info" @click="tuichu">退出</el-button>
  </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {}
    },
    methods: {
        tuichu() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style>

</style>