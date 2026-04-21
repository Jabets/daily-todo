# 每日待办 - DailyTodo

一个简洁美观的每日任务管理应用，支持用户登录注册、数据持久化。

## 功能特点

- ✅ 添加、完成、删除任务
- 📊 进度条实时显示
- 🏷️ 任务分类（工作、学习、生活、健康）
- 🔍 任务筛选（全部/待完成/已完成）
- 👤 用户认证系统
- 💾 数据持久化存储

## 技术栈

**前端**
- HTML5 / CSS3 / JavaScript
- Google Fonts (Plus Jakarta Sans)

**后端**
- Node.js + Express
- sql.js (SQLite 纯 JavaScript 实现)
- JWT 身份认证
- bcryptjs 密码加密

## 项目结构

```
daily-todo/
├── server/
│   ├── index.js              # 服务器入口
│   ├── routes/
│   │   ├── auth.js           # 认证路由
│   │   └── todos.js          # 任务路由
│   ├── middleware/
│   │   └── auth.js           # JWT 中间件
│   ├── db/
│   │   └── database.js       # 数据库模块
│   └── package.json
├── public/
│   ├── index.html            # 主页面
│   ├── login.html            # 登录/注册页
│   ├── css/style.css         # 样式文件
│   └── js/
│       ├── auth.js           # 认证状态管理
│       ├── api.js            # API 服务层
│       └── app.js            # 主应用逻辑
├── README.md
├── package.json
└── .gitignore
```

## 快速开始

### 安装依赖

```bash
cd server
npm install
```

### 启动服务器

```bash
npm start
```

### 访问应用

- 主页面: http://localhost:3000/
- 登录页面: http://localhost:3000/login

## API 文档

### 认证接口

| 接口 | 方法 | 请求体 | 说明 |
|------|------|--------|------|
| `/api/auth/register` | POST | `{ username, password }` | 注册 |
| `/api/auth/login` | POST | `{ username, password }` | 登录 |
| `/api/auth/me` | GET | - | 获取当前用户 |

### 任务接口（需登录）

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/todos` | GET | 获取任务列表 |
| `/api/todos?filter=todo` | GET | 获取待完成任务 |
| `/api/todos?filter=done` | GET | 获取已完成任务 |
| `/api/todos` | POST | 创建任务 `{ text, category? }` |
| `/api/todos/:id` | PUT | 更新任务 `{ text?, completed?, category? }` |
| `/api/todos/:id` | DELETE | 删除任务 |

### 响应示例

```json
// GET /api/todos
{
  "todos": [
    {
      "id": 1,
      "user_id": 1,
      "text": "完成项目报告",
      "completed": false,
      "category": "工作",
      "time": "09:30",
      "created_at": "2026-04-21 12:00:00"
    }
  ]
}
```

## 配置

环境变量（可选）:

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 3000 | 服务器端口 |
| `JWT_SECRET` | 内置密钥 | JWT 签名密钥 |

## 截图

![每日待办](screenshot.png)

## License

MIT
