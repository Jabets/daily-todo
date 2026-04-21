const express = require('express');
const { queryOne, queryAll, run, getLastInsertId } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const { filter = 'all' } = req.query;

  let whereClause = 'WHERE user_id = ?';
  if (filter === 'todo') whereClause += ' AND completed = 0';
  if (filter === 'done') whereClause += ' AND completed = 1';

  const todos = queryAll(
    `SELECT id, user_id, text, completed, category, time, created_at FROM todos ${whereClause} ORDER BY created_at DESC`,
    [req.user.userId]
  );

  const result = todos.map(row => ({
    id: row.id,
    user_id: row.user_id,
    text: row.text,
    completed: row.completed === 1,
    category: row.category,
    time: row.time,
    created_at: row.created_at
  }));

  res.json({ todos: result });
});

router.post('/', (req, res) => {
  const { text, category } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: '任务内容不能为空' });
  }

  const categories = ['工作', '学习', '生活', '健康'];
  const taskCategory = category || categories[Math.floor(Math.random() * categories.length)];
  const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  run('INSERT INTO todos (user_id, text, category, time) VALUES (?, ?, ?, ?)',
    [req.user.userId, text.trim(), taskCategory, time]);

  const todoId = getLastInsertId('todos', req.user.userId);
  const todo = queryOne('SELECT id, user_id, text, completed, category, time, created_at FROM todos WHERE id = ?', [todoId]);

  res.json({
    todo: {
      id: todo.id,
      user_id: todo.user_id,
      text: todo.text,
      completed: todo.completed === 1,
      category: todo.category,
      time: todo.time,
      created_at: todo.created_at
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed, category } = req.body;

  const existing = queryOne('SELECT id FROM todos WHERE id = ? AND user_id = ?', [id, req.user.userId]);
  if (!existing) {
    return res.status(404).json({ error: '任务不存在' });
  }

  const updates = [];
  const values = [];

  if (text !== undefined) { updates.push('text = ?'); values.push(text); }
  if (completed !== undefined) { updates.push('completed = ?'); values.push(completed ? 1 : 0); }
  if (category !== undefined) { updates.push('category = ?'); values.push(category); }

  if (updates.length > 0) {
    values.push(id, req.user.userId);
    run(`UPDATE todos SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, values);
  }

  const todo = queryOne('SELECT id, user_id, text, completed, category, time, created_at FROM todos WHERE id = ?', [id]);

  res.json({
    todo: {
      id: todo.id,
      user_id: todo.user_id,
      text: todo.text,
      completed: todo.completed === 1,
      category: todo.category,
      time: todo.time,
      created_at: todo.created_at
    }
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const existing = queryOne('SELECT id FROM todos WHERE id = ? AND user_id = ?', [id, req.user.userId]);
  if (!existing) {
    return res.status(404).json({ error: '任务不存在' });
  }

  run('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, req.user.userId]);

  res.json({ success: true });
});

module.exports = router;
