const STORAGE_KEY = 'todos-app'
const todoStorage = {
  fetch () {
    const todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

new Vue({
  data: {
    todos: todoStorage.fetch(),
    newTodo: "",
    filterState: 0,
    states: [
      { state: 'all', value: 0, label: 'すべて' },
      { state: 'working', value: 1, label: '作業中' },
      { state: 'completed', value: 2, label: '完了' }
    ]
  },

  watch: {
    todos: {
      handler (todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  computed: {
    filteredTodos () {
      return this.todos.filter(function (el) {
        return this.filterState === 0 || this.filterState === el.state
      }, this)
    },
    allLabels () {
      return this.states.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
    },
    allStates () {
      return this.states.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.state })
      }, {})
    }
  },

  methods: {
    addTodo () {
      const body = this.newTodo && this.newTodo.trim()
      if (!body) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        body: body,
        state: 1
      })
      this.newTodo = ''
    },
    changeState (item) {
      item.state = item.state === 1 ? 2 : 1
    },
    removeTodo (item) {
      const index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  }
}).$mount('#app')
