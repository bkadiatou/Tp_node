const express = require('express');
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

// Stockage des fichiers CV
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cv');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Stockage des images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadCV = multer({ storage: cvStorage }).single('cv');
const uploadImages = multer({ storage: imageStorage }).array('images');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
  uploadCV(req, res, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    uploadImages(req, res, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Réalisez ici toutes les opérations supplémentaires nécessaires, telles que l'enregistrement des informations dans une base de données
    });
  });
});
app.post('/', (req, res) => {
  // Gérer le traitement de la soumission du formulaire ici
  res.send('Formulaire soumis avec succès');
});

async function fetchAuthors() {
  try {
    const auteurss = await axios.get('https://openlibrary.org/authors/OL33421A.json');
    const authors = auteurss.data;
    console.log(auteurss);

  } catch (error) {
    console.error('Erreur lors de la récupération des auteurs :', error.message);
  }
}

// Appel de la fonction asynchrone
fetchAuthors();

app.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});



















