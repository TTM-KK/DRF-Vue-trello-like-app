<template>
  <!-- ヘッダナビゲーション -->
  <div id="header">
    <b-navbar type="dark" variant="dark">
      <a class="navbar-brand" href="/">Trello like App</a>
      <b-navbar-nav class="ml-auto" v-if="$route.meta.requiresAuth">
        <b-nav-item-dropdown right v-if="isLoggedIn">
          <template slot="button-content">{{ username }}</template>
          <b-dropdown-item href="#" @click="clickLogout">ログアウト</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item href="#" @click="clickLogin" v-else>ログイン</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar>
      <a class="nav-text" href="/">Boards一覧へ</a>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    computed: {
      username: function () {
        return this.$store.getters['auth/username']
      },
      isLoggedIn: function () {
        return this.$store.getters['auth/isLoggedIn']
      }
    },
    methods: {
      // ログアウトリンク押下
      clickLogout: function () {
        this.$store.dispatch('auth/logout')
        this.$store.dispatch('message/setInfoMessage', {message: 'ログアウトしました。'})
        this.$router.replace('/login')
      },
      // ログインリンク押下
      clickLogin: function () {
        this.$store.dispatch('message/clearMessages')
        this.$router.replace('/login')
      }
    }
  }
</script>

<style scoped>
  .nav-text{
    text-align: left;
    font-size: 1.2rem;
    color: #000;
    text-decoration: none;
  }
</style>