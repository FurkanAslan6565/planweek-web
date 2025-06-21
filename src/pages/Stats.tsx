import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useHabitContext } from '../contexts/HabitContext';
import { calculateHabitStats, getShortDayName } from '../utils/helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/tr';
import ShareableStats from '../components/ShareableStats';

dayjs.locale('tr');

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stats-tabpanel-${index}`}
      aria-labelledby={`stats-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Stats: React.FC = () => {
  const { state } = useHabitContext();
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const handleShare = () => {
    const totalCompletions = weeklyLogs.length;
    const shareText = `İşte bu haftaki alışkanlık başarımım: ${weeklyHabits.length} alışkanlık, ${totalCompletions} tamamlama! #HabitTT`;
    alert(`Paylaşılacak metin:\n\n${shareText}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const startOfWeek = selectedDate.startOf('week');
  const endOfWeek = selectedDate.endOf('week');

  const weeklyLogs = state.habitLogs.filter(log => {
    const logDate = dayjs(log.date);
    return logDate.isAfter(startOfWeek.subtract(1, 'day')) && logDate.isBefore(endOfWeek.add(1, 'day'));
  });
  
  const weeklyHabits = state.habits.filter(habit => {
    const habitWeekStart = dayjs(habit.weekStartDate);
    return habitWeekStart.isSame(startOfWeek, 'week');
  });

  const totalCompletions = weeklyLogs.length;

  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
  const weeklyData = weekDays.map(day => {
    const dayLogs = weeklyLogs.filter(log => 
      dayjs(log.date).isSame(day, 'day')
    );
    return {
      day: getShortDayName(day.toDate()),
      Tamamlanan: dayLogs.length,
    };
  });

  const habitStats = weeklyHabits.map(habit => ({
    ...habit,
    stats: calculateHabitStats(habit, weeklyLogs)
  })).sort((a, b) => b.stats.completionRate - a.stats.completionRate);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                Haftalık İstatistikler 📊
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <DatePicker
                    label="Hafta Seç"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue || dayjs())}
                />
                <Button variant="contained" startIcon={<ShareIcon />} onClick={() => setOpenShareDialog(true)}>
                    Paylaş
                </Button>
            </Box>
        </Box>

        {/* Overall Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {weeklyHabits.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Haftalık Alışkanlık
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {totalCompletions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Tamamlanan
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
            <Tab label="Haftalık İlerleme" />
            <Tab label="En İyi Performans" />
            <Tab label="Haftalık Rapor" />
          </Tabs>
        </Box>

        {/* Weekly Progress Tab */}
        <TabPanel value={tabValue} index={0}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Günlük Tamamlanan Alışkanlık Sayısı
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="Tamamlanan" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </TabPanel>

        {/* Top Performance Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                En İyi Performans Gösteren Alışkanlıklar
              </Typography>
              <List>
                {habitStats.slice(0, 10).map((habit, index) => (
                  <React.Fragment key={habit.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h4">{habit.icon}</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="h6">{habit.name}</Typography>}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">
                                Tamamlanma Oranı: {habit.stats.completionRate.toFixed(1)}%
                              </Typography>
                              <Typography variant="body2" color="primary">
                                {habit.stats.currentStreak} günlük seri
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={habit.stats.completionRate} 
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary">
                          #{index + 1}
                        </Typography>
                        <StarIcon sx={{ color: index < 3 ? 'gold' : 'grey' }} />
                      </Box>
                    </ListItem>
                    {index < habitStats.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Weekly Report Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Haftalık Alışkanlık Dökümü
              </Typography>
              {weeklyHabits.length > 0 ? (
                <List>
                  {weeklyHabits.map((habit) => {
                    const dailyStatuses = weekDays.map(day => {
                      const isCompleted = weeklyLogs.some(log => 
                        log.habitId === habit.id && dayjs(log.date).isSame(day, 'day')
                      );
                      return { day: getShortDayName(day.toDate()), date: day, isCompleted };
                    });

                    return (
                      <React.Fragment key={habit.id}>
                        <ListItem>
                          <ListItemIcon sx={{mr: 1}}>
                            <Typography variant="h4">{habit.icon}</Typography>
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="h6">{habit.name}</Typography>}
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                {dailyStatuses.map(status => (
                                  <Chip
                                    key={status.date.toISOString()}
                                    label={status.day} 
                                    icon={status.isCompleted ? <CheckIcon fontSize="small" /> : undefined}
                                    variant={status.isCompleted ? 'filled' : 'outlined'}
                                    color={status.isCompleted ? 'success' : 'default'}
                                    size="small"
                                  />
                                ))}
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    );
                  })}
                </List>
              ) : (
                <Typography sx={{textAlign: 'center', py: 4}}>
                  Bu hafta için planlanmış bir alışkanlık bulunmuyor.
                </Typography>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
      
      <ShareableStats 
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        weeklyHabits={weeklyHabits}
        weeklyLogs={weeklyLogs}
        startOfWeek={startOfWeek}
      />
    </LocalizationProvider>
  );
};

export default Stats; 