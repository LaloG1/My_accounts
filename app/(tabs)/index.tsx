import { MaterialIcons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { db } from "../../firebaseConfig";

export default function IndexScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const colorScheme = useColorScheme(); // 'light' o 'dark'

  const guardarDatos = async () => {
    if (!email || !password || !descripcion) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "usuarios"), {
        email,
        password,
        descripcion,
      });

      Alert.alert("Éxito", `Datos guardados con ID: ${docRef.id}`);

      setEmail("");
      setPassword("");
      setDescripcion("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: colorScheme === "dark" ? "#555" : "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: colorScheme === "dark" ? "#fff" : "#000",
    backgroundColor: colorScheme === "dark" ? "#222" : "#fff",
  };

  const inputPasswordStyle = {
    ...inputStyle,
    paddingRight: 40, // espacio para el icono
  };

  const containerStyle = {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: colorScheme === "dark" ? "#121212" : "#f5f5f5",
  };

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder="Email"
        style={inputStyle}
        placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
        value={email}
        onChangeText={setEmail}
      />

      <View style={{ position: "relative", marginBottom: 10 }}>
        <TextInput
          placeholder="Contraseña"
          style={inputPasswordStyle}
          placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostrarPassword}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: "50%", transform: [{ translateY: -12 }] }}
          onPress={() => setMostrarPassword(!mostrarPassword)}
        >
          <MaterialIcons
            name={mostrarPassword ? "visibility" : "visibility-off"}
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#555"}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Descripción"
        style={inputStyle}
        placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Button title="Guardar" onPress={guardarDatos} color={colorScheme === "dark" ? "#6200ee" : undefined} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 10,
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    paddingRight: 40, // espacio para el icono
  },
  iconPassword: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // centrar vertical
  },
});
