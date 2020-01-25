<template>
  <div class="container mt-5">
    <h3>My Boards</h3>
    <input
            type="text"
            placeholder="Add new board"
            v-model="boardName"
            @keyup.enter="add()"
    />
    <div class="mt-5">
      <draggable v-model="boardsList" class="row justify-content-center" handle=".handle">
        <!--template tagに関して-->
        <!--https://qiita.com/amamamaou/items/55225b3873b098b9b2bd-->
        <board-card
                v-for="(board, index) in boardsList"
                v-on:update-board="updateBoard({ boardTitle: board.name, boardId: board.id })"
                :key="index"
                :name="board.name"
                :id="board.id"
                class="col-8 mt-4 mb-4"
        >
        </board-card>
      </draggable>
    </div>
  </div>
</template>

<script>
  // import { mapState, mapActions } from 'vuex'
  import {createNamespacedHelpers} from 'vuex'

  const {mapState, mapActions} = createNamespacedHelpers('trello')
  import BoardCard from '@/components/BoardCard'
  import draggable from 'vuedraggable'

  export default {
    name: 'home-view',
    components: {
      BoardCard,
      draggable
    },
    data() {
      return {
        boardName: ''
      }
    },
    computed: {
      ...mapState([
        'boards',
        'fetchingData',
        'error'
      ]),

      boardsList: {
        get() {
          return this.boards  // 非同期処理の関係でwarnがでるが問題はない。注意。
        },
        set(value) {
          // 変更情報を伝え、並び順を更新する必要あり。
          this.setBoardsDataUpdate({value: value})
        }
      }
    },
    methods: {
      ...mapActions([
        'fetchBoards',
        'addBoard',
        'setBoardsDataUpdate'
      ]),
      add() {
        this.addBoard({name: this.boardName})
        this.boardName = ''
        this.fetchBoards()
      },

      updateBoard({ boardTitle, boardId}){


      },
      // setBoardsUpdate(value){
      //   this.setBoardsUpdate({value: value})
      // }

    },
    created() {
      this.fetchBoards()
    }
  }
</script>

<style scoped>

</style>