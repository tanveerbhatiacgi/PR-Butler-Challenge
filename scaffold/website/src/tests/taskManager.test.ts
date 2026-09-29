import { describe, it, expect, beforeEach } from 'vitest'
import { TaskManager } from '../taskManager'

describe('TaskManager', () => {
  let manager: TaskManager

  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = `
      <ul id="tasks"></ul>
      <span id="total-count"></span>
      <span id="completed-count"></span>
    `
    manager = new TaskManager()
  })

  it('adds, persists, and safely renders a task', () => {
    const description = '<img src=x onerror="alert(1)">'

    manager.addTask(description, 'low')

    expect(manager.getTasks()).toHaveLength(1)
    expect(manager.getTasks()[0]).toMatchObject({
      id: 1,
      text: description,
      priority: 'low',
      completed: false
    })
    expect(JSON.parse(localStorage.getItem('tasks') ?? '[]')[0].text).toBe(description)
    expect(document.querySelector('.task-text')?.textContent).toBe(description)
    expect(document.querySelector('.task-text img')).toBeNull()
  })

  it('toggles an existing task, updates statistics, and ignores unknown IDs', () => {
    manager.addTask('Task 1', 'medium')

    manager.toggleTask(1)

    expect(manager.getCompletedCount()).toBe(1)
    expect(document.querySelector('#completed-count')?.textContent).toBe('1')
    expect(document.querySelector('.task-item')?.classList.contains('completed')).toBe(true)
    expect(JSON.parse(localStorage.getItem('tasks') ?? '[]')[0].completed).toBe(true)

    manager.toggleTask(99)

    expect(manager.getCompletedCount()).toBe(1)
  })

  it('deletes tasks and persists the empty collection', () => {
    manager.addTask('Task 1', 'low')

    manager.deleteTask(1)

    expect(manager.getTasks()).toEqual([])
    expect(localStorage.getItem('tasks')).toBe('[]')
    expect(document.querySelectorAll('#tasks li')).toHaveLength(0)
  })

  it('filters active, completed, and all tasks while keeping total statistics', () => {
    manager.addTask('Task 1', 'low')
    manager.addTask('Task 2', 'high')
    manager.toggleTask(1)

    manager.setFilter('active')
    expect(Array.from(document.querySelectorAll('.task-text')).map((item) => item.textContent))
      .toEqual(['Task 2'])

    manager.setFilter('completed')
    expect(Array.from(document.querySelectorAll('.task-text')).map((item) => item.textContent))
      .toEqual(['Task 1'])

    manager.setFilter('all')
    expect(document.querySelectorAll('#tasks li')).toHaveLength(2)
    expect(document.querySelector('#total-count')?.textContent).toBe('2')
    expect(document.querySelector('#completed-count')?.textContent).toBe('1')
  })

  it('restores stored tasks and continues IDs after the highest saved ID', () => {
    localStorage.setItem('tasks', JSON.stringify([
      {
        id: 7,
        text: 'Restored task',
        priority: 'high',
        completed: true,
        createdAt: '2026-01-01T00:00:00.000Z'
      }
    ]))
    manager = new TaskManager()

    manager.addTask('Next task', 'low')

    expect(manager.getTasks().map((task) => task.id)).toEqual([7, 8])
    expect(manager.getCompletedCount()).toBe(1)
  })

  it('renders safely when the task list or statistics are absent', () => {
    document.body.innerHTML = ''
    expect(() => manager.render()).not.toThrow()

    document.body.innerHTML = '<ul id="tasks"></ul>'
    manager.addTask('Without statistics', 'low')
    expect(document.querySelectorAll('#tasks li')).toHaveLength(1)
  })
})
