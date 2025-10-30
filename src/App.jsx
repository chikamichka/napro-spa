import React, { useState, Suspense, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Stars, Line, Box, Cylinder } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Briefcase, Phone, Menu, X, ChevronRight, ChevronLeft,
  Award, MapPin, 
  Mail, Target, TrendingUp, CheckCircle, ArrowRight, Sun, Moon, Globe, ExternalLink,
  FileText, Calendar, MapPinned
} from 'lucide-react';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';

// --- UPDATED TRANSLATIONS WITH ABOUT, SERVICES, AND CONTACT SECTIONS ---
const translations = {
  fr: {
    nav: {
      home: "Accueil",
      about: "À Propos",
      services: "Services",
      projects: "Projets",
      contact: "Contact",
      gallery: "Galerie"
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
      allProjects: "Tous nos Projets",
      filters: [
        { id: 'all', label: 'Tous les projets' },
        { id: 'housing', label: 'Logements' },
        { id: 'industrial', label: 'Industriel' },
        { id: 'infrastructure', label: 'Infrastructure' },
        { id: 'education', label: 'Enseignement' },
        { id: 'urban', label: 'Urbanisme' }
      ]
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
    },
    gallery: {
      title: "Projets Phares en Images",
      subtitle: "Découvrez nos réalisations majeures",
      viewProject: "Voir le projet"
    },
    footer: {
      tagline: "Excellence en Ingénierie, Architecture et Supervision de Projets.",
      navigation: "Navigation",
      services: "Nos Services",
      rights: "Tous droits réservés."
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      projects: "Projects",
      contact: "Contact",
      gallery: "Gallery"
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
      allProjects: "All Our Projects",
      filters: [
        { id: 'all', label: 'All Projects' },
        { id: 'housing', label: 'Housing' },
        { id: 'industrial', label: 'Industrial' },
        { id: 'infrastructure', label: 'Infrastructure' },
        { id: 'education', label: 'Education' },
        { id: 'urban', label: 'Urban Planning' }
      ]
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
      formSubmit: "Send Message"
    },
    gallery: {
      title: "Featured Projects Gallery",
      subtitle: "Discover our major achievements",
      viewProject: "View Project"
    },
    footer: {
      tagline: "Excellence in Engineering, Architecture, and Project Supervision.",
      navigation: "Navigation",
      services: "Our Services",
      rights: "All rights reserved."
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "عن الشركة",
      services: "الخدمات",
      projects: "المشاريع",
      contact: "اتصل بنا",
      gallery: "المعرض"
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
    about: {
      title: "عن مؤسسة نابرو (NAPRO)",
      subtitle: "شركة جزائرية للتميز في مجال الهندسة والعمارة.",
      info: "معلومات عامة",
      juridic: "الشكل القانوني",
      juridicVal: "شركة مساهمة (SPA)",
      capital: "رأس المال الاجتماعي",
      capitalVal: "52.000.000 دج",
      address: "المقر الاجتماعي",
      addressVal: "23 شارع الإخوة قوراية، بئر خادم - الجزائر",
      ceo: "الإدارة",
      ceoVal: "السيد بوخلخال حسين - رئيس مجلس الإدارة والمدير العام",
      missionTitle: "مهمتنا",
      missionText1: "رسخت نابرو مكانتها كفاعل رئيسي في مجالات الهندسة المعمارية، الهندسة المدنية، الهندسة الصناعية والتعمير.",
      missionText2: "بفضل أكثر من 20 عامًا من الخبرة، طورنا خبرة معترف بها في الإشراف والتحكم في المشاريع الوطنية الكبرى.",
      missionTags: "التميز • الابتكار • الموثوقية",
      teamTitle: "هيكل الفريق",
      team: [
        { title: 'إطارات تنفيذية', count: '04' },
        { title: 'مهندسون وإطارات', count: '30' },
        { title: 'تقنيون سامون', count: '11' },
        { title: 'موظفو دعم', count: '05' }
      ],
      techTitle: "الوسائل التقنية",
      tech: [
        '44 حاسوب مكتبي + 3 حواسيب محمولة',
        'برامج CAD/DAO (AutoCAD 2008-2013)',
        'محطة طوبوغرافية LEICA TS 02',
        'برامج الحساب (SAP 2000)',
        'نظم المعلومات الجغرافية (GIS): Atlas GIS, Map Info',
        'معدات اختبار الخرسانة',
        '6 مركبات خدمة'
      ],
      turnoverTitle: "رقم الأعمال (بدون احتساب الرسوم)",
      turnover: [
        { year: '2024', amount: '17.5 م دج' },
        { year: '2023', amount: '30 م دج' },
        { year: '2022', amount: '09 م دج' },
        { year: '2021', amount: '41 م دج' },
        { year: '2020', amount: '63 م دج' }
      ]
    },
    services: {
      title: "خدماتنا",
      subtitle: "خدمات شاملة في جميع مجالات الهندسة والعمارة.",
      list: [
        {
          title: 'مديرية الإشراف على الأشغال',
          items: [
            'الجدولة، الإدارة والتنسيق (OPC)',
            'إدارة مشاريع التنفيذ',
            'المسح الطبوغرافي، التحديد',
            'دراسات الأقسام والتطبيق الميداني',
            'الخرائط'
          ]
        },
        {
          title: 'مديرية الدراسات المعمارية',
          items: [
            'الدراسات المعمارية (الرسم الأولي، التصميم الأولي المفصل)',
            'مشاريع التنفيذ',
            'دراسات الهندسة المدنية',
            'دراسات الأشغال الثانوية للمباني (CES)',
            'الطرق والشبكات المختلفة (VRD)'
          ]
        },
        {
          title: 'مديرية الهندسة الصناعية',
          items: [
            'دراسات العمليات',
            'التشخيص التقني',
            'دراسات التجديد',
            'تحديث الوحدات الصناعية',
            'مهام المقاول الشامل',
            'الإدارة الكاملة للمشاريع',
            'دراسات الطاقة'
          ]
        },
        {
          title: 'مديرية دراسات التهيئة والتعمير',
          items: [
            'دراسات المخططات التوجيهية للتهيئة والتعمير (PDAU)',
            'دراسات مخططات شغل الأراضي (POS)',
            'دراسات الجدوى',
            'تهيئة الإقليم'
          ]
        }
      ]
    },
    projects: {
      title: "مشاريعنا",
      subtitle: "أكثر من 50 مشروعًا وطنيًا كبيرًا تم إنجازها بامتياز.",
      allProjects: "جميع مشاريعنا",
      filters: [
        { id: 'all', label: 'كل المشاريع' },
        { id: 'housing', label: 'السكن' },
        { id: 'industrial', label: 'الصناعة' },
        { id: 'infrastructure', label: 'الهياكل القاعدية' },
        { id: 'education', label: 'التعليم' },
        { id: 'urban', label: 'التعمير' }
      ]
    },
    contact: {
      title: "اتصل بنا",
      subtitle: "فريقنا تحت تصرفكم لدراسة مشاريعكم.",
      infoTitle: "معلومات الاتصال",
      phone: "الهاتف",
      fax: "الفاكس",
      email: "البريد الإلكتروني",
      address: "العنوان",
      addressVal: "23 شارع الإخوة قوراية\nبئر خادم - الجزائر\nالجزائر",
      hoursTitle: "ساعات العمل",
      weekdays: "الأحد - الخميس",
      weekdaysHours: "08:00 - 17:00",
      weekends: "الجمعة - السبت",
      weekendsHours: "مغلق",
      formTitle: "أرسل لنا رسالة",
      formName: "الاسم الكامل *",
      formNamePlaceholder: "اسمك",
      formEmail: "البريد الإلكتروني *",
      formEmailPlaceholder: "your@email.com",
      formPhone: "رقم الهاتف",
      formPhonePlaceholder: "+213 XXX XXX XXX",
      formSubject: "الموضوع *",
      formSubjectPlaceholder: "موضوع رسالتك",
      formMessage: "الرسالة *",
      formMessagePlaceholder: "صف مشروعك أو طلبك...",
      formSubmit: "إرسال الرسالة"
    },
    gallery: {
      title: "المشاريع البارزة بالصور",
      subtitle: "اكتشف إنجازاتنا الكبرى",
      viewProject: "عرض المشروع"
    },
    footer: {
      tagline: "التميز في الهندسة، العمارة والإشراف على المشاريع.",
      navigation: "التنقل",
      services: "خدماتنا",
      rights: "كل الحقوق محفوظة."
    },
  }
};

// All 50+ projects from the document (kept as is)
const allProjects = [
  // Urban Planning Projects
  { id: 1, name: 'POS BOUKHLIFA', client: 'DUC', location: 'Bejaia', category: 'urban' },
  { id: 2, name: 'POS de l\'agglomération de ASSORO', client: 'DUC', location: 'Tamanrasset', category: 'urban' },
  { id: 3, name: 'POS RAHMANIA Centre', client: 'ANSA', location: 'Rahmania', category: 'urban' },
  { id: 4, name: 'POS de BORDJ BOU ARRERIDJ Nord-Ouest', client: 'DUC', location: 'Bordj Bou Arreridj', category: 'urban' },
  { id: 5, name: 'POS Quartier SIDI BENNOUR', client: 'ANSA', location: 'Mahelma', category: 'urban' },
  { id: 6, name: 'POS Tahaggart', client: 'DUC', location: 'Tamanrasset', category: 'urban' },
  { id: 7, name: 'POS IFRI DJANET N°05', client: 'DUC', location: 'Illizi', category: 'urban' },
  { id: 8, name: 'POS BORDJ OMAR DRISS', client: 'DUC', location: 'Illizi', category: 'urban' },
  { id: 9, name: 'POS Tameridjt', client: 'DUC', location: 'Bejaia', category: 'urban' },
  
  // Industrial Projects
  { id: 10, name: 'Cimenterie M\'sila - Génie Civil', client: 'ACC/ORASCOM', location: 'M\'sila', category: 'industrial' },
  { id: 11, name: 'Cimenterie Oggaz/Sig - Génie Civil', client: 'CIBA/ORASCOM', location: 'Sig', category: 'industrial' },
  { id: 12, name: 'Cimenterie Chlef - Silos à clincker', client: 'ECDE', location: 'Chlef', category: 'industrial' },
  { id: 13, name: 'Supervision projets Sonatrach Hassi Messaoud (24 mois)', client: 'Sonatrach/DP', location: 'Hassi Messaoud', category: 'industrial' },
  { id: 14, name: 'Supervision projets Sonatrach In Amenas (12 mois)', client: 'Sonatrach/RTI', location: 'In Amenas', category: 'industrial' },
  { id: 15, name: 'Supervision projets Sonatrach Bejaia (24 mois)', client: 'Sonatrach/TRC', location: 'Béjaia', category: 'industrial' },
  { id: 16, name: 'Supervision projets Sonatrach Hassi R\'mel', client: 'Sonatrach/DP', location: 'Hassi R\'mel', category: 'industrial' },
  { id: 17, name: 'Assistance technique Sonatrach Ourhoud', client: 'Sonatrach/Ourhoud', location: 'Hassi Messaoud', category: 'industrial' },
  { id: 18, name: 'Supervision projets Sonatrach HMD (36 mois)', client: 'Sonatrach/DP/HMD', location: 'Hassi Messaoud', category: 'industrial' },
  { id: 19, name: 'Aménagement piscine Base IRARA', client: 'Sonatrach/DP/HMD', location: 'Hassi Messaoud', category: 'industrial' },
  { id: 20, name: 'Réhabilitation usines Peaux et Cuirs', client: 'Tanneries', location: 'Djijel, Djelfa, El Amiria, Batna, Bejaia', category: 'industrial' },
  { id: 21, name: 'Parking 200 places camions - Cimenterie', client: 'ACC/LAFARGE', location: 'Hamma el dalaa, M\'sila', category: 'industrial' },
  { id: 22, name: 'Parc Industriel Ras El Ma (100 Ha)', client: 'ANIREF', location: 'Sidi Bel Abbes', category: 'industrial' },
  
  // Education Projects
  { id: 23, name: 'Lycée 1000 places Bouinan', client: 'AADL', location: 'Bouinan', category: 'education' },
  { id: 24, name: '05 Collèges type B6', client: 'AADL', location: 'Bouinan', category: 'education' },
  { id: 25, name: '06 Groupes scolaires type D', client: 'AADL', location: 'Sidi Abdallah', category: 'education' },
  
  // Housing Projects
  { id: 26, name: '15000 logements Bouinan', client: 'AADL', location: 'Bouinan', category: 'housing' },
  { id: 27, name: '1000 logements FADES', client: 'OPGI Birmandreis', location: 'Alger', category: 'housing' },
  { id: 28, name: '748 logements LSP Baba Hacène', client: 'OPGI Hussein Dey', location: 'Alger', category: 'housing' },
  { id: 29, name: '439 logements TCE DAS Chaabane', client: 'AADL', location: 'Ain Benian', category: 'housing' },
  { id: 30, name: '780 logements VRD Mahelma', client: 'AADL', location: 'Mahelma', category: 'housing' },
  { id: 31, name: '114 logements sociaux', client: 'OPGI Birmandreis', location: 'Alger', category: 'housing' },
  { id: 32, name: '1270 logements sociaux', client: 'OPGI BLIDA', location: 'Blida', category: 'housing' },
  { id: 33, name: '189 logements sociaux', client: 'AADL Said Hamdine', location: 'Alger', category: 'housing' },
  { id: 34, name: '500 logements TCE Meftah (18 mois)', client: 'OPGI BLIDA', location: 'Blida', category: 'housing' },
  { id: 35, name: '2000 logements ROUKHI SOUIDANIA', client: 'OPGI Hussein Dey', location: 'Alger', category: 'housing' },
  { id: 36, name: '2000 logements Rahmania', client: 'AADL', location: 'Sidi Abdallah', category: 'housing' },
  { id: 37, name: '1000 logements Zaatria', client: 'AADL', location: 'Sidi Abdallah', category: 'housing' },
  { id: 38, name: '483 logements Sidi Ghiles', client: 'AADL', location: 'Cherchell', category: 'housing' },
  { id: 39, name: '550 logements Sidi Ghiles', client: 'AADL', location: 'Cherchell', category: 'housing' },
  { id: 40, name: '400 logements Berrouaghia', client: 'AADL', location: 'Médéa', category: 'housing' },
  { id: 41, name: '500 logements Berrouaghia', client: 'AADL', location: 'Médéa', category: 'housing' },
  { id: 42, name: '790 logements Figuier', client: 'AADL', location: 'Boumerdes', category: 'housing' },
  { id: 43, name: '853 logements Beni Tamou', client: 'AADL', location: 'Blida', category: 'housing' },
  { id: 44, name: '237 logements LPL + 78 commerces', client: 'ENPI', location: 'Kaf El Hmam, Ouled Yaich, Blida', category: 'housing' },
  { id: 45, name: '600 logements Sbaat-Rouiba', client: 'OPGI BMR', location: 'Alger', category: 'housing' },
  { id: 46, name: '294 et 157 logements', client: 'OPGI H.DEY', location: 'Birtouta et Reghaia', category: 'housing' },
  
  // Infrastructure Projects
  { id: 47, name: 'Centre Pénitentiaire 1000 places', client: 'Ministère Justice', location: 'National', category: 'infrastructure' },
  { id: 48, name: 'Complexe Olympique Mohamed Boudiaf', client: 'OCO', location: 'Alger', category: 'infrastructure' },
  { id: 49, name: 'Extension siège Ministère Parlement', client: 'Ministère relations avec le parlement', location: 'Alger', category: 'infrastructure' },
  { id: 50, name: 'Gare Maritime d\'Alger', client: 'E.P.Al', location: 'Alger', category: 'infrastructure' },
  { id: 51, name: 'Ouvrages en béton armé et charpente métallique', client: 'E.P.Al', location: 'Alger', category: 'infrastructure' },
  { id: 52, name: 'Poste électrique MESSAAD 60/30KV', client: 'SONELGAZ', location: 'Djelfa', category: 'infrastructure' },
  { id: 53, name: 'Poste électrique Zerreah 60/30KV', client: 'SONELGAZ', location: 'Djelfa', category: 'infrastructure' },
  { id: 54, name: 'Centre de Contrôle Navigation Aérienne', client: 'ENNA', location: 'Oued Smar', category: 'infrastructure' },
  { id: 55, name: 'Equipement Electricité et Climatisation APN', client: 'Assemblee Populaire Nationale', location: 'Alger', category: 'infrastructure' }
];

// --- FEATURED PROJECTS UPDATED WITH IMAGE PATHS (kept as is) ---
const featuredProjects = [
  {
    id: 'lycee-bouinan',
    title: 'Lycée 1000 places - Bouinan',
    client: 'AADL',
    location: 'Site 10000 logements - Bouinan',
    category: 'education',
    description: 'Construction d\'un lycée de 1000 places avec infrastructure complète. Projet incluant blocs pédagogiques, administratifs et équipements sportifs.',
    images: [
      'images/projects/lycee-bouinan/image1.jpeg',
      'images/projects/lycee-bouinan/image3.jpeg',
      'images/projects/lycee-bouinan/image4.jpeg',
      'images/projects/lycee-bouinan/image5.jpeg',
      'images/projects/lycee-bouinan/image6.jpeg',
      'images/projects/lycee-bouinan/image7.jpeg'
    ]
  },
  {
    id: 'logements-berrouaghia',
    title: '400 Logements Location-Vente',
    client: 'AADL',
    location: 'Berrouaghia, Wilaya de Médéa',
    category: 'housing',
    description: 'Étude et réalisation de 400 logements location-vente en tous Corps d\'État (TCE) avec locaux à usage commercial et professionnel, conciergeries sans VRD.',
    images: [
      'images/projects/berrouaghia/image1.jpeg',
      'images/projects/berrouaghia/image2.jpeg',
      'images/projects/berrouaghia/image3.jpeg',
      'images/projects/berrouaghia/image4.jpeg',
      'images/projects/berrouaghia/image5.jpeg'
    ]
  },
  {
    id: 'logements-sidi-ghiles',
    title: '483 Logements AADL - Sidi Ghiles',
    client: 'AADL',
    location: 'Commune de Sidi Ghiles - Tipaza',
    category: 'housing',
    description: 'Projet de 483 logements avec travaux de terrassement, fondations et structure. Suivi et contrôle technique incluant tests de béton et carottage.',
    images: [
      'images/projects/Sidi Ghiles/image1.jpeg',
      'images/projects/Sidi Ghiles/image2.jpeg',
      'images/projects/Sidi Ghiles/image3.jpeg',
      'images/projects/Sidi Ghiles/image4.jpeg',
      'images/projects/Sidi Ghiles/image5.jpeg',
      'images/projects/Sidi Ghiles/image6.jpeg',
      'images/projects/Sidi Ghiles/image7.jpeg',
      'images/projects/Sidi Ghiles/image8.jpeg',
      'images/projects/Sidi Ghiles/image9.jpeg',
      'images/projects/Sidi Ghiles/image10.jpeg',
      'images/projects/Sidi Ghiles/image11.jpeg',
      'images/projects/Sidi Ghiles/image12.jpeg',
      'images/projects/Sidi Ghiles/image13.jpeg',
      'images/projects/Sidi Ghiles/image14.jpeg',
      'images/projects/Sidi Ghiles/image15.jpeg',
      'images/projects/Sidi Ghiles/image16.jpeg',
      'images/projects/Sidi Ghiles/image17.jpeg',
      'images/projects/Sidi Ghiles/image18.jpeg'
    ]
  },
  {
    id: 'parc-industriel',
    title: 'Parc Industriel Ras El Ma',
    client: 'ANIREF',
    location: 'Sidi Bel Abbes',
    category: 'industrial',
    description: 'Maîtrise d\'œuvre pour la réalisation du Parc Industriel de Ras El Ma sur 100 hectares. Aménagement complet du territoire industriel.',
    images: [
      'images/projects/Ras El Ma/image2.png'
    ]
  }
];

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

// This is your new, improved component
function CompanyLogo({ className = "", size = "normal" }) {
  const sizeClasses = {
    small: "w-10 h-10",
    normal: "w-16 h-16",
    large: "w-24 h-24",
  };

  // We apply size, custom classes, and our color classes all at once
  const combinedClassName = `${sizeClasses[size]} ${className} transition-all duration-500 ease-in-out`;

  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 93.000000 79.000000"
      preserveAspectRatio="xMidYMid meet"
      stroke="none"
      // This is the magic line:
      // We set the fill color directly using Tailwind
      // It will be #1f3a8a by default, and white in dark mode
      className={`${combinedClassName} fill-[#1f3a8a] dark:fill-white`}
    >
      <g transform="translate(0.000000,79.000000) scale(0.100000,-0.100000)">
        {/* I have copied your <path> data below.
          Notice the original 'fill="#000000"' is REMOVED from the <g> tag 
          so it can be controlled by the parent <svg> tag's className.
        */}
        <path d="M271 602 l-184 -157 57 -3 c77 -4 62 -22 -18 -22 -58 0 -65 -2 -81 -27 -15 -23 -16 -28 -3 -37 8 -6 108 -85 222 -176 115 -91 211 -164 215 -164 11 2 370 309 370 317 1 10 -78 9 -117 -3 -29 -8 -79 -46 -189 -144 l-23 -19 0 91 0 92 173 0 c153 1 174 3 195 19 12 11 22 22 22 25 0 7 -441 365 -450 366 -3 0 -88 -71 -189 -158z m326 17 c76 -62 168 -136 206 -167 37 -30 67 -58 67 -62 0 -15 -81 -19 -397 -21 -178 0 -323 -3 -323 -5 0 -5 318 -264 325 -264 3 0 61 47 128 103 106 90 177 133 177 107 0 -5 -53 -52 -117 -106 -64 -55 -130 -111 -147 -126 -17 -15 -35 -27 -39 -28 -5 0 -101 73 -213 162 -162 129 -201 165 -191 175 9 9 106 14 356 20 l345 8 -140 114 c-76 63 -147 121 -156 129 -16 13 -28 4 -134 -92 -109 -99 -120 -106 -158 -106 l-41 1 50 42 c27 23 97 83 155 134 58 50 106 92 107 92 2 1 65 -49 140 -110z m-14 -118 c42 -35 77 -68 77 -73 0 -13 -14 -3 -107 74 -45 37 -86 68 -90 68 -5 0 -45 -34 -91 -76 -45 -42 -87 -74 -93 -72 -6 2 33 43 86 91 96 85 98 86 119 69 12 -9 57 -46 99 -81z m-68 -36 c22 -18 36 -37 32 -41 -4 -4 -23 8 -42 26 l-35 34 -33 -32 c-48 -47 -68 -39 -22 8 21 22 44 40 50 40 5 -1 28 -16 50 -35z m-93 -202 c2 -49 3 -89 2 -91 -1 -2 -47 34 -102 80 l-99 83 91 6 c50 3 94 6 97 7 4 1 9 -37 11 -85z m58 -20 c0 -54 3 -73 10 -63 5 8 10 11 10 5 0 -17 -14 -31 -30 -30 -9 0 -14 8 -11 20 2 11 4 48 5 83 2 90 16 77 16 -15z" />
      </g>
    </svg>
  );
}

