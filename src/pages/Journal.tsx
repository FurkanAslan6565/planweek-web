import React, { useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  alpha,
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
import { Habit, HabitLog } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
dayjs.locale('tr');

interface GroupedLogs {
  [date: string]: {
    logs: (HabitLog & { habit?: Habit })[];
  };
}

const Journal: React.FC = () => {
  const { state } = useHabitContext();

  const groupedLogs = useMemo(() => {
    const notedLogs = state.habitLogs.filter(log => log.notes && log.notes.trim() !== '');

    const logsWithHabitInfo = notedLogs.map(log => {
      const habit = state.habits.find(h => h.id === log.habitId);
      return { ...log, habit };
    });

    const groups = logsWithHabitInfo.reduce<GroupedLogs>((acc, log) => {
      const dateStr = dayjs(log.date).format('D MMMM YYYY, dddd');
      if (!acc[dateStr]) {
        acc[dateStr] = { logs: [] };
      }
      acc[dateStr].logs.push(log);
      return acc;
    }, {});
    
    // Sort groups by date descending
    return Object.entries(groups).sort(([dateA], [dateB]) => {
      return dayjs(dateB, 'D MMMM YYYY, dddd').valueOf() - dayjs(dateA, 'D MMMM YYYY, dddd').valueOf();
    });

  }, [state.habitLogs, state.habits]);

  if (groupedLogs.length === 0) {
    return (
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Tarihsel Günlüğüm 📖
            </Typography>
            <Box sx={{py: 8, px: 2, bgcolor: 'background.paper', borderRadius: 4}}>
                <Typography variant="h6" sx={{mb: 2}}>Günlüğünüz Henüz Boş</Typography>
                <Typography color="text.secondary">
                    Alışkanlıklarınızı tamamlayıp notlar ekleyerek yolculuğunuzu
                    <br/>
                    burada ölümsüzleştirmeye başlayın!
                </Typography>
            </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Tarihsel Günlüğüm 📖
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Alışkanlık yolculuğunuzda aldığınız notlar.
        </Typography>
      </Box>

      <Timeline position="alternate">
        {groupedLogs.map(([date, group], index) => (
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
              <TimelineDot color="primary" variant="outlined">
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              {group.logs.map(log => (
                log.habit ? (
                    <Card 
                        key={log.id} 
                        sx={{
                            mb: 2,
                            borderLeft: `5px solid ${log.habit.color}`,
                            boxShadow: 3,
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: 6,
                            },
                            transition: 'all 0.3s ease-in-out'
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="h3" sx={{ mr: 1.5 }}>{log.habit.icon}</Typography>
                                <Box>
                                    <Typography variant="h6" component="div">
                                        {log.habit.name}
                                    </Typography>
                                    <Chip label={dayjs(log.date).format('HH:mm')} size="small" variant="outlined"/>
                                </Box>
                            </Box>
                            <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                "{log.notes}"
                            </Typography>
                        </CardContent>
                  </Card>
                ) : null
              ))}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
};

export default Journal; 