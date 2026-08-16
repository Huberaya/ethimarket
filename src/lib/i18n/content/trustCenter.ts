/** Contenus multilingues — Trust Center. */
import type { PerLocale } from './types';

export type TrustCenterContent = {
  seoTitle: string;
  seoDesc: string;
  title: string;
  intro: string;
  rule1Title: string;
  rule1Strong: string;
  rule1Text: string;
  ladderTitle: string;
  ladderIntro: string;
  ladder: { level: number; title: string; detail: string }[];
  processTitle: string;
  processIntro1: string;
  processPoints: string[];
  limitsTitle: string;
  limits: string[];
  engagementTitle: string;
  engagementText: string;
};

const fr: TrustCenterContent = {
  seoTitle: 'Trust Center — Comment nous vérifions | EthiMarket',
  seoDesc: "Pourquoi EthiMarket considère qu'un produit est responsable : hiérarchie des preuves, processus de vérification auprès des organismes certificateurs, et nos limites en toute transparence.",
  title: 'Trust Center',
  intro: "Pourquoi EthiMarket considère-t-il qu'un produit est responsable ? Voici exactement comment nous le décidons — et ce que nous ne pouvons pas garantir.",
  rule1Title: 'Notre règle n°1',
  rule1Strong: 'Chaque information affichée a une source, et le statut de vérification est calculé par la plateforme — jamais déclaré par le fournisseur.',
  rule1Text: "Quand une allégation n'a pas de preuve indépendante, nous ne la cachons pas et nous ne l'embellissons pas : nous affichons « ⚠️ Déclaration fournisseur — preuve indépendante non trouvée. » EthiMarket refuse d'être un site qui répète les arguments marketing des fournisseurs.",
  ladderTitle: 'La hiérarchie des preuves',
  ladderIntro: "Toutes les preuves ne se valent pas. Une allégation n'obtient le statut « Certifié » que si elle est appuyée par une preuve de niveau 4 ou 5, valide et non expirée.",
  ladder: [
    { level: 5, title: "Certificat vérifié auprès de l'organisme", detail: "Nous avons contacté l'organisme certificateur (Ecocert, FLOCERT, Control Union, Africert…) qui a confirmé l'authenticité et la validité du certificat. C'est le seul niveau qui donne le statut « ✅ Certifié »." },
    { level: 4, title: "Certificat déposé / rapport d'audit indépendant", detail: "Un certificat officiel ou un rapport d'audit tiers (SA8000, BSCI, SMETA…) est au dossier. La confirmation auprès de l'émetteur est en cours : statut « 🕓 Vérification en cours »." },
    { level: 3, title: 'Contrôle documentaire EthiMarket', detail: "Notre équipe a examiné les documents (factures matières, contrats, photos d'atelier, registres) sans confirmation externe. Ne suffit pas pour « Certifié »." },
    { level: 2, title: 'Document fournisseur non contrôlé', detail: "Le fournisseur a déposé un document que nous n'avons pas encore examiné." },
    { level: 1, title: 'Simple déclaration', detail: 'Le fournisseur affirme, sans document. Statut affiché : « ⚠️ Déclaration fournisseur — preuve indépendante non trouvée. »' },
  ],
  processTitle: 'Comment nous vérifions',
  processIntro1: "Notre annuaire interne référence plus de 55 organismes certificateurs dans le monde (Europe, Afrique, Asie, Amérique latine), avec leurs canaux de vérification officiels : API, registres publics, e-mail, formulaires, téléphone.",
  processPoints: [
    "Chaque certificat déposé est confronté à l'organisme émetteur (numéro, titulaire, périmètre, dates).",
    'Chaque vérification est horodatée et journalisée dans un registre immuable : personne, pas même un administrateur, ne peut effacer l\'historique.',
    "À l'expiration d'un certificat, le statut de l'allégation est automatiquement rétrogradé — un produit ne reste jamais « certifié » avec un certificat périmé.",
    "Si un organisme infirme un certificat, l'allégation passe en « ❌ Non confirmé » et le fournisseur est notifié.",
  ],
  limitsTitle: 'Nos limites, en toute transparence',
  limits: [
    "« Certifié » signifie que le certificat est authentique et valide — pas que nous avons visité l'usine nous-mêmes.",
    "Les estimations d'impact (CO2, eau) issues de modèles sectoriels sont toujours étiquetées comme telles, jamais présentées comme des mesures.",
    "Une « déclaration fournisseur » n'est pas nécessairement fausse — elle est simplement non prouvée à ce jour.",
    'La vérification auprès de certains organismes peut prendre plusieurs semaines ; le statut « vérification en cours » reflète ce délai réel.',
  ],
  engagementTitle: 'Notre engagement',
  engagementText: 'Si vous repérez une allégation douteuse, signalez-la : chaque signalement déclenche un contrôle documenté. La confiance ne se décrète pas, elle se prouve — source par source.',
};

