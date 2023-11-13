import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useDropzone } from "react-dropzone";
import { Avatar } from "native-base";

const firebaseConfig = {
  apiKey: "AIzaSyDyreWvsFsje3RsRNz94BuiA1JiqiLq-PI",
  authDomain: "checkinapp-36ba3.firebaseapp.com",
  projectId: "checkinapp-36ba3",
  storageBucket: "checkinapp-36ba3.appspot.com",
  messagingSenderId: "1064293880985",
  appId: "1:1064293880985:web:c2f704f80f674257fe9408",
  measurementId: "G-EKEWT2PLDP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const { width: screenWidth } = Dimensions.get("window");

const CheckInScreen = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "checkIns"));
      const checkInsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCheckIns(checkInsData);
    };

    fetchData();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onDrop = (acceptedFiles) => {
    const selectedImage = acceptedFiles[0];

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
    };
  };

  const addCheckIn = async () => {
    let storageRef;

    if (image) {
      storageRef = ref(storage, `images/${Date.now()}`);
      await uploadString(storageRef, image, "data_url");
    }

    await addDoc(collection(db, "checkIns"), {
      title: title,
      imageURL: image ? await getDownloadURL(storageRef) : null,
      timestamp: new Date(),
    });

    setTitle("");
    setImage(null);

    toggleModal();

    const snapshot = await getDocs(collection(db, "checkIns"));
    const checkInsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCheckIns(checkInsData);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Text style={styles.greetingText}>
          Hello! {"👋"} Welcome to the Check-In App
        </Text>
        <Text style={styles.subtitleText}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </Text>
        <View>
          <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>Add Check-In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.headingText}>Added Check-Ins</Text>
        <FlatList
          data={checkIns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.checkInContainer}>
              {item.imageURL && (
                <Image
                  style={styles.checkInImage}
                  source={{ uri: item.imageURL }}
                />
              )}
              <Text style={styles.checkInTitle}>{item.title}</Text>
              <Text style={styles.checkInDate}>
                {item?.timestamp?.toDate().toDateString()}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Avatar source={{ uri: "https://i.pravatar.cc/150?img=3" }} />
                <Text style={{ marginLeft: 10, marginTop: 10 }}>John Doe</Text>
              </View>
              <Text
                style={{
                  position: "absolute",
                  right: 40,
                  top: 30,
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#7B5AFF", // Light Purple
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                Checked IN
              </Text>
            </View>
          )}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Add Check-Ins</Text>
            </View>

            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                placeholder="Enter title..."
                value={title}
                onChangeText={(text) => setTitle(text)}
                style={styles.input}
              />
            </View>
            <Text
              style={{
                marginLeft: 10,
                marginBottom: 20,
                color: "black",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Upload Image
            </Text>

            {/* Drag-and-Drop Area */}
            {!image && (
              <View {...getRootProps()} style={styles.dropzone}>
                <input {...getInputProps()} />
                <Image
                  source={require("./assets/Inbox.png")}
                  style={styles.dropzoneImage}
                />
                <Text style={styles.dropzoneText}>
                  Click or drag file to this area to upload
                </Text>
                <Text style={styles.descriptionText}>
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </Text>
              </View>
            )}

            {/* Selected Image */}
            {image && (
              <Image style={styles.selectedImage} source={{ uri: image }} />
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={addCheckIn}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={toggleModal}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    elevation: 5,
    height: 200,
    backgroundImage:
      "url('https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D')",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitleText: {
    fontSize: 14,
    marginBottom: 10,
    color: "rgba(55, 55, 55, 0.8)",
  },
  addButton: {
    backgroundColor: "#7B5AFF", // Light Purple
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headingText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    marginLeft: 10,
  },
  checkInContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    margin: 20,
    elevation: 5,
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.45)",
  },
  checkInImage: {
    width: Dimensions.get("window").width - 80,
    height: Dimensions.get("window").width * 0.75,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  checkInTitle: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  checkInDate: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    color: "rgba(55, 55, 55, 0.8)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    width: "100%", // Adjust as needed
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    width: "90%", // Adjust as needed
    maxHeight: "100%", // Adjust as needed
  },

  modalHeader: {
    backgroundColor: "#f2f2f2",
    padding: 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
    padding: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
    fontSize: 16,
  },
  dropzone: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 4,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  dropzoneImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    marginLeft: 10,
  },
  dropzoneText: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
  descriptionText: {
    fontSize: 14,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
    gap: 10,
    padding: 15,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 2,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  dropzone: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 4,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    cursor: "pointer",
    marginHorizontal: 10,
    height: 200,
  },
  selectedImage: {
    width: 400,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#7B5AFF", // Light Purple
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#fff", // Tomato Red
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
  },
});

export default CheckInScreen;
