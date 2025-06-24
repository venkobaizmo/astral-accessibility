import { Injectable } from '@angular/core';

export interface AstralTranslations {
  // Main component
  'accessibility-tools': string;
  'open-accessibility-panel': string;
  'close-accessibility-panel': string;
  'accessibility-options-panel': string;
  'accessibility-features': string;

  // Contrast component
  'contrast': string;
  'invert': string;
  'high-contrast': string;
  'dark-high-contrast': string;

  // Text size component
  'bigger-text': string;
  'medium-text': string;
  'large-text': string;
  'extra-large-text': string;

  // Screen reader component
  'screen-reader': string;
  'screen-reader-unavailable': string;
  'read-normal': string;
  'read-fast': string;
  'read-slow': string;

  // Text spacing component
  'text-spacing': string;
  'light-spacing': string;
  'moderate-spacing': string;
  'heavy-spacing': string;

  // Screen mask component
  'screen-mask': string;
  'small-cursor': string;
  'medium-cursor': string;
  'large-cursor': string;
  'reading-mask': string;

  // Color blind support
  'color-blind-support': string;
  'protanopia': string;
  'deuteranopia': string;
  'tritanopia': string;
  'enable-color-blind-support': string;
  'color-blind-support-active': string;
  'color-blind-support-disabled': string;
  'color-blind-support-protanopia': string;
  'color-blind-support-deuteranopia': string;
  'color-blind-support-tritanopia': string;

  // Other components
  'saturation': string;
  'line-height': string;
  'skip-links': string;
  'focus-enhancement': string;
  'reduced-motion': string;
  'keyboard-navigation': string;

  // Line height states
  'default-line-height': string;
  'light-line-height': string;
  'moderate-line-height': string;
  'heavy-line-height': string;

  // Saturation states
  'normal-saturation': string;
  'low-saturation': string;
  'high-saturation': string;
  'desaturated': string;

  // Reduced motion states
  'normal-motion': string;
  'reduce-motion': string;

  // Focus enhancement states
  'default-focus': string;
  'enhanced-focus': string;

  // Keyboard navigation states
  'keyboard-nav-off': string;
  'keyboard-nav-on': string;

  // Skip links
  'skip-to-main-content': string;
  'skip-to-navigation': string;  'skip-to-search': string;
  'skip-to-footer': string;

  // Announcements
  'skip-links-enabled': string;
  'skip-links-disabled': string;
  'focus-enhancement-enabled': string;
  'focus-enhancement-disabled': string;
  'reduced-motion-enabled': string;
  'reduced-motion-disabled': string;

  // New WCAG 2.1 Level A/AA Features
  'alt-text-validator': string;
  'page-title-validator': string;
  'language-validator': string;
  'auto-refresh-controls': string;
  'focus-trap': string;
  'touch-target-validator': string;
  'reading-order-validator': string;
  'error-identification': string;

  // Alt Text Validator
  'validate-alt-text': string;
  'alt-text-issues-found': string;
  'no-alt-text-issues': string;
  'missing-alt-text': string;
  'decorative-images': string;
  'complex-images': string;

  // Page Title Validator
  'validate-page-title': string;
  'page-title-valid': string;
  'page-title-invalid': string;
  'page-title-missing': string;
  'page-title-too-long': string;
  'page-title-not-descriptive': string;

  // Language Validator
  'validate-language': string;
  'language-valid': string;
  'language-invalid': string;
  'missing-lang-attribute': string;
  'invalid-lang-code': string;
  'mixed-languages-detected': string;

  // Auto Refresh Controls
  'auto-refresh-detected': string;
  'pause-auto-refresh': string;
  'resume-auto-refresh': string;
  'auto-refresh-paused': string;
  'auto-refresh-resumed': string;
  'no-auto-refresh-detected': string;

  // Focus Trap
  'enable-focus-trap': string;
  'disable-focus-trap': string;
  'focus-trap-enabled': string;
  'focus-trap-disabled': string;
  'focus-trapped': string;

  // Touch Target Validator
  'validate-touch-targets': string;
  'touch-targets-valid': string;
  'touch-targets-invalid': string;
  'small-touch-targets': string;
  'overlapping-touch-targets': string;
  'minimum-size-44px': string;

  // Reading Order Validator
  'validate-reading-order': string;
  'reading-order-valid': string;
  'reading-order-issues': string;
  'heading-structure-issues': string;
  'tab-order-issues': string;
  'visual-reading-order': string;

  // Error Identification
  'identify-errors': string;
  'no-errors-found': string;
  'errors-found': string;
  'form-validation-errors': string;
  'missing-error-messages': string;
  'error-identification-active': string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLocale = 'en-US';
  