// 3D Building Component
function Building3D() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const structureColor = isDark ? '#60a5fa' : '#d6a46e';   // light terracotta-sand, warm and structural  
  const groundColor = isDark ? '#334155' : '#faf6f0';      // pale stone / cream background (architectural paper tone)  
  const accentColor = isDark ? '#f59e0b' : '#f5b342';      // soft golden amber (sunlight warmth)  
  const glowingColor = isDark ? '#3b82f6' : '#c5ccd6';     // light steel-gray with a hint of blue (glass/metal highlight)
   // soft steel gray-blue glow — evokes metal or glass

  const WireframeBox = ({ position, args, color }) => (
    <group position={position}>
      <Box args={args}>
        <meshStandardMaterial attach="material" color={color} transparent opacity={0.1} />
      </Box>
      <Line
        points={[
          [-args[0]/2, -args[1]/2, -args[2]/2], [-args[0]/2, args[1]/2, -args[2]/2],
          [args[0]/2, args[1]/2, -args[2]/2], [args[0]/2, -args[1]/2, -args[2]/2],
          [-args[0]/2, -args[1]/2, -args[2]/2],
          [-args[0]/2, -args[1]/2, args[2]/2], [-args[0]/2, args[1]/2, args[2]/2],
          [args[0]/2, args[1]/2, args[2]/2], [args[0]/2, -args[1]/2, args[2]/2],
          [-args[0]/2, -args[1]/2, args[2]/2],
          [-args[0]/2, -args[1]/2, -args[2]/2], [-args[0]/2, -args[1]/2, args[2]/2],
          [-args[0]/2, args[1]/2, -args[2]/2], [-args[0]/2, args[1]/2, args[2]/2],
          [args[0]/2, args[1]/2, -args[2]/2], [args[0]/2, args[1]/2, args[2]/2],
          [args[0]/2, -args[1]/2, -args[2]/2], [args[0]/2, -args[1]/2, args[2]/2],
        ]}
        color={color}
        lineWidth={1}
      />
    </group>
  );

  const Scaffolding = ({ position, height, width, depth, color }) => (
    <group position={position}>
      {[0, 1].map(x => [0, 1].map(z => (
        <Cylinder
          key={`${x}-${z}`}
          args={[0.02, 0.02, height, 8]}
          position={[x * width - width / 2, height / 2, z * depth - depth / 2]}
        >
          <meshStandardMaterial color={color} />
        </Cylinder>
      )))}
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

  const Crane = ({ position, rotation }) => (
    <group position={position} rotation={rotation}>
      <Cylinder args={[0.1, 0.1, 2, 8]} position={[0, 1, 0]}>
        <meshStandardMaterial color={accentColor} />
      </Cylinder>
      <Box args={[0.2, 0.2, 3]} position={[0, 2, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={accentColor} />
      </Box>
      <Box args={[0.4, 0.2, 0.4]} position={[0, 2, -1.2]}><meshStandardMaterial color={accentColor} /></Box>
    </group>
  );

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={[0, -0.5, 0]}>
        <Box args={[5, 0.2, 5]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color={groundColor} metalness={0.1} roughness={0.8} />
        </Box>
        <Line 
          points={[
            [-2.5, 0, -2.5], [-2.5, 0, 2.5], [2.5, 0, 2.5], [2.5, 0, -2.5], [-2.5, 0, -2.5],
          ]}
          color={structureColor} lineWidth={2}
        />
        <WireframeBox position={[0, 0.7, 0]} args={[4, 1.2, 3.5]} color={structureColor} />
        <WireframeBox position={[-0.5, 2.0, 0]} args={[3.5, 1.2, 3]} color={glowingColor} />
        <Box args={[3.2, 1, 2.8]} position={[-0.5, 2.0, 0]}>
          <meshStandardMaterial color={glowingColor} transparent opacity={isDark ? 0.05 : 0.1} emissive={glowingColor} emissiveIntensity={isDark ? 0.8 : 0.3} />
        </Box>
        <WireframeBox position={[0.5, 3.3, 0]} args={[4, 1.2, 3.5]} color={structureColor} />
        <Box args={[0.5, 4, 0.5]} position={[-1.5, 1.8, -1.5]}><meshStandardMaterial color={structureColor} /></Box>
        <Box args={[0.5, 4.5, 0.5]} position={[1.5, 2.0, 1.5]}><meshStandardMaterial color={structureColor} /></Box>
        <Scaffolding position={[-2.5, 0.1, 0]} height={3} width={1} depth={3.5} color={accentColor} />
        <Scaffolding position={[2.5, 0.1, 0]} height={3.5} width={1} depth={3.5} color={accentColor} />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[5, 3, 8]} fov={60} />
            {isDark && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
            <ambientLight intensity={isDark ? 0.6 : 1.2} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={isDark ? 1 : 1.5} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.5 : 0.3} color={isDark ? "#3b82f6" : "#60a5fa"} />
            <Suspense fallback={null}>
              <Building3D />
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
          </Canvas>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <CompanyLogo className="text-blue-600 dark:text-blue-400" size="large" />
              <h1 className="text-5xl md:text-7xl font-bold text-blue-900 dark:text-white">NAPRO</h1>
            </div>
            <p className="text-2xl md:text-3xl text-blue-800 dark:text-blue-300 mb-4 font-semibold">{t.home.subtitle}</p>
            <p className="text-xl text-slate-800 dark:text-gray-200 mb-8 max-w-3xl mx-auto font-medium">{t.home.title}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 shadow-xl dark:shadow-blue-500/30"
            >
              {t.home.cta} <ChevronRight />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white/80 dark:bg-slate-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {t.home.stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
              <div className="text-slate-700 dark:text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white text-center mb-16">
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
                className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border-2 border-slate-300 dark:border-blue-500/20 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all cursor-pointer shadow-lg dark:shadow-none"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {i === 0 && <Building2 size={40} />}
                  {i === 1 && <Briefcase size={40} />}
                  {i === 2 && <MapPin size={40} />}
                  {i === 3 && <Award size={40} />}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-700 dark:text-gray-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/80 dark:bg-slate-800/50 backdrop-blur px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12">{t.home.clientsTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.home.clients.map((client, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-white/10 backdrop-blur p-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/20 transition-all"
              >
                <div className="text-xl font-bold text-blue-900 dark:text-blue-300">{client}</div>
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


// --- GALLERY PAGE UPDATED ---
function GalleryPage() {
  const { t } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.gallery.title}</h1>
          <p className="text-xl text-slate-800 dark:text-gray-300 max-w-3xl mx-auto font-medium">{t.gallery.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl border-2 border-slate-300 dark:border-blue-500/20 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all shadow-xl cursor-pointer overflow-hidden"
              onClick={() => {
                setSelectedProject(project);
                setCurrentImageIndex(0); // Reset index when opening modal
              }}
            >
              {/* Updated to show the first image */}
              <img 
                src={project.images[0]} 
                alt={project.title} 
                className="h-64 w-full object-cover" 
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/e0e7ff/3b82f6?text=Image+Indisponible'; e.target.onerror = null; }}
              />
              <div className="p-6">
                <div className="inline-block bg-blue-100 dark:bg-blue-600/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {project.category === 'education' ? 'Enseignement' : project.category === 'housing' ? 'Logement' : 'Industriel'}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                <p className="text-slate-700 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                    <Users size={16} className="text-blue-600 dark:text-blue-400" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                    <MapPinned size={16} className="text-blue-600 dark:text-blue-400" />
                    <span>{project.location}</span>
                  </div>
                </div>
                <button className="mt-4 text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  {t.gallery.viewProject} <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal with Image Viewer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" // Made modal wider
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{selectedProject.title}</h2>
                <button onClick={() => setSelectedProject(null)} className="text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={28} />
                </button>
              </div>
              
              {/* --- NEW IMAGE VIEWER --- */}
              <div className="mb-6">
                <div className="relative h-96 w-full bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Main Image */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={selectedProject.images[currentImageIndex]}
                      alt={`${selectedProject.title} - ${currentImageIndex + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="h-full w-full object-contain"
                      onError={(e) => { e.target.src = 'https://placehold.co/800x600/e0e7ff/3b82f6?text=Image+Indisponible'; e.target.onerror = null; }}
                    />
                  </AnimatePresence>

                  {/* Prev Button */}
                  {selectedProject.images.length > 1 && (
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  
                  {/* Next Button */}
                  {selectedProject.images.length > 1 && (
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all z-10"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {selectedProject.images.length > 1 && (
                  <div className="mt-4 h-24 overflow-x-auto flex gap-2 p-1">
                    {selectedProject.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`h-20 w-28 object-cover rounded-md cursor-pointer transition-all ${
                          i === currentImageIndex ? 'ring-4 ring-blue-500' : 'opacity-60 hover:opacity-100'
                        }`}
                        onError={(e) => { e.target.src = 'https://placehold.co/112x80/e0e7ff/3b82f6?text=N/A'; e.target.onerror = null; }}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* --- END NEW IMAGE VIEWER --- */}
              
              <div className="space-y-6">
                <p className="text-lg text-slate-700 dark:text-gray-300">{selectedProject.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <Users className="text-blue-600 dark:text-blue-400" size={24} />
                    <div>
                      <div className="text-sm text-slate-600 dark:text-gray-400">Client</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">{selectedProject.client}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <MapPinned className="text-blue-600 dark:text-blue-400" size={24} />
                    <div>
                      <div className="text-sm text-slate-600 dark:text-gray-400">Localisation</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">{selectedProject.location}</div>
                    </div>
                  </div>
                </div>

                {/* Removed the old text-based image list */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Projects Page - All 50+ Projects
function ProjectsPage() {
  const { t } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter);

  const categoryIcons = {
    housing: <Building2 size={24} />,
    industrial: <Briefcase size={24} />,
    infrastructure: <Award size={24} />,
    education: <Users size={24} />,
    urban: <MapPin size={24} />
  };

  const categoryNames = {
    housing: 'Logement',
    industrial: 'Industriel',
    infrastructure: 'Infrastructure',
    education: 'Enseignement',
    urban: 'Urbanisme'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.projects.title}</h1>
          <p className="text-xl text-slate-800 dark:text-gray-300 max-w-3xl mx-auto font-medium">{t.projects.subtitle}</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {t.projects.filters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === cat.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-800/50 text-slate-800 dark:text-gray-300 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Count */}
        <div className="text-center mb-8">
          <p className="text-lg text-slate-700 dark:text-gray-300">
            <span className="font-bold text-blue-600 dark:text-blue-400">{filteredProjects.length}</span> {filter === 'all' ? 'projets au total' : 'projet(s) trouvé(s)'}
          </p>
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
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-slate-800/50 backdrop-blur p-6 rounded-xl border-2 border-slate-300 dark:border-blue-500/20 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all cursor-pointer shadow-lg"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-blue-600 dark:text-blue-400">
                    {categoryIcons[project.category]}
                  </div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-600/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                    {categoryNames[project.category]}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">
                  {project.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                    <Users size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="line-clamp-1">{project.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                    <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-blue-600 dark:text-blue-400">
                    {categoryIcons[selectedProject.category]}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedProject.name}</h2>
                </div>
                <button onClick={() => setSelectedProject(null)} className="text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X size={28} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="inline-block bg-blue-100 dark:bg-blue-600/20 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full font-medium">
                  {categoryNames[selectedProject.category]}
                </div>
                
                <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="text-blue-600 dark:text-blue-400" size={24} />
                    <div>
                      <div className="text-sm text-slate-600 dark:text-gray-400">Client</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">{selectedProject.client}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                    <div>
                      <div className="text-sm text-slate-600 dark:text-gray-400">Localisation</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">{selectedProject.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Contact Page with EmailJS
function ContactPage() {
  const { t } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // ⚠️ IMPORTANT: Replace these with your actual EmailJS credentials
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';  // From Step 3
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // From Step 4
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // From Step 5

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // --- THIS IS A DEMO ---
    // Since I don't have your EmailJS credentials, I'll simulate a successful send.
    // Replace this block with the emailjs.send() call when you're ready.
    console.log("Simulating email send with data:", formData);
    setTimeout(() => {
      setModalMessage('Message envoyé avec succès! Nous vous contacterons bientôt.');
      setIsError(false);
      setModalOpen(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setIsSending(false);
    }, 1500);
    // --- END DEMO BLOCK ---

    /*
    // --- UNCOMMENT THIS BLOCK AND ADD YOUR CREDENTIALS ---
    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'Non fourni',
      subject: formData.subject,
      message: formData.message,
      to_email: 'contact@napro.dz' // Your company email
    };

    // Send email via EmailJS
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setModalMessage('Message envoyé avec succès! Nous vous contacterons bientôt.');
      setIsError(false);
      setModalOpen(true);
      // Reset form
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    })
    .catch((error) => {
      console.error('FAILED...', error);
      setModalMessage('Erreur lors de l\'envoi du message. Veuillez réessayer ou nous contacter directement par téléphone.');
      setIsError(true);
      setModalOpen(true);
    })
    .finally(() => {
      setIsSending(false);
    });
    // --- END EMAILJS BLOCK ---
    */
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">Contactez-Nous</h1>
          <p className="text-xl text-slate-800 dark:text-gray-300 font-medium">
            Notre équipe est à votre disposition pour étudier vos projets.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border-2 border-slate-300 dark:border-blue-500/20 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Informations de Contact</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">Téléphone</div>
                    <div className="text-slate-700 dark:text-gray-300">+213 028 53 89 80</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <Phone className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">Fax</div>
                    <div className="text-slate-700 dark:text-gray-300">+213 028 53 89 78</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">Email</div>
                    <a href="mailto:contact@napro.dz" className="text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">contact@napro.dz</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-600/20 p-3 rounded-lg">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-semibold mb-1">Adresse</div>
                    <div className="text-slate-700 dark:text-gray-300">
                      23 Rue des frères Gouraya<br/>
                      Bir Khadem - Alger<br/>
                      Algérie
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border-2 border-slate-300 dark:border-blue-500/20 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Horaires d'ouverture</h3>
              <div className="space-y-2 text-slate-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span className="font-medium">Dimanche - Jeudi</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Vendredi - Samedi</span>
                  <span className="text-slate-500 dark:text-gray-500">Fermé</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-800/50 backdrop-blur p-8 rounded-xl border-2 border-slate-300 dark:border-blue-500/20 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-900 dark:text-white font-semibold mb-2">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Votre nom"
                  disabled={isSending}
                />
              </div>
              <div>
                <label className="block text-slate-900 dark:text-white font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                  disabled={isSending}
                />
              </div>
              <div>
                <label className="block text-slate-900 dark:text-white font-semibold mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="+213 XXX XXX XXX"
                  disabled={isSending}
                />
              </div>
              <div>
                <label className="block text-slate-900 dark:text-white font-semibold mb-2">Sujet *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Sujet de votre message"
                  disabled={isSending}
                />
              </div>
              <div>
                <label className="block text-slate-900 dark:text-white font-semibold mb-2">Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Décrivez votre projet ou votre demande..."
                  disabled={isSending}
                />
              </div>
              <motion.button
                whileHover={{ scale: isSending ? 1 : 1.02 }}
                whileTap={{ scale: isSending ? 1 : 0.98 }}
                type="submit"
                disabled={isSending}
                className={`w-full py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-xl ${
                  isSending 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {isError ? (
                <X className="text-red-500 dark:text-red-400 w-16 h-16 mx-auto mb-4" />
              ) : (
                <CheckCircle className="text-green-500 dark:text-green-400 w-16 h-16 mx-auto mb-4" />
              )}
              <p className="text-lg text-slate-900 dark:text-white font-semibold mb-6">{modalMessage}</p>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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

// Language Switcher
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
        className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white font-medium"
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
            className="absolute end-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden z-20"
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
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'text-slate-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700'
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

// Theme Toggle
function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  return (
    <button
      onClick={toggleTheme}
      className="text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

// Main App
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
    { id: 'services', label: 'Services' }, // This wasn't in your translations, keeping as-is
    { id: 'gallery', label: t.nav.gallery },
    { id: 'projects', label: t.nav.projects },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="fixed w-full z-40 bg-white/90 dark:bg-slate-900/95 backdrop-blur border-b-2 border-slate-300 dark:border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 text-2xl font-bold text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <CompanyLogo className="text-blue-600 dark:text-blue-400" size="normal" />
            <span>NAPRO</span>
          </button>
          
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => navigate(item.id)} 
                className={`font-semibold transition-colors ${
                  currentPage === item.id 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-4 ps-4 border-s-2 border-slate-300 dark:border-slate-700">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-800 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-t-2 border-slate-300 dark:border-slate-800"
            >
              <div className="flex flex-col px-4 pt-4 pb-6 space-y-3">
                {navItems.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => navigate(item.id)} 
                    className={`block w-full text-start px-3 py-2 rounded-md text-lg font-semibold ${
                      currentPage === item.id 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t-2 border-slate-300 dark:border-slate-700">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {currentPage === 'home' && <HomePage navigate={navigate} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <footer className="py-12 bg-slate-200 dark:bg-slate-950 border-t-2 border-slate-300 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <button onClick={() => navigate('home')} className="flex items-center gap-3 text-2xl font-bold text-blue-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4">
                <CompanyLogo className="text-blue-600 dark:text-blue-400" size="normal" />
                <span>NAPRO</span>
              </button>
              <p className="text-sm text-slate-700 dark:text-gray-400 font-medium">
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
                {t.footer.navigation}
              </h3>
              <div className="space-y-2 text-sm">
                {navItems.filter(item => item.id !== 'contact').map((page) => (
                  <button 
                    key={page.id}
                    onClick={() => navigate(page.id)}
                    className="block text-slate-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
                Services
              </h3>
              <div className="space-y-2 text-sm text-slate-700 dark:text-gray-400">
                <div className="font-medium">Supervision des Travaux</div>
                <div className="font-medium">Études d'Architecture</div>
                <div className="font-medium">Ingénierie Industrielle</div>
                <div className="font-medium">Aménagement et Urbanisme</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
                Contact
              </h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">+213 028 53 89 80</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">contact@napro.dz</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">23 Rue des frères Gouraya, Bir Khadem - Alger</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-300 dark:border-slate-800 pt-8 text-center text-sm text-slate-700 dark:text-gray-500">
            <p className="font-medium">© {new Date().getFullYear()} NAPRO - {t.home.subtitle}. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ProvidedApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
