import React, { useState, useMemo } from 'react';
import type { FC } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Fab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useHabitContext } from '../contexts/HabitContext';
import type { Habit } from '../types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/tr';
import updateLocale from 'dayjs/plugin/updateLocale';
import HabitCard from '../components/HabitCard';

dayjs.extend(updateLocale);
dayjs.updateLocale('tr', {
  weekStart: 1, // Monday
});
dayjs.locale('tr');

// --- Add Habit Dialog Component ---
interface AddHabitDialogProps {
  open: boolean;
  onClose: () => void;
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'createdAt'>) => void;
  weekStartDate: string;
}

const AddHabitDialog: FC<AddHabitDialogProps> = ({ open, onClose, onAddHabit, weekStartDate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState('#2196F3');

  const icons = ['🎯', '🏃', '📖', '🧘', '🎨', '💻', '💡', '✅'];
  const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#009688'];

  const handleAdd = () => {
    if (name) {
      onAddHabit({
        name,
        description,
        icon,
        color,
        weekStartDate,
        isActive: true,
      });
      onClose();
      setName('');
      setDescription('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>Yeni Haftalık Alışkanlık</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Bu alışkanlık seçili olan haftanın her gününe eklenecektir.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Alışkanlık Adı (örn: Kitap Oku)"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Kısa Açıklama (isteğe bağlı)"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box sx={{ my: 2 }}>
          <Typography color="text.secondary" gutterBottom>İkon Seç</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {icons.map(ic => (
              <IconButton key={ic} onClick={() => setIcon(ic)} sx={{ border: icon === ic ? 2 : 1, borderColor: icon === ic ? 'primary.main' : 'divider', fontSize: 24 }}>
                {ic}
              </IconButton>
            ))}
          </Box>
        </Box>
        <Box>
          <Typography color="text.secondary" gutterBottom>Renk Seç</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {colors.map(c => (
              <Box 
                key={c} 
                onClick={() => setColor(c)}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  backgroundColor: c, 
                  borderRadius: '50%', 
                  cursor: 'pointer',
                  border: color === c ? '3px solid' : '1px solid',
                  borderColor: color === c ? alpha(c, 0.5) : 'divider',
                  boxSizing: 'border-box'
                }} 
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleAdd} variant="contained" sx={{ borderRadius: 2 }}>Ekle</Button>
      </DialogActions>
    </Dialog>
  );
};


// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
  const { state, addHabit, addHabitLog, updateHabit, deleteHabit } = useHabitContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedDay, setSelectedDay] = useState<Dayjs>(dayjs());
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const theme = useTheme();

  const startOfWeek = selectedDate.startOf('week');
  const endOfWeek = selectedDate.endOf('week');
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

  const habitsForWeek = useMemo(() => state.habits.filter(habit => {
    const habitWeekStart = dayjs(habit.weekStartDate);
    return habitWeekStart.isSame(startOfWeek, 'week');
  }), [state.habits, startOfWeek]);

  const handleToggleCompletion = (habit: Habit, date: Dayjs) => {
    const logForDay = state.habitLogs.find(log => log.habitId === habit.id && dayjs(log.date).isSame(date, 'day'));
    if (!logForDay) {
      addHabitLog({
        habitId: habit.id,
        date: date.toDate(),
        completedValue: 1,
        notes: '',
      });
    }
  };

  // Edit handler for HabitCard
  const handleEditHabit = (habit: Habit, updated: Omit<Habit, 'id' | 'createdAt'>) => {
    updateHabit({ ...habit, ...updated });
  };

  // Delete handler for HabitCard
  const handleDeleteHabit = (habit: Habit) => {
    deleteHabit(habit.id);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
      <Container maxWidth="xl" sx={{ py: 4, height: { xs: 'auto', md: 'calc(100vh - 64px)' }, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Haftalık Planlayıcı
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              {startOfWeek.format('D MMMM')} - {endOfWeek.format('D MMMM YYYY')}
            </Typography>
          </Box>
          <DatePicker
            label="Hafta Seç"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue || dayjs())}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, overflow: 'hidden' }}>
          {/* Sidebar with Days */}
          <Paper elevation={2} sx={{ width: { xs: '100%', md: 280 }, p: 2, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 2, overflowX: { xs: 'auto', md: 'hidden' } }}>
            {weekDays.map(day => (
              <Card 
                key={day.toString()} 
                onClick={() => setSelectedDay(day)}
                sx={{
                  p: 2,
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: 2,
                  borderColor: selectedDay.isSame(day, 'day') ? 'primary.main' : 'transparent',
                  transform: selectedDay.isSame(day, 'day') ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.light',
                    transform: 'scale(1.03)'
                  }
                }}
              >
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>{day.format('ddd')}</Typography>
                <Typography variant="body2" color="text.secondary">{day.format('D MMM')}</Typography>
              </Card>
            ))}
          </Paper>

          {/* Day Details */}
          <Paper elevation={2} sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              {selectedDay.format('dddd, D MMMM')}
            </Typography>
            {habitsForWeek.length > 0 ? (
              <Grid container spacing={2}>
                {habitsForWeek.map((habit) => {
                  const isCompleted = state.habitLogs.some(
                    (log) =>
                      log.habitId === habit.id &&
                      dayjs(log.date).isSame(selectedDay, 'day')
                  );
                  return (
                    <Grid item xs={12} key={habit.id}>
                      <HabitCard
                        habit={habit}
                        isCompleted={isCompleted}
                        onToggleComplete={() => handleToggleCompletion(habit, selectedDay)}
                        onEdit={(updated) => handleEditHabit(habit, updated)}
                        onDelete={() => handleDeleteHabit(habit)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" sx={{ mt: 2 }}>Bu hafta için alışkanlık yok.</Typography>
                <Typography color="text.secondary">Yeni bir haftalık alışkanlık eklemek için '+' butonuna tıkla.</Typography>
              </Box>
            )}
          </Paper>
        </Box>

        <AddHabitDialog
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            onAddHabit={addHabit}
            weekStartDate={startOfWeek.toISOString()}
        />

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: { xs: 80, sm: 32 }, right: 32 }}
          onClick={() => setOpenAddDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Container>
    </LocalizationProvider>
  );
};

export default Dashboard; 