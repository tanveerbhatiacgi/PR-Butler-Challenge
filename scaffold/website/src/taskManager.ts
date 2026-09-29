import { Task, TaskFilter } from './types'
import { t } from './i18n'

export class TaskManager {
  private tasks: Task[] = []
  private filter: TaskFilter = 'all'
  private nextId = 1

  /** Restores saved tasks from browser storage when a manager is created. */
  constructor() {
    this.loadFromStorage()
  }

  /** Adds a task and persists it before refreshing the rendered list.
   * @param text - The task description to display.
   * @param priority - The task's priority category.
   */
  addTask(text: string, priority: 'low' | 'medium' | 'high') {
    const task: Task = {
      id: this.nextId++,
      text,
      priority,
      completed: false,
      createdAt: new Date()
    }
    this.tasks.push(task)
    this.saveToStorage()
    this.render()
  }

  /** Toggles completion and persists the change when the task exists.
   * @param id - The identifier of the task to toggle.
   */
  toggleTask(id: number) {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveToStorage()
      this.render()
    }
  }

  /** Removes a task and refreshes persisted state and the rendered list.
   * @param id - The identifier of the task to remove.
   */
  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id)
    this.saveToStorage()
    this.render()
  }

  /** Selects which tasks are visible and re-renders the task list.
   * @param filter - The visibility filter to apply.
   */
  setFilter(filter: TaskFilter) {
    this.filter = filter
    this.render()
  }

  /** Renders filtered tasks and updates completion statistics in the page. */
  render() {
    const taskList = document.getElementById('tasks')
    if (!taskList) return

    let filteredTasks = this.tasks
    if (this.filter === 'active') {
      filteredTasks = this.tasks.filter(t => !t.completed)
    } else if (this.filter === 'completed') {
      filteredTasks = this.tasks.filter(t => t.completed)
    }

    taskList.innerHTML = ''
    
    filteredTasks.forEach(task => {
      const li = document.createElement('li')
      li.className = `task-item ${task.completed ? 'completed' : ''}`
      
      const content = document.createElement('div')
      content.className = 'task-content'
      
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'task-checkbox'
      checkbox.checked = task.completed
      checkbox.addEventListener('change', () => this.toggleTask(task.id))
      
      const text = document.createElement('span')
      text.className = 'task-text'
      text.textContent = task.text
      
      const badge = document.createElement('span')
      badge.className = `priority-badge priority-${task.priority}`
      badge.textContent = t(`priority.${task.priority}`)
      
      content.appendChild(checkbox)
      content.appendChild(text)
      content.appendChild(badge)
      
      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'delete-btn'
      deleteBtn.textContent = t('button.delete')
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id))
      
      li.appendChild(content)
      li.appendChild(deleteBtn)
      taskList.appendChild(li)
    })

    this.updateStats()
  }

  private updateStats() {
    const totalCount = document.getElementById('total-count')
    const completedCount = document.getElementById('completed-count')
    
    if (totalCount) totalCount.textContent = String(this.tasks.length)
    if (completedCount) {
      completedCount.textContent = String(this.tasks.filter(t => t.completed).length)
    }
  }

  private saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  /** Restores serialized tasks and advances the ID counter past saved tasks. */
  private loadFromStorage() {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      this.tasks = JSON.parse(stored)
      this.nextId = Math.max(...this.tasks.map(t => t.id), 0) + 1
    }
  }

  /** Returns the current task collection. */
  getTasks() {
    return this.tasks
  }

  /** Returns the number of completed tasks in the current collection. */
  getCompletedCount() {
    return this.tasks.filter(t => t.completed).length
  }
}
