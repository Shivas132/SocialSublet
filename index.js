
const express = require('express'); 

const firebase  = require('firebase/app');
const firebaseAuth  = require('firebase/auth');
const fireStore = require('firebase/firestore')
var firebaseConfig = require('./firebaseConfig');
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(firebaseApp);

const app = express(); 
const path = require('path'); 

app.use(express.static('Client'));
app.use(
  express.urlencoded({
    extended: true,
  })
)

var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
const bodyParser = require('body-parser');
app.use(bodyParser.json());




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
    console.log(req.body);
    firebaseAuth.signInWithEmailAndPassword(auth, req.body.UserEmail, req.body.UserPassword)
      .then((userCredential) => {
        // Signed in 
        console.log(userCredential);
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


 app.post('/addEvent', function(req, res) { 

  var myData = req.body;
  console.log(myData)
  collectionRef = db.collection('Events');
  collectionRef.add(myData)
  .then((docRef) => {
    console.log(`Document written with ID: ${docRef.id}`);
  })
  .catch((error) => {
    console.error('Error adding document: ', error);
  });
  console.log('x');
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



app.listen(3000); 
console.log('Running at Port 3000'); 

