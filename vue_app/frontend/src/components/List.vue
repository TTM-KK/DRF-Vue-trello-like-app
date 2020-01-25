<template>
  <section>
    <div class="list-boarder">

      <delete-modal
              v-if="show_delete_modal"
              v-on:from-child="deleteTask"
              v-on:delete-cancel="show_delete_modal=false"
      ></delete-modal>
      <edit-modal
              v-if="show_edit_modal"
              v-on:edit-confirm="updateTask({text: $event})"
              v-on:edit-cancel="show_edit_modal=false"
              v-bind:parent_text="before_text"
      ></edit-modal>

      <list-delete-modal
              v-if="show_list_delete_modal"
              v-on:from-child="deleteList"
              v-on:delete-cancel="show_list_delete_modal=false"
      ></list-delete-modal>
      <list-edit-modal
              v-if="show_list_edit_modal"
              v-on:edit-confirm="updateList({name: $event})"
              v-on:edit-cancel="show_list_edit_modal=false"
              v-bind:parent_text="before_list_text"
      ></list-edit-modal>


      <div class="list-title">
        {{ name }}
        <span class="list-control">
          <button v-on:click="getListText">
            <edit-icon></edit-icon>
          </button>
          <button v-on:click="show_list_delete_modal=true">
            <delete-icon></delete-icon>
          </button>
        </span>
      </div>
      <ul>
        <draggable v-model="tasksList" group="task">
          <li
                  v-for="(task, index) in tasksList"
                  :key="index"
                  class="task"
          >
            <div>
              <div class="col-md-12">
                <div class="task-card text-left">
                  {{ task.title }}
                  <span class="task-control">
                    <button v-on:click="getText({ taskTitle: task.title, task: task })">
                    <edit-icon></edit-icon>
                  </button>
                  <button v-on:click="getDeleteText({task: task})">
                    <delete-icon></delete-icon>
                  </button>
                  </span>
                </div>
                <div class="text-right">

                </div>
              </div>
            </div>
          </li>
        </draggable>
        <input
                type="text"
                placeholder="Add a new task..."
                v-model="title"
                @keyup.enter="addTask()"
        />
      </ul>
    </div>
  </section>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex';
  // import TaskList from '@/components/TaskList'
  import draggable from 'vuedraggable'

  import DeleteModal from '@/components/modals/DeleteModal'
  import EditModal from '@/components/modals/EditModal'
  import ListDeleteModal from '@/components/modals/DeleteModal'
  import ListEditModal from '@/components/modals/EditModal'

  import EditIcon from 'vue-material-design-icons/SquareEditOutline'
  import DeleteIcon from 'vue-material-design-icons/TrashCanOutline'

  const {mapActions, mapGetters, mapState} = createNamespacedHelpers('trello')


  export default {
    name: "list",

    data() {
      return {
        title: '',
        text: '',
        before_text: '',
        edit_id: '',
        delete_id: '',
        show_delete_modal: false,
        show_edit_modal: false,

        before_list_text: '',
        show_list_delete_modal: false,
        show_list_edit_modal: false
      }
    },

    components: {
      // TaskList,
      draggable,
      DeleteModal,
      EditModal,
      EditIcon,
      DeleteIcon,
      ListDeleteModal,
      ListEditModal
    },

    props: {
      listId: String, // プロパティ名を決定する際に型を指定することができる。（異なる方を渡すと警告が出る。
      name: String,
      board: String
    },

    computed: {
      ...mapState([
        'tasksData'
      ]),

      ...mapGetters([
        'getTasksFromList',
      ]),

      // vue draggable
      tasksList: {
        get() {
          return this.tasksData[this.listId]
        },
        set(value) {
          this.setTaskDataUpdate({listId: this.listId, value: value})
        }
      }
    },

    methods: {
      ...mapActions([
        'addTaskAction',
        'deleteTaskAction',
        'updateTaskAction',
        'setTaskDataUpdate',
        'fetchTasks',
        'deleteListAction',
        'updateListAction'
      ]),

      getListText() {
        this.before_list_text = this.name
        this.show_list_edit_modal = true
      },

      updateList({name}) {
        if (this.before_list_text !== name) {
          this.updateListAction({
            name: name,
            board: this.board,
            id: this.listId
          })
        }
        this.before_list_text = ''
        this.show_list_edit_modal = false
      },

      deleteList() {
        this.deleteListAction({listId: this.listId, board: this.board})
        this.show_list_delete_modal = false
      },

      // taskの追加
      addTask() {
        this.addTaskAction({list: this.listId, title: this.title})
        this.title = ''
      },

      // taskのDelete
      deleteTask() {
        this.deleteTaskAction({taskId: this.delete_id, list: this.listId})
        this.show_delete_modal = false
        // this.setTasks(this.listId, this.getTasksFromList(this.listId))
      },

      // taskの編集
      updateTask({text}) {
        if (this.before_text !== text) {
          this.updateTaskAction({
            title: text,
            list: this.listId,
            taskId: this.edit_id
          })
        }
        this.before_text = ''
        this.edit_id = ''
        this.show_edit_modal = false
      },

      // テキスト情報を取得し保存する。
      getText({taskTitle, task}) {
        this.before_text = taskTitle
        this.text = taskTitle
        // this.edit = true
        this.edit_id = task.id
        this.show_edit_modal = true
      },

      // 削除するテキストの情報を取得する。
      getDeleteText({task}) {
        this.delete_id = task.id
        this.show_delete_modal = true
      }
    },

    // ライフサイクルフック
    created() {
      this.fetchTasks({list: this.listId})
      // this.setTasksData({listId: this.listId})
    }
  }

</script>

<style scoped>

  .list-title {
    margin-bottom: 2rem;
    font-size: 1.5rem;
    text-align: left;
  }

  .list-control {
    position: absolute;
    right: 2rem;
    font-size: 1.0rem
  }

  .task-control {
    display: none;
    position: absolute;
    right: 0.0px;
  }

  .task-card:hover .task-control {
    display: inline;
  }

  .list-boarder {
    padding: 1rem;
    background-origin: padding-box;
    background-color: #eceff1;
    border-radius: 3px;
  }

  .button--edit {
    position: absolute;
    right: 13%;
  }

  .button--delete {
    position: absolute;
    right: 5%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    background-color: #fafafa;
    border-radius: 3px;
    border-bottom: 1px solid #ccc;
    padding: 1rem;
  }

  input {
    box-sizing: border-box;
    background-color: #eceff1;
    border: none;
    border-radius: 3px;
    font-size: 1rem;
    outline: 0;
    padding: 0.75rem 0;
    transition: background-color 600ms ease;
    width: 100%;
  }
</style>