
const express = require('express'); 
const firebase  = require('firebase/app');
const firebaseAuth  = require('firebase/auth');
const fireStore = require('firebase/firestore')
var firebaseConfig = require('./firebaseConfig');
const formidable = require('formidable');
const path = require('path'); 
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
const bodyParser = require('body-parser');

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(firebaseApp);
const BUCKET_URL = "gs://web-project-51e3f.appspot.com/"

const app = express(); 
app.use(bodyParser.json());
app.use(express.static('Client'));
app.use(
  express.urlencoded({
    extended: true,
  })
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "web-project-51e3f.appspot.com"
});

const bucket = admin.storage().bucket();
const db = admin.firestore();




app.get('/',function(req,res){
  console.log("Login request");
  res.sendFile(path.join(__dirname, 'Client', 'Login.html'))
  });
  
  app.get('/SignUp',function(req,res){
    console.log("request for signup");
    res.sendFile(path.join(__dirname+'/Client/Register.html'));
  });
  
  app.post('/RegiserToHome' , function(req, res){
    console.log("try insert User to database")
    console.log(req.body);

    firebaseAuth.createUserWithEmailAndPassword(auth , req.body.UserEmail, req.body.UserPassword).then(()=>{
      console.log("insert User to database")
      res.sendFile(path.join(__dirname, 'Client', 'Home.html'))})
    .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
    res.send(false);
    });
  });

  app.post('/Home', function(req, res) { 
    firebaseAuth.signInWithEmailAndPassword(auth, req.body.UserEmail, req.body.UserPassword)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const userEmail = user.email;
        res.sendFile(path.join(__dirname, 'Client', 'Home.html'))
      })
      .catch((error) => {
        console.log("error");
        const errorCode = error.code;
        const errorMessage = error.message;
        res.send(false);
      });
 });

 



  app.post('/addEvent', async function(req, res) { 

  updatePhoto(req);  
  res.json({ message: "yay" });
});

app.get('/getEvents',async function(req,res){
  const documents = [];
  await db.collection("Events").get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      documents.push(doc.data());
    });
    //console.log(documents); // array of document objects
  })
  .catch((error) => {
    console.log('Error getting documents: ', error);
  });
  res.send(documents)
});




app.post('/getUserProfile',async function(req,res){
  const documents = [];
  console.log(req.body);
 res.sendFile(path.join(__dirname, 'Client', 'UserEvent.html'))
  
});


app.post('/getUserEvents',async function(req,res){
  const documents = [];
  console.log(req.body);
  email = req.body.email;
  await db.collection("Events").where("email", "==" , email).get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      documents.push(doc.data());
      });
})
.catch((error) => { 
    console.log("Error getting documents: ", error);
});
console.log(documents);
res.send(documents)

});


app.post('/deleteEvent',async function(req,res){
  console.log(req.body);
  console.log("----------------------");
  console.log(req.body.email , " " , req.body.startDate," " ,req.body.endDate);
  db.collection('Events').where('email', '==', req.body.email).where('start', '==', req.body.startDate).where('end' , '==' , req.body.endDate).get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        documentSnapshot.ref.delete();
      });
    console.log("delete secssed");
    res.send(true);
    })
    .catch(error => {
      console.error('Error deleting document: ', error);
      res.send(false);
    });  
});

function updatePhoto(req) {
  var EventFields = {};
  const imagesArray = [];
  const form = new formidable.IncomingForm();
  // Parse the FormData object
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(500).send('Error parsing form data.');
    }
    EventFields = fields;

    // Upload each file to Firestore Storage
    counter = 1;
    const currentDate = new Date();
    dateForFile = currentDate.getDate() + "-" + currentDate.getMonth();
    const promises = Object.values(files).map((file) => {
      fileName = fields.email + "-" + counter + "-" + dateForFile + ".jpg";
      filePath = file.filepath;
      counter += 1;
      //console.log("file name = ", fileName);
      //console.log("file path = ", file.filepath);
      const fileUpload = bucket.file(fileName);

      // Create a read stream from the file path
      const readStream = require('fs').createReadStream(filePath);

      // Pipe the read stream to the file upload stream
      readStream.pipe(
        fileUpload.createWriteStream({
          // Define metadata for the file (optional)
          metadata: {
            contentType: file.type,
            metadata: {
              custom: 'metadata',
            },
          },
        })
      );

      return bucket
        .file(fileName)
        .getSignedUrl({
          action: 'read',
          expires: '03-01-2024', // An expiration date in the future
        })
        .then((url) => {
          //console.log(`The download URL for ${fileName} is ${url[0]}.`);
          const tmp = url[0];
          imagesArray.push(tmp)
          //imagesArray.push(tmp);
        })
        .catch((error) => {
          console.error(`Error getting download URL for ${fileName}.`, error);
        });
    });

    Promise.all(promises).then(() => {
      EventFields.imagesArray = imagesArray;
      //console.log("EventFields function add image  -- > ", EventFields);
      updateEvent(EventFields);
    });
  });

  
}


function updateEvent(EventFields){
  console.log("EventFields function updateEvent  -- > ", EventFields);
  collectionRef = db.collection('Events');
  collectionRef.add(EventFields)         
  .then((docRef) => {
    console.log(`Document written with ID: ${docRef.id}`);
  })
  .catch((error) => {
    console.error('Error adding document: ', error);
});
}

app.listen(3000); 
console.log('Running at Port 3000'); 

