import app from 'firebase/app';
import auth from 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUser = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  //DATABASE//
  user = uid => this.db.ref('users/' + uid);
  users = () => this.db.ref('users');
  posts = uid => this.db.ref('users/'+uid+'/posts');
  post = (uid, pid) => this.db.ref('users/'+uid+'/posts/'+pid);
  likes = (uid, pid) => this.db.ref('users/'+uid+'/posts/'+pid+'/likes');
  following = (uid) => this.db.ref('users/'+uid+'/following');
  followers = (uid) => this.db.ref('users/'+uid+'/followers');
  messageReceived = (uid) => this.db.ref('users/'+uid+'/messages/received');
  messageSent = (uid) => this.db.ref('users/'+uid+'/messages/sent');
  messageNumReceived = (uid, mid) => this.db.ref('users/'+uid+'/messages/received/'+mid);
  messageNumSent = (uid, mid) => this.db.ref('users/'+uid+'/messages/sent/'+mid);
}

export default Firebase;
