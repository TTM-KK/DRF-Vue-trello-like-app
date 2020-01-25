import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import Board from '@/pages/BoardPage'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
    // modeはdefaultではhashモードになり、URLが美しくない。基本はhistoryモードに変更する必要あり。
  mode: 'history', // catch-all fallback routeを導入しないと存在しないURLをUserが叩いたときに、404エラーが返ってくる

    // ログインが必要な画面には「requiresAuth」フラグを付けておく　ー＞　グローバルナビゲーションガードで使用するため。
  routes: [
    { path: '/', component: HomePage, meta: { requiresAuth: true } },
    { path: '/login', component: LoginPage },
    { path: '*', redirect: '/' },
    { path: '/board/:id', name: 'board', component: Board, props: true }  // 動的ルートマッチング
  ]
})

/**
 * Routerによって画面遷移する際に毎回実行される
 */
// グローバルナビゲーションガード（以下はGlobal Before Guards）と言うらしい。
// routerさんで設定したmetaフィールド内のデータを検証し色々処理を書くことが出来る
// 今回の場合はrecord.meta.requiredAuthでログイン認証が必要な遷移先かを事前に検証し、
// その状態に応じて遷移先を決定している。
router.beforeEach((to, from, next) => {

  const isLoggedIn = store.getters['auth/isLoggedIn']  // auth storeモジュールのisLoggedInにアクセス
  const token = localStorage.getItem('access')
  console.log('to.path=', to.path)
  console.log('isLoggedIn=', isLoggedIn)

  // ログインが必要な画面に遷移しようとした場合（ネストしているrouteオブジェクトがrequiresAuth必須でも）
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // ログインしている状態の場合
    if (isLoggedIn) {
      console.log('User is already logged in. So, free to next.')
      next()

      // ログインしていない状態の場合
    } else {
      // まだ認証用トークンが残っていればユーザー情報を再取得
      if (token != null) {
        console.log('User is not logged in. Trying to reload again.')

        store.dispatch('auth/reload')
          .then(() => {
            // 再取得できたらそのまま次へ
            console.log('Succeeded to reload. So, free to next.')
            next() // next()はパイプラインの次のフックに移動するという意味
          })
          .catch(() => {
            // 再取得できなければログイン画面へ
            forceToLoginPage(to, from, next)
          })
      } else {
        // 認証用トークンが無い場合は、ログイン画面へ
        forceToLoginPage(to, from, next)
      }
    }

  } else {
    // ログインが不要な画面であればそのまま次へ
    console.log('Go to public page.')
    next()
  }
})

/**
 * ログイン画面へ強制送還
 */
function forceToLoginPage (to, from, next) {
  console.log('Force user to login page.')
  next({
    path: '/login',
    // 遷移先のURLはクエリ文字列として付加
    query: { next: to.fullPath }
  })
}

export default router