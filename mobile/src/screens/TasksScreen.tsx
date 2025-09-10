import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useVoice } from '../contexts/VoiceContext';
import { taskService } from '../services/taskService';
import { Task } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  Flame,
  Star,
  Filter,
  RefreshCw,
  Mic,
  MicOff,
} from 'lucide-react-native';

const TasksScreen: React.FC = () => {
  const { theme } = useTheme();
  const { speak, isSpeaking } = useVoice();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'ai' | 'priority' | 'dueDate'>('ai');
  const [isRecording, setIsRecording] = useState(false);

  // Fetch tasks - temporarily disabled for demo
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => Promise.resolve([]), // Mock empty tasks for now
  });

  // Complete task mutation - temporarily disabled for demo
  const completeTaskMutation = useMutation({
    mutationFn: () => Promise.resolve(), // Mock success for now
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      speak('Great job! Task completed!');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to complete task');
    },
  });

  // Delete task mutation - temporarily disabled for demo
  const deleteTaskMutation = useMutation({
    mutationFn: () => Promise.resolve(), // Mock success for now
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to delete task');
    },
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'ai':
        return (b.aiPriority || 0) - (a.aiPriority || 0);
      case 'priority':
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      default:
        return 0;
    }
  });

  const handleCompleteTask = (taskId: string) => {
    completeTaskMutation.mutate(taskId);
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTaskMutation.mutate(taskId)
        },
      ]
    );
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Voice input implementation would go here
    speak('Voice input feature coming soon!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return theme.colors.error;
      case 'Medium': return theme.colors.warning;
      case 'Low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return React.createElement(Flame, { size: 16, color: theme.colors.error });
      case 'Medium': return React.createElement(Star, { size: 16, color: theme.colors.warning });
      case 'Low': return React.createElement(Circle, { size: 16, color: theme.colors.success });
      default: return React.createElement(Circle, { size: 16, color: theme.colors.textSecondary });
    }
  };

  const renderTask = ({ item: task }: { item: Task }) => (
    <Card
      style={[
        styles.taskCard,
        task.completed && styles.completedTask,
      ]}
      onPress={() => navigation.navigate('TaskDetail' as never, { taskId: task.id } as never)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleRow}>
          <TouchableOpacity
            onPress={() => handleCompleteTask(task.id)}
            style={styles.checkbox}
          >
            {task.completed ? (
              <CheckCircle size={24} color={theme.colors.success} />
            ) : (
              <Circle size={24} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
          
          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                { color: theme.colors.text },
                task.completed && styles.completedText,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            
            {task.description && (
              <Text
                style={[
                  styles.taskDescription,
                  { color: theme.colors.textSecondary },
                  task.completed && styles.completedText,
                ]}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.taskMeta}>
          <View style={styles.priorityRow}>
            {getPriorityIcon(task.priority)}
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority}
            </Text>
          </View>

          {task.dueDate && (
            <View style={styles.dueDateRow}>
              <Clock size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.dueDateText, { color: theme.colors.textSecondary }]}>
                {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}

          {task.aiPriority && (
            <View style={styles.aiScoreRow}>
              <Text style={[styles.aiScoreText, { color: theme.colors.primary }]}>
                AI: {task.aiPriority}%
              </Text>
            </View>
          )}
        </View>
      </View>

      {task.roast && (
        <View style={styles.roastContainer}>
          <Text style={[styles.roastText, { color: theme.colors.accent }]}>
            "{task.roast}"
          </Text>
        </View>
      )}
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No tasks found
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {filter === 'completed' 
          ? "You haven't completed any tasks yet"
          : filter === 'pending'
          ? "All caught up! Time to add some tasks"
          : "Start by adding your first task"
        }
      </Text>
      <Button
        title="Add Task"
        onPress={() => navigation.navigate('TaskDetail' as never, { taskId: 'new' } as never)}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Tasks
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleVoiceInput}
            style={[
              styles.voiceButton,
              { backgroundColor: isRecording ? theme.colors.error : theme.colors.primary }
            ]}
          >
            {isRecording ? (
              <MicOff size={20} color="#ffffff" />
            ) : (
              <Mic size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
          
          <Button
            title="Add"
            onPress={() => navigation.navigate('TaskDetail' as never, { taskId: 'new' } as never)}
            size="small"
            style={styles.addButton}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.filterButtons}>
          {(['all', 'pending', 'completed'] as const).map((filterType) => (
            <Button
              key={filterType}
              title={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              onPress={() => setFilter(filterType)}
              variant={filter === filterType ? 'primary' : 'outline'}
              size="small"
              style={styles.filterButton}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setSortBy(sortBy === 'ai' ? 'priority' : 'ai')}
          style={styles.sortButton}
        >
          <Filter size={16} color={theme.colors.primary} />
          <Text style={[styles.sortText, { color: theme.colors.primary }]}>
            {sortBy === 'ai' ? 'AI Sort' : 'Priority'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <FlatList
        data={sortedTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    minWidth: 60,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    minWidth: 80,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    marginBottom: 12,
  },
  completedTask: {
    opacity: 0.7,
  },
  taskHeader: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
  },
  aiScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiScoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roastContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  roastText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    minWidth: 120,
  },
});

export default TasksScreen;
