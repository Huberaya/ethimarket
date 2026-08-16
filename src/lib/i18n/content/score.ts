/** Contenus multilingues — page Score EthiMarket. */
import type { PerLocale } from './types';

export type ScoreContent = {
  heroTitle: string;
  heroText: string;
  calcTitle: string;
  calcIntro: string;
  categories: { name: string; items: { label: string; points: number }[] }[];
  ptsLabel: string;
  badgesTitle: string;
  badgesIntro: string;
  badges: { range: string; label: string; icon: string; desc: string }[];
  scoreWord: string;
  penaltiesTitle: string;
  penaltiesIntro: string;
  penalties: { event: string; points: number; suspend?: boolean }[];
  suspension: string;
  updateTitle: string;
  updateIntro: string;
  updateItems: string[];
  tipsTitle: string;
  tipsIntro: string;
  tips: string[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

const fr: ScoreContent = {
  heroTitle: 'Le Score EthiMarket',
  heroText: "Une note sur 100 qui résume en un coup d'œil la fiabilité, la qualité et l'éthique d'un producteur. Plus le score est élevé, plus vous pouvez acheter en confiance.",
  calcTitle: 'Comment est calculé le score ?',
  calcIntro: 'Le score est réparti sur 100 points selon 5 catégories :',
  categories: [
    { name: 'Certifications', items: [{ label: 'Certification bio vérifiée', points: 15 }, { label: 'Fairtrade', points: 10 }, { label: 'Autres certifications (+2 chacune, max 10)', points: 10 }, { label: 'Analyses laboratoire à jour', points: 5 }] },
    { name: 'Traçabilité', items: [{ label: 'Coordonnées GPS renseignées', points: 10 }, { label: 'Photos exploitation (min. 5)', points: 5 }, { label: 'Historique 3 ans', points: 5 }, { label: 'Vidéo de présentation', points: 5 }] },
    { name: 'Éthique', items: [{ label: 'Charte signée', points: 5 }, { label: 'Salaires documentés', points: 10 }, { label: 'Rapport social annuel', points: 5 }] },
    { name: 'Environnement', items: [{ label: 'Bilan carbone', points: 5 }, { label: 'Actions durables', points: 5 }] },
    { name: 'Satisfaction', items: [{ label: 'Note moyenne ≥ 4,5/5', points: 5 }, { label: 'Note 4,0–4,4/5', points: 3 }, { label: 'Note < 4,0/5', points: 0 }] },
  ],
  ptsLabel: 'pts',
  badgesTitle: 'Les badges',
  badgesIntro: 'Selon le score obtenu, le producteur reçoit un badge visible sur sa fiche :',
  badges: [
    { range: '90–100', label: 'Certifié Or', icon: '🏆', desc: 'Excellence — producteur exemplaire sur tous les critères' },
    { range: '75–89', label: 'Certifié Argent', icon: '🥈', desc: 'Très bon — producteur fiable et transparent' },
    { range: '60–74', label: 'Vérifié Bronze', icon: '🥉', desc: 'Conforme — producteur validé, en progression' },
    { range: '< 60', label: 'Non éligible', icon: '⚠️', desc: 'Score insuffisant — amélioration nécessaire' },
  ],
  scoreWord: 'Score',
  penaltiesTitle: 'Système de pénalités',
  penaltiesIntro: 'Le score peut être réduit en cas de manquement :',
  penalties: [
    { event: 'Certificat expiré', points: -10 },
    { event: 'Réclamation acheteur', points: -5 },
    { event: 'Litige non résolu', points: -20 },
    { event: 'Faux document détecté', points: -50, suspend: true },
  ],
  suspension: '+ SUSPENSION',
  updateTitle: 'Mise à jour automatique',
  updateIntro: 'Le score est recalculé automatiquement :',
  updateItems: ['Chaque semaine (cron job)', 'Après chaque validation de certification', 'Après chaque nouvel avis acheteur', 'Après chaque changement de certification'],
  tipsTitle: 'Comment améliorer son score',
  tipsIntro: 'Conseils pour les producteurs qui souhaitent monter en grade :',
  tips: [
    'Ajoutez et faites valider toutes vos certifications',
    'Renseignez les coordonnées GPS de votre exploitation',
    'Téléchargez au moins 5 photos de votre exploitation',
    'Ajoutez une vidéo de présentation (+5 pts)',
    'Documentez les salaires versés à vos employés',
    'Rédigez un bilan carbone et un rapport environnemental',
    'Maintenez une note moyenne supérieure à 4,5/5',
  ],
  ctaTitle: 'Prêt à acheter en confiance ?',
  ctaText: 'Parcourez notre catalogue de producteurs vérifiés.',
  ctaButton: 'Voir le catalogue',
};

const en: ScoreContent = {
  heroTitle: 'The EthiMarket Score',
  heroText: 'A score out of 100 that summarizes at a glance the reliability, quality and ethics of a producer. The higher the score, the more confidently you can buy.',
  calcTitle: 'How is the score calculated?',
  calcIntro: 'The score is distributed over 100 points across 5 categories:',
  categories: [
    { name: 'Certifications', items: [{ label: 'Verified organic certification', points: 15 }, { label: 'Fairtrade', points: 10 }, { label: 'Other certifications (+2 each, max 10)', points: 10 }, { label: 'Up-to-date lab analyses', points: 5 }] },
    { name: 'Traceability', items: [{ label: 'GPS coordinates provided', points: 10 }, { label: 'Farm photos (min. 5)', points: 5 }, { label: '3-year history', points: 5 }, { label: 'Presentation video', points: 5 }] },
    { name: 'Ethics', items: [{ label: 'Signed charter', points: 5 }, { label: 'Documented wages', points: 10 }, { label: 'Annual social report', points: 5 }] },
    { name: 'Environment', items: [{ label: 'Carbon footprint report', points: 5 }, { label: 'Sustainable actions', points: 5 }] },
    { name: 'Satisfaction', items: [{ label: 'Average rating ≥ 4.5/5', points: 5 }, { label: 'Rating 4.0–4.4/5', points: 3 }, { label: 'Rating < 4.0/5', points: 0 }] },
  ],
  ptsLabel: 'pts',
  badgesTitle: 'The badges',
  badgesIntro: 'Based on the score obtained, the producer receives a badge visible on their profile:',
  badges: [
    { range: '90–100', label: 'Gold Certified', icon: '🏆', desc: 'Excellence — exemplary producer on all criteria' },
    { range: '75–89', label: 'Silver Certified', icon: '🥈', desc: 'Very good — reliable and transparent producer' },
    { range: '60–74', label: 'Bronze Verified', icon: '🥉', desc: 'Compliant — validated producer, progressing' },
    { range: '< 60', label: 'Not eligible', icon: '⚠️', desc: 'Insufficient score — improvement needed' },
  ],
  scoreWord: 'Score',
  penaltiesTitle: 'Penalty system',
  penaltiesIntro: 'The score can be reduced in case of breach:',
  penalties: [
    { event: 'Expired certificate', points: -10 },
    { event: 'Buyer complaint', points: -5 },
    { event: 'Unresolved dispute', points: -20 },
    { event: 'Fake document detected', points: -50, suspend: true },
  ],
  suspension: '+ SUSPENSION',
  updateTitle: 'Automatic updates',
  updateIntro: 'The score is recalculated automatically:',
  updateItems: ['Every week (cron job)', 'After each certification validation', 'After each new buyer review', 'After each certification change'],
  tipsTitle: 'How to improve your score',
  tipsIntro: 'Tips for producers who want to move up:',
  tips: [
    'Add and have all your certifications validated',
    'Provide the GPS coordinates of your farm',
    'Upload at least 5 photos of your farm',
    'Add a presentation video (+5 pts)',
    'Document the wages paid to your employees',
    'Write a carbon footprint and environmental report',
    'Maintain an average rating above 4.5/5',
  ],
  ctaTitle: 'Ready to buy with confidence?',
  ctaText: 'Browse our catalog of verified producers.',
  ctaButton: 'View the catalog',
};

const es: ScoreContent = {
  heroTitle: 'El Score EthiMarket',
  heroText: 'Una nota sobre 100 que resume de un vistazo la fiabilidad, la calidad y la ética de un productor. Cuanto más alto el puntaje, más confianza al comprar.',
  calcTitle: '¿Cómo se calcula el puntaje?',
  calcIntro: 'El puntaje se distribuye en 100 puntos según 5 categorías:',
  categories: [
    { name: 'Certificaciones', items: [{ label: 'Certificación orgánica verificada', points: 15 }, { label: 'Fairtrade', points: 10 }, { label: 'Otras certificaciones (+2 cada una, máx 10)', points: 10 }, { label: 'Análisis de laboratorio al día', points: 5 }] },
    { name: 'Trazabilidad', items: [{ label: 'Coordenadas GPS proporcionadas', points: 10 }, { label: 'Fotos de la explotación (mín. 5)', points: 5 }, { label: 'Historial de 3 años', points: 5 }, { label: 'Video de presentación', points: 5 }] },
    { name: 'Ética', items: [{ label: 'Carta firmada', points: 5 }, { label: 'Salarios documentados', points: 10 }, { label: 'Informe social anual', points: 5 }] },
    { name: 'Medio ambiente', items: [{ label: 'Balance de carbono', points: 5 }, { label: 'Acciones sostenibles', points: 5 }] },
    { name: 'Satisfacción', items: [{ label: 'Nota media ≥ 4,5/5', points: 5 }, { label: 'Nota 4,0–4,4/5', points: 3 }, { label: 'Nota < 4,0/5', points: 0 }] },
  ],
  ptsLabel: 'pts',
  badgesTitle: 'Las insignias',
  badgesIntro: 'Según el puntaje obtenido, el productor recibe una insignia visible en su ficha:',
  badges: [
    { range: '90–100', label: 'Certificado Oro', icon: '🏆', desc: 'Excelencia — productor ejemplar en todos los criterios' },
    { range: '75–89', label: 'Certificado Plata', icon: '🥈', desc: 'Muy bueno — productor fiable y transparente' },
    { range: '60–74', label: 'Verificado Bronce', icon: '🥉', desc: 'Conforme — productor validado, en progresión' },
    { range: '< 60', label: 'No elegible', icon: '⚠️', desc: 'Puntaje insuficiente — mejora necesaria' },
  ],
  scoreWord: 'Puntaje',
  penaltiesTitle: 'Sistema de penalizaciones',
  penaltiesIntro: 'El puntaje puede reducirse en caso de incumplimiento:',
  penalties: [
    { event: 'Certificado vencido', points: -10 },
    { event: 'Reclamación de comprador', points: -5 },
    { event: 'Disputa no resuelta', points: -20 },
    { event: 'Documento falso detectado', points: -50, suspend: true },
  ],
  suspension: '+ SUSPENSIÓN',
  updateTitle: 'Actualización automática',
  updateIntro: 'El puntaje se recalcula automáticamente:',
  updateItems: ['Cada semana (tarea programada)', 'Tras cada validación de certificación', 'Tras cada nueva reseña de comprador', 'Tras cada cambio de certificación'],
  tipsTitle: 'Cómo mejorar su puntaje',
  tipsIntro: 'Consejos para los productores que desean subir de grado:',
  tips: [
    'Añada y haga validar todas sus certificaciones',
    'Proporcione las coordenadas GPS de su explotación',
    'Suba al menos 5 fotos de su explotación',
    'Añada un video de presentación (+5 pts)',
    'Documente los salarios pagados a sus empleados',
    'Redacte un balance de carbono y un informe ambiental',
    'Mantenga una nota media superior a 4,5/5',
  ],
  ctaTitle: '¿Listo para comprar con confianza?',
  ctaText: 'Explore nuestro catálogo de productores verificados.',
  ctaButton: 'Ver el catálogo',
};

const pt: ScoreContent = {
  heroTitle: 'O Score EthiMarket',
  heroText: 'Uma nota de 0 a 100 que resume num piscar de olhos a confiabilidade, a qualidade e a ética de um produtor. Quanto maior a pontuação, mais confiança na compra.',
  calcTitle: 'Como a pontuação é calculada?',
  calcIntro: 'A pontuação é distribuída em 100 pontos em 5 categorias:',
  categories: [
    { name: 'Certificações', items: [{ label: 'Certificação orgânica verificada', points: 15 }, { label: 'Fairtrade', points: 10 }, { label: 'Outras certificações (+2 cada, máx 10)', points: 10 }, { label: 'Análises de laboratório em dia', points: 5 }] },
    { name: 'Rastreabilidade', items: [{ label: 'Coordenadas GPS fornecidas', points: 10 }, { label: 'Fotos da propriedade (mín. 5)', points: 5 }, { label: 'Histórico de 3 anos', points: 5 }, { label: 'Vídeo de apresentação', points: 5 }] },
    { name: 'Ética', items: [{ label: 'Carta assinada', points: 5 }, { label: 'Salários documentados', points: 10 }, { label: 'Relatório social anual', points: 5 }] },
    { name: 'Meio ambiente', items: [{ label: 'Balanço de carbono', points: 5 }, { label: 'Ações sustentáveis', points: 5 }] },
    { name: 'Satisfação', items: [{ label: 'Nota média ≥ 4,5/5', points: 5 }, { label: 'Nota 4,0–4,4/5', points: 3 }, { label: 'Nota < 4,0/5', points: 0 }] },
  ],
  ptsLabel: 'pts',
  badgesTitle: 'Os selos',
  badgesIntro: 'Conforme a pontuação obtida, o produtor recebe um selo visível em seu perfil:',
  badges: [
    { range: '90–100', label: 'Certificado Ouro', icon: '🏆', desc: 'Excelência — produtor exemplar em todos os critérios' },
    { range: '75–89', label: 'Certificado Prata', icon: '🥈', desc: 'Muito bom — produtor confiável e transparente' },
    { range: '60–74', label: 'Verificado Bronze', icon: '🥉', desc: 'Conforme — produtor validado, em progressão' },
    { range: '< 60', label: 'Não elegível', icon: '⚠️', desc: 'Pontuação insuficiente — melhoria necessária' },
  ],
  scoreWord: 'Pontuação',
  penaltiesTitle: 'Sistema de penalidades',
  penaltiesIntro: 'A pontuação pode ser reduzida em caso de infração:',
  penalties: [
    { event: 'Certificado vencido', points: -10 },
    { event: 'Reclamação de comprador', points: -5 },
    { event: 'Disputa não resolvida', points: -20 },
    { event: 'Documento falso detectado', points: -50, suspend: true },
  ],
  suspension: '+ SUSPENSÃO',
  updateTitle: 'Atualização automática',
  updateIntro: 'A pontuação é recalculada automaticamente:',
  updateItems: ['Toda semana (tarefa agendada)', 'Após cada validação de certificação', 'Após cada nova avaliação de comprador', 'Após cada mudança de certificação'],
  tipsTitle: 'Como melhorar sua pontuação',
  tipsIntro: 'Dicas para os produtores que desejam subir de nível:',
  tips: [
    'Adicione e valide todas as suas certificações',
    'Forneça as coordenadas GPS da sua propriedade',
    'Envie pelo menos 5 fotos da sua propriedade',
    'Adicione um vídeo de apresentação (+5 pts)',
    'Documente os salários pagos aos seus funcionários',
    'Redija um balanço de carbono e um relatório ambiental',
    'Mantenha uma nota média superior a 4,5/5',
  ],
  ctaTitle: 'Pronto para comprar com confiança?',
  ctaText: 'Navegue pelo nosso catálogo de produtores verificados.',
  ctaButton: 'Ver o catálogo',
};

const ar: ScoreContent = {
  heroTitle: 'نقاط EthiMarket',
  heroText: 'علامة من 100 تلخص بنظرة واحدة موثوقية المنتج وجودته وأخلاقياته. كلما ارتفعت النقاط، زادت ثقتك في الشراء.',
  calcTitle: 'كيف تُحسب النقاط؟',
  calcIntro: 'تتوزع النقاط على 100 نقطة وفق 5 فئات:',
  categories: [
    { name: 'الشهادات', items: [{ label: 'شهادة عضوية موثّقة', points: 15 }, { label: 'التجارة العادلة', points: 10 }, { label: 'شهادات أخرى (+2 لكل واحدة، بحد أقصى 10)', points: 10 }, { label: 'تحاليل مخبرية محدّثة', points: 5 }] },
    { name: 'التتبع', items: [{ label: 'إحداثيات GPS مقدمة', points: 10 }, { label: 'صور المزرعة (5 على الأقل)', points: 5 }, { label: 'سجل 3 سنوات', points: 5 }, { label: 'فيديو تقديمي', points: 5 }] },
    { name: 'الأخلاقيات', items: [{ label: 'ميثاق موقّع', points: 5 }, { label: 'أجور موثقة', points: 10 }, { label: 'تقرير اجتماعي سنوي', points: 5 }] },
    { name: 'البيئة', items: [{ label: 'حصيلة كربونية', points: 5 }, { label: 'إجراءات مستدامة', points: 5 }] },
    { name: 'الرضا', items: [{ label: 'متوسط تقييم ≥ 4,5/5', points: 5 }, { label: 'تقييم 4,0–4,4/5', points: 3 }, { label: 'تقييم < 4,0/5', points: 0 }] },
  ],
  ptsLabel: 'نقطة',
  badgesTitle: 'الشارات',
  badgesIntro: 'حسب النقاط المحصلة، يحصل المنتج على شارة ظاهرة في ملفه:',
  badges: [
    { range: '90–100', label: 'معتمد ذهبي', icon: '🏆', desc: 'تميّز — منتج مثالي في جميع المعايير' },
    { range: '75–89', label: 'معتمد فضي', icon: '🥈', desc: 'جيد جداً — منتج موثوق وشفاف' },
    { range: '60–74', label: 'موثّق برونزي', icon: '🥉', desc: 'مطابق — منتج مصادق عليه، في تقدم' },
    { range: '< 60', label: 'غير مؤهل', icon: '⚠️', desc: 'نقاط غير كافية — يلزم التحسين' },
  ],
  scoreWord: 'النقاط',
  penaltiesTitle: 'نظام العقوبات',
  penaltiesIntro: 'يمكن تخفيض النقاط في حالة الإخلال:',
  penalties: [
    { event: 'شهادة منتهية الصلاحية', points: -10 },
    { event: 'شكوى مشترٍ', points: -5 },
    { event: 'نزاع غير محلول', points: -20 },
    { event: 'وثيقة مزورة مكتشفة', points: -50, suspend: true },
  ],
  suspension: '+ إيقاف',
  updateTitle: 'تحديث تلقائي',
  updateIntro: 'تُعاد حساب النقاط تلقائياً:',
  updateItems: ['كل أسبوع (مهمة مجدولة)', 'بعد كل مصادقة على شهادة', 'بعد كل تقييم جديد من مشترٍ', 'بعد كل تغيير في الشهادات'],
  tipsTitle: 'كيف تحسّن نقاطك',
  tipsIntro: 'نصائح للمنتجين الراغبين في الترقي:',
  tips: [
    'أضف جميع شهاداتك واجعلها مصادقاً عليها',
    'أدخل إحداثيات GPS لمزرعتك',
    'ارفع 5 صور على الأقل لمزرعتك',
    'أضف فيديو تقديمياً (+5 نقاط)',
    'وثّق الأجور المدفوعة لموظفيك',
    'حرّر حصيلة كربونية وتقريراً بيئياً',
    'حافظ على متوسط تقييم أعلى من 4,5/5',
  ],
  ctaTitle: 'هل أنت مستعد للشراء بثقة؟',
  ctaText: 'تصفح كتالوج منتجينا الموثّقين.',
  ctaButton: 'عرض الكتالوج',
};

export const SCORE_CONTENT: PerLocale<ScoreContent> = { fr, en, es, pt, ar };
