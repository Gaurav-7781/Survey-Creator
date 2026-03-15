import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const float = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

const Blob = styled(Box)(({ theme, color, size, top, left, delay, duration }) => ({
  position: 'fixed',
  width: size || '400px',
  height: size || '400px',
  top: top || '0',
  left: left || '0',
  backgroundColor: color || theme.palette.primary.light,
  borderRadius: '50%',
  filter: 'blur(80px)',
  opacity: theme.palette.mode === 'dark' ? 0.08 : 0.15,
  zIndex: -1,
  animation: `${float} ${duration || '20s'} ease-in-out infinite`,
  animationDelay: delay || '0s',
  pointerEvents: 'none',
}));

const BackgroundDecoration = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Blob 
        color="#4F46E5" 
        size="500px" 
        top="-100px" 
        left="-100px" 
        duration="25s" 
      />
      <Blob 
        color="#F43F5E" 
        size="400px" 
        top="40%" 
        left="70%" 
        delay="-5s" 
        duration="30s" 
      />
      <Blob 
        color="#8B5CF6" 
        size="350px" 
        top="70%" 
        left="10%" 
        delay="-10s" 
        duration="22s" 
      />
    </Box>
  );
};

export default BackgroundDecoration;
