import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { addMovie } from '../../store/firebaseConfig';

const AddMovieScreen = () => {
  const [title, setTitle] = useState('');
  const [banner, setBanner] = useState('');
  const [backdrops, setBackdrop] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [videoURL, setVideoURL] = useState('');
  const [yearOfRelease, setYearOfRelease] = useState('');

  const tagOptions = [
    'Comedy', 'Drama', 'Romantic', 'Action', 'Supernatural', 
    'Science Fiction', 'Cartoon', 'Detective Fiction', 'Teenager','Horror','Thriller','Mystery'
  ];

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 500,
        cropping: true,
      });
      setBanner(image.path); 
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };
  const pickImagebackdrop = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });
      setBackdrop(image.path); 
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      const uri = result[0].uri.replace('file://', ''); 
      setVideoURL(uri);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled video picker');
      } else {
        console.error('Error picking video: ', error);
      }
    }
  };

  const handleAddMovie = () => {
    if (tags.length === 3) {
      addMovie(title,backdrops, banner, description, tags, videoURL, yearOfRelease);
    } else {
      alert('Please select exactly 3 tags.');
    }
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 3) {
      setTags([...tags, tag]);
    } else {
      alert('You can only select 3 tags.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />

      <Text>Banner</Text>
      <TouchableOpacity onPress={pickImage}>
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
          {banner ? <Image source={{ uri: banner }} style={{ height: 200, width: '100%' }} /> : <Text>Select Banner Image</Text>}
        </View>
      </TouchableOpacity>

      <Text>Backdrops</Text>
      <TouchableOpacity onPress={pickImagebackdrop}>
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
          {backdrops ? <Image source={{ uri: backdrops }} style={{ height: 200, width: '100%' }} /> : <Text>Select Backdrops Image</Text>}
        </View>
      </TouchableOpacity>

      <Text>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />

      <Text>Tags</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
        {tagOptions.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={{
              padding: 10,
              margin: 5,
              borderWidth: 1,
              borderRadius: 5,
              backgroundColor: tags.includes(tag) ? 'green' : 'white',
            }}
          >
            <Text>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Video URL</Text>
      <TouchableOpacity onPress={pickVideo}>
        <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
          <Text>Select Video</Text>
        </View>
      </TouchableOpacity>

      <Text>Year of Release</Text>
      <TextInput
        value={yearOfRelease}
        onChangeText={setYearOfRelease}
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
        keyboardType="numeric"
      />

      <Button title="Add Movie" onPress={handleAddMovie} />
    </ScrollView>
  );
};

export default AddMovieScreen;
