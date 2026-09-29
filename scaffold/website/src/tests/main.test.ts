import { beforeEach, describe, expect, it, vi } from 'vitest'

function setPageMarkup(): void {
  document.body.innerHTML = `
    <header>
      <h1 data-i18n="app.title"></h1>
      <div class="language-selector">
        <button id="lang-en">English</button>
        <button id="lang-fr">Français</button>
      </div>
    </header>
    <h2 data-i18n="task.add"></h2>
    <form id="task-form">
      <input id="task-input" data-i18n="task.placeholder" data-i18n-attr="placeholder">
      <select id="priority-select">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" data-i18n="button.add"></button>
    </form>
    <button class="filter-btn" data-filter="all" data-i18n="filter.all"></button>
    <button class="filter-btn" data-filter="active" data-i18n="filter.active"></button>
    <button class="filter-btn" data-filter="completed" data-i18n="filter.completed"></button>
    <button class="filter-btn">No filter</button>
    <span data-i18n="stats.total"></span>
    <span data-i18n="stats.completed"></span>
    <span data-i18n></span>
    <ul id="tasks"></ul>
    <span id="total-count"></span>
    <span id="completed-count"></span>
    <footer data-i18n="footer.text"></footer>
  `
}

async function loadMain(): Promise<void> {
  vi.resetModules()
  await import('../main')
  await vi.waitFor(() => expect(document.documentElement.lang).toBe('en'))
}

function submitTask(text: string, priority: string): Event {
  const input = document.querySelector<HTMLInputElement>('#task-input')
  const select = document.querySelector<HTMLSelectElement>('#priority-select')
  const form = document.querySelector<HTMLFormElement>('#task-form')
  if (!input || !select || !form) throw new Error('Task form fixture is incomplete')

  input.value = text
  select.value = priority
  const event = new Event('submit', { bubbles: true, cancelable: true })
  form.dispatchEvent(event)
  return event
}

describe('Task Manager page', () => {
  beforeEach(async () => {
    localStorage.clear()
    document.documentElement.lang = 'und'
    setPageMarkup()
    await loadMain()
  })

  it('translates the page and ignores blank submissions', () => {
    expect(document.querySelector('h1')?.textContent).toBe('My Task Manager')
    expect(document.querySelector<HTMLInputElement>('#task-input')?.placeholder)
      .toBe('Enter task description')

    const blankSubmission = submitTask('   ', 'low')

    expect(blankSubmission.defaultPrevented).toBe(true)
    expect(localStorage.getItem('tasks')).toBeNull()

    const submission = submitTask('  Pay a bill  ', 'high')

    expect(submission.defaultPrevented).toBe(true)
    expect(document.querySelector<HTMLInputElement>('#task-input')?.value).toBe('')
    expect(document.querySelector('.task-text')?.textContent).toBe('  Pay a bill  ')
    expect(document.querySelector('.priority-badge')?.textContent).toBe('High Priority')
  })

  it('filters tasks and updates every translated control when switching languages', () => {
    submitTask('Pay a bill', 'high')
    submitTask('Read a book', 'low')

    const checkbox = document.querySelector<HTMLInputElement>('.task-checkbox')
    if (!checkbox) throw new Error('Expected a task checkbox')
    checkbox.checked = true
    checkbox.dispatchEvent(new Event('change'))

    document.querySelector<HTMLButtonElement>('[data-filter="active"]')?.click()
    expect(Array.from(document.querySelectorAll('.task-text')).map((item) => item.textContent))
      .toEqual(['Read a book'])

    document.querySelector<HTMLButtonElement>('[data-filter="completed"]')?.click()
    expect(Array.from(document.querySelectorAll('.task-text')).map((item) => item.textContent))
      .toEqual(['Pay a bill'])

    document.querySelector<HTMLButtonElement>('#lang-fr')?.click()
    expect(document.documentElement.lang).toBe('fr')
    expect(document.querySelector('h1')?.textContent).toBe('Mon Gestionnaire de Tâches')
    expect(document.querySelector<HTMLInputElement>('#task-input')?.placeholder)
      .toBe('Saisissez la description de la tâche')
    expect(document.querySelector('.priority-badge')?.textContent).toBe('Priorité élevée')
    expect(document.querySelector('.delete-btn')?.textContent).toBe('Supprimer')
    expect(document.querySelector('#lang-fr')?.classList.contains('active')).toBe(true)

    const frenchButton = document.querySelector<HTMLButtonElement>('#lang-fr')
    if (!frenchButton) throw new Error('Expected the French language button')
    frenchButton.id = 'lang-fr-unavailable'
    frenchButton.click()
    expect(document.querySelector('.language-selector .active')).toBeNull()

    document.querySelector<HTMLButtonElement>('[data-filter="all"]')?.click()
    document.querySelector<HTMLButtonElement>('.filter-btn:not([data-filter])')?.click()
    expect(document.querySelectorAll('#tasks li')).toHaveLength(2)

    document.querySelector<HTMLButtonElement>('#lang-en')?.click()
    expect(document.documentElement.lang).toBe('en')
    expect(document.querySelector('h1')?.textContent).toBe('My Task Manager')
  })

  it('initializes without optional page controls or a task list', async () => {
    document.body.innerHTML = ''
    document.documentElement.lang = 'und'

    await loadMain()

    expect(document.documentElement.lang).toBe('en')
    expect(document.body.children).toHaveLength(0)
  })
})