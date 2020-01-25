<template>
  <div id="app">
    <global-header :user="user"></global-header>   <!-- componentで設定した名前をHTMLカスタムタグのように使用できる。 -->
    <router-view class="container"></router-view>
    <!--<app-footer></app-footer>-->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import AppHeader from '@/components/AppHeader'
import GlobalHeader from '@/components/GlobalHeader'
export default {
  name: 'app',
  components: { GlobalHeader },
  data () {
    return {
      boardName: ''
    }
  },
  computed: {
    ...mapState([
      'user',
      'boards'
    ])
  },
  methods: {
    ...mapActions([
      'addBoard'
    ]),
    add () {
      this.addBoard({ name: this.boardName })
      this.boardName = ''
    }
  }
}
</script>

<style scoped>
  #app {
    box-sizing: border-box;
    color: #37474f;
    font-family: 'Lato', Helvetica, Arial, sans-serif;
    margin: 0 auto;
    padding: 0;
    text-align: center;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }
  .container {
    padding-bottom: 4rem;
  }
</style>