import express, { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Task } from './task.model';

const MAX_LIMIT = 50;

export function createApp() {
  const app = express();
  app.use(express.json());

  const validId = (req: Request, res: Response, next: NextFunction) => {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    next();
  };

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/tasks', async (req, res, next) => {
    try {
      const task = await Task.create({ title: req.body?.title, completed: req.body?.completed });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  app.get('/tasks', async (req, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || 10));
      const filter: Record<string, unknown> = {};
      if (req.query.completed === 'true' || req.query.completed === 'false') {
        filter.completed = req.query.completed === 'true';
      }
      const [items, total] = await Promise.all([
        Task.find(filter).sort({ createdAt: 1, _id: 1 }).skip((page - 1) * limit).limit(limit),
        Task.countDocuments(filter),
      ]);
      res.json({ items, total, page, limit });
    } catch (err) {
      next(err);
    }
  });

  app.get('/tasks/:id', validId, async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  app.put('/tasks/:id', validId, async (req, res, next) => {
    try {
      const update: Record<string, unknown> = {};
      if (req.body?.title !== undefined) update.title = req.body.title;
      if (req.body?.completed !== undefined) update.completed = req.body.completed;
      const task = await Task.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after', runValidators: true });
      if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/tasks/:id', validId, async (req, res, next) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
    if (err?.name === 'ValidationError' || err?.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    if (err?.code === 11000) return res.status(409).json({ error: 'El título ya existe' });
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  });

  return app;
}
