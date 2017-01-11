/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import Upload from 'react-native-background-upload'

export default class uploader extends Component {
  state = {
    fileGambar: ''
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="pilih gambar"
          onPress={this.handlePilihGambar}
        />
        <Text>Path file: {this.state.fileGambar.uri}</Text>
        <Button
          title="upload"
          onPress={this.handleUpload}
        />
        <Text>Status upload: idle</Text>
      </View>
    );
  }

  handlePilihGambar = () => {
    var options = {
      title: 'Pilih gambar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source;

        // You can display the image using either data...
        //source = { uri: 'data:image/jpeg;base64,' + response.data };

        // Or a reference to the platform specific asset location
        console.log('PLATFORM')
        console.log(Platform.OS)
        if (Platform.OS === 'android') {
          source = { uri: response.uri };
        } else {
          source = { uri: response.uri.replace('file://', '') };
        }

        source = { uri: response.uri };

        this.setState({
          fileGambar: source
        });
      }
    });
  }

  handleUpload = () => {
    console.log('URI FILE GAMBAR')
    console.log(this.state.fileGambar.uri)
    const options = {
      url: 'https://lembah-video.s3-ap-southeast-1.amazonaws.com/uploader.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJFIRQZNF4ZAQF4PA%2F20170111%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170111T061021Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=d16abb7b1fe06bf20e82f1e0463ca899704953c6f1822007926cd63e6056f277',
      path: this.state.fileGambar.uri
    }

    Upload.startUpload(options).then((uploadId) => {
      console.log('Upload started')
      console.log(uploadId)
      Upload.addListener('progress',uploadId, (data) => {
        console.log(`Progress: ${data.progress}%`)
      })
      Upload.addListener('error',uploadId, (data) => {
        console.log(`Error: ${data.error}%`)
      })
      Upload.addListener('completed',uploadId, (data) => {
        console.log(`Completed!`)
      })
    }).catch(function(err) {
      console.log('Upload error!',err)
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('uploader', () => uploader);