  private translations: Record<string, AstralTranslations> = {
    'en-US': {
      // Main component
      'accessibility-tools': 'Accessibility tools',
      'open-accessibility-panel': 'Open accessibility panel',
      'close-accessibility-panel': 'Close accessibility panel',
      'accessibility-options-panel': 'Accessibility options panel',
      'accessibility-features': 'Accessibility features',

      // Contrast component
      'contrast': 'Contrast',
      'invert': 'Invert',
      'high-contrast': 'High Contrast',
      'dark-high-contrast': 'Dark High Contrast',

      // Text size component
      'bigger-text': 'Bigger Text',
      'medium-text': 'Medium Text',
      'large-text': 'Large Text',
      'extra-large-text': 'Extra Large Text',

      // Screen reader component
      'screen-reader': 'Screen Reader',
      'screen-reader-unavailable': 'Screen Reader unavailable on device',
      'read-normal': 'Read Normal',
      'read-fast': 'Read Fast',
      'read-slow': 'Read Slow',

      // Text spacing component
      'text-spacing': 'Text Spacing',
      'light-spacing': 'Light Spacing',
      'moderate-spacing': 'Moderate Spacing',
      'heavy-spacing': 'Heavy Spacing',

      // Screen mask component
      'screen-mask': 'Screen Mask',
      'small-cursor': 'Small Cursor',
      'medium-cursor': 'Medium Cursor',
      'large-cursor': 'Large Cursor',
      'reading-mask': 'Reading Mask',

      // Color blind support
      'color-blind-support': 'Color Blind Support',
      'protanopia': 'Protanopia',
      'deuteranopia': 'Deuteranopia',
      'tritanopia': 'Tritanopia',
      'enable-color-blind-support': 'Enable color blind support',
      'color-blind-support-active': 'Color blind support active',
      'color-blind-support-disabled': 'Color blind support disabled',
      'color-blind-support-protanopia': 'Color blind support enabled for protanopia (red-blind)',
      'color-blind-support-deuteranopia': 'Color blind support enabled for deuteranopia (green-blind)',
      'color-blind-support-tritanopia': 'Color blind support enabled for tritanopia (blue-blind)',

      // Other components
      'saturation': 'Saturation',
      'line-height': 'Line Height',
      'skip-links': 'Skip Links',
      'focus-enhancement': 'Focus Enhancement',
      'reduced-motion': 'Reduced Motion',
      'keyboard-navigation': 'Keyboard Navigation',

      // Line height states
      'default-line-height': 'Default',
      'light-line-height': 'Light Height',
      'moderate-line-height': 'Moderate Height',
      'heavy-line-height': 'Heavy Height',

      // Saturation states
      'normal-saturation': 'Normal',
      'low-saturation': 'Low Saturation',
      'high-saturation': 'High Saturation',
      'desaturated': 'Desaturated',

      // Reduced motion states
      'normal-motion': 'Normal Motion',
      'reduce-motion': 'Reduce Motion',

      // Focus enhancement states
      'default-focus': 'Default Focus',
      'enhanced-focus': 'Enhanced Focus',

      // Keyboard navigation states
      'keyboard-nav-off': 'Keyboard Navigation Off',
      'keyboard-nav-on': 'Keyboard Navigation On',

      // Skip links
      'skip-to-main-content': 'Skip to main content',
      'skip-to-navigation': 'Skip to navigation',
      'skip-to-search': 'Skip to search',
      'skip-to-footer': 'Skip to footer',      // Announcements
      'skip-links-enabled': 'Skip links enabled',
      'skip-links-disabled': 'Skip links disabled',
      'focus-enhancement-enabled': 'Enhanced focus indicators enabled',
      'focus-enhancement-disabled': 'Enhanced focus indicators disabled',
      'reduced-motion-enabled': 'Reduced motion enabled - animations disabled',
      'reduced-motion-disabled': 'Reduced motion disabled - animations restored',

      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'es': {
      // Main component
      'accessibility-tools': 'Herramientas de accesibilidad',
      'open-accessibility-panel': 'Abrir panel de accesibilidad',
      'close-accessibility-panel': 'Cerrar panel de accesibilidad',
      'accessibility-options-panel': 'Panel de opciones de accesibilidad',
      'accessibility-features': 'Características de accesibilidad',

      // Contrast component
      'contrast': 'Contraste',
      'invert': 'Invertir',
      'high-contrast': 'Alto Contraste',
      'dark-high-contrast': 'Alto Contraste Oscuro',

      // Text size component
      'bigger-text': 'Texto Más Grande',
      'medium-text': 'Texto Mediano',
      'large-text': 'Texto Grande',
      'extra-large-text': 'Texto Extra Grande',

      // Screen reader component
      'screen-reader': 'Lector de Pantalla',
      'screen-reader-unavailable': 'Lector de pantalla no disponible en el dispositivo',
      'read-normal': 'Leer Normal',
      'read-fast': 'Leer Rápido',
      'read-slow': 'Leer Lento',

      // Text spacing component
      'text-spacing': 'Espaciado de Texto',
      'light-spacing': 'Espaciado Ligero',
      'moderate-spacing': 'Espaciado Moderado',
      'heavy-spacing': 'Espaciado Pesado',

      // Screen mask component
      'screen-mask': 'Máscara de Pantalla',
      'small-cursor': 'Cursor Pequeño',
      'medium-cursor': 'Cursor Mediano',
      'large-cursor': 'Cursor Grande',
      'reading-mask': 'Máscara de Lectura',

      // Color blind support
      'color-blind-support': 'Soporte para Daltonismo',
      'protanopia': 'Protanopia',
      'deuteranopia': 'Deuteranopia',
      'tritanopia': 'Tritanopia',
      'enable-color-blind-support': 'Habilitar soporte para daltonismo',
      'color-blind-support-active': 'Soporte para daltonismo activo',
      'color-blind-support-disabled': 'Soporte para daltonismo deshabilitado',
      'color-blind-support-protanopia': 'Soporte para daltonismo habilitado para protanopia (ciego al rojo)',
      'color-blind-support-deuteranopia': 'Soporte para daltonismo habilitado para deuteranopia (ciego al verde)',
      'color-blind-support-tritanopia': 'Soporte para daltonismo habilitado para tritanopia (ciego al azul)',

      // Other components
      'saturation': 'Saturación',
      'line-height': 'Altura de Línea',
      'skip-links': 'Enlaces de Salto',
      'focus-enhancement': 'Mejora de Enfoque',
      'reduced-motion': 'Movimiento Reducido',
      'keyboard-navigation': 'Navegación por Teclado',

      // Line height states
      'default-line-height': 'Predeterminado',
      'light-line-height': 'Altura Ligera',
      'moderate-line-height': 'Altura Moderada',
      'heavy-line-height': 'Altura Pesada',

      // Saturation states
      'normal-saturation': 'Normal',
      'low-saturation': 'Baja Saturación',
      'high-saturation': 'Alta Saturación',
      'desaturated': 'Desaturado',

      // Reduced motion states
      'normal-motion': 'Movimiento Normal',
      'reduce-motion': 'Reducir Movimiento',

      // Focus enhancement states
      'default-focus': 'Enfoque Predeterminado',
      'enhanced-focus': 'Enfoque Mejorado',

      // Keyboard navigation states
      'keyboard-nav-off': 'Navegación por Teclado Desactivada',
      'keyboard-nav-on': 'Navegación por Teclado Activada',

      // Skip links
      'skip-to-main-content': 'Saltar al contenido principal',
      'skip-to-navigation': 'Saltar a la navegación',
      'skip-to-search': 'Saltar a la búsqueda',
      'skip-to-footer': 'Saltar al pie de página',      // Announcements
      'skip-links-enabled': 'Enlaces de salto habilitados',
      'skip-links-disabled': 'Enlaces de salto deshabilitados',
      'focus-enhancement-enabled': 'Indicadores de enfoque mejorados habilitados',
      'focus-enhancement-disabled': 'Indicadores de enfoque mejorados deshabilitados',
      'reduced-motion-enabled': 'Movimiento reducido habilitado - animaciones deshabilitadas',
      'reduced-motion-disabled': 'Movimiento reducido deshabilitado - animaciones restauradas',

      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Validador de Texto Alternativo',
      'page-title-validator': 'Validador de Título de Página',
      'language-validator': 'Validador de Idioma',
      'auto-refresh-controls': 'Controles de Actualización Automática',
      'focus-trap': 'Trampa de Enfoque',
      'touch-target-validator': 'Validador de Objetivos Táctiles',
      'reading-order-validator': 'Validador de Orden de Lectura',
      'error-identification': 'Identificación de Errores',

      // Alt Text Validator
      'validate-alt-text': 'Validar Texto Alternativo',
      'alt-text-issues-found': 'Se encontraron problemas de texto alternativo',
      'no-alt-text-issues': 'No se encontraron problemas de texto alternativo',
      'missing-alt-text': 'Falta texto alternativo',
      'decorative-images': 'Imágenes decorativas',
      'complex-images': 'Imágenes complejas necesitan descripciones',

      // Page Title Validator
      'validate-page-title': 'Validar Título de Página',
      'page-title-valid': 'El título de la página es válido',
      'page-title-invalid': 'El título de la página tiene problemas',
      'page-title-missing': 'Falta el título de la página',
      'page-title-too-long': 'El título de la página es demasiado largo',
      'page-title-not-descriptive': 'El título de la página no es descriptivo',

      // Language Validator
      'validate-language': 'Validar Idioma',
      'language-valid': 'Los atributos de idioma son válidos',
      'language-invalid': 'Los atributos de idioma tienen problemas',
      'missing-lang-attribute': 'Falta el atributo lang',
      'invalid-lang-code': 'Código de idioma inválido',
      'mixed-languages-detected': 'Idiomas mixtos detectados',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Actualización automática detectada',
      'pause-auto-refresh': 'Pausar Actualización Automática',
      'resume-auto-refresh': 'Reanudar Actualización Automática',
      'auto-refresh-paused': 'Actualización automática pausada',
      'auto-refresh-resumed': 'Actualización automática reanudada',
      'no-auto-refresh-detected': 'No se detectó actualización automática',

      // Focus Trap
      'enable-focus-trap': 'Habilitar Trampa de Enfoque',
      'disable-focus-trap': 'Deshabilitar Trampa de Enfoque',
      'focus-trap-enabled': 'Trampa de enfoque habilitada',
      'focus-trap-disabled': 'Trampa de enfoque deshabilitada',
      'focus-trapped': 'El enfoque está atrapado en esta área',

      // Touch Target Validator
      'validate-touch-targets': 'Validar Objetivos Táctiles',
      'touch-targets-valid': 'Los objetivos táctiles son válidos',
      'touch-targets-invalid': 'Los objetivos táctiles tienen problemas',
      'small-touch-targets': 'Se encontraron objetivos táctiles pequeños',
      'overlapping-touch-targets': 'Se encontraron objetivos táctiles superpuestos',
      'minimum-size-44px': 'Los objetivos táctiles deben tener al menos 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validar Orden de Lectura',
      'reading-order-valid': 'El orden de lectura es válido',
      'reading-order-issues': 'El orden de lectura tiene problemas',
      'heading-structure-issues': 'Problemas de estructura de encabezados',
      'tab-order-issues': 'Problemas de orden de pestañas',
      'visual-reading-order': 'Orden de lectura visual',

      // Error Identification
      'identify-errors': 'Identificar Errores',
      'no-errors-found': 'No se encontraron errores',
      'errors-found': 'Se encontraron errores',
      'form-validation-errors': 'Errores de validación de formulario',
      'missing-error-messages': 'Mensajes de error faltantes',
      'error-identification-active': 'Identificación de errores activa'
    },
    'fr': {
      // Main component
      'accessibility-tools': 'Outils d\'accessibilité',
      'open-accessibility-panel': 'Ouvrir le panneau d\'accessibilité',
      'close-accessibility-panel': 'Fermer le panneau d\'accessibilité',
      'accessibility-options-panel': 'Panneau d\'options d\'accessibilité',
      'accessibility-features': 'Fonctionnalités d\'accessibilité',

      // Contrast component
      'contrast': 'Contraste',
      'invert': 'Inverser',
      'high-contrast': 'Haut Contraste',
      'dark-high-contrast': 'Haut Contraste Sombre',

      // Text size component
      'bigger-text': 'Texte Plus Grand',
      'medium-text': 'Texte Moyen',
      'large-text': 'Grand Texte',
      'extra-large-text': 'Texte Extra Large',

      // Screen reader component
      'screen-reader': 'Lecteur d\'Écran',
      'screen-reader-unavailable': 'Lecteur d\'écran non disponible sur cet appareil',
      'read-normal': 'Lire Normal',
      'read-fast': 'Lire Rapide',
      'read-slow': 'Lire Lent',

      // Text spacing component
      'text-spacing': 'Espacement du Texte',
      'light-spacing': 'Espacement Léger',
      'moderate-spacing': 'Espacement Modéré',
      'heavy-spacing': 'Espacement Lourd',

      // Screen mask component
      'screen-mask': 'Masque d\'Écran',
      'small-cursor': 'Petit Curseur',
      'medium-cursor': 'Curseur Moyen',
      'large-cursor': 'Grand Curseur',
      'reading-mask': 'Masque de Lecture',

      // Color blind support
      'color-blind-support': 'Support pour Daltonisme',
      'protanopia': 'Protanopie',
      'deuteranopia': 'Deutéranopie',
      'tritanopia': 'Tritanopie',
      'enable-color-blind-support': 'Activer le support pour daltonisme',
      'color-blind-support-active': 'Support pour daltonisme actif',
      'color-blind-support-disabled': 'Support pour daltonisme désactivé',
      'color-blind-support-protanopia': 'Support pour daltonisme activé pour protanopie (aveugle au rouge)',
      'color-blind-support-deuteranopia': 'Support pour daltonisme activé pour deutéranopie (aveugle au vert)',
      'color-blind-support-tritanopia': 'Support pour daltonisme activé pour tritanopie (aveugle au bleu)',

      // Other components
      'saturation': 'Saturation',
      'line-height': 'Hauteur de Ligne',
      'skip-links': 'Liens de Saut',
      'focus-enhancement': 'Amélioration du Focus',
      'reduced-motion': 'Mouvement Réduit',
      'keyboard-navigation': 'Navigation au Clavier',

      // Line height states
      'default-line-height': 'Par Défaut',
      'light-line-height': 'Hauteur Légère',
      'moderate-line-height': 'Hauteur Modérée',
      'heavy-line-height': 'Hauteur Lourde',

      // Saturation states
      'normal-saturation': 'Normal',
      'low-saturation': 'Faible Saturation',
      'high-saturation': 'Haute Saturation',
      'desaturated': 'Désaturé',

      // Reduced motion states
      'normal-motion': 'Mouvement Normal',
      'reduce-motion': 'Réduire le Mouvement',

      // Focus enhancement states
      'default-focus': 'Focus Par Défaut',
      'enhanced-focus': 'Focus Amélioré',

      // Keyboard navigation states
      'keyboard-nav-off': 'Navigation au Clavier Désactivée',
      'keyboard-nav-on': 'Navigation au Clavier Activée',

      // Skip links
      'skip-to-main-content': 'Aller au contenu principal',
      'skip-to-navigation': 'Aller à la navigation',
      'skip-to-search': 'Aller à la recherche',
      'skip-to-footer': 'Aller au pied de page',

      // Announcements
      'skip-links-enabled': 'Liens de saut activés',
      'skip-links-disabled': 'Liens de saut désactivés',
      'focus-enhancement-enabled': 'Indicateurs de focus améliorés activés',
      'focus-enhancement-disabled': 'Indicateurs de focus améliorés désactivés',
      'reduced-motion-enabled': 'Mouvement réduit activé - animations désactivées',
      'reduced-motion-disabled': 'Mouvement réduit désactivé - animations restaurées',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'de': {
      // Main component
      'accessibility-tools': 'Barrierefreiheits-Tools',
      'open-accessibility-panel': 'Barrierefreiheits-Panel öffnen',
      'close-accessibility-panel': 'Barrierefreiheits-Panel schließen',
      'accessibility-options-panel': 'Barrierefreiheits-Optionen Panel',
      'accessibility-features': 'Barrierefreiheits-Funktionen',

      // Contrast component
      'contrast': 'Kontrast',
      'invert': 'Umkehren',
      'high-contrast': 'Hoher Kontrast',
      'dark-high-contrast': 'Dunkler Hoher Kontrast',

      // Text size component
      'bigger-text': 'Größerer Text',
      'medium-text': 'Mittlerer Text',
      'large-text': 'Großer Text',
      'extra-large-text': 'Extra Großer Text',

      // Screen reader component
      'screen-reader': 'Bildschirmleser',
      'screen-reader-unavailable': 'Bildschirmleser auf diesem Gerät nicht verfügbar',
      'read-normal': 'Normal Lesen',
      'read-fast': 'Schnell Lesen',
      'read-slow': 'Langsam Lesen',

      // Text spacing component
      'text-spacing': 'Textabstand',
      'light-spacing': 'Leichter Abstand',
      'moderate-spacing': 'Moderater Abstand',
      'heavy-spacing': 'Schwerer Abstand',

      // Screen mask component
      'screen-mask': 'Bildschirmmaske',
      'small-cursor': 'Kleiner Cursor',
      'medium-cursor': 'Mittlerer Cursor',
      'large-cursor': 'Großer Cursor',
      'reading-mask': 'Lesemaske',

      // Color blind support
      'color-blind-support': 'Farbenblind-Unterstützung',
      'protanopia': 'Protanopie',
      'deuteranopia': 'Deuteranopie',
      'tritanopia': 'Tritanopie',
      'enable-color-blind-support': 'Farbenblind-Unterstützung aktivieren',
      'color-blind-support-active': 'Farbenblind-Unterstützung aktiv',
      'color-blind-support-disabled': 'Farbenblind-Unterstützung deaktiviert',
      'color-blind-support-protanopia': 'Farbenblind-Unterstützung für Protanopie aktiviert (rotblind)',
      'color-blind-support-deuteranopia': 'Farbenblind-Unterstützung für Deuteranopie aktiviert (grünblind)',
      'color-blind-support-tritanopia': 'Farbenblind-Unterstützung für Tritanopie aktiviert (blaublind)',

      // Other components
      'saturation': 'Sättigung',
      'line-height': 'Zeilenhöhe',
      'skip-links': 'Sprunglinks',
      'focus-enhancement': 'Fokus-Verbesserung',
      'reduced-motion': 'Reduzierte Bewegung',
      'keyboard-navigation': 'Tastaturnavigation',

      // Line height states
      'default-line-height': 'Standard',
      'light-line-height': 'Leichte Höhe',
      'moderate-line-height': 'Moderate Höhe',
      'heavy-line-height': 'Schwere Höhe',

      // Saturation states
      'normal-saturation': 'Normal',
      'low-saturation': 'Niedrige Sättigung',
      'high-saturation': 'Hohe Sättigung',
      'desaturated': 'Entsättigt',

      // Reduced motion states
      'normal-motion': 'Normale Bewegung',
      'reduce-motion': 'Bewegung Reduzieren',

      // Focus enhancement states
      'default-focus': 'Standard-Fokus',
      'enhanced-focus': 'Verbesserter Fokus',

      // Keyboard navigation states
      'keyboard-nav-off': 'Tastaturnavigation Aus',
      'keyboard-nav-on': 'Tastaturnavigation Ein',

      // Skip links
      'skip-to-main-content': 'Zum Hauptinhalt springen',
      'skip-to-navigation': 'Zur Navigation springen',
      'skip-to-search': 'Zur Suche springen',
      'skip-to-footer': 'Zur Fußzeile springen',

      // Announcements
      'skip-links-enabled': 'Sprunglinks aktiviert',
      'skip-links-disabled': 'Sprunglinks deaktiviert',
      'focus-enhancement-enabled': 'Verbesserte Fokusindikatoren aktiviert',
      'focus-enhancement-disabled': 'Verbesserte Fokusindikatoren deaktiviert',      'reduced-motion-enabled': 'Reduzierte Bewegung aktiviert - Animationen deaktiviert',
      'reduced-motion-disabled': 'Reduzierte Bewegung deaktiviert - Animationen wiederhergestellt',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'zh-CN': {
      // Main component
      'accessibility-tools': '无障碍工具',
      'open-accessibility-panel': '打开无障碍面板',
      'close-accessibility-panel': '关闭无障碍面板',
      'accessibility-options-panel': '无障碍选项面板',
      'accessibility-features': '无障碍功能',

      // Contrast component
      'contrast': '对比度',
      'invert': '反转',
      'high-contrast': '高对比度',
      'dark-high-contrast': '深色高对比度',

      // Text size component
      'bigger-text': '更大文本',
      'medium-text': '中等文本',
      'large-text': '大文本',
      'extra-large-text': '超大文本',

      // Screen reader component
      'screen-reader': '屏幕阅读器',
      'screen-reader-unavailable': '设备上无屏幕阅读器可用',
      'read-normal': '正常阅读',
      'read-fast': '快速阅读',
      'read-slow': '慢速阅读',

      // Text spacing component
      'text-spacing': '文本间距',
      'light-spacing': '轻度间距',
      'moderate-spacing': '中度间距',
      'heavy-spacing': '重度间距',

      // Screen mask component
      'screen-mask': '屏幕遮罩',
      'small-cursor': '小光标',
      'medium-cursor': '中等光标',
      'large-cursor': '大光标',
      'reading-mask': '阅读遮罩',

      // Color blind support
      'color-blind-support': '色盲支持',
      'protanopia': '红色盲',
      'deuteranopia': '绿色盲',
      'tritanopia': '蓝色盲',
      'enable-color-blind-support': '启用色盲支持',
      'color-blind-support-active': '色盲支持已激活',
      'color-blind-support-disabled': '色盲支持已禁用',
      'color-blind-support-protanopia': '红色盲支持已启用',
      'color-blind-support-deuteranopia': '绿色盲支持已启用',
      'color-blind-support-tritanopia': '蓝色盲支持已启用',

      // Other components
      'saturation': '饱和度',
      'line-height': '行高',
      'skip-links': '跳转链接',
      'focus-enhancement': '焦点增强',
      'reduced-motion': '减少动画',
      'keyboard-navigation': '键盘导航',

      // Line height states
      'default-line-height': '默认',
      'light-line-height': '轻度行高',
      'moderate-line-height': '中度行高',
      'heavy-line-height': '重度行高',

      // Saturation states
      'normal-saturation': '正常',
      'low-saturation': '低饱和度',
      'high-saturation': '高饱和度',
      'desaturated': '去饱和',

      // Reduced motion states
      'normal-motion': '正常动画',
      'reduce-motion': '减少动画',

      // Focus enhancement states
      'default-focus': '默认焦点',
      'enhanced-focus': '增强焦点',

      // Keyboard navigation states
      'keyboard-nav-off': '键盘导航关闭',
      'keyboard-nav-on': '键盘导航开启',

      // Skip links
      'skip-to-main-content': '跳转到主要内容',
      'skip-to-navigation': '跳转到导航',
      'skip-to-search': '跳转到搜索',
      'skip-to-footer': '跳转到页脚',

      // Announcements
      'skip-links-enabled': '跳转链接已启用',
      'skip-links-disabled': '跳转链接已禁用',
      'focus-enhancement-enabled': '增强焦点指示器已启用',
      'focus-enhancement-disabled': '增强焦点指示器已禁用',
      'reduced-motion-enabled': '减少动画已启用 - 动画已禁用',
      'reduced-motion-disabled': '减少动画已禁用 - 动画已恢复',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'ja': {
      // Main component
      'accessibility-tools': 'アクセシビリティツール',
      'open-accessibility-panel': 'アクセシビリティパネルを開く',
      'close-accessibility-panel': 'アクセシビリティパネルを閉じる',
      'accessibility-options-panel': 'アクセシビリティオプションパネル',
      'accessibility-features': 'アクセシビリティ機能',

      // Contrast component
      'contrast': 'コントラスト',
      'invert': '反転',
      'high-contrast': 'ハイコントラスト',
      'dark-high-contrast': 'ダークハイコントラスト',

      // Text size component
      'bigger-text': '大きなテキスト',
      'medium-text': '中サイズテキスト',
      'large-text': '大サイズテキスト',
      'extra-large-text': '特大テキスト',

      // Screen reader component
      'screen-reader': 'スクリーンリーダー',
      'screen-reader-unavailable': 'このデバイスではスクリーンリーダーが利用できません',
      'read-normal': '通常読み上げ',
      'read-fast': '高速読み上げ',
      'read-slow': '低速読み上げ',

      // Text spacing component
      'text-spacing': 'テキスト間隔',
      'light-spacing': '軽い間隔',
      'moderate-spacing': '中程度の間隔',
      'heavy-spacing': '広い間隔',

      // Screen mask component
      'screen-mask': 'スクリーンマスク',
      'small-cursor': '小カーソル',
      'medium-cursor': '中カーソル',
      'large-cursor': '大カーソル',
      'reading-mask': '読書マスク',

      // Color blind support
      'color-blind-support': '色覚障害サポート',
      'protanopia': '第一色覚異常',
      'deuteranopia': '第二色覚異常',
      'tritanopia': '第三色覚異常',
      'enable-color-blind-support': '色覚障害サポートを有効にする',
      'color-blind-support-active': '色覚障害サポートが有効',
      'color-blind-support-disabled': '色覚障害サポートが無効',
      'color-blind-support-protanopia': '第一色覚異常サポートが有効',
      'color-blind-support-deuteranopia': '第二色覚異常サポートが有効',
      'color-blind-support-tritanopia': '第三色覚異常サポートが有効',

      // Other components
      'saturation': '彩度',
      'line-height': '行の高さ',
      'skip-links': 'スキップリンク',
      'focus-enhancement': 'フォーカス強化',
      'reduced-motion': 'アニメーション軽減',
      'keyboard-navigation': 'キーボードナビゲーション',

      // Line height states
      'default-line-height': 'デフォルト',
      'light-line-height': '軽い高さ',
      'moderate-line-height': '中程度の高さ',
      'heavy-line-height': '重い高さ',

      // Saturation states
      'normal-saturation': '通常',
      'low-saturation': '低彩度',
      'high-saturation': '高彩度',
      'desaturated': '無彩色',

      // Reduced motion states
      'normal-motion': '通常のアニメーション',
      'reduce-motion': 'アニメーション軽減',

      // Focus enhancement states
      'default-focus': 'デフォルトフォーカス',
      'enhanced-focus': '強化フォーカス',

      // Keyboard navigation states
      'keyboard-nav-off': 'キーボードナビゲーションオフ',
      'keyboard-nav-on': 'キーボードナビゲーションオン',

      // Skip links
      'skip-to-main-content': 'メインコンテンツにスキップ',
      'skip-to-navigation': 'ナビゲーションにスキップ',
      'skip-to-search': '検索にスキップ',
      'skip-to-footer': 'フッターにスキップ',

      // Announcements
      'skip-links-enabled': 'スキップリンクが有効',
      'skip-links-disabled': 'スキップリンクが無効',
      'focus-enhancement-enabled': '強化フォーカスインジケーターが有効',
      'focus-enhancement-disabled': '強化フォーカスインジケーターが無効',      'reduced-motion-enabled': 'アニメーション軽減が有効 - アニメーションが無効',
      'reduced-motion-disabled': 'アニメーション軽減が無効 - アニメーションが復元',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'ko': {
      // Main component
      'accessibility-tools': '접근성 도구',
      'open-accessibility-panel': '접근성 패널 열기',
      'close-accessibility-panel': '접근성 패널 닫기',
      'accessibility-options-panel': '접근성 옵션 패널',
      'accessibility-features': '접근성 기능',

      // Contrast component
      'contrast': '대비',
      'invert': '반전',
      'high-contrast': '고대비',
      'dark-high-contrast': '어두운 고대비',

      // Text size component
      'bigger-text': '큰 텍스트',
      'medium-text': '중간 텍스트',
      'large-text': '대형 텍스트',
      'extra-large-text': '특대 텍스트',

      // Screen reader component
      'screen-reader': '화면 읽기',
      'screen-reader-unavailable': '이 기기에서는 화면 읽기를 사용할 수 없습니다',
      'read-normal': '보통 읽기',
      'read-fast': '빠른 읽기',
      'read-slow': '느린 읽기',

      // Text spacing component
      'text-spacing': '텍스트 간격',
      'light-spacing': '가벼운 간격',
      'moderate-spacing': '보통 간격',
      'heavy-spacing': '넓은 간격',

      // Screen mask component
      'screen-mask': '화면 마스크',
      'small-cursor': '작은 커서',
      'medium-cursor': '중간 커서',
      'large-cursor': '큰 커서',
      'reading-mask': '읽기 마스크',

      // Color blind support
      'color-blind-support': '색맹 지원',
      'protanopia': '적색맹',
      'deuteranopia': '녹색맹',
      'tritanopia': '청색맹',
      'enable-color-blind-support': '색맹 지원 활성화',
      'color-blind-support-active': '색맹 지원 활성',
      'color-blind-support-disabled': '색맹 지원 비활성',
      'color-blind-support-protanopia': '적색맹 지원 활성화',
      'color-blind-support-deuteranopia': '녹색맹 지원 활성화',
      'color-blind-support-tritanopia': '청색맹 지원 활성화',

      // Other components
      'saturation': '채도',
      'line-height': '줄 높이',
      'skip-links': '건너뛰기 링크',
      'focus-enhancement': '포커스 강화',
      'reduced-motion': '동작 감소',
      'keyboard-navigation': '키보드 탐색',

      // Line height states
      'default-line-height': '기본값',
      'light-line-height': '가벼운 높이',
      'moderate-line-height': '보통 높이',
      'heavy-line-height': '무거운 높이',

      // Saturation states
      'normal-saturation': '보통',
      'low-saturation': '낮은 채도',
      'high-saturation': '높은 채도',
      'desaturated': '채도 제거',

      // Reduced motion states
      'normal-motion': '보통 동작',
      'reduce-motion': '동작 감소',

      // Focus enhancement states
      'default-focus': '기본 포커스',
      'enhanced-focus': '강화된 포커스',

      // Keyboard navigation states
      'keyboard-nav-off': '키보드 탐색 끄기',
      'keyboard-nav-on': '키보드 탐색 켜기',

      // Skip links
      'skip-to-main-content': '주요 내용으로 건너뛰기',
      'skip-to-navigation': '탐색으로 건너뛰기',
      'skip-to-search': '검색으로 건너뛰기',
      'skip-to-footer': '푸터로 건너뛰기',

      // Announcements
      'skip-links-enabled': '건너뛰기 링크 활성화',
      'skip-links-disabled': '건너뛰기 링크 비활성화',
      'focus-enhancement-enabled': '강화된 포커스 표시기 활성화',
      'focus-enhancement-disabled': '강화된 포커스 표시기 비활성화',      'reduced-motion-enabled': '동작 감소 활성화 - 애니메이션 비활성화',
      'reduced-motion-disabled': '동작 감소 비활성화 - 애니메이션 복원',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'ar': {
      // Main component
      'accessibility-tools': 'أدوات إمكانية الوصول',
      'open-accessibility-panel': 'فتح لوحة إمكانية الوصول',
      'close-accessibility-panel': 'إغلاق لوحة إمكانية الوصول',
      'accessibility-options-panel': 'لوحة خيارات إمكانية الوصول',
      'accessibility-features': 'ميزات إمكانية الوصول',

      // Contrast component
      'contrast': 'التباين',
      'invert': 'عكس',
      'high-contrast': 'تباين عالي',
      'dark-high-contrast': 'تباين عالي داكن',

      // Text size component
      'bigger-text': 'نص أكبر',
      'medium-text': 'نص متوسط',
      'large-text': 'نص كبير',
      'extra-large-text': 'نص كبير جداً',

      // Screen reader component
      'screen-reader': 'قارئ الشاشة',
      'screen-reader-unavailable': 'قارئ الشاشة غير متوفر على هذا الجهاز',
      'read-normal': 'قراءة عادية',
      'read-fast': 'قراءة سريعة',
      'read-slow': 'قراءة بطيئة',

      // Text spacing component
      'text-spacing': 'تباعد النص',
      'light-spacing': 'تباعد خفيف',
      'moderate-spacing': 'تباعد متوسط',
      'heavy-spacing': 'تباعد كثيف',

      // Screen mask component
      'screen-mask': 'قناع الشاشة',
      'small-cursor': 'مؤشر صغير',
      'medium-cursor': 'مؤشر متوسط',
      'large-cursor': 'مؤشر كبير',
      'reading-mask': 'قناع القراءة',

      // Color blind support
      'color-blind-support': 'دعم عمى الألوان',
      'protanopia': 'عمى الأحمر',
      'deuteranopia': 'عمى الأخضر',
      'tritanopia': 'عمى الأزرق',
      'enable-color-blind-support': 'تفعيل دعم عمى الألوان',
      'color-blind-support-active': 'دعم عمى الألوان نشط',
      'color-blind-support-disabled': 'دعم عمى الألوان معطل',
      'color-blind-support-protanopia': 'دعم عمى الأحمر مفعل',
      'color-blind-support-deuteranopia': 'دعم عمى الأخضر مفعل',
      'color-blind-support-tritanopia': 'دعم عمى الأزرق مفعل',

      // Other components
      'saturation': 'التشبع',
      'line-height': 'ارتفاع السطر',
      'skip-links': 'روابط التخطي',
      'focus-enhancement': 'تحسين التركيز',
      'reduced-motion': 'تقليل الحركة',
      'keyboard-navigation': 'التنقل بلوحة المفاتيح',

      // Line height states
      'default-line-height': 'افتراضي',
      'light-line-height': 'ارتفاع خفيف',
      'moderate-line-height': 'ارتفاع متوسط',
      'heavy-line-height': 'ارتفاع كثيف',

      // Saturation states
      'normal-saturation': 'عادي',
      'low-saturation': 'تشبع منخفض',
      'high-saturation': 'تشبع عالي',
      'desaturated': 'منزوع التشبع',

      // Reduced motion states
      'normal-motion': 'حركة عادية',
      'reduce-motion': 'تقليل الحركة',

      // Focus enhancement states
      'default-focus': 'تركيز افتراضي',
      'enhanced-focus': 'تركيز محسن',

      // Keyboard navigation states
      'keyboard-nav-off': 'التنقل بلوحة المفاتيح مغلق',
      'keyboard-nav-on': 'التنقل بلوحة المفاتيح مفتوح',

      // Skip links
      'skip-to-main-content': 'تخطي إلى المحتوى الرئيسي',
      'skip-to-navigation': 'تخطي إلى التنقل',
      'skip-to-search': 'تخطي إلى البحث',
      'skip-to-footer': 'تخطي إلى التذييل',

      // Announcements
      'skip-links-enabled': 'روابط التخطي مفعلة',
      'skip-links-disabled': 'روابط التخطي معطلة',
      'focus-enhancement-enabled': 'مؤشرات التركيز المحسنة مفعلة',
      'focus-enhancement-disabled': 'مؤشرات التركيز المحسنة معطلة',      'reduced-motion-enabled': 'تقليل الحركة مفعل - الرسوم المتحركة معطلة',
      'reduced-motion-disabled': 'تقليل الحركة معطل - الرسوم المتحركة مستعادة',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'ru': {
      // Main component
      'accessibility-tools': 'Инструменты доступности',
      'open-accessibility-panel': 'Открыть панель доступности',
      'close-accessibility-panel': 'Закрыть панель доступности',
      'accessibility-options-panel': 'Панель параметров доступности',
      'accessibility-features': 'Функции доступности',

      // Contrast component
      'contrast': 'Контрастность',
      'invert': 'Инвертировать',
      'high-contrast': 'Высокая контрастность',
      'dark-high-contrast': 'Тёмная высокая контрастность',

      // Text size component
      'bigger-text': 'Больший текст',
      'medium-text': 'Средний текст',
      'large-text': 'Крупный текст',
      'extra-large-text': 'Очень крупный текст',

      // Screen reader component
      'screen-reader': 'Программа чтения с экрана',
      'screen-reader-unavailable': 'Программа чтения с экрана недоступна на этом устройстве',
      'read-normal': 'Обычное чтение',
      'read-fast': 'Быстрое чтение',
      'read-slow': 'Медленное чтение',

      // Text spacing component
      'text-spacing': 'Интервалы текста',
      'light-spacing': 'Лёгкие интервалы',
      'moderate-spacing': 'Умеренные интервалы',
      'heavy-spacing': 'Широкие интервалы',

      // Screen mask component
      'screen-mask': 'Маска экрана',
      'small-cursor': 'Малый курсор',
      'medium-cursor': 'Средний курсор',
      'large-cursor': 'Большой курсор',
      'reading-mask': 'Маска для чтения',

      // Color blind support
      'color-blind-support': 'Поддержка дальтонизма',
      'protanopia': 'Протанопия',
      'deuteranopia': 'Дейтеранопия',
      'tritanopia': 'Тританопия',
      'enable-color-blind-support': 'Включить поддержку дальтонизма',
      'color-blind-support-active': 'Поддержка дальтонизма активна',
      'color-blind-support-disabled': 'Поддержка дальтонизма отключена',
      'color-blind-support-protanopia': 'Поддержка протанопии включена',
      'color-blind-support-deuteranopia': 'Поддержка дейтеранопии включена',
      'color-blind-support-tritanopia': 'Поддержка тританопии включена',

      // Other components
      'saturation': 'Насыщенность',
      'line-height': 'Высота строки',
      'skip-links': 'Ссылки перехода',
      'focus-enhancement': 'Улучшение фокуса',
      'reduced-motion': 'Уменьшение движения',
      'keyboard-navigation': 'Навигация с клавиатуры',

      // Line height states
      'default-line-height': 'По умолчанию',
      'light-line-height': 'Лёгкая высота',
      'moderate-line-height': 'Умеренная высота',
      'heavy-line-height': 'Большая высота',

      // Saturation states
      'normal-saturation': 'Обычная',
      'low-saturation': 'Низкая насыщенность',
      'high-saturation': 'Высокая насыщенность',
      'desaturated': 'Обесцвеченная',

      // Reduced motion states
      'normal-motion': 'Обычное движение',
      'reduce-motion': 'Уменьшить движение',

      // Focus enhancement states
      'default-focus': 'Обычный фокус',
      'enhanced-focus': 'Улучшенный фокус',

      // Keyboard navigation states
      'keyboard-nav-off': 'Навигация с клавиатуры выключена',
      'keyboard-nav-on': 'Навигация с клавиатуры включена',

      // Skip links
      'skip-to-main-content': 'Перейти к основному содержимому',
      'skip-to-navigation': 'Перейти к навигации',
      'skip-to-search': 'Перейти к поиску',
      'skip-to-footer': 'Перейти к нижнему колонтитулу',

      // Announcements
      'skip-links-enabled': 'Ссылки перехода включены',
      'skip-links-disabled': 'Ссылки перехода отключены',
      'focus-enhancement-enabled': 'Улучшенные индикаторы фокуса включены',
      'focus-enhancement-disabled': 'Улучшенные индикаторы фокуса отключены',      'reduced-motion-enabled': 'Уменьшение движения включено - анимации отключены',
      'reduced-motion-disabled': 'Уменьшение движения отключено - анимации восстановлены',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'pt': {
      // Main component
      'accessibility-tools': 'Ferramentas de acessibilidade',
      'open-accessibility-panel': 'Abrir painel de acessibilidade',
      'close-accessibility-panel': 'Fechar painel de acessibilidade',
      'accessibility-options-panel': 'Painel de opções de acessibilidade',
      'accessibility-features': 'Recursos de acessibilidade',

      // Contrast component
      'contrast': 'Contraste',
      'invert': 'Inverter',
      'high-contrast': 'Alto Contraste',
      'dark-high-contrast': 'Alto Contraste Escuro',

      // Text size component
      'bigger-text': 'Texto Maior',
      'medium-text': 'Texto Médio',
      'large-text': 'Texto Grande',
      'extra-large-text': 'Texto Extra Grande',

      // Screen reader component
      'screen-reader': 'Leitor de Tela',
      'screen-reader-unavailable': 'Leitor de tela indisponível neste dispositivo',
      'read-normal': 'Leitura Normal',
      'read-fast': 'Leitura Rápida',
      'read-slow': 'Leitura Lenta',

      // Text spacing component
      'text-spacing': 'Espaçamento do Texto',
      'light-spacing': 'Espaçamento Leve',
      'moderate-spacing': 'Espaçamento Moderado',
      'heavy-spacing': 'Espaçamento Pesado',

      // Screen mask component
      'screen-mask': 'Máscara de Tela',
      'small-cursor': 'Cursor Pequeno',
      'medium-cursor': 'Cursor Médio',
      'large-cursor': 'Cursor Grande',
      'reading-mask': 'Máscara de Leitura',

      // Color blind support
      'color-blind-support': 'Suporte para Daltonismo',
      'protanopia': 'Protanopia',
      'deuteranopia': 'Deuteranopia',
      'tritanopia': 'Tritanopia',
      'enable-color-blind-support': 'Ativar suporte para daltonismo',
      'color-blind-support-active': 'Suporte para daltonismo ativo',
      'color-blind-support-disabled': 'Suporte para daltonismo desativado',
      'color-blind-support-protanopia': 'Suporte para protanopia ativado',
      'color-blind-support-deuteranopia': 'Suporte para deuteranopia ativado',
      'color-blind-support-tritanopia': 'Suporte para tritanopia ativado',

      // Other components
      'saturation': 'Saturação',
      'line-height': 'Altura da Linha',
      'skip-links': 'Links de Salto',
      'focus-enhancement': 'Melhoria de Foco',
      'reduced-motion': 'Movimento Reduzido',
      'keyboard-navigation': 'Navegação por Teclado',

      // Line height states
      'default-line-height': 'Padrão',
      'light-line-height': 'Altura Leve',
      'moderate-line-height': 'Altura Moderada',
      'heavy-line-height': 'Altura Pesada',

      // Saturation states
      'normal-saturation': 'Normal',
      'low-saturation': 'Baixa Saturação',
      'high-saturation': 'Alta Saturação',
      'desaturated': 'Dessaturado',

      // Reduced motion states
      'normal-motion': 'Movimento Normal',
      'reduce-motion': 'Reduzir Movimento',

      // Focus enhancement states
      'default-focus': 'Foco Padrão',
      'enhanced-focus': 'Foco Melhorado',

      // Keyboard navigation states
      'keyboard-nav-off': 'Navegação por Teclado Desligada',
      'keyboard-nav-on': 'Navegação por Teclado Ligada',

      // Skip links
      'skip-to-main-content': 'Pular para o conteúdo principal',
      'skip-to-navigation': 'Pular para a navegação',
      'skip-to-search': 'Pular para a busca',
      'skip-to-footer': 'Pular para o rodapé',

      // Announcements
      'skip-links-enabled': 'Links de salto ativados',
      'skip-links-disabled': 'Links de salto desativados',
      'focus-enhancement-enabled': 'Indicadores de foco melhorados ativados',
      'focus-enhancement-disabled': 'Indicadores de foco melhorados desativados',      'reduced-motion-enabled': 'Movimento reduzido ativado - animações desativadas',
      'reduced-motion-disabled': 'Movimento reduzido desativado - animações restauradas',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'it': {
      // Main component
      'accessibility-tools': 'Strumenti di accessibilità',
      'open-accessibility-panel': 'Apri pannello di accessibilità',
      'close-accessibility-panel': 'Chiudi pannello di accessibilità',
      'accessibility-options-panel': 'Pannello opzioni di accessibilità',
      'accessibility-features': 'Funzionalità di accessibilità',

      // Contrast component
      'contrast': 'Contrasto',
      'invert': 'Inverti',
      'high-contrast': 'Alto Contrasto',
      'dark-high-contrast': 'Alto Contrasto Scuro',

      // Text size component
      'bigger-text': 'Testo Più Grande',
      'medium-text': 'Testo Medio',
      'large-text': 'Testo Grande',
      'extra-large-text': 'Testo Extra Grande',

      // Screen reader component
      'screen-reader': 'Lettore Schermo',
      'screen-reader-unavailable': 'Lettore schermo non disponibile su questo dispositivo',
      'read-normal': 'Lettura Normale',
      'read-fast': 'Lettura Veloce',
      'read-slow': 'Lettura Lenta',

      // Text spacing component
      'text-spacing': 'Spaziatura Testo',
      'light-spacing': 'Spaziatura Leggera',
      'moderate-spacing': 'Spaziatura Moderata',
      'heavy-spacing': 'Spaziatura Pesante',

      // Screen mask component
      'screen-mask': 'Maschera Schermo',
      'small-cursor': 'Cursore Piccolo',
      'medium-cursor': 'Cursore Medio',
      'large-cursor': 'Cursore Grande',
      'reading-mask': 'Maschera di Lettura',

      // Color blind support
      'color-blind-support': 'Supporto Daltonismo',
      'protanopia': 'Protanopia',
      'deuteranopia': 'Deuteranopia',
      'tritanopia': 'Tritanopia',
      'enable-color-blind-support': 'Attiva supporto daltonismo',
      'color-blind-support-active': 'Supporto daltonismo attivo',
      'color-blind-support-disabled': 'Supporto daltonismo disattivato',
      'color-blind-support-protanopia': 'Supporto protanopia attivato',
      'color-blind-support-deuteranopia': 'Supporto deuteranopia attivato',
      'color-blind-support-tritanopia': 'Supporto tritanopia attivato',

      // Other components
      'saturation': 'Saturazione',
      'line-height': 'Altezza Riga',
      'skip-links': 'Link di Salto',
      'focus-enhancement': 'Miglioramento Focus',
      'reduced-motion': 'Movimento Ridotto',
      'keyboard-navigation': 'Navigazione da Tastiera',

      // Line height states
      'default-line-height': 'Predefinita',
      'light-line-height': 'Altezza Leggera',
      'moderate-line-height': 'Altezza Moderata',
      'heavy-line-height': 'Altezza Pesante',

      // Saturation states
      'normal-saturation': 'Normale',
      'low-saturation': 'Bassa Saturazione',
      'high-saturation': 'Alta Saturazione',
      'desaturated': 'Desaturato',

      // Reduced motion states
      'normal-motion': 'Movimento Normale',
      'reduce-motion': 'Riduci Movimento',

      // Focus enhancement states
      'default-focus': 'Focus Predefinito',
      'enhanced-focus': 'Focus Migliorato',

      // Keyboard navigation states
      'keyboard-nav-off': 'Navigazione da Tastiera Spenta',
      'keyboard-nav-on': 'Navigazione da Tastiera Accesa',

      // Skip links
      'skip-to-main-content': 'Salta al contenuto principale',
      'skip-to-navigation': 'Salta alla navigazione',
      'skip-to-search': 'Salta alla ricerca',
      'skip-to-footer': 'Salta al piè di pagina',

      // Announcements
      'skip-links-enabled': 'Link di salto attivati',
      'skip-links-disabled': 'Link di salto disattivati',
      'focus-enhancement-enabled': 'Indicatori focus migliorati attivati',
      'focus-enhancement-disabled': 'Indicatori focus migliorati disattivati',      'reduced-motion-enabled': 'Movimento ridotto attivato - animazioni disattivate',
      'reduced-motion-disabled': 'Movimento ridotto disattivato - animazioni ripristinate',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'nl': {
      // Main component
      'accessibility-tools': 'Toegankelijkheidstools',
      'open-accessibility-panel': 'Toegankelijkheidspaneel openen',
      'close-accessibility-panel': 'Toegankelijkheidspaneel sluiten',
      'accessibility-options-panel': 'Toegankelijkheidsopties paneel',
      'accessibility-features': 'Toegankelijkheidsfuncties',

      // Contrast component
      'contrast': 'Contrast',
      'invert': 'Omkeren',
      'high-contrast': 'Hoog Contrast',
      'dark-high-contrast': 'Donker Hoog Contrast',

      // Text size component
      'bigger-text': 'Grotere Tekst',
      'medium-text': 'Middelgrote Tekst',
      'large-text': 'Grote Tekst',
      'extra-large-text': 'Extra Grote Tekst',

      // Screen reader component
      'screen-reader': 'Schermlezer',
      'screen-reader-unavailable': 'Schermlezer niet beschikbaar op dit apparaat',
      'read-normal': 'Normaal Voorlezen',
      'read-fast': 'Snel Voorlezen',
      'read-slow': 'Langzaam Voorlezen',

      // Text spacing component
      'text-spacing': 'Tekstafstand',
      'light-spacing': 'Lichte Afstand',
      'moderate-spacing': 'Gematigde Afstand',
      'heavy-spacing': 'Zware Afstand',

      // Screen mask component
      'screen-mask': 'Schermmasker',
      'small-cursor': 'Kleine Cursor',
      'medium-cursor': 'Middelgrote Cursor',
      'large-cursor': 'Grote Cursor',
      'reading-mask': 'Leesmasker',

      // Color blind support
      'color-blind-support': 'Kleurenblind Ondersteuning',
      'protanopia': 'Protanopie',
      'deuteranopia': 'Deuteranopie',
      'tritanopia': 'Tritanopie',
      'enable-color-blind-support': 'Kleurenblind ondersteuning inschakelen',
      'color-blind-support-active': 'Kleurenblind ondersteuning actief',
      'color-blind-support-disabled': 'Kleurenblind ondersteuning uitgeschakeld',
      'color-blind-support-protanopia': 'Protanopie ondersteuning ingeschakeld',
      'color-blind-support-deuteranopia': 'Deuteranopie ondersteuning ingeschakeld',
      'color-blind-support-tritanopia': 'Tritanopie ondersteuning ingeschakeld',

      // Other components
      'saturation': 'Verzadiging',
      'line-height': 'Regelhoogte',
      'skip-links': 'Overslaan Links',
      'focus-enhancement': 'Focus Verbetering',
      'reduced-motion': 'Verminderde Beweging',
      'keyboard-navigation': 'Toetsenbordnavigatie',

      // Line height states
      'default-line-height': 'Standaard',
      'light-line-height': 'Lichte Hoogte',
      'moderate-line-height': 'Gematigde Hoogte',
      'heavy-line-height': 'Zware Hoogte',

      // Saturation states
      'normal-saturation': 'Normaal',
      'low-saturation': 'Lage Verzadiging',
      'high-saturation': 'Hoge Verzadiging',
      'desaturated': 'Onverzadigd',

      // Reduced motion states
      'normal-motion': 'Normale Beweging',
      'reduce-motion': 'Beweging Verminderen',

      // Focus enhancement states
      'default-focus': 'Standaard Focus',
      'enhanced-focus': 'Verbeterde Focus',

      // Keyboard navigation states
      'keyboard-nav-off': 'Toetsenbordnavigatie Uit',
      'keyboard-nav-on': 'Toetsenbordnavigatie Aan',

      // Skip links
      'skip-to-main-content': 'Ga naar hoofdinhoud',
      'skip-to-navigation': 'Ga naar navigatie',
      'skip-to-search': 'Ga naar zoeken',
      'skip-to-footer': 'Ga naar voettekst',

      // Announcements
      'skip-links-enabled': 'Overslaan links ingeschakeld',
      'skip-links-disabled': 'Overslaan links uitgeschakeld',
      'focus-enhancement-enabled': 'Verbeterde focus indicatoren ingeschakeld',
      'focus-enhancement-disabled': 'Verbeterde focus indicatoren uitgeschakeld',      'reduced-motion-enabled': 'Verminderde beweging ingeschakeld - animaties uitgeschakeld',
      'reduced-motion-disabled': 'Verminderde beweging uitgeschakeld - animaties hersteld',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'hi': {
      // Main component
      'accessibility-tools': 'पहुंच उपकरण',
      'open-accessibility-panel': 'पहुंच पैनल खोलें',
      'close-accessibility-panel': 'पहुंच पैनल बंद करें',
      'accessibility-options-panel': 'पहुंच विकल्प पैनल',
      'accessibility-features': 'पहुंच सुविधाएं',

      // Contrast component
      'contrast': 'कंट्रास्ट',
      'invert': 'उल्टा करें',
      'high-contrast': 'उच्च कंट्रास्ट',
      'dark-high-contrast': 'डार्क उच्च कंट्रास्ट',

      // Text size component
      'bigger-text': 'बड़ा टेक्स्ट',
      'medium-text': 'मध्यम टेक्स्ट',
      'large-text': 'बड़ा टेक्स्ट',
      'extra-large-text': 'अतिरिक्त बड़ा टेक्स्ट',

      // Screen reader component
      'screen-reader': 'स्क्रीन रीडर',
      'screen-reader-unavailable': 'इस डिवाइस पर स्क्रीन रीडर उपलब्ध नहीं है',
      'read-normal': 'सामान्य पढ़ना',
      'read-fast': 'तेज़ पढ़ना',
      'read-slow': 'धीमा पढ़ना',

      // Text spacing component
      'text-spacing': 'टेक्स्ट स्पेसिंग',
      'light-spacing': 'हल्की स्पेसिंग',
      'moderate-spacing': 'मध्यम स्पेसिंग',
      'heavy-spacing': 'भारी स्पेसिंग',

      // Screen mask component
      'screen-mask': 'स्क्रीन मास्क',
      'small-cursor': 'छोटा कर्सर',
      'medium-cursor': 'मध्यम कर्सर',
      'large-cursor': 'बड़ा कर्सर',
      'reading-mask': 'रीडिंग मास्क',

      // Color blind support
      'color-blind-support': 'वर्णांधता सहायता',
      'protanopia': 'प्रोटानोपिया',
      'deuteranopia': 'ड्यूटेरानोपिया',
      'tritanopia': 'ट्रिटानोपिया',
      'enable-color-blind-support': 'वर्णांधता सहायता सक्षम करें',
      'color-blind-support-active': 'वर्णांधता सहायता सक्रिय',
      'color-blind-support-disabled': 'वर्णांधता सहायता निष्क्रिय',
      'color-blind-support-protanopia': 'प्रोटानोपिया सहायता सक्षम',
      'color-blind-support-deuteranopia': 'ड्यूटेरानोपिया सहायता सक्षम',
      'color-blind-support-tritanopia': 'ट्रिटानोपिया सहायता सक्षम',

      // Other components
      'saturation': 'संतृप्ति',
      'line-height': 'लाइन की ऊंचाई',
      'skip-links': 'स्किप लिंक',
      'focus-enhancement': 'फोकस सुधार',
      'reduced-motion': 'कम गति',
      'keyboard-navigation': 'कीबोर्ड नेवीगेशन',

      // Line height states
      'default-line-height': 'डिफ़ॉल्ट',
      'light-line-height': 'हल्की ऊंचाई',
      'moderate-line-height': 'मध्यम ऊंचाई',
      'heavy-line-height': 'भारी ऊंचाई',

      // Saturation states
      'normal-saturation': 'सामान्य',
      'low-saturation': 'कम संतृप्ति',
      'high-saturation': 'उच्च संतृप्ति',
      'desaturated': 'असंतृप्त',

      // Reduced motion states
      'normal-motion': 'सामान्य गति',
      'reduce-motion': 'गति कम करें',

      // Focus enhancement states
      'default-focus': 'डिफ़ॉल्ट फोकस',
      'enhanced-focus': 'बेहतर फोकस',

      // Keyboard navigation states
      'keyboard-nav-off': 'कीबोर्ड नेवीगेशन बंद',
      'keyboard-nav-on': 'कीबोर्ड नेवीगेशन चालू',

      // Skip links
      'skip-to-main-content': 'मुख्य सामग्री पर जाएं',
      'skip-to-navigation': 'नेवीगेशन पर जाएं',
      'skip-to-search': 'खोज पर जाएं',
      'skip-to-footer': 'फुटर पर जाएं',

      // Announcements
      'skip-links-enabled': 'स्किप लिंक सक्षम',
      'skip-links-disabled': 'स्किप लिंक निष्क्रिय',
      'focus-enhancement-enabled': 'बेहतर फोकस संकेतक सक्षम',
      'focus-enhancement-disabled': 'बेहतर फोकस संकेतक निष्क्रिय',
      'reduced-motion-enabled': 'कम गति सक्षम - एनीमेशन निष्क्रिय',
      'reduced-motion-disabled': 'कम गति निष्क्रिय - एनीमेशन बहाल',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    },
    'tr': {
      // Main component
      'accessibility-tools': 'Erişilebilirlik araçları',
      'open-accessibility-panel': 'Erişilebilirlik panelini aç',
      'close-accessibility-panel': 'Erişilebilirlik panelini kapat',
      'accessibility-options-panel': 'Erişilebilirlik seçenekleri paneli',
      'accessibility-features': 'Erişilebilirlik özellikleri',

      // Contrast component
      'contrast': 'Kontrast',
      'invert': 'Ters çevir',
      'high-contrast': 'Yüksek Kontrast',
      'dark-high-contrast': 'Koyu Yüksek Kontrast',

      // Text size component
      'bigger-text': 'Büyük Metin',
      'medium-text': 'Orta Metin',
      'large-text': 'Büyük Metin',
      'extra-large-text': 'Çok Büyük Metin',

      // Screen reader component
      'screen-reader': 'Ekran Okuyucu',
      'screen-reader-unavailable': 'Bu cihazda ekran okuyucu kullanılamıyor',
      'read-normal': 'Normal Okuma',
      'read-fast': 'Hızlı Okuma',
      'read-slow': 'Yavaş Okuma',

      // Text spacing component
      'text-spacing': 'Metin Aralığı',
      'light-spacing': 'Hafif Aralık',
      'moderate-spacing': 'Orta Aralık',
      'heavy-spacing': 'Geniş Aralık',

      // Screen mask component
      'screen-mask': 'Ekran Maskesi',
      'small-cursor': 'Küçük İmleç',
      'medium-cursor': 'Orta İmleç',
      'large-cursor': 'Büyük İmleç',
      'reading-mask': 'Okuma Maskesi',

      // Color blind support
      'color-blind-support': 'Renk Körlüğü Desteği',
      'protanopia': 'Protanopi',
      'deuteranopia': 'Döteranopi',
      'tritanopia': 'Tritanopi',
      'enable-color-blind-support': 'Renk körlüğü desteğini etkinleştir',
      'color-blind-support-active': 'Renk körlüğü desteği aktif',
      'color-blind-support-disabled': 'Renk körlüğü desteği devre dışı',
      'color-blind-support-protanopia': 'Protanopi desteği etkinleştirildi',
      'color-blind-support-deuteranopia': 'Döteranopi desteği etkinleştirildi',
      'color-blind-support-tritanopia': 'Tritanopi desteği etkinleştirildi',

      // Other components
      'saturation': 'Doygunluk',
      'line-height': 'Satır Yüksekliği',
      'skip-links': 'Atlama Bağlantıları',
      'focus-enhancement': 'Odak Geliştirme',
      'reduced-motion': 'Azaltılmış Hareket',
      'keyboard-navigation': 'Klavye Navigasyonu',

      // Line height states
      'default-line-height': 'Varsayılan',
      'light-line-height': 'Hafif Yükseklik',
      'moderate-line-height': 'Orta Yükseklik',
      'heavy-line-height': 'Ağır Yükseklik',

      // Saturation states
      'normal-saturation': 'Normal',
      'low-saturation': 'Düşük Doygunluk',
      'high-saturation': 'Yüksek Doygunluk',
      'desaturated': 'Doygunluğu Azaltılmış',

      // Reduced motion states
      'normal-motion': 'Normal Hareket',
      'reduce-motion': 'Hareketi Azalt',

      // Focus enhancement states
      'default-focus': 'Varsayılan Odak',
      'enhanced-focus': 'Geliştirilmiş Odak',

      // Keyboard navigation states
      'keyboard-nav-off': 'Klavye Navigasyonu Kapalı',
      'keyboard-nav-on': 'Klavye Navigasyonu Açık',

      // Skip links
      'skip-to-main-content': 'Ana içeriğe atla',
      'skip-to-navigation': 'Navigasyona atla',
      'skip-to-search': 'Aramaya atla',
      'skip-to-footer': 'Alt bilgiye atla',

      // Announcements
      'skip-links-enabled': 'Atlama bağlantıları etkinleştirildi',
      'skip-links-disabled': 'Atlama bağlantıları devre dışı bırakıldı',
      'focus-enhancement-enabled': 'Geliştirilmiş odak göstergeleri etkinleştirildi',
      'focus-enhancement-disabled': 'Geliştirilmiş odak göstergeleri devre dışı bırakıldı',
      'reduced-motion-enabled': 'Azaltılmış hareket etkinleştirildi - animasyonlar devre dışı',
      'reduced-motion-disabled': 'Azaltılmış hareket devre dışı bırakıldı - animasyonlar geri yüklendi',
      // New WCAG 2.1 Level A/AA Features
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',

      // Alt Text Validator
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',

      // Page Title Validator
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',

      // Language Validator
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',

      // Auto Refresh Controls
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',

      // Focus Trap
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',

      // Touch Target Validator
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',

      // Reading Order Validator
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',

      // Error Identification
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active'
    }
  };

  constructor() {
    this.detectLocale();
  }

  private detectLocale(): void {
    // Try to detect locale from browser
    const browserLocale = navigator.language || 'en-US';
    
    // Check if we have translations for this locale
    if (this.translations[browserLocale]) {
      this.currentLocale = browserLocale;
    } else {
      // Try to match by language only (e.g., 'en' from 'en-GB')
      const language = browserLocale.split('-')[0];
      const matchingLocale = Object.keys(this.translations).find(locale => 
        locale.startsWith(language)
      );
      
      if (matchingLocale) {
        this.currentLocale = matchingLocale;
      }
    }
  }

  setLocale(locale: string): void {
    if (this.translations[locale]) {
      this.currentLocale = locale;
    }
  }

  getTranslation(key: keyof AstralTranslations): string {
    return this.translations[this.currentLocale]?.[key] || this.translations['en-US'][key] || key;
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getAvailableLocales(): string[] {
    return Object.keys(this.translations);
  }
}
