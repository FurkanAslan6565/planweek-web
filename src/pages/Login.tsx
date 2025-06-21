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
  EmojiEvents
} from '@mui/icons-material';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';

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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Şifre sıfırlama e-postası göndermek için e-posta adresinizi girin.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Şifre sıfırlama e-postası gönderildi. Lütfen e-posta kutunuzu kontrol edin.');
    } catch (error: any) {
      setError('Şifre sıfırlama e-postası gönderilemedi. Lütfen e-posta adresinizi kontrol edin.');
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          overflow: 'hidden',
          background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'relative'
        }}
      >
        <FloatingCard icon={<Book sx={{ fontSize: { xs: 30, sm: 40 } }} />} text="Bilgi ve Öğrenme" sx={{ 
          top: { xs: '5%', sm: '10%' }, 
          left: { xs: '2%', sm: '8%' }, 
          display: { xs: 'none', sm: 'block' },
          animation: 'float1 8s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<SportsGymnastics sx={{ fontSize: { xs: 35, sm: 50 } }} />} text="Disiplin ve Düzen" sx={{ 
          top: { xs: '80%', sm: '75%' }, 
          left: { xs: '3%', sm: '15%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float2 10s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<SelfImprovement sx={{ fontSize: { xs: 32, sm: 45 } }} />} text="Kişisel Gelişim" sx={{ 
          top: { xs: '8%', sm: '15%' }, 
          right: { xs: '3%', sm: '12%' }, 
          display: { xs: 'none', sm: 'block' },
          animation: 'float2 9s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<TargetIcon sx={{ fontSize: { xs: 28, sm: 35 } }} />} text="Hedeflerine Odaklan" sx={{ 
          bottom: { xs: '8%', sm: '12%' }, 
          right: { xs: '2%', sm: '8%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float1 12s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<FitnessCenter sx={{ fontSize: { xs: 30, sm: 42 } }} />} text="Güç ve Dayanıklılık" sx={{ 
          top: { xs: '40%', sm: '45%' }, 
          left: { xs: '1%', sm: '5%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float3 11s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<Psychology sx={{ fontSize: { xs: 26, sm: 38 } }} />} text="Zihinsel Sağlık" sx={{ 
          top: { xs: '55%', sm: '60%' }, 
          right: { xs: '1%', sm: '5%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float4 13s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<School sx={{ fontSize: { xs: 28, sm: 36 } }} />} text="Sürekli Öğrenme" sx={{ 
          top: { xs: '18%', sm: '25%' }, 
          left: { xs: '20%', sm: '25%' }, 
          display: { xs: 'none', sm: 'block' },
          animation: 'float2 7s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<TrendingUp sx={{ fontSize: { xs: 32, sm: 44 } }} />} text="İlerleme ve Büyüme" sx={{ 
          bottom: { xs: '18%', sm: '25%' }, 
          left: { xs: '15%', sm: '20%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float1 9s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<Lightbulb sx={{ fontSize: { xs: 24, sm: 32 } }} />} text="Yaratıcılık" sx={{ 
          top: { xs: '28%', sm: '35%' }, 
          right: { xs: '20%', sm: '25%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float3 14s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<Timer sx={{ fontSize: { xs: 30, sm: 40 } }} />} text="Zaman Yönetimi" sx={{ 
          bottom: { xs: '35%', sm: '40%' }, 
          right: { xs: '12%', sm: '15%' }, 
          display: { xs: 'none', md: 'block' },
          animation: 'float4 10s ease-in-out infinite' 
        }} />
        <FloatingCard icon={<EmojiEvents sx={{ fontSize: { xs: 34, sm: 46 } }} />} text="Başarı ve Zafer" sx={{ 
          top: { xs: '90%', sm: '85%' }, 
          right: { xs: '15%', sm: '20%' }, 
          display: { xs: 'none', lg: 'block' },
          animation: 'float1 8.5s ease-in-out infinite' 
        }} />

        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 450,
            width: '100%',
            mx: 2,
            background: 'rgba(20, 20, 30, 0.75)',
            backdropFilter: 'blur(15px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 0.8s ease-out',
            zIndex: 1,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
            Planweek'e Hoş Geldin
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Hesabına giriş yap ve hedeflerine odaklan
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{successMessage}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', mt: 1 }}>
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
              autoComplete="current-password" 
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
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <MuiLink
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                disabled={loading}
                sx={{ 
                  color: 'primary.light', 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  cursor: 'pointer'
                }}
              >
                Şifremi Unuttum
              </MuiLink>
            </Box>
            
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
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Giriş Yap'}
            </Button>
            
            <Divider sx={{ my: 2, color: 'grey.500' }}>veya</Divider>

            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<GoogleIcon />} 
              onClick={handleGoogleLogin}
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
              Google ile Giriş Yap
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Hesabın yok mu?{' '}
                <MuiLink component={Link} to="/register" sx={{ color: 'primary.light', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Kayıt Ol
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default LoginPage; 