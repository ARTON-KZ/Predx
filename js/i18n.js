/* Predx — i18n (Spanish default, English optional) */
(function () {
  const LANG_KEY = 'predx_lang';

  const T = {
    /* ── NAVBAR ── */
    'nav-how':   { es: 'Cómo Funciona',  en: 'How It Works' },
    'nav-plans': { es: 'Planes',         en: 'Plans' },
    'nav-faq':   { es: 'Preguntas',      en: 'FAQ' },
    'nav-login': { es: 'Iniciar Sesión', en: 'Login' },
    'nav-start': { es: 'Comenzar',       en: 'Get Started' },

    /* ── HERO ── */
    'hero-eyebrow': {
      es: 'Confiado por más de 2,400 miembros en todo el mundo',
      en: 'Trusted by 2,400+ members worldwide',
    },
    'hero-title': {
      es: 'GANA MÁS.<br /><span class="chrome">PREDICE MEJOR.</span>',
      en: 'WIN MORE.<br /><span class="chrome">PREDICT SMARTER.</span>',
    },
    'hero-sub': {
      es: 'Predicciones diarias de fútbol profesionales respaldadas por análisis de datos. Únete a nuestra comunidad VIP y empieza a ganar de forma consistente.',
      en: 'Professional daily soccer predictions backed by data analysis. Join our VIP community and start cashing out consistently.',
    },
    'hero-btn-plans': { es: 'Ver Planes',    en: 'View Plans' },
    'hero-btn-how':   { es: 'Cómo Funciona', en: 'How It Works' },

    /* ── STATS ── */
    'stat-winrate':     { es: 'Tasa de Éxito',           en: 'Win Rate' },
    'stat-predictions': { es: 'Predicciones Realizadas', en: 'Predictions Made' },
    'stat-members':     { es: 'Miembros Activos',        en: 'Active Members' },
    'stat-years':       { es: 'Años Operando',           en: 'Years Running' },

    /* ── HOW IT WORKS ── */
    'how-eyebrow': { es: 'Proceso', en: 'Process' },
    'how-title': {
      es: 'CÓMO <span class="chrome">FUNCIONA</span>',
      en: 'HOW IT <span class="chrome">WORKS</span>',
    },
    'how-sub': {
      es: 'Únete en tres sencillos pasos y empieza a recibir predicciones ganadoras hoy.',
      en: 'Join in three simple steps and start receiving winning predictions today.',
    },
    'step1-title': { es: 'Elige Tu Plan',         en: 'Choose Your Plan' },
    'step1-desc':  { es: 'Selecciona el plan Básico o Premium que mejor se adapte a tus necesidades. Ambos incluyen predicciones diarias de nuestros analistas expertos.', en: 'Select the Basic or Premium plan that suits your needs. Both come with expert daily predictions from our analysts.' },
    'step2-title': { es: 'Paga de Forma Segura',  en: 'Pay Securely' },
    'step2-desc':  { es: 'Completa tu pago de forma segura mediante criptomoneda a través de nuestro procesador de pagos de confianza. Rápido y anónimo.', en: 'Complete your payment securely using cryptocurrency via our trusted payment processor. Fast and anonymous.' },
    'step3-title': { es: 'Únete al Telegram VIP', en: 'Join VIP Telegram' },
    'step3-desc':  { es: 'Obtén acceso instantáneo a nuestro grupo privado de Telegram. Recibe predicciones verificadas antes de cada partido.', en: 'Get instant access to our private Telegram group. Receive verified predictions before every match kicks off.' },

    /* ── PLANS ── */
    'plans-eyebrow': { es: 'Precios', en: 'Pricing' },
    'plans-title': {
      es: 'ELIGE TU <span class="chrome">PLAN</span>',
      en: 'CHOOSE YOUR <span class="chrome">PLAN</span>',
    },
    'plans-sub':  { es: 'Todos los planes incluyen acceso VIP a Telegram. Actualiza cuando quieras.', en: 'All plans include VIP Telegram access. Upgrade anytime.' },
    'plan-badge': { es: 'Más Popular', en: 'Most Popular' },
    'basic-period': { es: '/mes', en: '/month' },
    'prem-period':  { es: '/mes', en: '/month' },
    'basic-f1':  { es: '2 predicciones de fútbol diarias',       en: '2 daily soccer predictions' },
    'basic-f2':  { es: 'Análisis de partidos del fin de semana', en: 'Weekend match analysis' },
    'basic-f3':  { es: 'Acceso VIP privado',          en: 'Private VIP access' },
    'basic-f4':  { es: 'Equipo de analistas expertos',           en: 'Expert analyst team' },
    'basic-btn': { es: 'Obtener Plan Básico',  en: 'Get Basic Plan' },
    'prem-f1':   { es: '6 predicciones de partidos diarias',     en: '6 daily match predictions' },
    'prem-f2':   { es: 'Análisis de partidos del fin de semana', en: 'Weekend match analysis' },
    'prem-f3':   { es: 'Predicciones enviadas por correo',       en: 'Email prediction delivery' },
    'prem-f4':   { es: 'Acceso al foro de la comunidad',         en: 'Community forum access' },
    'prem-f5':   { es: 'Acceso VIP privado',          en: 'Private VIP access' },
    'prem-f6':   { es: 'Soporte experto prioritario',            en: 'Priority expert support' },
    'prem-btn':  { es: 'Obtener Plan Premium', en: 'Get Premium Plan' },
    'plans-note':{ es: 'Pagos procesados de forma segura mediante criptomoneda. Acceso otorgado en minutos tras la confirmación del pago.', en: 'Payments processed securely via cryptocurrency. Access granted within minutes of payment confirmation.' },

    /* ── FAQ ── */
    'faq-eyebrow': { es: 'Preguntas Frecuentes', en: 'FAQ' },
    'faq-title': {
      es: 'PREGUNTAS <span class="chrome">FRECUENTES</span>',
      en: 'COMMON <span class="chrome">QUESTIONS</span>',
    },
    'faq1-q': { es: '¿Qué tan precisas son sus predicciones?', en: 'How accurate are your predictions?' },
    'faq1-a': { es: 'Nuestro sistema analiza años de datos de partidos y el rendimiento actual de los equipos. Garantizamos victorias y nuestras predicciones superan consistentemente los promedios de la industria. La mayoría de los usuarios ven resultados mejorados en su primera semana.', en: 'Our system analyzes years of match data and current team performance. We guarantee wins and our predictions consistently outperform industry averages. Most users see improved results within their first week.' },
    'faq2-q': { es: '¿Está segura mi información de pago?',    en: 'Is my payment information safe?' },
    'faq2-a': { es: 'Usamos encriptación de nivel bancario para todas las transacciones. Tus datos financieros nunca tocan nuestros servidores directamente. Nos asociamos con procesadores de pago de confianza para mantener todo seguro.', en: 'We use bank-level encryption for all transactions. Your financial data never touches our servers directly. We partner with trusted payment processors to keep everything secure.' },
    'faq3-q': { es: '¿Cuándo recibo las predicciones?',        en: 'When do I get predictions?' },
    'faq3-a': { es: 'Las predicciones llegan cada mañana antes de los partidos del día. Los miembros Premium reciben alertas en vivo cuando las cuotas cambian significativamente. Tendrás tiempo suficiente para colocar tus apuestas.', en: "Predictions arrive each morning before the day's matches. Premium members get live alerts when odds shift significantly. You'll have plenty of time to place your bets." },
    'faq4-q': { es: '¿Puedo cancelar en cualquier momento?',   en: 'Can I cancel anytime?' },
    'faq4-a': { es: 'Sí. Cancela tu suscripción cuando quieras sin penalizaciones. Tu acceso continúa hasta el final de tu período de facturación.', en: 'Yes. Cancel your subscription whenever you want with no penalties. Your access continues through the end of your billing period.' },
    'faq5-q': { es: '¿Qué pasa si las predicciones fallan?',   en: 'What if predictions miss?' },
    'faq5-a': { es: 'Nos enfocamos en encontrar ventajas estadísticas y garantías. Nuestro historial habla por sí mismo — si ocurre alguna pérdida, serás ampliamente compensado.', en: 'We focus on finding statistical edges and guarantees. Our track record speaks for itself — if any loss occurs, you will be greatly compensated.' },

    /* ── CTA ── */
    'cta-eyebrow': { es: '¿Listo para Ganar?', en: 'Ready to Win?' },
    'cta-title': {
      es: 'EMPIEZA A PREDECIR<br /><span class="chrome">CON INTELIGENCIA HOY</span>',
      en: 'START PREDICTING<br /><span class="chrome">SMARTER TODAY</span>',
    },
    'cta-sub':     { es: 'Únete a más de 2,400 miembros que confían en Predx para sus predicciones diarias. Cancela en cualquier momento.', en: 'Join over 2,400 members who trust Predx for their daily match predictions. Cancel anytime.' },
    'cta-basic':   { es: 'Básico — $150/mes',  en: 'Basic — $150/mo' },
    'cta-premium': { es: 'Premium — $300/mes', en: 'Premium — $300/mo' },

    /* ── FOOTER ── */
    'footer-tagline':    { es: 'Servicio profesional de predicciones deportivas. Análisis experto. Selecciones diarias. Comunidad VIP.', en: 'Professional sports prediction service. Expert analysis. Daily picks. VIP community.' },
    'footer-col1':       { es: 'Sitio',              en: 'Site' },
    'footer-how':        { es: 'Cómo Funciona',      en: 'How It Works' },
    'footer-plans':      { es: 'Planes y Precios',   en: 'Plans & Pricing' },
    'footer-faq':        { es: 'Preguntas',          en: 'FAQ' },
    'footer-col2':       { es: 'Cuenta',             en: 'Account' },
    'footer-login':      { es: 'Inicio de Sesión',   en: 'Member Login' },
    'footer-basic':      { es: 'Comprar Básico',     en: 'Buy Basic' },
    'footer-premium':    { es: 'Comprar Premium',    en: 'Buy Premium' },
    'footer-col3':       { es: 'Comunidad',          en: 'Community' },
    'footer-telegram':   { es: 'Grupo de Telegram',  en: 'Telegram Group' },
    'footer-copy':       { es: '© 2025 Predx. Todos los derechos reservados.', en: '© 2025 Predx. All rights reserved.' },
    'footer-disclaimer': { es: 'Las apuestas deportivas implican riesgo financiero. Predx proporciona análisis y predicciones únicamente con fines informativos. Por favor, apuesta de forma responsable.', en: 'Sports betting involves financial risk. Predx provides analysis and predictions for informational purposes only. Please bet responsibly.' },

    /* ── PAYMENT PAGE ── */
    'pay-order':        { es: 'Tu Pedido',              en: 'Your Order' },
    'pay-secure-title': { es: 'Pago Seguro con Cripto', en: 'Secure Crypto Payment' },
    'pay-secure-desc':  { es: 'Los pagos se procesan de forma segura a través de Paymento. Aceptamos Bitcoin, USDT y otras criptomonedas principales. Tu transacción es privada y está protegida.', en: 'Payments are processed securely via Paymento. We accept Bitcoin, USDT and other major cryptocurrencies. Your transaction is private and protected.' },
    'pay-access':       { es: 'Acceso otorgado en minutos tras la confirmación', en: 'Access granted within minutes of confirmation' },
    'pay-methods-title':{ es: 'Paga desde cualquier wallet', en: 'Pay from any wallet' },
    'pay-methods-desc': { es: 'Elige Bitcoin, Litecoin, Dogecoin o Bitcoin Cash: la pasarela te muestra una dirección y un código QR. Copia la dirección o escanea el QR y envía el monto exacto desde cualquier wallet o exchange. No necesitas conectar ninguna wallet.', en: 'Choose Bitcoin, Litecoin, Dogecoin or Bitcoin Cash: the gateway shows you an address and a QR code. Copy the address or scan the QR and send the exact amount from any wallet or exchange. No wallet connection needed.' },
    'pay-title': {
      es: 'COMPLETAR <span class="chrome">PAGO</span>',
      en: 'COMPLETE <span class="chrome">CHECKOUT</span>',
    },
    'pay-sub':         { es: 'Ingresa tus datos a continuación para continuar a la página de pago.', en: 'Enter your details below to continue to the payment page.' },
    'pay-name-label':  { es: 'Nombre Completo',    en: 'Full Name' },
    'pay-name-ph':     { es: 'Juan Pérez',          en: 'John Doe' },
    'pay-name-error':  { es: 'Por favor ingresa tu nombre completo.', en: 'Please enter your full name.' },
    'pay-email-label': { es: 'Correo Electrónico',  en: 'Email Address' },
    'pay-email-ph':    { es: 'tu@ejemplo.com',       en: 'you@example.com' },
    'pay-email-error': { es: 'Por favor ingresa un correo electrónico válido.', en: 'Please enter a valid email address.' },
    'pay-btn':         { es: 'Pagar con Cripto',    en: 'Pay with Crypto' },
    'pay-processing':  { es: 'Procesando...',        en: 'Processing...' },
    'pay-terms':       { es: 'Al continuar, aceptas nuestros términos. Serás redirigido a una página de pago segura. Regresa aquí después del pago para confirmar.', en: 'By continuing, you agree to our terms. You will be redirected to a secure payment page. Return here after payment to confirm.' },
    'pay-back':        { es: '← Volver al inicio',  en: '← Back to home' },
    'pay-period':      { es: '/ mes',               en: '/ month' },

    /* ── SUCCESS PAGE ── */
    'suc-pending-h':    { es: 'CONFIRMANDO PAGO', en: 'CONFIRMING PAYMENT' },
    'suc-pending-p':    { es: 'Esperando confirmación de blockchain. Puede tomar de unos minutos hasta una hora según la criptomoneda. Puedes cerrar esta página — tu pago se registrará automáticamente.', en: 'Waiting for blockchain confirmation. This can take from a few minutes up to an hour depending on the cryptocurrency. You can close this page — your payment will register automatically.' },
    'suc-pending-info': { es: 'Tras la confirmación, únete al grupo de Telegram para recibir tu acceso. Si cierras esta página, puedes volver cuando quieras para ver el estado.', en: 'Once confirmed, join the Telegram group to receive your access. If you close this page you can come back anytime to check the status.' },
    'suc-still-pending':{ es: 'Aún esperando confirmación. Es seguro cerrar esta página — tu acceso se otorgará en cuanto se confirme el pago.', en: 'Still waiting for confirmation. It is safe to close this page — your access will be granted as soon as the payment confirms.' },
    'suc-awaiting-h':   { es: 'ESPERANDO TU PAGO', en: 'AWAITING YOUR PAYMENT' },
    'suc-awaiting-p':   { es: 'Aún no detectamos tu transacción. Completa el pago en la pasarela — esta página se actualizará automáticamente.', en: "We haven't detected your transaction yet. Complete the payment on the gateway — this page updates automatically." },
    'suc-return-gateway': { es: 'Volver a la pasarela de pago', en: 'Return to payment gateway' },
    'suc-verify-btn':      { es: 'Ya pagué — Verificar ahora', en: "I've paid — Verify now" },
    'suc-verify-checking': { es: 'Verificando...',             en: 'Checking...' },
    'suc-verify-pending':  { es: 'Aún no detectamos tu pago. Si ya enviaste los fondos, espera unos minutos — seguimos verificando automáticamente.', en: "We haven't detected your payment yet. If you've already sent the funds, wait a few minutes — we keep verifying automatically." },
    'suc-verify-error':    { es: 'No se pudo verificar ahora mismo. Revisa tu conexión e inténtalo de nuevo.', en: "Couldn't verify right now. Check your connection and try again." },
    'suc-step1':        { es: 'Pago',         en: 'Payment' },
    'suc-step2':        { es: 'Confirmación', en: 'Confirmation' },
    'suc-step3':        { es: 'Acceso',       en: 'Access' },
    'banner-pending':      { es: 'Tienes un pago en proceso.', en: 'You have a payment in progress.' },
    'banner-pending-link': { es: 'Ver estado →',               en: 'View status →' },
    'suc-title': {
      es: 'PAGO <span class="chrome">CONFIRMADO!</span>',
      en: 'PAYMENT <span class="chrome">CONFIRMED!</span>',
    },
    'suc-sub':        { es: 'Tu suscripción está activa. Únete a nuestro grupo privado de Telegram ahora para empezar a recibir predicciones.', en: 'Your subscription is active. Join our private Telegram group now to start receiving predictions.' },
    'suc-tg-btn':     { es: 'Unirse al Grupo VIP de Telegram', en: 'Join VIP Telegram Group' },
    'suc-next-h':     { es: 'Próximo paso:', en: 'Next step:' },
    'suc-next-p': {
      es: 'Una vez que el administrador te verifique en Telegram, recibirás un <strong>código de acceso</strong> personal por DM. Úsalo para iniciar sesión en tu cuenta de miembro.',
      en: "Once the admin verifies you on Telegram, you'll receive a personal <strong>access code</strong> via DM. Use it to log into your member account.",
    },
    'suc-login-link': { es: '¿Ya tienes tu código? Inicia sesión en tu cuenta →', en: 'Already have your code? Login to your account →' },
    'suc-fail-h': {
      es: 'PAGO <span style="color:var(--red);">FALLIDO</span>',
      en: 'PAYMENT <span style="color:var(--red);">FAILED</span>',
    },
    'suc-fail-p':  { es: 'Tu pago no pudo completarse. No se han cobrado fondos. Por favor intenta de nuevo o contacta al soporte en Telegram.', en: 'Your payment could not be completed. No funds have been charged. Please try again or contact support on Telegram.' },
    'suc-retry':   { es: 'Intentar de Nuevo', en: 'Try Again' },
    'suc-support': { es: 'Contactar Soporte', en: 'Contact Support' },

    /* ── LOGIN PAGE ── */
    'login-title': {
      es: 'INICIO DE <span class="chrome">SESIÓN</span>',
      en: 'MEMBER <span class="chrome">LOGIN</span>',
    },
    'login-sub':         { es: 'Ingresa tu correo electrónico y la contraseña enviada por el administrador.', en: 'Enter your email address and the password sent to you by the admin.' },
    'login-email-label': { es: 'Correo Electrónico',    en: 'Email Address' },
    'login-email-ph':    { es: 'tu@ejemplo.com',         en: 'you@example.com' },
    'login-pass-label':  { es: 'Contraseña',             en: 'Password' },
    'login-pass-ph':     { es: 'Ingresa tu contraseña',  en: 'Enter your password' },
    'login-continue':    { es: 'Continuar',              en: 'Continue' },
    'login-no-account':  { es: '¿No tienes cuenta? Suscríbete para obtener acceso.', en: "Don't have an account? Subscribe to get access." },
    'login-view-plans':  { es: 'Ver Planes',             en: 'View Plans' },
    'login-back':        { es: '← Volver al inicio',    en: '← Back to home' },
    'otp-title': {
      es: 'VERIFICAR <span class="chrome">IDENTIDAD</span>',
      en: 'VERIFY <span class="chrome">IDENTITY</span>',
    },
    'otp-info': {
      es: 'Ingresa el <strong>código de acceso</strong> enviado por el administrador vía Telegram para completar el inicio de sesión.',
      en: 'Enter the <strong>access code</strong> sent to you by the admin via Telegram to complete sign-in.',
    },
    'otp-label':  { es: 'Código de Acceso', en: 'Access Code' },
    'otp-ph':     { es: 'ej. X7KP2MQA',    en: 'e.g. X7KP2MQA' },
    'otp-hint':   { es: 'Código de 8 caracteres de tu mensaje de Telegram', en: '8-character code from your Telegram message' },
    'otp-signin': { es: 'Iniciar Sesión',   en: 'Sign In' },

    /* ── MEMBER PAGE ── */
    'member-sub':        { es: 'Tu suscripción está activa. Consulta el grupo de Telegram para las predicciones de hoy.', en: "Your subscription is active. Check the Telegram group for today's predictions." },
    'member-tg-btn':     { es: 'Abrir Grupo de Telegram',      en: 'Open Telegram Group' },
    'member-today': {
      es: 'SELECCIONES <span class="chrome">DE HOY</span>',
      en: "TODAY'S <span class=\"chrome\">PICKS</span>",
    },
    'member-how-title':  { es: 'CÓMO USAR TU MEMBRESÍA',          en: 'HOW TO USE YOUR MEMBERSHIP' },
    'member-s1-title':   { es: 'Únete al Grupo de Telegram',       en: 'Join the Telegram Group' },
    'member-s1-desc':    { es: 'Haz clic en el botón de arriba para abrir nuestro grupo privado de Telegram donde se publican predicciones diariamente.', en: 'Click the button above to open our private Telegram group where predictions are posted daily.' },
    'member-s2-title':   { es: 'Revisa las Predicciones Diariamente', en: 'Check Predictions Daily' },
    'member-s2-desc':    { es: 'Las predicciones se publican cada mañana antes de los partidos. Siempre verifica las cuotas en tu casa de apuestas antes de apostar.', en: 'Predictions are posted every morning before matches. Always verify odds on your bookmaker before placing bets.' },
    'member-s3-title':   { es: 'Renovar Mensualmente',             en: 'Renew Monthly' },
    'member-s3-desc':    { es: 'Tu suscripción se renueva mensualmente. Contacta al administrador en Telegram para renovar antes del vencimiento y mantener el acceso.', en: 'Your subscription renews monthly. Contact the admin on Telegram to renew before expiry and retain access.' },
    'member-help-title': { es: '¿NECESITAS AYUDA?',                en: 'NEED HELP?' },
    'member-help-desc':  { es: 'Contacta al administrador directamente en Telegram para cualquier pregunta sobre tu suscripción o predicciones.', en: 'Contact the admin directly on Telegram for any questions about your subscription or predictions.' },
    'member-msg-admin':  { es: 'Mensaje al Admin',                 en: 'Message Admin' },
    'member-signout':    { es: 'Cerrar Sesión',                    en: 'Sign Out' },
    /* dynamic prediction strings */
    'member-loading':      { es: 'Cargando selecciones de hoy...', en: "Loading today's picks..." },
    'member-no-picks-h':   { es: 'Sin selecciones publicadas hoy', en: 'No picks posted yet today' },
    'member-no-picks-p':   { es: 'Vuelve más tarde — las predicciones se publican antes del mediodía.', en: 'Check back later — predictions are usually posted before noon.' },
    'member-error-picks':  { es: 'No se pudieron cargar las selecciones. Verifica tu conexión.', en: 'Could not load picks. Check your connection and try refreshing.' },
    'member-tip-label':    { es: 'Pronóstico:', en: 'Tip:' },
    'member-odds-label':   { es: 'Cuotas',      en: 'Odds' },
    'member-res-win':      { es: '✓ GANADO',   en: '✓ WIN' },
    'member-res-loss':     { es: '✗ PERDIDO',  en: '✗ LOSS' },
    'member-res-pending':  { es: '• PENDIENTE',en: '• PENDING' },
    'member-plan-basic':   { es: 'Básico',      en: 'Basic' },
    'member-plan-premium': { es: '⭐ Premium',  en: '⭐ Premium' },

    /* ── PAYMENT.JS dynamic ── */
    'pjs-basic-name':  { es: 'BÁSICO',   en: 'BASIC' },
    'pjs-prem-name':   { es: 'PREMIUM',  en: 'PREMIUM' },
    'pjs-price-basic': { es: '$150 / mes',  en: '$150 / month' },
    'pjs-price-prem':  { es: '$300 / mes',  en: '$300 / month' },
    'pjs-badge-basic': { es: 'Plan Básico', en: 'Basic Plan' },
    'pjs-badge-prem':  { es: 'Plan Premium',en: 'Premium Plan' },
    'pjs-popular':     { es: 'Más Popular', en: 'Most Popular' },
    'pjs-basic-f1':    { es: '2 predicciones de fútbol diarias',       en: '2 daily soccer predictions' },
    'pjs-basic-f2':    { es: 'Análisis de partidos del fin de semana', en: 'Weekend match analysis' },
    'pjs-basic-f3':    { es: 'Acceso VIP privado',          en: 'Private VIP access' },
    'pjs-basic-f4':    { es: 'Equipo de analistas expertos',           en: 'Expert analyst team' },
    'pjs-prem-f1':     { es: '6 predicciones de partidos diarias',     en: '6 daily match predictions' },
    'pjs-prem-f2':     { es: 'Análisis de partidos del fin de semana', en: 'Weekend match analysis' },
    'pjs-prem-f3':     { es: 'Predicciones enviadas por correo',       en: 'Email prediction delivery' },
    'pjs-prem-f4':     { es: 'Acceso al foro de la comunidad',         en: 'Community forum access' },
    'pjs-prem-f5':     { es: 'Acceso VIP privado',          en: 'Private VIP access' },
    'pjs-prem-f6':     { es: 'Soporte experto prioritario',            en: 'Priority expert support' },
    'pjs-pay-btn':     { es: 'Pagar con Cripto',   en: 'Pay with Crypto' },
    'pjs-processing':  { es: 'Procesando...',       en: 'Processing...' },
    'pjs-error-conn':  { es: 'No se puede conectar al servidor de pago. Verifica tu conexión e intenta de nuevo.', en: 'Unable to connect to payment server. Please check your connection and try again.' },
    'pjs-error-gen':   { es: 'Algo salió mal. Por favor intenta de nuevo.', en: 'Something went wrong. Please try again.' },
  };

  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'es';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
    document.dispatchEvent(new CustomEvent('predx:langchange', { detail: { lang } }));
  }

  function t(key) {
    const lang = getLang();
    return T[key] ? (T[key][lang] !== undefined ? T[key][lang] : (T[key].en || key)) : key;
  }

  function applyLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (T[k] && T[k][lang] !== undefined) el.textContent = T[k][lang];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.dataset.i18nHtml;
      if (T[k] && T[k][lang] !== undefined) el.innerHTML = T[k][lang];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const k = el.dataset.i18nPlaceholder;
      if (T[k] && T[k][lang] !== undefined) el.placeholder = T[k][lang];
    });
    document.documentElement.lang = lang;
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'es' ? 'English' : 'Español';
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getLang());
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', () => setLang(getLang() === 'es' ? 'en' : 'es'));
    }
  });

  window.predxI18n = { getLang, setLang, t, applyLang };
})();
