import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // ajusta la ruta si tu archivo está en otro lado

export default function IndexScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const guardarDatos = async () => {
    if (!email || !password || !descripcion) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "usuarios"), {
        email: email,
        password: password, // texto plano para pruebas
        descripcion: descripcion
      });

      Alert.alert("Éxito", `Datos guardados con ID: ${docRef.id}`);
      setEmail("");
      setPassword("");
      setDescripcion("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Descripción"
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <Button title="Guardar" onPress={guardarDatos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  }
});
