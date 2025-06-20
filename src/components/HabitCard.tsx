import React, { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
  useTheme,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { MoreVert, CheckCircle, Edit, Delete } from '@mui/icons-material';
import type { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onEdit: (updated: Omit<Habit, 'id' | 'createdAt'>) => void;
  onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, onToggleComplete, onEdit, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description);
  const [editIcon, setEditIcon] = useState(habit.icon);
  const [editColor, setEditColor] = useState(habit.color);

  const icons = ['🎯', '🏃', '📖', '🧘', '🎨', '💻', '💡', '✅'];
  const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#009688'];

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEditOpen = () => {
    setEditName(habit.name);
    setEditDescription(habit.description);
    setEditIcon(habit.icon);
    setEditColor(habit.color);
    setEditOpen(true);
    handleMenuClose();
  };
  const handleEditSave = () => {
    onEdit({
      name: editName,
      description: editDescription,
      icon: editIcon,
      color: editColor,
      weekStartDate: habit.weekStartDate,
      isActive: habit.isActive,
      reminderTime: habit.reminderTime,
    });
    setEditOpen(false);
  };

  return (
    <Fade in>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderRadius: 4,
          boxShadow: isCompleted ? 8 : 2,
          background: isCompleted
            ? `linear-gradient(90deg, ${alpha(theme.palette.success.main, 0.15)}, ${alpha(theme.palette.success.light, 0.10)})`
            : theme.palette.background.paper,
          position: 'relative',
          minHeight: 80,
          transition: 'box-shadow 0.2s, background 0.2s',
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${habit.color} 60%, ${alpha(habit.color, 0.2)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            mr: 2,
            boxShadow: isCompleted ? 4 : 1,
            border: isCompleted ? `2px solid ${theme.palette.success.main}` : 'none',
            transition: 'all 0.2s',
          }}
        >
          {habit.icon}
        </Box>
        {/* Info */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'text.secondary' : 'text.primary',
              fontWeight: 600,
              fontSize: 20,
              mb: 0.5,
              letterSpacing: 0.1,
            }}
          >
            {habit.name}
          </Typography>
          {habit.description && (
            <Typography variant="body2" color="text.secondary">
              {habit.description}
            </Typography>
          )}
        </Box>
        {/* Complete Button */}
        <Tooltip title={isCompleted ? 'Tamamlandı' : 'Tamamla'}>
          <IconButton
            onClick={onToggleComplete}
            sx={{
              color: isCompleted ? 'success.main' : 'primary.main',
              mr: 1,
              transition: 'color 0.2s',
            }}
          >
            <CheckCircle fontSize="large" />
          </IconButton>
        </Tooltip>
        {/* Menu */}
        <IconButton onClick={handleMenuOpen} sx={{ ml: 0.5 }}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditOpen}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Düzenle
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onDelete(); }} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Sil
          </MenuItem>
        </Menu>
        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Alışkanlığı Düzenle</DialogTitle>
          <DialogContent>
            <TextField
              label="Alışkanlık Adı"
              fullWidth
              margin="dense"
              value={editName}
              onChange={e => setEditName(e.target.value)}
            />
            <TextField
              label="Açıklama"
              fullWidth
              margin="dense"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
            />
            <Box sx={{ my: 2 }}>
              <Typography color="text.secondary" gutterBottom>İkon Seç</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {icons.map(ic => (
                  <IconButton key={ic} onClick={() => setEditIcon(ic)} sx={{ border: editIcon === ic ? 2 : 1, borderColor: editIcon === ic ? 'primary.main' : 'divider', fontSize: 24 }}>
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
                    onClick={() => setEditColor(c)}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: c,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: editColor === c ? '3px solid' : '1px solid',
                      borderColor: editColor === c ? alpha(c, 0.5) : 'divider',
                      boxSizing: 'border-box',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>İptal</Button>
            <Button onClick={handleEditSave} variant="contained">Kaydet</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Fade>
  );
};

export default HabitCard; 