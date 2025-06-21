import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import { 
  Google as GoogleIcon, 
  Book, 
  SportsGymnastics, 
  SelfImprovement, 
  TrackChanges as TargetIcon,
  FitnessCenter,
  Psychology,
  School,
  TrendingUp,
  Lightbulb,
  Timer,
  EmojiEvents,
  Star,
  RocketLaunch,
  AutoAwesome
} from '@mui/icons-material';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const FloatingCard = ({ icon, text, sx }: { icon: React.ReactNode, text: string, sx: object }) => (
    <Paper elevation={4} sx={{
        position: 'absolute',
        p: 2,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        maxWidth: 200,
        textAlign: 'center',
        ...sx,
    }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="caption" sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 500, 
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.2
            }}>
                {text}
            </Typography>
        </Box>
    </Paper>
);

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const keyframes = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float1 {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
    @keyframes float2 {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(-5deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
    @keyframes float3 {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-25px) rotate(3deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
    @keyframes float4 {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(-3deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', overflow: 'hidden', position: 'relative', background: 'linear-gradient(-45deg, #4A00E0, #8E2DE2, #23a6d5, #23d5ab)', backgroundSize: '400% 400%', animation: 'gradient 20s ease infinite', }}>
        <FloatingCard icon={<Book sx={{ fontSize: { xs: 30, sm: 40 } }} />} text="Yeni bir yolculuğa başla" sx={{ 
          top: { xs: '3%', sm: '8%' }, 
          left: { xs: '2%', sm: '10%' }, 
          display: { xs: 'none', sm: 'block' },
          animation: 'float1 8s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<SportsGymnastics sx={{ fontSize: { xs: 35, sm: 50 } }} />} text="Spor ve Sağlık" sx={{ 
          top: { xs: '85%', sm: '80%' }, 
          left: { xs: '3%', sm: '12%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float2 10s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<SelfImprovement sx={{ fontSize: { xs: 32, sm: 45 } }} />} text="Kendini Geliştir" sx={{ 
          top: { xs: '5%', sm: '12%' }, 
          right: { xs: '2%', sm: '10%' }, 
          display: { xs: 'none', sm: 'block' },
          animation: 'float2 9s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<TargetIcon sx={{ fontSize: { xs: 28, sm: 35 } }} />} text="Hedeflerine ulaş" sx={{ 
          bottom: { xs: '5%', sm: '10%' }, 
          right: { xs: '3%', sm: '12%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float1 12s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<FitnessCenter sx={{ fontSize: { xs: 30, sm: 42 } }} />} text="Güç ve Dayanıklılık" sx={{ 
          top: { xs: '45%', sm: '50%' }, 
          left: { xs: '1%', sm: '6%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float3 11s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<Psychology sx={{ fontSize: { xs: 26, sm: 38 } }} />} text="Zihinsel Sağlık" sx={{ 
          top: { xs: '60%', sm: '65%' }, 
          right: { xs: '1%', sm: '6%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float4 13s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<School sx={{ fontSize: { xs: 28, sm: 36 } }} />} text="Sürekli Öğrenme" sx={{ 
          top: { xs: '15%', sm: '20%' }, 
          left: { xs: '25%', sm: '28%' }, 
          display: { xs: 'none', sm: 'block' },
          animation: 'float2 7s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<TrendingUp sx={{ fontSize: { xs: 32, sm: 44 } }} />} text="İlerleme ve Büyüme" sx={{ 
          bottom: { xs: '25%', sm: '30%' }, 
          left: { xs: '18%', sm: '18%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float1 9s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<Lightbulb sx={{ fontSize: { xs: 24, sm: 32 } }} />} text="Yaratıcılık" sx={{ 
          top: { xs: '25%', sm: '30%' }, 
          right: { xs: '25%', sm: '28%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float3 14s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<Timer sx={{ fontSize: { xs: 30, sm: 40 } }} />} text="Zaman Yönetimi" sx={{ 
          bottom: { xs: '40%', sm: '45%' }, 
          right: { xs: '18%', sm: '18%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float4 10s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<EmojiEvents sx={{ fontSize: { xs: 34, sm: 46 } }} />} text="Başarı ve Zafer" sx={{ 
          top: { xs: '95%', sm: '90%' }, 
          right: { xs: '18%', sm: '18%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float1 8.5s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<Star sx={{ fontSize: { xs: 26, sm: 34 } }} />} text="Parlak Gelecek" sx={{ 
          top: { xs: '35%', sm: '40%' }, 
          left: { xs: '32%', sm: '35%' }, 
          display: { xs: 'none', xl: 'block' },
          animation: 'float2 6s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<RocketLaunch sx={{ fontSize: { xs: 36, sm: 48 } }} />} text="Hızlı İlerleme" sx={{ 
          bottom: { xs: '15%', sm: '20%' }, 
          left: { xs: '32%', sm: '35%' }, 
          display: { xs: 'none', xl: 'block' },
          animation: 'float3 12s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<AutoAwesome sx={{ fontSize: { xs: 22, sm: 30 } }} />} text="Mükemmellik" sx={{ 
          top: { xs: '75%', sm: '70%' }, 
          right: { xs: '32%', sm: '35%' }, 
          display: { xs: 'none', xl: 'block' },
          animation: 'float4 9s ease-in-out infinite' 
        }} />

        <Paper elevation={12} sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 450, width: '100%', mx: 2, background: 'rgba(20, 20, 30, 0.75)', backdropFilter: 'blur(15px)', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.1)', animation: 'fadeIn 0.8s ease-out', zIndex: 1, }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
            Planweek'e Katıl
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Hesap oluştur ve kişisel gelişim yolculuğuna başla
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', mt: 1 }}>
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              id="email" 
              label="E-posta Adresi" 
              name="email" 
              autoComplete="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              InputLabelProps={{ sx: { color: 'grey.400' } }} 
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'grey.700' }, 
                  '&:hover fieldset': { borderColor: 'primary.light' }, 
                  'input': { color: 'white' } 
                } 
              }} 
            />
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              name="password" 
              label="Şifre" 
              type="password" 
              id="password" 
              autoComplete="new-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              InputLabelProps={{ sx: { color: 'grey.400' } }} 
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'grey.700' }, 
                  '&:hover fieldset': { borderColor: 'primary.light' }, 
                  'input': { color: 'white' } 
                } 
              }} 
            />
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              name="confirmPassword" 
              label="Şifre Tekrar" 
              type="password" 
              id="confirmPassword" 
              autoComplete="new-password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              InputLabelProps={{ sx: { color: 'grey.400' } }} 
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'grey.700' }, 
                  '&:hover fieldset': { borderColor: 'primary.light' }, 
                  'input': { color: 'white' } 
                } 
              }} 
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              disabled={loading} 
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                fontSize: '1.1rem', 
                transition: '0.3s', 
                '&:hover': { 
                  transform: 'translateY(-3px)', 
                  boxShadow: '0 4px 20px -5px rgba(0,150,255,0.7)' 
                } 
              }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Kayıt Ol'}
            </Button>
            
            <Divider sx={{ my: 2, color: 'grey.500' }}>veya</Divider>

            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<GoogleIcon />} 
              onClick={handleGoogleRegister}
              disabled={loading}
              sx={{ 
                py: 1.5, 
                color: 'white', 
                borderColor: 'grey.700', 
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.08)', 
                  borderColor: 'primary.main' 
                } 
              }}
            >
              Google ile Kayıt Ol
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Zaten hesabın var mı?{' '}
                <MuiLink component={Link} to="/login" sx={{ color: 'primary.light', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Giriş Yap
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default RegisterPage; 