const en: TrustCenterContent = {
  seoTitle: 'Trust Center — How we verify | EthiMarket',
  seoDesc: 'Why EthiMarket considers a product responsible: the evidence hierarchy, the verification process with certification bodies, and our limits in full transparency.',
  title: 'Trust Center',
  intro: 'Why does EthiMarket consider a product responsible? Here is exactly how we decide — and what we cannot guarantee.',
  rule1Title: 'Our rule #1',
  rule1Strong: 'Every displayed piece of information has a source, and the verification status is computed by the platform — never declared by the supplier.',
  rule1Text: 'When a claim has no independent evidence, we neither hide it nor embellish it: we display "⚠️ Supplier declaration — no independent evidence found." EthiMarket refuses to be a site that repeats suppliers\' marketing arguments.',
  ladderTitle: 'The evidence hierarchy',
  ladderIntro: 'Not all evidence is equal. A claim only gets the "Certified" status if it is backed by level 4 or 5 evidence, valid and not expired.',
  ladder: [
    { level: 5, title: 'Certificate verified with the body', detail: 'We contacted the certification body (Ecocert, FLOCERT, Control Union, Africert…) which confirmed the authenticity and validity of the certificate. This is the only level that grants the "✅ Certified" status.' },
    { level: 4, title: 'Filed certificate / independent audit report', detail: 'An official certificate or third-party audit report (SA8000, BSCI, SMETA…) is on file. Confirmation with the issuer is in progress: status "🕓 Verification in progress".' },
    { level: 3, title: 'EthiMarket documentary review', detail: 'Our team examined the documents (material invoices, contracts, workshop photos, registers) without external confirmation. Not sufficient for "Certified".' },
    { level: 2, title: 'Unreviewed supplier document', detail: 'The supplier filed a document that we have not yet examined.' },
    { level: 1, title: 'Simple declaration', detail: 'The supplier asserts, without a document. Displayed status: "⚠️ Supplier declaration — no independent evidence found."' },
  ],
  processTitle: 'How we verify',
  processIntro1: 'Our internal directory references more than 55 certification bodies worldwide (Europe, Africa, Asia, Latin America), with their official verification channels: API, public registers, email, forms, phone.',
  processPoints: [
    'Each filed certificate is checked against the issuing body (number, holder, scope, dates).',
    'Each verification is timestamped and logged in an immutable register: nobody, not even an administrator, can erase the history.',
    'When a certificate expires, the claim status is automatically downgraded — a product never stays "certified" with an expired certificate.',
    'If a body disproves a certificate, the claim becomes "❌ Not confirmed" and the supplier is notified.',
  ],
  limitsTitle: 'Our limits, in full transparency',
  limits: [
    '"Certified" means the certificate is authentic and valid — not that we visited the factory ourselves.',
    'Impact estimates (CO2, water) from sector models are always labeled as such, never presented as measurements.',
    'A "supplier declaration" is not necessarily false — it is simply unproven to date.',
    'Verification with some bodies can take several weeks; the "verification in progress" status reflects this real delay.',
  ],
  engagementTitle: 'Our commitment',
  engagementText: 'If you spot a dubious claim, report it: every report triggers a documented review. Trust is not decreed, it is proven — source by source.',
};

