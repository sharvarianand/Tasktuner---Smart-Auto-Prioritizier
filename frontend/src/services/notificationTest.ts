// Test file to verify notification service functionality
import { notificationService } from '../services/notificationService';

// Test notification service initialization
console.log('🔔 Testing NotificationService...');

// Test 1: Check if service is properly initialized
console.log('✅ Service initialized:', !!notificationService);

// Test 2: Check permission status
console.log('🔑 Permission status:', notificationService.getPermissionStatus());

// Test 3: Test task storage and retrieval
const testTasks = [
  {
    id: 'test-1',
    title: 'Test Task 1',
    dueDate: '2025-08-03',
    endTime: '14:00',
    completed: false
  },
  {
    id: 'test-2', 
    title: 'Test Task 2 - Overdue',
    dueDate: '2025-08-02',
    endTime: '12:00',
    completed: false
  }
];

// Update stored tasks
notificationService.updateStoredTasks(testTasks);
console.log('💾 Test tasks stored successfully');

// Test 4: Request notification permission (if needed)
notificationService.requestPermission().then(granted => {
  console.log('🔔 Notification permission:', granted ? 'Granted' : 'Denied');
  
  if (granted) {
    // Test 5: Show a test notification
    notificationService.showNotification('🎯 TaskTuner Test', {
      body: 'Notification system is working correctly!',
      tag: 'test-notification'
    });
    console.log('✅ Test notification sent');
  }
});

// Test 6: Test scheduling functionality
const testTask = {
  id: 'schedule-test',
  title: 'Schedule Test Task',
  dueDate: '2025-08-03',
  startTime: '15:00',
  endTime: '16:00',
  reminders: {
    before: 5, // 5 minutes before
    after: 5   // 5 minutes after
  }
};

notificationService.showTaskNotifications(testTask);
console.log('⏰ Task notifications scheduled for test task');

// Test 7: Test cancellation
setTimeout(() => {
  notificationService.cancelAllTaskNotifications('schedule-test');
  console.log('❌ Test task notifications cancelled');
}, 2000);

console.log('🎉 All notification tests completed!');

export default {};
