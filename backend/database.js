const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: require('path').join(__dirname, 'WeildWeeks.db') // Utiliser le fichier WeildWeeks.db
});

// Modèle pour les étudiants
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  family: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.ENUM('1A', '2A'),
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Modèle pour les événements
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING, // Utiliser STRING au lieu de GEOGRAPHY
    allowNull: false
  },
  association: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Modèle pour les favoris des étudiants
const FavoriteEvent = sequelize.define('FavoriteEvent', {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id'
    }
  }
});

// Modèle pour les documents d'information
const InfoDoc = sequelize.define('InfoDoc', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    }
  }
});

// Modèle pour les associations
const Association = sequelize.define('Association', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Modèle pour les rôles
const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Modèle pour les permissions
const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Modèle pour les utilisateurs (étudiants) avec rôle
const UserRole = sequelize.define('UserRole', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    }
  }
});

// Modèle pour les rôles avec permissions
const RolePermission = sequelize.define('RolePermission', {
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    }
  },
  permissionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Permission,
      key: 'id'
    }
  }
});

// Modèle pour la présence aux événements
const Attendance = sequelize.define('Attendance', {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id'
    }
  },
  attended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// Modèle pour les participants aux événements
const EventParticipant = sequelize.define('EventParticipant', {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id'
    }
  }
});

// Fonction pour vérifier les permissions d'un utilisateur
async function hasPermission(userId, action) {
  const userRoles = await UserRole.findAll({ where: { userId } });
  const roleIds = userRoles.map(userRole => userRole.roleId);

  const permissions = await RolePermission.findAll({
    where: {
      roleId: roleIds,
      '$Permission.action$': action
    },
    include: [Permission]
  });

  return permissions.length > 0;
}

// Exemple d'utilisation de la fonction hasPermission
async function addEvent(userId, eventData) {
  if (await hasPermission(userId, 'add_event')) {
    const event = await Event.create(eventData);
    console.log('Événement ajouté:', event);
  } else {
    console.log('Permission refusée: ajouter un événement');
  }
}

// Synchronisation des modèles avec la base de données
sequelize.sync({ force: true }).then(() => {
  console.log("Les tables ont été créées.");
  createData();
});

// Exemple de création de données
async function createData() {
  // Créer des rôles
  const roleAdmin = await Role.create({ name: 'Admin' });
  const roleOrganizer = await Role.create({ name: 'Organizer' });
  const roleStudent = await Role.create({ name: 'Student' });

  // Créer des permissions
  const permAddEvent = await Permission.create({ action: 'add_event' });
  const permChangeFamily = await Permission.create({ action: 'change_family' });

  // Associer des permissions aux rôles
  await RolePermission.create({ roleId: roleAdmin.id, permissionId: permAddEvent.id });
  await RolePermission.create({ roleId: roleAdmin.id, permissionId: permChangeFamily.id });
  await RolePermission.create({ roleId: roleOrganizer.id, permissionId: permAddEvent.id });

  // Créer un étudiant avec un rôle
  const student = await Student.create({
    email: 'etudiant@example.com',
    family: 'Famille A',
    year: '1A',
    photo: 'photo_etudiant.jpg'
  });

  await UserRole.create({ userId: student.id, roleId: roleStudent.id });

  // Créer une association
  const association = await Association.create({
    name: 'Association A',
    photo: 'photo_association.jpg'
  });

  // Ajouter un événement en vérifiant les permissions
  await addEvent(student.id, {
    name: 'Événement A',
    date: new Date(),
    startTime: '10:00',
    endTime: '12:00',
    location: '48.8588443,2.2943506',
    association: association.name,
    description: 'Description de l\'événement A',
    photo: 'photo_evenement.jpg'
  });

  // Ajouter l'événement aux favoris de l'étudiant
  await FavoriteEvent.create({
    studentId: student.id,
    eventId: event.id
  });

  // Ajouter la présence de l'étudiant à l'événement
  await Attendance.create({
    studentId: student.id,
    eventId: event.id,
    attended: true
  });

  // Ajouter un participant à un événement
  await EventParticipant.create({
    studentId: student.id,
    eventId: event.id
  });

  // Créer un document d'information
  await InfoDoc.create({
    title: 'Document d\'information A',
    content: 'Contenu du document d\'information A',
    authorId: student.id
  });

  console.log("Les données ont été créées.");
}

module.exports = {
  Student,
  Event,
  FavoriteEvent,
  InfoDoc,
  Association,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Attendance,
  EventParticipant
};