const es: TrustCenterContent = {
  seoTitle: 'Trust Center — Cómo verificamos | EthiMarket',
  seoDesc: 'Por qué EthiMarket considera que un producto es responsable: jerarquía de pruebas, proceso de verificación con los organismos certificadores y nuestros límites con total transparencia.',
  title: 'Trust Center',
  intro: '¿Por qué EthiMarket considera que un producto es responsable? Aquí está exactamente cómo lo decidimos — y lo que no podemos garantizar.',
  rule1Title: 'Nuestra regla n°1',
  rule1Strong: 'Cada información mostrada tiene una fuente, y el estado de verificación es calculado por la plataforma — nunca declarado por el proveedor.',
  rule1Text: 'Cuando una alegación no tiene prueba independiente, no la ocultamos ni la embellecemos: mostramos «⚠️ Declaración del proveedor — no se encontró prueba independiente.» EthiMarket se niega a ser un sitio que repite los argumentos de marketing de los proveedores.',
  ladderTitle: 'La jerarquía de las pruebas',
  ladderIntro: 'No todas las pruebas valen lo mismo. Una alegación solo obtiene el estado «Certificado» si está respaldada por una prueba de nivel 4 o 5, válida y no vencida.',
  ladder: [
    { level: 5, title: 'Certificado verificado con el organismo', detail: 'Contactamos al organismo certificador (Ecocert, FLOCERT, Control Union, Africert…) que confirmó la autenticidad y validez del certificado. Es el único nivel que otorga el estado «✅ Certificado».' },
    { level: 4, title: 'Certificado depositado / informe de auditoría independiente', detail: 'Un certificado oficial o un informe de auditoría de terceros (SA8000, BSCI, SMETA…) está en el expediente. La confirmación con el emisor está en curso: estado «🕓 Verificación en curso».' },
    { level: 3, title: 'Control documental EthiMarket', detail: 'Nuestro equipo examinó los documentos (facturas de materias, contratos, fotos de taller, registros) sin confirmación externa. No es suficiente para «Certificado».' },
    { level: 2, title: 'Documento del proveedor no controlado', detail: 'El proveedor depositó un documento que aún no hemos examinado.' },
    { level: 1, title: 'Simple declaración', detail: 'El proveedor afirma, sin documento. Estado mostrado: «⚠️ Declaración del proveedor — no se encontró prueba independiente.»' },
  ],
  processTitle: 'Cómo verificamos',
  processIntro1: 'Nuestro directorio interno referencia más de 55 organismos certificadores en el mundo (Europa, África, Asia, América Latina), con sus canales de verificación oficiales: API, registros públicos, correo electrónico, formularios, teléfono.',
  processPoints: [
    'Cada certificado depositado se contrasta con el organismo emisor (número, titular, alcance, fechas).',
    'Cada verificación está fechada y registrada en un registro inmutable: nadie, ni siquiera un administrador, puede borrar el historial.',
    'Al vencer un certificado, el estado de la alegación se degrada automáticamente — un producto nunca permanece «certificado» con un certificado vencido.',
    'Si un organismo desmiente un certificado, la alegación pasa a «❌ No confirmado» y se notifica al proveedor.',
  ],
  limitsTitle: 'Nuestros límites, con total transparencia',
  limits: [
    '«Certificado» significa que el certificado es auténtico y válido — no que hayamos visitado la fábrica nosotros mismos.',
    'Las estimaciones de impacto (CO2, agua) de modelos sectoriales siempre están etiquetadas como tales, nunca presentadas como mediciones.',
    'Una «declaración del proveedor» no es necesariamente falsa — simplemente no está probada hasta la fecha.',
    'La verificación con algunos organismos puede tardar varias semanas; el estado «verificación en curso» refleja ese plazo real.',
  ],
  engagementTitle: 'Nuestro compromiso',
  engagementText: 'Si detecta una alegación dudosa, repórtela: cada reporte desencadena un control documentado. La confianza no se decreta, se prueba — fuente por fuente.',
};

