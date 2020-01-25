<template>
  <div class="container mt-5">
    <h3>{{ name }}</h3>
    <input
            type="text"
            placeholder="Add a list..."
            v-model="listName"
            @keyup.enter="add()"
    />
    <div class="mt-5">
      <draggable v-model="myList" class="row">
        <list
                v-for="(list, index) in myList"
                :key="index"
                :listId="list.id"
                :name="list.name"
                :board="list.board"
                class="col-md-3 mt-4 mb-4"
        >
        </list>
      </draggable>
    </div>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex';

  const {mapState, mapGetters, mapActions} = createNamespacedHelpers('trello')
  import List from '@/components/List'

  import draggable from 'vuedraggable'

  export default {
    name: "board",
    components: {
      List,
      draggable,
    },
    props: {
      name: String,
      id: String,
    },

    data() {
      return {
        listName: '',
      }
    },
    computed: {
      ...mapState([
        'lists',
        'fetchingData',
        'error'
      ]),
      ...mapGetters([
        'getListsByBoard'
      ]),
      boardLists() {
        return this.getListsByBoard(this.id)
      },

      // vue draggable用。get()で取得したい情報。set()はdrop後に実行される処理。
      myList: {
        get() {
          return this.lists
        },
        set(value) {
          this.setListDataUpdate({value: value})
        }
      }
    },

    methods: {
      ...mapActions([
        'addListAction',
        'fetchLists',
        'setListDataUpdate'
      ]),

      add() {
        this.addListAction({board: this.id, name: this.listName})
        this.listName = ''
      },

    },

    created() {
      this.fetchLists({board: this.id})
    }
  }
</script>

<style scoped>

</style>