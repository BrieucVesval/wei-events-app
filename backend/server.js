const express = require('express');
const cors = require('cors');
const db = require('./database');
const { getUserRole } = require('./roleService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(re, res)=>{
  return res.json("From BackendSide")
})

// Endpoint pour obtenir tous les éléments
app.get('/api/events', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ events: rows });
    });
});

// Endpoint pour ajouter un nouvel élément
app.post('/api/events', async (req, res) => {
  const { name, date, startTime, endTime, location, description, photo } = req.body;

  console.log('Données reçues:', req.body);

  if (!name || !date || !startTime || !endTime || !location) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
  }

  try {
    const event = await db.Event.create({
      name,
      date,
      startTime,
      endTime,
      location,
      description,
      photo
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour obtenir tous les étudiants
app.get('/api/students', async (req, res) => {
  try {
    const students = await db.Student.findAll({
      attributes: ['id', 'email', 'family', 'year', 'photo']
    });
    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour changer la famille d'un étudiant
app.put('/api/students/:studentId/family', async (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  const { newFamily } = req.body;

  try {
    const student = await db.Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }

    student.family = newFamily;
    await student.save();

    res.json({ message: 'Famille changée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour récupérer le rôle de l'utilisateur
app.get('/api/role/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const role = await getUserRole(userId);
  res.json({ role });
});

// Endpoint pour ajouter un participant à un événement
app.post('/api/events/:eventId/participants', async (req, res) => {
  const eventId = parseInt(req.params.eventId, 10);
  const { studentId } = req.body;

  try {
    const participant = await db.EventParticipant.create({
      studentId,
      eventId
    });
    res.status(201).json(participant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});