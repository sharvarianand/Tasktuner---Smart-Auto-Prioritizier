import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function FocusScreen() {
  const [time, setTime] = useState(25 * 60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTime(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [active]);

  const format = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus</Text>
      <Text style={styles.timer}>{format(time)}</Text>
      <View style={{ height: 12 }} />
      <Button title={active ? 'Pause' : 'Start'} onPress={() => setActive(a => !a)} />
      <View style={{ height: 8 }} />
      <Button title="Reset" onPress={() => { setActive(false); setTime(25*60); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  timer: { fontSize: 48, fontWeight: '800' },
});


