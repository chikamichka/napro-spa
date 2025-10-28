import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Building2, Users, Briefcase, Phone, Menu, X, ChevronRight, Award, MapPin, Mail } from 'lucide-react';
import { useState, Suspense } from 'react';

// 3D Building Model Component
function Building3D() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Main building */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[2, 3, 2]} />
          <meshStandardMaterial color="#1e40af" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Building details - windows */}
        {[...Array(4)].map((_, i) => (
          <mesh key={`left-${i}`} position={[-0.7, 0.5 + i * 0.6, 1.01]}>
            <boxGeometry args={[0.3, 0.4, 0.02]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
        ))}
        {[...Array(4)].map((_, i) => (
          <mesh key={`right-${i}`} position={[0.7, 0.5 + i * 0.6, 1.01]}>
            <boxGeometry args={[0.3, 0.4, 0.02]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
        ))}
        {/* Secondary tower */}
        <mesh position={[1.5, 0.8, -0.5]} castShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#2563eb" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Ground platform */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <boxGeometry args={[4, 0.2, 4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </Float>
  );
}

// Main App Component
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="text-2xl font-bold text-white">
            NAPRO
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('home')} className="text-gray-300 hover:text-white transition">Accueil</button>
            <button onClick={() => navigate('about')} className="text-gray-300 hover:text-white transition">À Propos</button>
            <button onClick={() => navigate('services')} className="text-gray-300 hover:text-white transition">Services</button>
            <button onClick={() => navigate('projects')} className="text-gray-300 hover:text-white transition">Projets</button>
            <button onClick={() => navigate('contact')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-800 border-t border-slate-700"
          >
            <div className="flex flex-col p-4 gap-4">
              <button onClick={() => navigate('home')} className="text-gray-300 hover:text-white transition py-2 text-left">Accueil</button>
              <button onClick={() => navigate('about')} className="text-gray-300 hover:text-white transition py-2 text-left">À Propos</button>
              <button onClick={() => navigate('services')} className="text-gray-300 hover:text-white transition py-2 text-left">Services</button>
              <button onClick={() => navigate('projects')} className="text-gray-300 hover:text-white transition py-2 text-left">Projets</button>
              <button onClick={() => navigate('contact')} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-center">Contact</button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        {currentPage === 'home' && (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Hero Section with 3D */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[5, 3, 5]} />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
                  <Suspense fallback={null}>
                    <Building3D />
                  </Suspense>
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
              </div>
              
              <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                    NAPRO
                  </h1>
                  <p className="text-2xl md:text-3xl text-blue-300 mb-4">
                    National Techno-Project
                  </p>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Excellence en Engineering, Architecture et Supervision de Projets
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('projects')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2"
                  >
                    Découvrir nos projets <ChevronRight />
                  </motion.button>
                </motion.div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-800/50 backdrop-blur">
              <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: '35+', label: 'Professionnels' },
                  { number: '50+', label: 'Projets Majeurs' },
                  { number: '20+', label: 'Années d\'Expérience' },
                  { number: '100K+', label: 'Heures d\'Intervention' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                    <div className="text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
                >
                  Nos Expertises
                </motion.h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <Building2 size={40} />,
                      title: 'Architecture',
                      desc: 'Études architecturales complètes et génie civil'
                    },
                    {
                      icon: <Briefcase size={40} />,
                      title: 'Engineering Industriel',
                      desc: 'Process, diagnostic et modernisation'
                    },
                    {
                      icon: <MapPin size={40} />,
                      title: 'Urbanisme',
                      desc: 'PDAU, POS et études de viabilisation'
                    },
                    {
                      icon: <Award size={40} />,
                      title: 'Supervision',
                      desc: 'OPC, maîtrise d\'œuvre et contrôle'
                    }
                  ].map((service, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer"
                    >
                      <div className="text-blue-400 mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                      <p className="text-gray-400">{service.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Clients Section */}
            <section className="py-20 bg-slate-800/50 backdrop-blur px-4">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-12">Nos Clients de Référence</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {['Sonatrach', 'AADL', 'OPGI', 'Ministère Justice'].map((client, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/10 backdrop-blur p-6 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-blue-300">{client}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-8">Contactez-Nous</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="flex flex-col items-center gap-2">
                    <Phone className="text-blue-400" size={32} />
                    <div className="text-white font-semibold">Téléphone</div>
                    <div className="text-gray-400">+213 028 53 89 80</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="text-blue-400" size={32} />
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-gray-400">contact@napro.dz</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <MapPin className="text-blue-400" size={32} />
                    <div className="text-white font-semibold">Adresse</div>
                    <div className="text-gray-400">23 Rue des frères Gouraya, Bir Khadem, Alger</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage !== 'home' && (
          <div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page</h2>
              <p className="text-gray-400">Coming Soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">NAPRO</div>
          <p className="mb-4">National Techno-Project - Excellence en Engineering</p>
          <p className="text-sm">© 2025 NAPRO. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}