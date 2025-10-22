import Note from '../models/note.js';

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, userId: req.userId });
    await note.save();
    res.json({ message: 'Note created' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.userId) return res.status(403).json({ message: 'You are not the owner' });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.updatedAt = new Date();
    await note.save();

    res.json({ message: 'updated', note });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const replaceNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.userId) return res.status(403).json({ message: 'You are not the owner' });

    note.title = req.body.title;
    note.content = req.body.content;
    note.updatedAt = new Date();
    await note.save();

    res.json(note);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAllTitles = async (req, res) => {
  try {
    const result = await Note.updateMany(
      { userId: req.userId },
      { $set: { title: req.body.title, updatedAt: new Date() } }
    );
    if (result.modifiedCount === 0) return res.json({ message: 'No note found' });
    res.json({ message: 'All notes updated' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.userId) return res.status(403).json({ message: 'You are not the owner' });

    await note.deleteOne();
    res.json({ message: 'deleted', note });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPaginatedNotes = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const notes = await Note.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(notes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.userId) return res.status(403).json({ message: 'You are not the owner' });
    res.json(note);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNoteByContent = async (req, res) => {
  try {
    const note = await Note.findOne({ userId: req.userId, content: req.query.content });
    if (!note) return res.json({ message: 'No note found' });
    res.json(note);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotesWithUser = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId })
      .select('title userId createdAt')
      .populate({ path: 'userId', select: 'email' });
    res.json(notes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const aggregateNotes = async (req, res) => {
  try {
    const result = await Note.aggregate([
      { $match: { userId: req.userId, title: req.query.title } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          title: 1,
          userId: 1,
          createdAt: 1,
          user: { name: '$user.name', email: '$user.email' }
        }
      }
    ]);
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAllNotes = async (req, res) => {
  try {
    await Note.deleteMany({ userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
