import React, { Component } from 'react';
import firebase from 'firebase';

import FileUpload from './FileUpload';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
         user 
        });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
         pictures: this.state.pictures.concat(snapshot.val())
        })
    });
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        console.log(`Inicio sesión: ${result.user.email}`);
      })
      .catch(error => console.error(`Error ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(result => {
        console.log(`Cierre sesión: ${result.user.email}`);
      })
      .catch(error => console.error(`Error ${error.code}: ${error.message}`));
  }

  handleUpload(e) {
    console.log('handelUpload');
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on(
      'state_changed',
      snapshot => {
        let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        this.setState({ uploadValue: percentage });
      },
      console.log,
      () => {
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL
        };

        const dbRef = firebase.database().ref('pictures');
        const newPicture = dbRef.push();
        newPicture.set(record);
      }
    );
  }

  renderLoginButton() {
    const imgStyle = {
      width: 100,
      height: 100
    };

    if (this.state.user) {
      return (
        <div>
          <img src={this.state.user.photoURL} style={imgStyle} alt="photoURL" />
          <p>
            Hola {this.state.user.displayName}
          </p>
          <button onClick={this.handleLogout}>Salir</button>

          <FileUpload onUpload={this.handleUpload} />

          {this.state.pictures.map(picture =>
            <div>
              <hr/>
              <img src={picture.image} alt=""/> 
              <br/>
              <img width="32" src={picture.photoURL} alt={picture.displayName}/> 
              <br/>
              <span>{picture.displayName}</span>
            </div>
          ).reverse()}                
        </div>
      );
    } else {
      return <button onClick={this.handleAuth}>Login with Google</button>;
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <p className="App-intro">
          {this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