const pt: TrustCenterContent = {
  seoTitle: 'Trust Center — Como verificamos | EthiMarket',
  seoDesc: 'Por que a EthiMarket considera um produto responsável: hierarquia de provas, processo de verificação com os organismos certificadores e nossos limites com total transparência.',
  title: 'Trust Center',
  intro: 'Por que a EthiMarket considera um produto responsável? Aqui está exatamente como decidimos — e o que não podemos garantir.',
  rule1Title: 'Nossa regra n°1',
  rule1Strong: 'Cada informação exibida tem uma fonte, e o status de verificação é calculado pela plataforma — nunca declarado pelo fornecedor.',
  rule1Text: 'Quando uma alegação não tem prova independente, não a escondemos nem a embelezamos: exibimos «⚠️ Declaração do fornecedor — nenhuma prova independente encontrada.» A EthiMarket se recusa a ser um site que repete os argumentos de marketing dos fornecedores.',
  ladderTitle: 'A hierarquia das provas',
  ladderIntro: 'Nem todas as provas são iguais. Uma alegação só obtém o status «Certificado» se estiver apoiada por uma prova de nível 4 ou 5, válida e não expirada.',
  ladder: [
    { level: 5, title: 'Certificado verificado junto ao organismo', detail: 'Contatamos o organismo certificador (Ecocert, FLOCERT, Control Union, Africert…) que confirmou a autenticidade e a validade do certificado. É o único nível que concede o status «✅ Certificado».' },
    { level: 4, title: 'Certificado depositado / relatório de auditoria independente', detail: 'Um certificado oficial ou relatório de auditoria de terceiros (SA8000, BSCI, SMETA…) está no dossiê. A confirmação junto ao emissor está em andamento: status «🕓 Verificação em andamento».' },
    { level: 3, title: 'Controle documental EthiMarket', detail: 'Nossa equipe examinou os documentos (faturas de matérias-primas, contratos, fotos de oficina, registros) sem confirmação externa. Não é suficiente para «Certificado».' },
    { level: 2, title: 'Documento do fornecedor não controlado', detail: 'O fornecedor depositou um documento que ainda não examinamos.' },
    { level: 1, title: 'Simples declaração', detail: 'O fornecedor afirma, sem documento. Status exibido: «⚠️ Declaração do fornecedor — nenhuma prova independente encontrada.»' },
  ],
  processTitle: 'Como verificamos',
  processIntro1: 'Nosso diretório interno referencia mais de 55 organismos certificadores no mundo (Europa, África, Ásia, América Latina), com seus canais de verificação oficiais: API, registros públicos, e-mail, formulários, telefone.',
  processPoints: [
    'Cada certificado depositado é confrontado com o organismo emissor (número, titular, escopo, datas).',
    'Cada verificação é datada e registrada em um registro imutável: ninguém, nem mesmo um administrador, pode apagar o histórico.',
    'Quando um certificado expira, o status da alegação é automaticamente rebaixado — um produto nunca permanece «certificado» com um certificado vencido.',
    'Se um organismo desmentir um certificado, a alegação passa a «❌ Não confirmado» e o fornecedor é notificado.',
  ],
  limitsTitle: 'Nossos limites, com total transparência',
  limits: [
    '«Certificado» significa que o certificado é autêntico e válido — não que visitamos a fábrica nós mesmos.',
    'As estimativas de impacto (CO2, água) de modelos setoriais são sempre rotuladas como tais, nunca apresentadas como medições.',
    'Uma «declaração do fornecedor» não é necessariamente falsa — está simplesmente não comprovada até o momento.',
    'A verificação com alguns organismos pode levar várias semanas; o status «verificação em andamento» reflete esse prazo real.',
  ],
  engagementTitle: 'Nosso compromisso',
  engagementText: 'Se você identificar uma alegação duvidosa, denuncie: cada denúncia aciona um controle documentado. A confiança não se decreta, se prova — fonte por fonte.',
};

