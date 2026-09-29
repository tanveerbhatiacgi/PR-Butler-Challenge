import { TaskManager } from './taskManager'
import { getCurrentLanguage, loadTranslations, setLanguage, t } from './i18n'
import { TaskFilter } from './types'
import './styles.css'

let taskManager: TaskManager

/** Loads locale data, creates the task manager, and connects the page controls. */
async function init(): Promise<void> {
  await loadTranslations()
  taskManager = new TaskManager()
  setupEventListeners()
  applyTranslations()
  taskManager.render()
}

/** Connects form submission, language selection, and task-filter controls. */
function setupEventListeners(): void {
  const form = document.getElementById('task-form') as HTMLFormElement
  const langEnBtn = document.getElementById('lang-en')
  const langFrBtn = document.getElementById('lang-fr')

  form?.addEventListener('submit', handleSubmit)
  langEnBtn?.addEventListener('click', () => switchLanguage('en'))
  langFrBtn?.addEventListener('click', () => switchLanguage('fr'))

  const filterBtns = document.querySelectorAll('.filter-btn')
  filterBtns.forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const filter = target.dataset.filter
      if (filter) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
        target.classList.add('active')
        taskManager.setFilter(filter as TaskFilter)
      }
    })
  })
}

/** Adds a non-empty task from the form and clears the input after submission.
 * @param event - Form submission event to cancel before processing.
 */
function handleSubmit(event: Event): void {
  event.preventDefault()
  const input = document.getElementById('task-input') as HTMLInputElement
  const select = document.getElementById('priority-select') as HTMLSelectElement

  if (input.value.trim()) {
    taskManager.addTask(input.value, select.value as 'low' | 'medium' | 'high')
    input.value = ''
  }
}

/** Changes the active locale and refreshes translated page and task labels.
 * @param lang - Locale code to apply to the page.
 */
function switchLanguage(lang: string): void {
  setLanguage(lang)

  document.querySelectorAll('.language-selector button').forEach(btn => {
    btn.classList.remove('active')
  })

  const activeBtn = document.getElementById(`lang-${lang}`)
  activeBtn?.classList.add('active')

  applyTranslations()
  taskManager.render()
}

/** Applies the active locale to each element marked with a translation key. */
function applyTranslations(): void {
  document.documentElement.lang = getCurrentLanguage()
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n
    if (!key) return

    const value = t(key)
    const attribute = element.dataset.i18nAttr
    if (attribute) {
      element.setAttribute(attribute, value)
    } else {
      element.textContent = value
    }
  })
}

init()
