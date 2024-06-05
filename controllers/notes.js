const Note = require('../models/note');

exports.getAllNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find().skip(skip).limit(limit);
    const total = await Note.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      notes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createNote = async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      res.status(400).json({ message: messages.join('. ') });
    } else if (err.code === 11000) {
      res.status(400).json({ message: 'Note with this title already exists' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (req.body.title != null) note.title = req.body.title;
    if (req.body.content != null) note.content = req.body.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      res.status(400).json({ message: messages.join('. ') });
    } else if (err.code === 11000) {
      res.status(400).json({ message: 'Note with this title already exists' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
