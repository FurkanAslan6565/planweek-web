import React, { useMemo } from 'react';
import type { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import { Habit, HabitLog } from '../types';
import { getShortDayName } from '../utils/helpers';
import { Star } from '@mui/icons-material';

const motivationalQuotes = [
  "Küçük adımlar, büyük başarılara götürür. Devam et!",
  "Bugünün emeği, yarının zaferidir.",
  "Her gün, yeni bir başlangıçtır. Harika gidiyorsun!",
  "Unutma, en büyük başarılar sabırla inşa edilir.",
  "Kararlılığın, hedeflerine giden yoldaki en büyük gücün.",
  "Zirveye giden yol, ilk adımı atmakla başlar."
];

interface ShareableStatsProps {
  open: boolean;
  onClose: () => void;
  weeklyHabits: Habit[];
  weeklyLogs: HabitLog[];
  startOfWeek: Dayjs;
}

const ShareableStats: FC<ShareableStatsProps> = ({
  open,
  onClose,
  weeklyHabits,
  weeklyLogs,
  startOfWeek,
}) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
    return weekDays.map(day => {
      const dailyLogs = weeklyLogs.filter(log => dayjs(log.date).isSame(day, 'day'));
      return {
        name: getShortDayName(day.toDate()),
        Hedeflenen: weeklyHabits.length,
        Tamamlanan: dailyLogs.length,
      };
    });
  }, [weeklyHabits, weeklyLogs, startOfWeek]);
  
  const randomQuote = useMemo(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)], []);
  const totalCompletions = weeklyLogs.length;
  const totalGoals = weeklyHabits.length * 7;
  const overallCompletionRate = totalGoals > 0 ? (totalCompletions / totalGoals) * 100 : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', pb: 0 }}>
        Haftalık Başarı Raporun!
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)` }}>
          <Typography variant="h6" align="center" gutterBottom>
            Bu Hafta <strong>{weeklyHabits.length}</strong> Alışkanlık Belirledin
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            Toplamda <strong>{totalCompletions}</strong> kez hedefini başarıyla tamamladın. Haftalık tamamlanma oranın: <strong>%{overallCompletionRate.toFixed(1)}</strong>
          </Typography>
        </Paper>

        <Box sx={{ height: 300, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: theme.palette.divider }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="Hedeflenen" fill={theme.palette.grey[400]} radius={[8, 8, 0, 0]} />
              <Bar dataKey="Tamamlanan" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ textAlign: 'center', p: 2, border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
            <Star sx={{color: 'gold', mb: 1}}/>
            <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                "{randomQuote}"
            </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareableStats; 