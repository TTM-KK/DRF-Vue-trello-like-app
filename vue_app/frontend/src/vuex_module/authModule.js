import api from '@/services/api'
// 認証情報
const authModule = {
  strict: process.env.NODE_ENV !== 'production',  // strictモードによるエラーを検知するためにはコストが掛かるため、本番環境では必ず、Falseに設定する用に
  namespaced: true,  // namespaceを設定しているとモジュールの名前をgetters, mutations, actionsを呼び出すときに使用する事ができる（推奨。コンポーネントの再利用がしやすくなる。
  state: {  // アプリケーションの状態を管理
    username: '',  // vuexで管理する変数
    isLoggedIn: false
  },
  getters: {  // stateのいち部やstateから返された値を保持する。　vue componentのcomputedプロパティに当たるもの（算出プロパティ）。プロパティアクセススタイルとメソッドアクセススタイルの2つがある。
    username: state => state.username,  //　メソッドアクセススタイルは引数を渡すことが可能である。
    isLoggedIn: state => state.isLoggedIn
  },
  mutations: {  // stateを更新させる。
    set(state, payload) {  // stateでvuexのstateを操作する。payloadはオブジェクトとして引数として渡される
      state.username = payload.user.username  // mapGettersヘルパーをコンポーネント側で使用すれば、短い記述で算出プロパティを呼び出すことが可能になる。
      state.isLoggedIn = true
    },
    clear(state) {
      state.username = ''
      state.isLoggedIn = false
    }
  },
  actions: {  // 非同期通信や外部APIとのやり取りをおこなう。
    /**
     * ログイン
     */
    login(context, payload) {
      return api.post('/auth/jwt/create/', {
        'username': payload.username,
        'password': payload.password
      })
          .then(response => {
            // 認証用トークンをlocalStorageに保存
            localStorage.setItem('access', response.data.access)
            // ユーザー情報を取得してstoreのユーザー情報を更新
            return context.dispatch('reload')
                .then(user => user)
          })
    },
    /**
     * ログアウト
     */
    logout(context) {
      // 認証用トークンをlocalStorageから削除
      localStorage.removeItem('access')
      // storeのユーザー情報をクリア
      context.commit('clear')
    },
    /**
     * ユーザー情報更新
     */
    reload(context) {
      return api.get('/auth/users/me/')
          .then(response => {
            const user = response.data
            // storeのユーザー情報を更新
            context.commit('set', {user: user})
            return user
          })
    }
  }
}

export default authModule
