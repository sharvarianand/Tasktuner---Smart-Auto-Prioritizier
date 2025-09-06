import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { taskApi } from '../api';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await taskApi.getPrioritized();
        // Ensure sorted by aiPriority descending if present
        const sorted = [...data].sort((a, b) => (b.aiPriority || 0) - (a.aiPriority || 0));
        setTasks(sorted);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return <View style={styles.center}><Text>{error}</Text></View>;

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={tasks}
      keyExtractor={(item) => String(item.id || item.title)}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{index + 1}. {item.title || item.taskName}</Text>
          <Text style={styles.meta}>Priority: {item.priority}  •  AI: {item.aiPriority ?? '—'}</Text>
          {item.dueDate && <Text style={styles.meta}>Due: {String(item.dueDate).slice(0,10)} {item.dueTime || ''}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 12, color: '#555', marginTop: 4 },
});


