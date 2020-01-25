import Vue from 'vue'
import Vuex from 'vuex'
import authModule from '@/vuex_module/authModule'
import messageModule from '@/vuex_module/messageModule'
import trelloModule from '@/vuex_module/trelloModule';

Vue.use(Vuex)

// モジュールをオブジェクトとして定義し、オプションに渡している。
const store = new Vuex.Store({
  modules: {
    auth: authModule,
    message: messageModule,
    trello: trelloModule
  }
})

export default store