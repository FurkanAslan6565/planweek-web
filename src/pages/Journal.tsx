import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@mui/lab';
import { useHabitContext } from '../contexts/HabitContext';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
dayjs.locale('tr');

const Journal: React.FC = () => {
  const { state } = useHabitContext();

  const notesByDate = React.useMemo(() => {
    // Sadece notu olan logları al
    const notedLogs = state.habitLogs.filter(log => log.notes && log.notes.trim() !== '');

    // Logları tarihe göre grupla
    const grouped = notedLogs.reduce((acc, log) => {
      const dateStr = dayjs(log.date).format('D MMMM YYYY');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      // Alışkanlık bilgisini log'a ekle
      const habit = state.habits.find(h => h.id === log.habitId);
      if (habit) {
        acc[dateStr].push({ ...log, habit });
      }
      return acc;
    }, {} as Record<string, (typeof notedLogs[0] & { habit: typeof state.habits[0] })[]>);

    // Tarihe göre en yeniden en eskiye sırala
    return Object.entries(grouped).sort(([dateA], [dateB]) => dayjs(dateB, 'D MMMM YYYY').valueOf() - dayjs(dateA, 'D MMMM YYYY').valueOf());
  }, [state.habitLogs, state.habits]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Tarihsel Günlüğüm 📖
      </Typography>
      
      {notesByDate.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6">Günlüğünüz henüz boş.</Typography>
            <Typography color="text.secondary">
                Alışkanlıklarınızı tamamlayıp notlar ekleyerek yolculuğunuzu burada ölümsüzleştirmeye başlayın!
            </Typography>
        </Box>
      ) : (
        <Timeline position="alternate">
          {notesByDate.map(([date, logs], index) => (
            <TimelineItem key={date}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {date}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                {logs.map(log => (
                  <Card key={log.id} sx={{ mb: 2, borderLeft: 5, borderColor: log.habit.color }}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {log.habit.icon} {log.habit.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                        "{log.notes}"
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Container>
  );
};

export default Journal; 