import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Mock events for now
      setEvents([]);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const selectedDateEvents = selectedDate ? events.filter((event: any) => event.startTime?.startsWith(selectedDate)) : [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Calendar
        </Text>
        
        <Card style={styles.calendarCard}>
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            Calendar view coming soon...
          </Text>
        </Card>

        {selectedDate && (
          <Card style={styles.eventsCard}>
            <Text style={[styles.eventsTitle, { color: theme.colors.text }]}>
              Events for {selectedDate}
            </Text>
            
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event: any, index: number) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventTime, { color: theme.colors.textSecondary }]}>
                    {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
                  </Text>
                  {event.description && (
                    <Text style={[styles.eventDescription, { color: theme.colors.textSecondary }]}>
                      {event.description}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={[styles.noEvents, { color: theme.colors.textSecondary }]}>
                No events for this date
              </Text>
            )}
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title="Refresh Events"
            onPress={loadEvents}
            loading={loading}
            style={styles.refreshButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarCard: {
    marginBottom: 20,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
  },
  eventsCard: {
    marginBottom: 20,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  eventItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  noEvents: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  actions: {
    marginBottom: 20,
  },
  refreshButton: {
    marginBottom: 10,
  },
});

export default CalendarScreen;
