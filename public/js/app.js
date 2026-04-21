let tasks = [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterTabs = document.getElementById('filterTabs');
const progressFill = document.getElementById('progressFill');
const progressCount = document.getElementById('progressCount');
const currentDateEl = document.getElementById('currentDate');
const greetingEl = document.querySelector('.greeting');
const logoutBtn = document.getElementById('logoutBtn');

function initDate() {
  const now = new Date();
  const options = { month: 'long', day: 'numeric', weekday: 'long' };
  currentDateEl.textContent = now.toLocaleDateString('zh-CN', options);

  const hour = now.getHours();
  let greeting = '你好';
  if (hour < 12) greeting = '上午好';
  else if (hour < 18) greeting = '下午好';
  else greeting = '晚上好';

  const username = auth.getUsername();
  greetingEl.textContent = username ? `${greeting}，${username} 👋` : `${greeting} 👋`;
}

async function loadTasks() {
  try {
    const data = await api.todos.getAll(currentFilter);
    tasks = data.todos;
    renderTasks();
    updateProgress();
  } catch (err) {
    console.error('加载任务失败:', err);
  }
}

function renderTasks() {
  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="empty-title">${currentFilter === 'done' ? '还没有已完成的任务' : '今日任务已全部完成 🎉'}</p>
        <p class="empty-text">${currentFilter === 'done' ? '完成一些任务吧' : '添加新任务开始吧'}</p>
      </div>
    `;
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <div class="task-checkbox">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="task-content">
        <p class="task-text">${escapeHtml(task.text)}</p>
        <div class="task-meta">
          <span class="task-tag">${getCategoryLabel(task.category)}</span>
          <span class="task-time">${task.time || ''}</span>
        </div>
      </div>
      <button class="task-delete" aria-label="删除任务" data-id="${task.id}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.task-delete')) return;
      toggleTask(parseInt(item.dataset.id));
    });
  });

  document.querySelectorAll('.task-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(parseInt(btn.dataset.id));
    });
  });
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  progressFill.style.width = `${percent}%`;
  progressCount.textContent = `${completed} / ${total}`;
}

async function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  try {
    await api.todos.create(text);
    taskInput.value = '';
    await loadTasks();
  } catch (err) {
    console.error('添加任务失败:', err);
    alert(err.message);
  }
}

async function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    try {
      await api.todos.update(id, { completed: !task.completed });
      await loadTasks();
    } catch (err) {
      console.error('更新任务失败:', err);
    }
  }
}

async function deleteTask(id) {
  try {
    await api.todos.delete(id);
    await loadTasks();
  } catch (err) {
    console.error('删除任务失败:', err);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getCategoryLabel(category) {
  const labels = {
    '工作': '💼 工作',
    '学习': '📚 学习',
    '生活': '🏠 生活',
    '健康': '💪 健康'
  };
  return labels[category] || category;
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

filterTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-tab')) {
    document.querySelector('.filter-tab.active').classList.remove('active');
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    loadTasks();
  }
});

logoutBtn.addEventListener('click', () => auth.logout());

auth.requireAuth();
initDate();
loadTasks();
