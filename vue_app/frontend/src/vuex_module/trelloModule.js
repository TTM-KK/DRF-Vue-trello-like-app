import * as types from './mutation-types'
import api from '@/services/api'
import Vue from 'vue'

const trelloModule = {
  strict: process.env.NODE_ENV !== 'production',  // strictモードによるエラーを検知するためにはコストが掛かるため、本番環境では必ず、Falseに設定する用に
  namespaced: true,

  state: {
    user: null,
    fetchingData: true,
    error: null,
    boards:
        {
          /*
              id: {
                id,
                owner,
                name
              }
            */
        }
    ,
    lists: {
      /*
          id: {
            id,
            board,
            name
          }
        */
    }
    ,

    // すべてのtaskデータが一括で補完される。
    tasks: {
      /*
          id: {
            id,
            list,
            title,
            completed
          }
        */
    },

    // 各listsのtaskデータを管理する。vue draggableを有効にするために追加。
    tasksData: {}
  },
  getters: {
    getBoards: (state) => {
      function compareFunc(a, b) {
        return a.order - b.order
      }

      return Object.values(state.boards).sort(compareFunc)
    },

    getListsByBoard: (state) => (boardId) => {
      function compareFunc(a, b) {
        return a.order - b.order
      }

      return Object.values(state.lists)
          .filter(list => list.board === boardId).sort(compareFunc)
    },

    getTasksFromList: (state) => (listId) => {
      // 取得したtaskオブジェクトをソートする。
      function compareFunc(a, b) {
        return a.order - b.order
      }

      // listIdに一致するものを取り出し、並び順をソートする。
      return Object.values(state.tasks)
          .filter(task => task.list === listId).sort(compareFunc)
    }
  },

  mutations: {

    // userの情報を更新する。
    setUserInfo(state, {userId}) {
      state.user = userId
    },

    updateBoard(state, {value}) {
      state.boards = value
    },

    updateList(state, {value}) {
      state.lists = value
    },

    setTasks(state, {listId, eachTask}) {
      Vue.set(state.tasksData, listId, eachTask)
    },

    // vuexのstateにlistIdをKey, eachTaskをvalueとしてセットする。
    updateTasks(state, {listId, eachTask}) {
      Vue.set(state.tasksData, listId, eachTask)
    },

    // Fetch the boards created by user
    [types.FETCH_BOARDS_REQUEST](state) {
      state.fetchingData = true
      state.error = null
    },

    [types.FETCH_BOARDS_SUCCESS](state, {boards}) {
      state.fetchingData = false
      state.error = null
      state.boards = boards
    },

    [types.FETCH_BOARDS_FAILURE](state, {error}) {
      state.fetchingData = false
      state.error = error
    },

    // Fetch the lists from a board
    [types.FETCH_LISTS_REQUEST](state) {
      state.fetchingData = true
      state.error = null
    },

    [types.FETCH_LISTS_SUCCESS](state) {
      state.fetchingData = false
      state.error = null
      // state.lists = {...lists}
    },

    [types.FETCH_LISTS_FAILURE](state, {error}) {
      state.fetchingData = false
      state.error = error
    },

    // Fetch the tasks from a list
    [types.FETCH_TASKS_REQUEST](state) {
      state.fetchingData = true
      state.error = null
    },

    [types.FETCH_TASKS_SUCCESS](state) {
      state.fetchingData = false
      state.error = null
      // state.tasks = {...tasks}
    },

    [types.FETCH_TASKS_FAILURE](state, {error}) {
      state.fetchingData = false
      state.error = error
    },

    // Create a new board
    [types.ADD_BOARD](state, {board}) {
      Vue.set(state.boards, board.id, board)
    },

    // Create a new task list
    [types.ADD_COLUMN](state, {column}) {
      Vue.set(state.lists, column.id, column)
    },

    // Add a new task to a task list
    [types.ADD_TASK](state, {task}) {
      Vue.set(state.tasks, task.id, task)
    },

    // Delete a task from a task list
    [types.DELETE_TASK](state, {taskId}) {
      state.tasks = Object.values(state.tasks)
          .filter(task => task.id !== taskId)
    },

    // Check a task as completed
    [types.MARK_AS_COMPLETED](state, {task}) {
      task.completed = !task.completed
    }
  },

  actions: {

    // Add a new board
    addBoard({commit, state, dispatch}, {name}) {
      api({
        method: 'post',
        url: '/trello/boards/',
        data: {
          owner: state.user,
          name: name,
          order: 1000
        }
      })
          .then(() => {
            dispatch('fetchBoards')
          })
    },

    updateBoardAction({state, dispatch}, {new_name, id}) {
      api({
        method: 'put',
        url: '/trello/boards/' + id + '/',
        data: {
          owner: state.user,
          name: new_name,
        }
      })
          .then(() => {
            dispatch({
              type: 'fetchBoards'
            })
          })
    },
    deleteBoardAction({state, dispatch}, {id}) {
      api({
        method: 'delete',
        url: '/trello/boards/' + id + '/',

      })
          .then(() => {
            dispatch({
              type: 'fetchBoards'
            })
          })
    },

    // Fetch via AJAX the boards from user
    fetchBoards({commit, state, getters}) {

      commit(types.FETCH_BOARDS_REQUEST)

      api({
        method: 'get',
        url: '/auth/users/me/'
      })
      // 同期処理で追従できる形にcommitを制御しないと実行順序を追えなくなるので注意。
          .then(response => {
            commit({
              type: 'setUserInfo',
              userId: response.data.id
            })
          })
          .then(() =>
                  api({
                    method: 'get',
                    url: '/trello/boards/',
                    params: {'owner': state.user} // これだけだとHTTPリクエストを直打ちで他のUserの情報も取得できてしまう。通信のときに前処理書かないといけない。
                  })
                      .then(response => {
                        commit({
                          type: types.FETCH_BOARDS_SUCCESS,
                          boards: response.data
                        })
                        // state.boards = response.data
                      })
                      .then(() => {
                        let board = getters.getBoards
                        commit({
                          type: types.FETCH_BOARDS_SUCCESS,
                          boards: board
                        })
                      })
              // .then(() => commit(types.FETCH_BOARDS_SUCCESS))  // 状態を変更
          )
    },

    // boardの変更を検知しorderの再登録を行う。
    setBoardsDataUpdate({commit, state}, {value}) {

      commit({
        type: 'updateBoard',
        value: value
      })

      let i = 0
      for (let k of Object.keys(value)) {
        api({
          method: 'put',
          url: '/trello/boards/' + value[k].id + '/',
          data: {
            owner: state.user,
            name: value[k].name,
            order: i
          }
        })
        i++
      }
    },

    // Add a new column/lst to a board via AJAX
    addListAction({commit, dispatch}, {board, name}) {
      api({
        method: 'post',
        url: '/trello/lists/',
        data: {
          board: board,
          name: name,
          order: 100
        }
      })
          .then(() => {
            dispatch({
              type: 'fetchLists',
              board: board
            },)
          })
    },

    updateListAction({dispatch}, {name, board, id}) {
      api({
        method: 'put',
        url: '/trello/lists/' + id + '/',
        data: {
          board: board,
          name: name
        }
      })
          .then(() => {
            dispatch({
              type: 'fetchLists',
              board: board
            })
          })
    },

    // delete list
    deleteListAction({dispatch}, {listId, board}) {
      api({
        method: 'delete',
        url: '/trello/lists/' + listId + '/',
      })
          .then(() => {
            dispatch({
              type: 'fetchLists',
              board: board
            })
          })
    },

    // vue draggableによる並び変えをDRFに伝える
    setListDataUpdate({commit, state}, {value}) {
      commit({
        type: 'updateList',
        value: value
      })

      let i = 0
      for (let k of Object.keys(value)) {
        api({
          method: 'put',
          url: '/trello/lists/' + value[k].id + '/',
          data: {
            board: value[k].board,
            name: value[k].name,
            order: i
          }
        })
        i++
      }
    },

    // Fetch lists from a board
    fetchLists({commit, state, getters}, {board}) {
      commit(types.FETCH_LISTS_REQUEST)

      api({
        method: 'get',
        url: '/trello/lists/',
        params: {'board': board}
      })
          .then(response => {
            state.lists = response.data
          })
          .then(() => {
            let eachList = getters.getListsByBoard(board)
            commit({
              type: 'updateList',
              value: eachList
            })
          })
    },

    /* for task */

    // Add a new tasks
    addTaskAction({commit, dispatch, state}, {list, title}) {
      api({
        method: 'post',
        url: '/trello/tasks/',
        data: {
          list: list,
          title: title,
          completed: false,
          order: 1000  // 初期位置を下段にするため。
        }
      })
          .then(() => {
            dispatch({
              type: 'fetchTasks',
              list: list
            })
          })
    },

    // Delete a task
    deleteTaskAction({commit, dispatch}, {taskId, list}) {
      api({
        method: 'delete',
        url: '/trello/tasks/' + taskId,
      })
          .then(() => {
            dispatch({
              type: 'fetchTasks',
              list: list
            })
          })
    },

    // Update a task
    updateTaskAction({commit, dispatch}, {taskId, list, title}) {
      api({
        method: 'put',
        url: '/trello/tasks/' + taskId + '/',
        data: {
          list: list,
          title: title,
        }
      })
          .then(() => {
            dispatch({
              type: 'fetchTasks',
              list: list
            })
          })
    },

    // vue draggableによる並び変えをDRFに伝える
    setTaskDataUpdate({commit, state}, {listId, value}) {
      commit({
        type: 'setTasks',
        listId: listId,
        eachTask: value
      })

      let i = 0
      for (let k of Object.keys(value)) {
        api({
          method: 'put',
          url: '/trello/tasks/' + value[k].id + '/',
          data: {
            list: listId,
            title: value[k].title,
            order: i
          }
        })
        i++
      }
    },

    // Fetch tasks
    fetchTasks({commit, state, dispatch, getters}, {list}) {
      commit(types.FETCH_TASKS_REQUEST)

      api({
        method: 'get',
        url: '/trello/tasks/',
        params: {'id': list}
      })
          .then(response => {
            state.tasks = response.data
          })
          .then(() => commit(types.FETCH_TASKS_SUCCESS))

          // componentのtaskのDataをvuexのstateと同期させるために実行
          .then(() => {
            let eachTask = getters.getTasksFromList(list)
            commit({
              type: 'updateTasks',
              listId: list,
              eachTask: eachTask
            })
          })
    },
  }
}

export default trelloModule