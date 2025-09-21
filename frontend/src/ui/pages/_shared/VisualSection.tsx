// components/VisualSection.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Icons (can be replaced with SVGs if you prefer not to install MUI)
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function VisualSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [windowHeight, setWindowHeight] = useState<number>(0);

  // Effect to get the window height on the client-side to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      const onResize = () => setWindowHeight(window.innerHeight);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  const storeFeatures = [
    {
      key: 'speed',
      icon: <ElectricBoltIcon style={{ fontSize: 32 }} />,
      title: 'Lightning Fast',
      description: 'Optimized for instant loads and a seamless experience.',
    },
    {
      key: 'security',
      icon: <VerifiedUserIcon style={{ fontSize: 32 }} />,
      title: 'Secure & Private',
      description: 'Your data is protected with end-to-end encryption.',
    },
    {
      key: 'quality',
      icon: <WorkspacePremiumIcon style={{ fontSize: 32 }} />,
      title: 'Premium Quality',
      description: 'Crafted with the highest standards for a superior product.',
    },
    {
      key: 'shipping',
      icon: <LocalShippingIcon style={{ fontSize: 32 }} />,
      title: 'Worldwide Shipping',
      description: 'Delivered to your doorstep, wherever you are.',
    },
  ];

  // A map to apply the correct hover color class for each feature.
  // These colors should be defined in your tailwind.config.js file.
  const featureColorMap: Record<string, string> = {
    speed: 'group-hover:text-feature-speed',
    security: 'group-hover:text-feature-security',
    quality: 'group-hover:text-feature-quality',
    shipping: 'group-hover:text-feature-shipping',
  };

  return (
    <aside
      className="
    hidden md:flex  /* يختفي في الشاشات الصغيرة ويظهر من md فما فوق */
    relative flex-col items-center justify-center overflow-hidden p-4 md:w-[31%] md:p-8
    bg-gradient-to-br from-blue-100 to-purple-100
  "
      aria-label="Visual Branding Section"
    >
      {/* Animated background particles */}
      <AnimatePresence>
        {windowHeight > 0 &&
          Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: Math.random() * 0.5 }}
              animate={{ opacity: 1, y: [0, -windowHeight] }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
                delay: Math.random() * 5,
              }}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
              }}
              className="rounded-full pointer-events-none bg-black/10"
            />
          ))}
      </AnimatePresence>

      {/* Spinning logo section */}
      <div
        className="flex relative justify-center items-center mb-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated conic gradient border */}
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1, #ff6b6b)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: isHovered ? 4 : 10, ease: 'linear', repeat: Infinity }}
        />
        {/* Inner mask to create the border effect */}
        <motion.div
          className="absolute w-48 h-48 bg-white rounded-full"
          animate={{ scale: isHovered ? 0.95 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Logo container with glassmorphism effect */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative z-10"
        >
          <div className="p-3 rounded-full shadow-lg backdrop-blur-sm bg-white/10">
            {/* Note: If using Next.js, it's better to use the <Image> component 
              from 'next/image' for automatic optimization.
            */}
            <img
              src="/logo/big.png"
              alt="Company Logo"
              width={140}
              height={140}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Features section */}
      <div className="mt-4 w-full max-w-md">
        <div className="flex flex-col gap-4">
          {storeFeatures.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Feature card with hover effects */}
              <div
                className="
                  group flex items-center gap-4 rounded-3xl border border-black/10
                  bg-white/20 p-5 shadow-md backdrop-blur-lg
                  transition-all duration-300 ease-in-out
                  hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20
                "
              >
                {/* Icon container with 3D flip animation */}
                <div
                  className={`
                    flex h-12 w-12 items-center justify-center
                    text-gray-500 transition-all duration-500 ease-in-out
                    [transform-style:preserve-3d] 
                    group-hover:scale-110 group-hover:[transform:rotateY(360deg)]
                    ${featureColorMap[feature.key]}
                  `}
                >
                  {feature.icon}
                </div>
                {/* Text container */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
}