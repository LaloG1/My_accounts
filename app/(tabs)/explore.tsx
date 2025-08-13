import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { DataTable, IconButton, TextInput, Button } from "react-native-paper";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface Usuario {
  id: string;
  email: string;
  password: string;
  descripcion: string;
}

export default function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  // Lectura en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const data: Usuario[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Usuario[];
      setUsuarios(data);
    });
    return () => unsub();
  }, []);

  // Eliminar usuario
  const eliminarUsuario = async (id: string) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      Alert.alert("Eliminado", "Registro eliminado correctamente");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!editandoId) return;
    try {
      await updateDoc(doc(db, "usuarios", editandoId), {
        email: nuevoEmail,
        descripcion: nuevaDescripcion,
      });
      setEditandoId(null);
      setNuevoEmail("");
      setNuevaDescripcion("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Email</DataTable.Title>
        <DataTable.Title>Descripción</DataTable.Title>
        <DataTable.Title>Acciones</DataTable.Title>
      </DataTable.Header>

      {usuarios.map((usuario) =>
        editandoId === usuario.id ? (
          <DataTable.Row key={usuario.id}>
            <TextInput
              value={nuevoEmail}
              onChangeText={setNuevoEmail}
              placeholder="Nuevo email"
              style={{ flex: 1, marginRight: 5 }}
            />
            <TextInput
              value={nuevaDescripcion}
              onChangeText={setNuevaDescripcion}
              placeholder="Nueva descripción"
              style={{ flex: 1, marginRight: 5 }}
            />
            <Button mode="contained" onPress={guardarEdicion} style={{ marginRight: 5 }}>
              Guardar
            </Button>
            <Button mode="outlined" onPress={() => setEditandoId(null)}>
              Cancelar
            </Button>
          </DataTable.Row>
        ) : (
          <DataTable.Row key={usuario.id}>
            <DataTable.Cell>{usuario.email}</DataTable.Cell>
            <DataTable.Cell>{usuario.descripcion}</DataTable.Cell>
            <DataTable.Cell>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => {
                  setEditandoId(usuario.id);
                  setNuevoEmail(usuario.email);
                  setNuevaDescripcion(usuario.descripcion);
                }}
              />
              <IconButton
                icon="delete"
                size={20}
                onPress={() =>
                  Alert.alert(
                    "Confirmar eliminación",
                    "¿Seguro que quieres eliminar este usuario?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      { text: "Eliminar", onPress: () => eliminarUsuario(usuario.id) },
                    ]
                  )
                }
              />
            </DataTable.Cell>
          </DataTable.Row>
        )
      )}
    </DataTable>
  );
}
