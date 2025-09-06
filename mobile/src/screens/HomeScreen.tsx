import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskTuner Mobile</Text>
      <Button title="View Tasks" onPress={() => navigation.navigate('Tasks')} />
      <View style={{ height: 12 }} />
      <Button title="Focus Mode" onPress={() => navigation.navigate('Focus')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
});


