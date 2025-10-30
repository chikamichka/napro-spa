import React, { useState, Suspense, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Stars, Line, Box, Cylinder } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Briefcase, Phone, Menu, X, ChevronRight, Award, MapPin, 
  Mail, Target, TrendingUp, CheckCircle, ArrowRight, Sun, Moon, Globe
} from 'lucide-react';
import * as THREE from 'three';
// --- i18n & Translations Setup ---

const translations = {
  fr: {
    nav: {
      home: "Accueil",
      about: "À Propos",
      services: "Services",
      projects: "Projets",
      contact: "Contact",
    },
    home: {
      subtitle: "National Techno-Project",
      title: "Excellence en Ingénierie, Architecture et Supervision de Projets",
      cta: "Découvrir nos projets",
      stats: [
        { number: '35+', label: 'Professionnels' },
        { number: '50+', label: 'Projets Majeurs' },
        { number: '20+', label: 'Ans d\'Expérience' },
        { number: '100K+', label: 'Heures d\'Intervention' }
      ],
      expertiseTitle: "Nos Expertises",
      services: [
        { title: 'Architecture', desc: 'Études architecturales complètes et génie civil' },
        { title: 'Ingénierie Industrielle', desc: 'Process, diagnostic et modernisation' },
        { title: 'Urbanisme', desc: 'PDAU, POS et études de viabilisation' },
        { title: 'Supervision', desc: 'OPC, maîtrise d\'œuvre et contrôle' }
      ],
      clientsTitle: "Nos Clients de Référence",
      clients: ['Sonatrach', 'AADL', 'OPGI', 'Ministère Justice', 'ACC/ORASCOM', 'SONELGAZ', 'ANIREF', 'APN']
    },
    footer: {
      tagline: "Excellence en Ingénierie, Architecture et Supervision de Projets.",
      navigation: "Navigation",
      services: "Nos Services",
      rights: "Tous droits réservés."
    },
    about: {
      title: "À Propos de NAPRO",
      subtitle: "Une entreprise algérienne d'excellence dans le domaine de l'ingénierie et de l'architecture.",
      info: "Informations Générales",
      juridic: "Forme Juridique",
      juridicVal: "Société par Actions",
      capital: "Capital Social",
      capitalVal: "52.000.000 DA",
      address: "Siège Social",
      addressVal: "23 Rue des frères Gouraya, Bir Khadem - Alger",
      ceo: "Direction",
      ceoVal: "Mr. BOUKHELKHAL HACENE - PDG",
      missionTitle: "Notre Mission",
      missionText1: "NAPRO s'est imposée comme un acteur majeur dans les domaines de l'architecture, du génie civil, de l'ingénierie industrielle et de l'urbanisme.",
      missionText2: "Avec plus de 20 années d'expérience, nous avons développé une expertise reconnue dans la supervision et le contrôle de projets d'envergure nationale.",
      missionTags: "Excellence • Innovation • Fiabilité",
      teamTitle: "Structure de l'Équipe",
      team: [
        { title: 'Cadres Dirigeants', count: '04' },
        { title: 'Ingénieurs & Cadres', count: '30' },
        { title: 'Techniciens Supérieurs', count: '11' },
        { title: 'Personnel Support', count: '05' }
      ],
      techTitle: "Moyens Techniques",
      tech: [
        '44 Micro-ordinateurs + 3 portables',
        'Logiciels CAO/DAO (AutoCAD 2008-2013)',
        'Station Topographique LEICA TS 02',
        'Logiciels de calcul (SAP 2000)',
        'SIG: Atlas GIS, Map Info',
        'Matériel de contrôle du béton',
        '6 Véhicules de service'
      ],
      turnoverTitle: "Chiffre d'Affaires (HT)",
      turnover: [
        { year: '2024', amount: '17,5 M DA' },
        { year: '2023', amount: '30 M DA' },
        { year: '2022', amount: '09 M DA' },
        { year: '2021', amount: '41 M DA' },
        { year: '2020', amount: '63 M DA' }
      ]
    },
    services: {
      title: "Nos Services",
      subtitle: "Des prestations complètes dans tous les domaines de l'ingénierie et de l'architecture.",
      list: [
        {
          title: 'Direction de la Supervision des Travaux',
          items: [
            'Ordonnancement, Pilotage et Coordination (O.P.C)',
            'Maîtrise d\'œuvre d\'exécution',
            'Levés topographiques, Bornages',
            'Études parcellaires et Implantations',
            'Cartographie'
          ]
        },
        {
          title: 'Direction des Études d\'Architecture',
          items: [
            'Études d\'Architecture (Esquisse, A.P.D)',
            'Projets d\'exécution',
            'Études de Génie Civil',
            'Études des C.E.S (Corps d\'États Secondaires)',
            'VRD (Voiries et Réseaux Divers)'
          ]
        },
        {
          title: 'Direction de l\'Ingénierie Industrielle',
          items: [
            'Études de Process',
            'Diagnostic Technique',
            'Études de Rénovation',
            'Modernisation d\'Unités Industrielles',
            'Missions d\'ensemblier',
            'Maîtrise complète de projets',
            'Études énergétiques'
          ]
        },
        {
          title: 'Direction des Études d\'Aménagement et d\'Urbanisme',
          items: [
            'Études des Plans Directeurs d\'Aménagement et d\'Urbanisme (PDAU)',
            'Études des Plans d\'Occupation des Sols (POS)',
            'Études de viabilisation',
            'Aménagement du territoire'
          ]
        }
      ]
    },
    projects: {
      title: "Nos Projets",
      subtitle: "Plus de 50 projets d'envergure nationale réalisés avec excellence.",
      filters: [
        { id: 'all', label: 'Tous les projets' },
        { id: 'housing', label: 'Logements' },
        { id: 'industrial', label: 'Industriel' },
        { id: 'infrastructure', label: 'Infrastructure' },
        { id: 'education', label: 'Enseignement' }
      ],
      list: [
        { id: 1, name: 'Lycée 1000 places - Bouinan', client: 'AADL', category: 'education', location: 'Bouinan' },
        { id: 2, name: '15000 logements', client: 'AADL', category: 'housing', location: 'Bouinan' },
        { id: 3, name: 'Cimenterie de M\'sila', client: 'ACC/ORASCOM', category: 'industrial', location: 'M\'sila' },
        { id: 4, name: 'Supervision des projets Sonatrach', client: 'Sonatrach', category: 'industrial', location: 'Hassi Messaoud' },
        { id: 5, name: '2000 logements Roukhi', client: 'OPGI', category: 'housing', location: 'Souidania' },
        { id: 6, name: '483 logements', client: 'AADL', category: 'housing', location: 'Sidi Ghiles' },
        { id: 7, name: 'Complexe Olympique', client: 'OCO', category: 'infrastructure', location: 'Alger' },
        { id: 8, name: 'Centre Pénitentiaire 1000 places', client: 'Ministère Justice', category: 'infrastructure', location: 'National' },
        { id: 9, name: 'Parc Industriel de Ras El Ma', client: 'ANIREF', category: 'industrial', location: 'Sidi Bel Abbes' },
        { id: 10, name: 'Postes électriques 60/30KV', client: 'SONELGAZ', category: 'infrastructure', location: 'Djelfa' },
        { id: 11, name: '790 logements Le Figuier', client: 'AADL', category: 'housing', location: 'Boumerdes' },
        { id: 12, name: 'Gare Maritime d\'Alger', client: 'E.P.Al', category: 'infrastructure', location: 'Alger' }
      ],
      categoryNames: {
        all: "Tous",
        housing: "Logements",
        industrial: "Industriel",
        infrastructure: "Infrastructure",
        education: "Enseignement"
      }
    },
    contact: {
      title: "Contactez-Nous",
      subtitle: "Notre équipe est à votre disposition pour étudier vos projets.",
      infoTitle: "Informations de Contact",
      phone: "Téléphone",
      fax: "Fax",
      email: "Email",
      address: "Adresse",
      addressVal: "23 Rue des frères Gouraya\nBir Khadem - Alger\nAlgérie",
      hoursTitle: "Horaires d'ouverture",
      weekdays: "Dimanche - Jeudi",
      weekdaysHours: "08:00 - 17:00",
      weekends: "Vendredi - Samedi",
      weekendsHours: "Fermé",
      formTitle: "Envoyez-nous un message",
      formName: "Nom complet *",
      formNamePlaceholder: "Votre nom",
      formEmail: "Email *",
      formEmailPlaceholder: "votre@email.com",
      formPhone: "Téléphone",
      formPhonePlaceholder: "+213 XXX XXX XXX",
      formSubject: "Sujet *",
      formSubjectPlaceholder: "Sujet de votre message",
      formMessage: "Message *",
      formMessagePlaceholder: "Décrivez votre projet ou votre demande...",
      formSubmit: "Envoyer le message"
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      projects: "Projects",
      contact: "Contact",
    },
    home: {
      subtitle: "National Techno-Project",
      title: "Excellence in Engineering, Architecture, and Project Supervision",
      cta: "Discover our projects",
      stats: [
        { number: '35+', label: 'Professionals' },
        { number: '50+', label: 'Major Projects' },
        { number: '20+', label: 'Years of Experience' },
        { number: '100K+', label: 'Intervention Hours' }
      ],
      expertiseTitle: "Our Expertise",
      services: [
        { title: 'Architecture', desc: 'Comprehensive architectural studies and civil engineering' },
        { title: 'Industrial Engineering', desc: 'Process, diagnostics, and modernization' },
        { title: 'Urban Planning', desc: 'PDAU, POS, and feasibility studies' },
        { title: 'Supervision', desc: 'OPC, project management, and control' }
      ],
      clientsTitle: "Our Key Clients",
      clients: ['Sonatrach', 'AADL', 'OPGI', 'Ministry of Justice', 'ACC/ORASCOM', 'SONELGAZ', 'ANIREF', 'APN']
    },
    footer: {
      tagline: "Excellence in Engineering, Architecture, and Project Supervision.",
      navigation: "Navigation",
      services: "Our Services",
      rights: "All rights reserved."
    },
    about: {
      title: "About NAPRO",
      subtitle: "An Algerian company of excellence in the field of engineering and architecture.",
      info: "General Information",
      juridic: "Legal Form",
      juridicVal: "Joint-stock company (SPA)",
      capital: "Social Capital",
      capitalVal: "52,000,000 DZD",
      address: "Head Office",
      addressVal: "23 Gouraya Brothers Street, Bir Khadem - Algiers",
      ceo: "Management",
      ceoVal: "Mr. BOUKHELKHAL HACENE - CEO",
      missionTitle: "Our Mission",
      missionText1: "NAPRO has established itself as a major player in the fields of architecture, civil engineering, industrial engineering, and urban planning.",
      missionText2: "With over 20 years of experience, we have developed recognized expertise in the supervision and control of large-scale national projects.",
      missionTags: "Excellence • Innovation • Reliability",
      teamTitle: "Team Structure",
      team: [
        { title: 'Executive Managers', count: '04' },
        { title: 'Engineers & Managers', count: '30' },
        { title: 'Senior Technicians', count: '11' },
        { title: 'Support Staff', count: '05' }
      ],
      techTitle: "Technical Resources",
      tech: [
        '44 PCs + 3 Laptops',
        'CAD/DAO Software (AutoCAD 2008-2013)',
        'LEICA TS 02 Total Station',
        'Calculation Software (SAP 2000)',
        'GIS: Atlas GIS, Map Info',
        'Concrete testing equipment',
        '6 Service Vehicles'
      ],
      turnoverTitle: "Turnover (Excl. Tax)",
      turnover: [
        { year: '2024', amount: '17.5M DZD' },
        { year: '2023', amount: '30M DZD' },
        { year: '2022', amount: '09M DZD' },
        { year: '2021', amount: '41M DZD' },
        { year: '2020', amount: '63M DZD' }
      ]
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive services in all fields of engineering and architecture.",
      list: [
        {
          title: 'Works Supervision Department',
          items: [
            'Scheduling, Piloting, and Coordination (OPC)',
            'Execution Project Management',
            'Topographical Surveys, Demarcations',
            'Plot Studies and Layouts',
            'Cartography'
          ]
        },
        {
          title: 'Architectural Studies Department',
          items: [
            'Architectural Studies (Sketch, Preliminary Design)',
            'Execution Projects',
            'Civil Engineering Studies',
            'Secondary Building Services (CES) Studies',
            'VRD (Roads and Various Networks)'
          ]
        },
        {
          title: 'Industrial Engineering Department',
          items: [
            'Process Studies',
            'Technical Diagnostics',
            'Renovation Studies',
            'Modernization of Industrial Units',
            'Turnkey Missions',
            'Complete Project Management',
            'Energy Studies'
          ]
        },
        {
          title: 'Planning and Urbanism Studies Department',
          items: [
            'Master Plans for Development and Urbanism (PDAU) Studies',
            'Land Use Plans (POS) Studies',
            'Viability Studies',
            'Territorial Planning'
          ]
        }
      ]
    },
    projects: {
      title: "Our Projects",
      subtitle: "Over 50 large-scale national projects completed with excellence.",
      filters: [
        { id: 'all', label: 'All Projects' },
        { id: 'housing', label: 'Housing' },
        { id: 'industrial', label: 'Industrial' },
        { id: 'infrastructure', label: 'Infrastructure' },
        { id: 'education', label: 'Education' }
      ],
      list: [
        { id: 1, name: '1000-place High School - Bouinan', client: 'AADL', category: 'education', location: 'Bouinan' },
        { id: 2, name: '15000 housing units', client: 'AADL', category: 'housing', location: 'Bouinan' },
        { id: 3, name: 'M\'sila Cement Plant', client: 'ACC/ORASCOM', category: 'industrial', location: 'M\'sila' },
        { id: 4, name: 'Sonatrach Projects Supervision', client: 'Sonatrach', category: 'industrial', location: 'Hassi Messaoud' },
        { id: 5, name: '2000 Roukhi housing units', client: 'OPGI', category: 'housing', location: 'Souidania' },
        { id: 6, name: '483 housing units', client: 'AADL', category: 'housing', location: 'Sidi Ghiles' },
        { id: 7, name: 'Olympic Complex', client: 'OCO', category: 'infrastructure', location: 'Algiers' },
        { id: 8, name: '1000-place Penitentiary Center', client: 'Ministry of Justice', category: 'infrastructure', location: 'National' },
        { id: 9, name: 'Ras El Ma Industrial Park', client: 'ANIREF', category: 'industrial', location: 'Sidi Bel Abbes' },
        { id: 10, name: '60/30KV Electrical Substations', client: 'SONELGAZ', category: 'infrastructure', location: 'Djelfa' },
        { id: 11, name: '790 Figuier housing units', client: 'AADL', category: 'housing', location: 'Boumerdes' },
        { id: 12, name: 'Algiers Maritime Terminal', client: 'E.P.Al', category: 'infrastructure', location: 'Algiers' }
      ],
      categoryNames: {
        all: "All",
        housing: "Housing",
        industrial: "Industrial",
        infrastructure: "Infrastructure",
        education: "Education"
      }
    },
    contact: {
      title: "Contact Us",
      subtitle: "Our team is available to study your projects.",
      infoTitle: "Contact Information",
      phone: "Phone",
      fax: "Fax",
      email: "Email",
      address: "Address",
      addressVal: "23 Gouraya Brothers Street\nBir Khadem - Algiers\nAlgeria",
      hoursTitle: "Opening Hours",
      weekdays: "Sunday - Thursday",
      weekdaysHours: "08:00 - 17:00",
      weekends: "Friday - Saturday",
      weekendsHours: "Closed",
      formTitle: "Send us a message",
      formName: "Full name *",
      formNamePlaceholder: "Your name",
      formEmail: "Email *",
      formEmailPlaceholder: "your@email.com",
      formPhone: "Phone",
      formPhonePlaceholder: "+213 XXX XXX XXX",
      formSubject: "Subject *",
      formSubjectPlaceholder: "Subject of your message",
      formMessage: "Message *",
      formMessagePlaceholder: "Describe your project or request...",
      formSubmit: "Send message"
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "عن الشركة",
      services: "الخدمات",
      projects: "المشاريع",
      contact: "اتصل بنا",
    },
    home: {
      subtitle: "المؤسسة الوطنية للمشاريع التقنية",
      title: "التميز في الهندسة، العمارة والإشراف على المشاريع",
      cta: "اكتشف مشاريعنا",
      stats: [
        { number: '+35', label: 'محترف' },
        { number: '+50', label: 'مشروع كبير' },
        { number: '+20', label: 'سنة خبرة' },
        { number: '+100K', label: 'ساعة تدخل' }
      ],
      expertiseTitle: "خبراتنا",
      services: [
        { title: 'الهندسة المعمارية', desc: 'دراسات معمارية متكاملة وهندسة مدنية' },
        { title: 'الهندسة الصناعية', desc: 'دراسة العمليات، التشخيص والتحديث' },
        { title: 'التعمير', desc: 'مخططات التهيئة والتعمير ودراسات الجدوى' },
        { title: 'الإشراف', desc: 'التنظيم، الإدارة والمراقبة (OPC)' }
      ],
      clientsTitle: "عملاؤنا المرجعيون",
      clients: ['سوناطراك', 'AADL', 'OPGI', 'وزارة العدل', 'ACC/ORASCOM', 'سونلغاز', 'ANIREF', 'APN']
    },
    footer: {
      tagline: "التميز في الهندسة، العمارة والإشراف على المشاريع.",
      navigation: "التنقل",
      services: "خدماتنا",
      rights: "كل الحقوق محفوظة."
    },
    about: {
      title: "عن شركة NAPRO",
      subtitle: "شركة جزائرية رائدة في مجال الهندسة والهندسة المعمارية.",
      info: "معلومات عامة",
      juridic: "الشكل القانوني",
      juridicVal: "شركة مساهمة",
      capital: "رأس المال الاجتماعي",
      capitalVal: "52.000.000 د.ج",
      address: "المقر الاجتماعي",
      addressVal: "23 شارع الإخوة قراية، بئر خادم - الجزائر",
      ceo: "الإدارة",
      ceoVal: "السيد بوخلخال حسان - مدير عام",
      missionTitle: "مهمتنا",
      missionText1: "فرضت NAPRO نفسها كفاعل رئيسي في مجالات الهندسة المعمارية، الهندسة المدنية، الهندسة الصناعية والتعمير.",
      missionText2: "بأكثر من 20 عامًا من الخبرة، طورنا خبرة معترف بها في الإشراف ومراقبة المشاريع ذات البعد الوطني.",
      missionTags: "التميز • الابتكار • الموثوقية",
      teamTitle: "هيكل الفريق",
      team: [
        { title: 'أطر مسيرة', count: '04' },
        { title: 'مهندسون وأطر', count: '30' },
        { title: 'تقنيون سامون', count: '11' },
        { title: 'موظفو الدعم', count: '05' }
      ],
      techTitle: "الوسائل التقنية",
      tech: [
        '44 حاسوب مكتبي + 3 حواسيب محمولة',
        'برمجيات التصميم (AutoCAD 2008-2013)',
        'محطة طوبوغرافية LEICA TS 02',
        'برمجيات الحساب (SAP 2000)',
        'نظم المعلومات الجغرافية: Atlas GIS, Map Info',
        'معدات مراقبة الخرسانة',
        '6 مركبات خدمة'
      ],
      turnoverTitle: "رقم الأعمال (خارج الرسوم)",
      turnover: [
        { year: '2024', amount: '17,5 مليون د.ج' },
        { year: '2023', amount: '30 مليون د.ج' },
        { year: '2022', amount: '09 مليون د.ج' },
        { year: '2021', amount: '41 مليون د.ج' },
        { year: '2020', amount: '63 مليون د.ج' }
      ]
    },
    services: {
      title: "خدماتنا",
      subtitle: "خدمات شاملة في جميع مجالات الهندسة والهندسة المعمارية.",
      list: [
        {
          title: 'مديرية الإشراف على الأشغال',
          items: [
            'التنظيم، الإدارة والتنسيق (O.P.C)',
            'إدارة تنفيذ المشاريع',
            'المسح الطبوغرافي وتحديد المواقع',
            'دراسات تقسيم الأراضي والتimplantation',
            'رسم الخرائط'
          ]
        },
        {
          title: 'مديرية الدراسات المعمارية',
          items: [
            'الدراسات المعمارية (المخطط الأولي، A.P.D)',
            'مشاريع التنفيذ',
            'دراسات الهندسة المدنية',
            'دراسات C.E.S (الأعمال الثانوية)',
            'VRD (الطرق والشبكات المختلفة)'
          ]
        },
        {
          title: 'مديرية الهندسة الصناعية',
          items: [
            'دراسات العمليات (Process)',
            'التشخيص التقني',
            'دراسات التجديد',
            'تحديث الوحدات الصناعية',
            'مهام المقاول العام',
            'الإدارة الكاملة للمشاريع',
            'دراسات الطاقة'
          ]
        },
        {
          title: 'مديرية دراسات التهيئة والتعمير',
          items: [
            'دراسات المخططات التوجيهية للتهيئة والتعمير (PDAU)',
            'دراسات مخططات شغل الأراضي (POS)',
            'دراسات الجدوى والتهيئة',
            'تهيئة الإقليم'
          ]
        }
      ]
    },
    projects: {
      title: "مشاريعنا",
      subtitle: "أكثر من 50 مشروعًا وطنيًا كبيرًا تم إنجازها بامتياز.",
      filters: [
        { id: 'all', label: 'كل المشاريع' },
        { id: 'housing', label: 'السكن' },
        { id: 'industrial', label: 'الصناعة' },
        { id: 'infrastructure', label: 'الهياكل القاعدية' },
        { id: 'education', label: 'التعليم' }
      ],
      list: [
        { id: 1, name: 'ثانوية 1000 مقعد - بوعينان', client: 'AADL', category: 'education', location: 'بوعينان' },
        { id: 2, name: '15000 سكن', client: 'AADL', category: 'housing', location: 'بوعينان' },
        { id: 3, name: 'مصنع الإسمنت - المسيلة', client: 'ACC/ORASCOM', category: 'industrial', location: 'المسيلة' },
        { id: 4, name: 'إشراف على مشاريع سوناطراك', client: 'سوناطراك', category: 'industrial', location: 'حاسي مسعود' },
        { id: 5, name: '2000 سكن الروخي', client: 'OPGI', category: 'housing', location: 'السويدانية' },
        { id: 6, name: '483 سكن', client: 'AADL', category: 'housing', location: 'سيدي غيلاس' },
        { id: 7, name: 'المركب الأولمبي', client: 'OCO', category: 'infrastructure', location: 'الجزائر' },
        { id: 8, name: 'مركز عقابي 1000 مكان', client: 'وزارة العدل', category: 'infrastructure', location: 'وطني' },
        { id: 9, name: 'حظيرة صناعية رأس الماء', client: 'ANIREF', category: 'industrial', location: 'سيدي بلعباس' },
        { id: 10, name: 'محطات كهربائية 60/30KV', client: 'SONELGAZ', category: 'infrastructure', location: 'الجلفة' },
        { id: 11, name: '790 سكن الفيجي', client: 'AADL', category: 'housing', location: 'بومرداس' },
        { id: 12, name: 'المحطة البحرية - الجزائر', client: 'E.P.Al', category: 'infrastructure', location: 'الجزائر' }
      ],
      categoryNames: {
        all: "الكل",
        housing: "السكن",
        industrial: "الصناعة",
        infrastructure: "الهياكل القاعدية",
        education: "التعليم"
      }
    }
    ,
    contact: {
      title: "اتصل بنا",
      subtitle: "فريقنا في خدمتكم لدراسة مشاريعكم.",
      infoTitle: "معلومات الاتصال",
      phone: "الهاتف",
      fax: "الفاكس",
      email: "البريد الإلكتروني",
      address: "العنوان",
      addressVal: "23 شارع الإخوة قراية\nبئر خادم - الجزائر\nالجزائر",
      hoursTitle: "أوقات العمل",
      weekdays: "الأحد - الخميس",
      weekdaysHours: "08:00 - 17:00",
      weekends: "الجمعة - السبت",
      weekendsHours: "مغلق",
      formTitle: "أرسل لنا رسالة",
      formName: "الاسم الكامل *",
      formNamePlaceholder: "اسمكم",
      formEmail: "البريد الإلكتروني *",
      formEmailPlaceholder: "email@example.com",
      formPhone: "الهاتف",
      formPhonePlaceholder: "XXX XXX XXX 213+",
      formSubject: "الموضوع *",
      formSubjectPlaceholder: "موضوع رسالتكم",
      formMessage: "الرسالة *",
      formMessagePlaceholder: "صف مشروعك أو طلبك...",
      formSubmit: "إرسال الرسالة"
    }
  }
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('fr');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = translations[language];

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage, t }}>
      <div className={`${theme} ${language === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

// --- 3D Building Model Component (Redesigned for Blueprint/Construction theme) ---
function Building3D() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  // Theme-aware colors for blueprint/construction look
  const structureColor = isDark ? '#60a5fa' : '#3b82f6'; // Blue for lines
  const groundColor = isDark ? '#334155' : '#e2e8f0'; // Dark slate / Light gray
  const accentColor = isDark ? '#f59e0b' : '#fbbf24'; // Orange for cranes/accents
  const wireframeColor = isDark ? '#3b82f6' : '#93c5fd'; // Lighter blue for internal structure
  const glowingColor = isDark ? '#3b82f6' : '#bfdbfe'; // More vibrant blue for glow

  // Helper to create a wireframe box
  const WireframeBox = ({ position, args, color }) => (
    <group position={position}>
      <Box args={args}>
        <meshStandardMaterial attach="material" color={color} transparent opacity={0.1} />
      </Box>
      <Line
        points={[
          [-args[0]/2, -args[1]/2, -args[2]/2], [-args[0]/2, args[1]/2, -args[2]/2],
          [args[0]/2, args[1]/2, -args[2]/2], [args[0]/2, -args[1]/2, -args[2]/2],
          [-args[0]/2, -args[1]/2, -args[2]/2], // bottom rectangle
          [-args[0]/2, -args[1]/2, args[2]/2], [-args[0]/2, args[1]/2, args[2]/2],
          [args[0]/2, args[1]/2, args[2]/2], [args[0]/2, -args[1]/2, args[2]/2],
          [-args[0]/2, -args[1]/2, args[2]/2], // top rectangle
          [-args[0]/2, -args[1]/2, -args[2]/2], [-args[0]/2, -args[1]/2, args[2]/2],
          [-args[0]/2, args[1]/2, -args[2]/2], [-args[0]/2, args[1]/2, args[2]/2],
          [args[0]/2, args[1]/2, -args[2]/2], [args[0]/2, args[1]/2, args[2]/2],
          [args[0]/2, -args[1]/2, -args[2]/2], [args[0]/2, -args[1]/2, args[2]/2], // vertical lines
        ]}
        color={color}
        lineWidth={1}
      />
    </group>
  );

  // Scaffolding Component
  const Scaffolding = ({ position, height, width, depth, color }) => (
    <group position={position}>
      {/* Vertical poles */}
      {[0, 1].map(x => [0, 1].map(z => (
        <Cylinder
          key={`${x}-${z}`}
          args={[0.02, 0.02, height, 8]}
          position={[x * width - width / 2, height / 2, z * depth - depth / 2]}
        >
          <meshStandardMaterial color={color} />
        </Cylinder>
      )))}
      {/* Horizontal bars */}
      {[0, 1].map(y => (
        <group key={y}>
          <Box args={[width, 0.02, 0.02]} position={[0, y * height, depth / 2]}><meshStandardMaterial color={color} /></Box>
          <Box args={[width, 0.02, 0.02]} position={[0, y * height, -depth / 2]}><meshStandardMaterial color={color} /></Box>
          <Box args={[0.02, 0.02, depth]} position={[width / 2, y * height, 0]}><meshStandardMaterial color={color} /></Box>
          <Box args={[0.02, 0.02, depth]} position={[-width / 2, y * height, 0]}><meshStandardMaterial color={color} /></Box>
        </group>
      ))}
    </group>
  );

  // Simple Crane Component
  const Crane = ({ position, rotation }) => (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <Cylinder args={[0.1, 0.1, 2, 8]} position={[0, 1, 0]}>
        <meshStandardMaterial color={accentColor} />
      </Cylinder>
      {/* Arm */}
      <Box args={[0.2, 0.2, 3]} position={[0, 2, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={accentColor} />
      </Box>
      {/* Counterweight */}
      <Box args={[0.4, 0.2, 0.4]} position={[0, 2, -1.2]}><meshStandardMaterial color={accentColor} /></Box>
    </group>
  );

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={[0, -0.5, 0]}>
        {/* Main Building Structure - Layers */}
        {/* Base Platform */}
        <Box args={[5, 0.2, 5]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color={groundColor} metalness={0.1} roughness={0.8} />
        </Box>
        <Line 
          points={[
            [-2.5, 0, -2.5], [-2.5, 0, 2.5], [2.5, 0, 2.5], [2.5, 0, -2.5], [-2.5, 0, -2.5],
          ]}
          color={structureColor} lineWidth={2}
        />

        {/* Floor 1 */}
        <WireframeBox position={[0, 0.7, 0]} args={[4, 1.2, 3.5]} color={structureColor} />
        
        {/* Floor 2 - Glowing section */}
        <WireframeBox position={[-0.5, 2.0, 0]} args={[3.5, 1.2, 3]} color={glowingColor} />
        <Box args={[3.2, 1, 2.8]} position={[-0.5, 2.0, 0]}>
          <meshStandardMaterial color={glowingColor} transparent opacity={isDark ? 0.05 : 0.1} emissive={glowingColor} emissiveIntensity={isDark ? 0.8 : 0.3} />
        </Box>
        
        {/* Floor 3 */}
        <WireframeBox position={[0.5, 3.3, 0]} args={[4, 1.2, 3.5]} color={structureColor} />

        {/* Vertical Beams/Core */}
        <Box args={[0.5, 4, 0.5]} position={[-1.5, 1.8, -1.5]}><meshStandardMaterial color={structureColor} /></Box>
        <Box args={[0.5, 4.5, 0.5]} position={[1.5, 2.0, 1.5]}><meshStandardMaterial color={structureColor} /></Box>
        
        {/* Scaffolding on one side */}
        <Scaffolding position={[-2.5, 0.1, 0]} height={3} width={1} depth={3.5} color={accentColor} />
        <Scaffolding position={[2.5, 0.1, 0]} height={3.5} width={1} depth={3.5} color={accentColor} />

        {/* Cranes */}
        <Crane position={[-3, 0, -3]} rotation={[0, Math.PI / 4, 0]} />
        <Crane position={[3, 0, 3]} rotation={[0, -Math.PI / 4, 0]} />
      </group>
    </Float>
  );
}

// Home Page
function HomePage({ navigate }) {
  const { theme, t } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      {/* Hero Section with 3D */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-100 via-blue-100 to-slate-100 dark:bg-none">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[5, 3, 8]} fov={60} />
            {isDark && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
            <ambientLight intensity={isDark ? 0.6 : 1.2} />
            <spotLight 
              position={[10, 10, 10]} 
              angle={0.3} 
              penumbra={1} 
              intensity={isDark ? 1 : 1.5} 
              castShadow 
            />
            <pointLight 
              position={[-10, -10, -10]} 
              intensity={isDark ? 0.5 : 0.3} 
              color={isDark ? "#3b82f6" : "#60a5fa"} 
            />
            <Suspense fallback={null}>
              <Building3D />
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
          </Canvas>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-blue-900 dark:text-white mb-6">
              NAPRO
            </h1>
            <p className="text-2xl md:text-3xl text-blue-700 dark:text-blue-300 mb-4">
              {t.home.subtitle}
            </p>
            <p className="text-xl text-slate-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t.home.title}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 shadow-lg dark:shadow-blue-500/30"
            >
              {t.home.cta} <ChevronRight />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {t.home.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
              <div className="text-slate-600 dark:text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white text-center mb-16"
          >
            {t.home.expertiseTitle}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-slate-200 dark:border-blue-500/20 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all cursor-pointer shadow-md dark:shadow-none"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {i === 0 && <Building2 size={40} />}
                  {i === 1 && <Briefcase size={40} />}
                  {i === 2 && <MapPin size={40} />}
                  {i === 3 && <Award size={40} />}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-gray-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12">{t.home.clientsTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.home.clients.map((client, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/50 dark:bg-white/10 backdrop-blur p-6 rounded-lg hover:bg-white dark:hover:bg-white/20 transition-all"
              >
                <div className="text-xl font-bold text-blue-800 dark:text-blue-300">{client}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// About Page
function AboutPage() {
  const { t } = useApp();
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.about.title}</h1>
          <p className="text-xl text-slate-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t.about.subtitle}
          </p>
        </motion.div>

        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-lg dark:shadow-none"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.about.info}</h2>
            <div className="space-y-4 text-slate-600 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <Building2 className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">{t.about.juridic}</div>
                  <div>{t.about.juridicVal}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">{t.about.capital}</div>
                  <div>{t.about.capitalVal}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">{t.about.address}</div>
                  <div>{t.about.addressVal}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">{t.about.ceo}</div>
                  <div>{t.about.ceoVal}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-lg dark:shadow-none"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.about.missionTitle}</h2>
            <p className="text-slate-600 dark:text-gray-300 mb-4">
              {t.about.missionText1}
            </p>
            <p className="text-slate-600 dark:text-gray-300 mb-4">
              {t.about.missionText2}
            </p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Target size={20} />
              <span className="font-semibold">{t.about.missionTags}</span>
            </div>
          </motion.div>
        </div>

        {/* Team Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 mb-16 shadow-lg dark:shadow-none"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">{t.about.teamTitle}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {t.about.team.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{item.count}</div>
                <div className="text-slate-600 dark:text-gray-300">{item.title}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Equipment */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-lg dark:shadow-none"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.about.techTitle}</h2>
            <div className="space-y-3">
              {t.about.tech.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-600 dark:text-gray-300">
                  <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-lg dark:shadow-none"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.about.turnoverTitle}</h2>
            <div className="space-y-4">
              {t.about.turnover.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-gray-300 font-semibold">{item.year}</span>
                  <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">{item.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Services Page
function ServicesPage() {
  const { t } = useApp();
  const icons = [<Award size={40} />, <Building2 size={40} />, <Briefcase size={40} />, <MapPin size={40} />];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.services.title}</h1>
          <p className="text-xl text-slate-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {t.services.list.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all shadow-lg dark:shadow-none"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-blue-600 dark:text-blue-400">{icons[i]}</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{service.title}</h2>
              </div>
              <ul className="space-y-3">
                {service.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-600 dark:text-gray-300">
                    <ChevronRight className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Projects Page
function ProjectsPage() {
  const { t } = useApp();
  const [filter, setFilter] = useState('all');
  
  const projects = t.projects.list;
  const categories = t.projects.filters;
  const categoryNames = t.projects.categoryNames;

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.projects.title}</h1>
          <p className="text-xl text-slate-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t.projects.subtitle}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === cat.id
                  ? 'bg-blue-600 text-white shadow-md dark:shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-800/50 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-blue-500/20 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all cursor-pointer group shadow-lg dark:shadow-none"
              >
                <div className="flex items-start justify-between mb-4">
                  <Building2 className="text-blue-600 dark:text-blue-400" size={32} />
                  <span className="text-xs bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                    {categoryNames[project.category]}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <div className="space-y-2 text-slate-600 dark:text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// Contact Page
function ContactPage() {
  const { t } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  // Create a modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use a modal instead of alert
    setModalMessage('Formulaire envoyé! (Ceci est une démo)');
    setModalOpen(true);
    // Reset form
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.contact.title}</h1>
          <p className="text-xl text-slate-700 dark:text-gray-300">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-lg dark:shadow-none">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.contact.infoTitle}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">{t.contact.phone}</div>
                    <div className="text-slate-600 dark:text-gray-300">+213 028 53 89 80</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">{t.contact.fax}</div>
                    <div className="text-slate-600 dark:text-gray-300">+213 028 53 89 78</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">{t.contact.email}</div>
                    <div className="text-slate-600 dark:text-gray-300">contact@napro.dz</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">{t.contact.address}</div>
                    <div className="text-slate-600 dark:text-gray-300 whitespace-pre-line">
                      {t.contact.addressVal}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-lg dark:shadow-none">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t.contact.hoursTitle}</h3>
              <div className="space-y-2 text-slate-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>{t.contact.weekdays}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{t.contact.weekdaysHours}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.contact.weekends}</span>
                  <span className="text-slate-400 dark:text-gray-500">{t.contact.weekendsHours}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-slate-200 dark:border-blue-500/20 shadow-lg dark:shadow-none"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.contact.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-800 dark:text-white font-semibold mb-2">{t.contact.formName}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder={t.contact.formNamePlaceholder}
                />
              </div>
              <div>
                <label className="block text-slate-800 dark:text-white font-semibold mb-2">{t.contact.formEmail}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder={t.contact.formEmailPlaceholder}
                />
              </div>
              <div>
                <label className="block text-slate-800 dark:text-white font-semibold mb-2">{t.contact.formPhone}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder={t.contact.formPhonePlaceholder}
                />
              </div>
              <div>
                <label className="block text-slate-800 dark:text-white font-semibold mb-2">{t.contact.formSubject}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder={t.contact.formSubjectPlaceholder}
                />
              </div>
              <div>
                <label className="block text-slate-800 dark:text-white font-semibold mb-2">{t.contact.formMessage}</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder={t.contact.formMessagePlaceholder}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg dark:shadow-blue-500/30"
              >
                {t.contact.formSubmit} <ArrowRight size={20} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
            >
              <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
              <p className="text-lg text-slate-800 dark:text-white">{modalMessage}</p>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Language Switcher Component
function LanguageSwitcher() {
  const { language, changeLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];
  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-300 hover:text-white"
      >
        <Globe size={20} />
        <span className="hidden sm:inline">{currentLang.label}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute end-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 text-start text-sm ${
                  language === lang.code
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  return (
    <button
      onClick={toggleTheme}
      className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

// Main App Component
// ... all your other components (Building3D, HomePage, ContactPage, etc.) are above this ...

// Main App Component
function App() {
  const { t, language } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'services', label: t.nav.services },
    { id: 'projects', label: t.nav.projects },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    // We removed the "bg-slate-100 dark:bg-slate-900" classes from this div
    // because your individual page components (HomePage, AboutPage, etc.)
    // already define their own backgrounds. This is cleaner.
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="text-2xl font-bold text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            NAPRO
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => navigate(item.id)} 
                className={`font-medium transition-colors ${
                  currentPage === item.id 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-4 ps-4 border-s border-slate-200 dark:border-slate-700">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-800 dark:text-gray-300 hover:text-black dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col px-4 pt-4 pb-6 space-y-3">
                {navItems.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => navigate(item.id)} 
                    className={`block w-full text-start px-3 py-2 rounded-md text-lg font-medium ${
                      currentPage === item.id 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <main>
        {currentPage === 'home' && <HomePage navigate={navigate} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <footer className="py-12 bg-slate-200 dark:bg-slate-950 border-t border-slate-300 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand */}
            <div>
              <button onClick={() => navigate('home')} className="text-2xl font-bold text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4">
                NAPRO
              </button>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                {t.footer.tagline}
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                {t.footer.navigation}
              </h3>
              <div className="space-y-2 text-sm">
                {navItems.filter(item => item.id !== 'contact').map((page) => (
                  <button 
                    key={page.id}
                    onClick={() => navigate(page.id)}
                    className="block text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Services */}
            <div>
              <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                {t.footer.services}
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                {t.home.services.map((service) => (
                  <div key={service.title}>{service.title}</div>
                ))}
              </div>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">
                {t.nav.contact}
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+213 028 53 89 80</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>contact@napro.dz</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span>23 Rue des frères Gouraya, Bir Khadem - Alger</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-300 dark:border-slate-800 pt-8 text-center text-sm text-slate-600 dark:text-gray-500">
            <p>© {new Date().getFullYear()} NAPRO - {t.home.subtitle}. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrap the App in the provider
export default function ProvidedApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}