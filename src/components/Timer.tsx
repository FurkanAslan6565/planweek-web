import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Timer as TimerIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useHabitContext } from '../contexts/HabitContext';
import { formatDuration } from '../utils/helpers';
import type { Habit } from '../types';

interface TimerProps {
  habit: Habit;
  onClose: () => void;
}

const Timer: React.FC<TimerProps> = ({ habit, onClose }) => {
  const { addHabitLog, addTimerSession, updateTimerSession } = useHabitContext();
  const [timeLeft, setTimeLeft] = useState(habit.targetValue * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowCompleteDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const startTimer = () => {
    if (!sessionId) {
      const newSessionId = uuidv4();
      const startTime = new Date();
      const session = {
        id: newSessionId,
        habitId: habit.id,
        startTime: startTime,
        duration: habit.targetValue,
        isActive: true
      };
      addTimerSession(session);
      setSessionId(newSessionId);
      setSessionStartTime(startTime);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (sessionId && sessionStartTime) {
      const endTime = new Date();
      const durationInMinutes = (endTime.getTime() - sessionStartTime.getTime()) / (1000 * 60);
      
      updateTimerSession({
        id: sessionId,
        habitId: habit.id,
        startTime: sessionStartTime,
        endTime: endTime,
        duration: Math.round(durationInMinutes),
        isActive: false
      });
    }
  };

  const completeSession = () => {
    const completedMinutes = habit.targetValue - Math.floor(timeLeft / 60);
    
    addHabitLog({
      habitId: habit.id,
      date: new Date(),
      completedValue: completedMinutes,
      notes: notes
    });

    if (sessionId && sessionStartTime) {
      updateTimerSession({
        id: sessionId,
        habitId: habit.id,
        startTime: sessionStartTime,
        endTime: new Date(),
        duration: completedMinutes,
        isActive: false
      });
    }

    setShowCompleteDialog(false);
    onClose();
  };

  const progress = ((habit.targetValue * 60 - timeLeft) / (habit.targetValue * 60)) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <Card 
        sx={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 1000, 
          minWidth: { xs: '90%', sm: 400 },
          maxWidth: 450,
          borderRadius: 3,
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)'
            : 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  lineHeight: 1,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {habit.icon}
              </Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {habit.name}
                </Typography>
                <Chip 
                  label={habit.category} 
                  size="small" 
                  sx={{ 
                    borderRadius: 1,
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(33, 150, 243, 0.15)'
                        : 'rgba(33, 150, 243, 0.1)',
                    color: 'primary.main',
                    fontWeight: 500
                  }} 
                />
              </Box>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h1" 
              component="div" 
              sx={{ 
                fontFamily: 'monospace',
                fontSize: '4rem',
                fontWeight: 700,
                background: isRunning && !isPaused
                  ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  : 'none',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: isRunning && !isPaused ? 'transparent' : 'inherit',
              }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              Kalan süre
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                İlerleme
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: progress === 100 ? 'success.main' : 'primary.main'
                }}
              >
                %{Math.round(progress)}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: progress === 100
                    ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)'
                    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {!isRunning ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayIcon />}
                onClick={startTimer}
                sx={{
                  minWidth: 160,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1EA7F1 90%)',
                  }
                }}
              >
                Başlat
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayIcon />}
                    onClick={resumeTimer}
                    sx={{
                      minWidth: 160,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1EA7F1 90%)',
                      }
                    }}
                  >
                    Devam Et
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PauseIcon />}
                    onClick={pauseTimer}
                    sx={{
                      minWidth: 160,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }
                    }}
                  >
                    Duraklat
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<StopIcon />}
                  onClick={stopTimer}
                  color="error"
                  sx={{
                    minWidth: 160,
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      backgroundColor: 'error.main',
                      color: 'white',
                    }
                  }}
                >
                  Durdur
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Complete Session Dialog */}
      <Dialog 
        open={showCompleteDialog} 
        onClose={() => setShowCompleteDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)'
              : 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Tebrikler! 🎉
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {habit.name} alışkanlığını {formatDuration(habit.targetValue - Math.floor(timeLeft / 60))} süreyle tamamladın!
          </Typography>
          <TextField
            fullWidth
            label="Notlar (isteğe bağlı)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bu oturum hakkında notlarını yazabilirsin..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowCompleteDialog(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            İptal
          </Button>
          <Button 
            onClick={completeSession} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1EA7F1 90%)',
              }
            }}
          >
            Tamamla
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Timer; 