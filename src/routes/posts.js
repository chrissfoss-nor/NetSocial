const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts – public feed (latest 50 posts)
router.get('/', (req, res) => {
  const posts = db
    .prepare(
      `SELECT posts.id, posts.content, posts.created_at,
              users.id AS user_id, users.name AS author
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC
       LIMIT 50`
    )
    .all();
  res.json(posts);
});

// POST /api/posts – create a post (authenticated)
router.post('/', requireAuth, (req, res) => {
  const { content } = req.body || {};
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }
  if (content.length > 500) {
    return res.status(400).json({ error: 'Post content must be 500 characters or fewer' });
  }

  const result = db
    .prepare('INSERT INTO posts (user_id, content) VALUES (?, ?)')
    .run(req.user.id, content.trim());

  const post = db
    .prepare(
      `SELECT posts.id, posts.content, posts.created_at,
              users.id AS user_id, users.name AS author
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = ?`
    )
    .get(result.lastInsertRowid);

  res.status(201).json(post);
});

// DELETE /api/posts/:id – delete own post (authenticated)
router.delete('/:id', requireAuth, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Post deleted' });
});

module.exports = router;