const ar: TrustCenterContent = {
  seoTitle: 'مركز الثقة — كيف نتحقق | EthiMarket',
  seoDesc: 'لماذا تعتبر EthiMarket منتجاً ما مسؤولاً: تسلسل الأدلة، عملية التحقق مع هيئات التصديق، وحدودنا بكل شفافية.',
  title: 'مركز الثقة',
  intro: 'لماذا تعتبر EthiMarket منتجاً ما مسؤولاً؟ إليك بالضبط كيف نقرر ذلك — وما لا يمكننا ضمانه.',
  rule1Title: 'قاعدتنا الأولى',
  rule1Strong: 'كل معلومة معروضة لها مصدر، وحالة التحقق تُحسب بواسطة المنصة — ولا يعلنها المورد أبداً.',
  rule1Text: 'عندما لا يكون لادعاء ما دليل مستقل، لا نخفيه ولا نجمّله: نعرض «⚠️ إعلان المورد — لم يُعثر على دليل مستقل.» ترفض EthiMarket أن تكون موقعاً يردد الحجج التسويقية للموردين.',
  ladderTitle: 'تسلسل الأدلة',
  ladderIntro: 'ليست كل الأدلة متساوية. لا يحصل الادعاء على حالة «معتمد» إلا إذا كان مدعوماً بدليل من المستوى 4 أو 5، صالح وغير منتهي الصلاحية.',
  ladder: [
    { level: 5, title: 'شهادة تم التحقق منها لدى الهيئة', detail: 'اتصلنا بهيئة التصديق (Ecocert، FLOCERT، Control Union، Africert…) التي أكدت صحة الشهادة وسريانها. هذا هو المستوى الوحيد الذي يمنح حالة «✅ معتمد».' },
    { level: 4, title: 'شهادة مودعة / تقرير تدقيق مستقل', detail: 'شهادة رسمية أو تقرير تدقيق من طرف ثالث (SA8000، BSCI، SMETA…) موجود في الملف. التأكيد لدى الجهة المصدرة جارٍ: الحالة «🕓 التحقق جارٍ».' },
    { level: 3, title: 'مراجعة وثائقية من EthiMarket', detail: 'فحص فريقنا الوثائق (فواتير المواد، العقود، صور الورشة، السجلات) دون تأكيد خارجي. لا يكفي لحالة «معتمد».' },
    { level: 2, title: 'وثيقة مورد غير مراجعة', detail: 'أودع المورد وثيقة لم نفحصها بعد.' },
    { level: 1, title: 'مجرد إعلان', detail: 'يؤكد المورد، بدون وثيقة. الحالة المعروضة: «⚠️ إعلان المورد — لم يُعثر على دليل مستقل.»' },
  ],
  processTitle: 'كيف نتحقق',
  processIntro1: 'يضم دليلنا الداخلي أكثر من 55 هيئة تصديق حول العالم (أوروبا، إفريقيا، آسيا، أمريكا اللاتينية)، مع قنوات التحقق الرسمية الخاصة بها: API، سجلات عامة، بريد إلكتروني، نماذج، هاتف.',
  processPoints: [
    'كل شهادة مودعة تُقارن مع الهيئة المصدرة (الرقم، صاحب الشهادة، النطاق، التواريخ).',
    'كل عملية تحقق مؤرخة ومسجلة في سجل غير قابل للتغيير: لا أحد، ولا حتى المسؤول، يمكنه محو التاريخ.',
    'عند انتهاء صلاحية شهادة، تُخفض حالة الادعاء تلقائياً — لا يبقى منتج «معتمداً» بشهادة منتهية أبداً.',
    'إذا نفت هيئة شهادةً ما، ينتقل الادعاء إلى «❌ غير مؤكد» ويتم إخطار المورد.',
  ],
  limitsTitle: 'حدودنا، بكل شفافية',
  limits: [
    '«معتمد» يعني أن الشهادة أصلية وصالحة — وليس أننا زرنا المصنع بأنفسنا.',
    'تقديرات الأثر (CO2، الماء) المستمدة من نماذج قطاعية تُوسم دائماً على هذا النحو، ولا تُقدم أبداً كقياسات.',
    '«إعلان المورد» ليس بالضرورة خاطئاً — إنه ببساطة غير مثبت حتى الآن.',
    'قد يستغرق التحقق لدى بعض الهيئات عدة أسابيع؛ حالة «التحقق جارٍ» تعكس هذه المدة الحقيقية.',
  ],
  engagementTitle: 'التزامنا',
  engagementText: 'إذا لاحظت ادعاءً مشكوكاً فيه، أبلغ عنه: كل بلاغ يطلق مراجعة موثقة. الثقة لا تُفرض، بل تُثبت — مصدراً بمصدر.',
};

export const TRUST_CENTER_CONTENT: PerLocale<TrustCenterContent> = { fr, en, es, pt, ar };
