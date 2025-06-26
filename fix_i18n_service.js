const fs = require('fs');
const path = require('path');

// Create a clean i18n service file with proper translations
const cleanI18nService = `import { Injectable } from '@angular/core';

export interface AstralTranslations {
  'accessibility-tools': string;
  'contrast': string;
  'bigger-text': string;
  'screen-reader': string;
  'text-spacing': string;
  'screen-mask': string;
  'saturation': string;
  'line-height': string;
  'skip-links': string;
  'focus-enhancement': string;
  'form-enhancement': string;
  'page-structure': string;
  'reduced-motion': string;
  'keyboard-navigation': string;
  'invert': string;
  'high-contrast': string;
  'dark-high-contrast': string;
  'medium-text': string;
  'large-text': string;
  'extra-large-text': string;
  'read-normal': string;
  'read-fast': string;
  'read-slow': string;
  'light-spacing': string;
  'moderate-spacing': string;
  'heavy-spacing': string;
  'large-cursor': string;
  'reading-mask': string;
  'low-saturation': string;
  'high-saturation': string;
  'desaturated': string;
  'screen-reader-unavailable': string;
  'color-blind-support': string;
  'protanopia': string;
  'deuteranopia': string;
  'tritanopia': string;
  'alt-text-validator': string;
  'page-title-validator': string;
  'language-validator': string;
  'auto-refresh-controls': string;
  'focus-trap': string;
  'touch-target-validator': string;
  'reading-order-validator': string;
  'error-identification': string;
  'text-align': string;
  'dictionary': string;
  'highlight-links': string;
  'pause-animations': string;
  'hide-images': string;
  'dyslexia-friendly': string;
  'enable-dyslexia-friendly': string;
  'dyslexia-friendly-active': string;
  'dyslexia-friendly-disabled': string;
  'dyslexia-friendly-opendyslexic': string;
  'dyslexia-friendly-high-readability': string;
  'dyslexia-friendly-reading-guide': string;
  'cursor': string;
  'tooltip': string;
  'open-accessibility-panel': string;
  'close-accessibility-panel': string;
  'accessibility-options-panel': string;
  'accessibility-features': string;
  'small-cursor': string;
  'medium-cursor': string;
  'normal-saturation': string;
  'low-saturation-mode': string;
  'high-saturation-mode': string;
  'medium-saturation': string;
  'default-line-height': string;
  'light-line-height': string;
  'moderate-line-height': string;
  'heavy-line-height': string;
  'normal-motion': string;
  'reduce-motion': string;
  'default-focus': string;
  'enhanced-focus': string;
  'keyboard-nav-off': string;
  'keyboard-nav-on': string;
  'skip-to-main-content': string;
  'skip-to-navigation': string;
  'skip-to-search': string;
  'skip-to-footer': string;
  'skip-links-enabled': string;
  'skip-links-disabled': string;
  'focus-enhancement-enabled': string;
  'focus-enhancement-disabled': string;
  'reduced-motion-enabled': string;
  'reduced-motion-disabled': string;
  'enable-color-blind-support': string;
  'color-blind-support-active': string;
  'color-blind-support-disabled': string;
  'color-blind-support-protanopia': string;
  'color-blind-support-deuteranopia': string;
  'color-blind-support-tritanopia': string;
  'validate-alt-text': string;
  'alt-text-issues-found': string;
  'no-alt-text-issues': string;
  'missing-alt-text': string;
  'decorative-images': string;
  'complex-images': string;
  'validate-page-title': string;
  'page-title-valid': string;
  'page-title-invalid': string;
  'page-title-missing': string;
  'page-title-too-long': string;
  'page-title-not-descriptive': string;
  'validate-language': string;
  'language-valid': string;
  'language-invalid': string;
  'missing-lang-attribute': string;
  'invalid-lang-code': string;
  'mixed-languages-detected': string;
  'auto-refresh-detected': string;
  'pause-auto-refresh': string;
  'resume-auto-refresh': string;
  'auto-refresh-paused': string;
  'auto-refresh-resumed': string;
  'no-auto-refresh-detected': string;
  'enable-focus-trap': string;
  'disable-focus-trap': string;
  'focus-trap-enabled': string;
  'focus-trap-disabled': string;
  'focus-trapped': string;
  'validate-touch-targets': string;
  'touch-targets-valid': string;
  'touch-targets-invalid': string;
  'small-touch-targets': string;
  'overlapping-touch-targets': string;
  'minimum-size-44px': string;
  'validate-reading-order': string;
  'reading-order-valid': string;
  'reading-order-issues': string;
  'heading-structure-issues': string;
  'tab-order-issues': string;
  'visual-reading-order': string;
  'identify-errors': string;
  'no-errors-found': string;
  'errors-found': string;
  'form-validation-errors': string;
  'missing-error-messages': string;
  'error-identification-active': string;
  'left-align': string;
  'center-align': string;
  'right-align': string;
  'dictionary-active': string;
  'loading-definition': string;
  'definition-not-found': string;
  'select-word-for-definition': string;
  'subtle-highlight': string;
  'strong-highlight': string;
  'underline-all': string;
  'pause-all': string;
  'disable-autoplay': string;
  'hide-decorative': string;
  'hide-all': string;
  'show-alt-text': string;
  'dyslexia-font': string;
  'dyslexia-opendyslexic-font': string;
  'dyslexia-high-readability': string;
  'dyslexia-reading-guide': string;
  'high-contrast-text': string;
  'reading-guide': string;
  'default-cursor': string;
  'extra-large-cursor': string;
  'tooltip-active': string;
  'show-tooltips': string;
  'enhanced-tooltips': string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLocale = 'en-US';
  
  private readonly translations: Record<string, AstralTranslations> = {
    'en-US': {
      'accessibility-tools': 'Accessibility tools',
      'contrast': 'Contrast',
      'bigger-text': 'Bigger Text',
      'screen-reader': 'Screen Reader',
      'text-spacing': 'Text Spacing',
      'screen-mask': 'Screen Mask',
      'saturation': 'Saturation',
      'line-height': 'Line Height',
      'skip-links': 'Skip Links',
      'focus-enhancement': 'Focus Enhancement',
      'form-enhancement': 'Form Enhancement',
      'page-structure': 'Page Structure',
      'reduced-motion': 'Reduced Motion',
      'keyboard-navigation': 'Keyboard Navigation',
      'invert': 'Invert',
      'high-contrast': 'High Contrast',
      'dark-high-contrast': 'Dark High Contrast',
      'medium-text': 'Medium Text',
      'large-text': 'Large Text',
      'extra-large-text': 'Extra Large Text',
      'read-normal': 'Read Normal',
      'read-fast': 'Read Fast',
      'read-slow': 'Read Slow',
      'light-spacing': 'Light Spacing',
      'moderate-spacing': 'Moderate Spacing',
      'heavy-spacing': 'Heavy Spacing',
      'large-cursor': 'Large Cursor',
      'reading-mask': 'Reading Mask',
      'low-saturation': 'Low Saturation',
      'high-saturation': 'High Saturation',
      'desaturated': 'Desaturated',
      'screen-reader-unavailable': 'Screen Reader unavailable on device',
      'color-blind-support': 'Color Blind Support',
      'protanopia': 'Protanopia',
      'deuteranopia': 'Deuteranopia',
      'tritanopia': 'Tritanopia',
      'alt-text-validator': 'Alt Text Validator',
      'page-title-validator': 'Page Title Validator',
      'language-validator': 'Language Validator',
      'auto-refresh-controls': 'Auto Refresh Controls',
      'focus-trap': 'Focus Trap',
      'touch-target-validator': 'Touch Target Validator',
      'reading-order-validator': 'Reading Order Validator',
      'error-identification': 'Error Identification',
      'text-align': 'Text Align',
      'dictionary': 'Dictionary',
      'highlight-links': 'Highlight Links',
      'pause-animations': 'Pause Animations',
      'hide-images': 'Hide Images',
      'dyslexia-friendly': 'Dyslexia Friendly',
      'enable-dyslexia-friendly': 'Enable dyslexia friendly mode',
      'dyslexia-friendly-active': 'Dyslexia friendly mode active',
      'dyslexia-friendly-disabled': 'Dyslexia friendly mode disabled',
      'dyslexia-friendly-opendyslexic': 'Dyslexia friendly mode enabled with OpenDyslexic font',
      'dyslexia-friendly-high-readability': 'Dyslexia friendly mode enabled with high readability',
      'dyslexia-friendly-reading-guide': 'Dyslexia friendly mode enabled with reading guide',
      'dyslexia-opendyslexic-font': 'OpenDyslexic Font',
      'dyslexia-high-readability': 'High Readability',
      'dyslexia-reading-guide': 'Reading Guide',
      'cursor': 'Cursor',
      'tooltip': 'Tooltip',
      'open-accessibility-panel': 'Open accessibility panel',
      'close-accessibility-panel': 'Close accessibility panel',
      'accessibility-options-panel': 'Accessibility options panel',
      'accessibility-features': 'Accessibility features',
      'small-cursor': 'Small Cursor',
      'medium-cursor': 'Medium Cursor',
      'normal-saturation': 'Normal',
      'low-saturation-mode': 'Low Saturation',
      'high-saturation-mode': 'High Saturation',
      'medium-saturation': 'Medium Saturation',
      'default-line-height': 'Default',
      'light-line-height': 'Light Height',
      'moderate-line-height': 'Moderate Height',
      'heavy-line-height': 'Heavy Height',
      'normal-motion': 'Normal Motion',
      'reduce-motion': 'Reduce Motion',
      'default-focus': 'Default Focus',
      'enhanced-focus': 'Enhanced Focus',
      'keyboard-nav-off': 'Keyboard Navigation Off',
      'keyboard-nav-on': 'Keyboard Navigation On',
      'skip-to-main-content': 'Skip to main content',
      'skip-to-navigation': 'Skip to navigation',
      'skip-to-search': 'Skip to search',
      'skip-to-footer': 'Skip to footer',
      'skip-links-enabled': 'Skip links enabled',
      'skip-links-disabled': 'Skip links disabled',
      'focus-enhancement-enabled': 'Enhanced focus indicators enabled',
      'focus-enhancement-disabled': 'Enhanced focus indicators disabled',
      'reduced-motion-enabled': 'Reduced motion enabled - animations disabled',
      'reduced-motion-disabled': 'Reduced motion disabled - animations restored',
      'enable-color-blind-support': 'Enable color blind support',
      'color-blind-support-active': 'Color blind support active',
      'color-blind-support-disabled': 'Color blind support disabled',
      'color-blind-support-protanopia': 'Color blind support enabled for protanopia (red-blind)',
      'color-blind-support-deuteranopia': 'Color blind support enabled for deuteranopia (green-blind)',
      'color-blind-support-tritanopia': 'Color blind support enabled for tritanopia (blue-blind)',
      'validate-alt-text': 'Validate Alt Text',
      'alt-text-issues-found': 'Alt text issues found',
      'no-alt-text-issues': 'No alt text issues found',
      'missing-alt-text': 'Missing alt text',
      'decorative-images': 'Decorative images',
      'complex-images': 'Complex images need descriptions',
      'validate-page-title': 'Validate Page Title',
      'page-title-valid': 'Page title is valid',
      'page-title-invalid': 'Page title has issues',
      'page-title-missing': 'Page title is missing',
      'page-title-too-long': 'Page title is too long',
      'page-title-not-descriptive': 'Page title is not descriptive',
      'validate-language': 'Validate Language',
      'language-valid': 'Language attributes are valid',
      'language-invalid': 'Language attributes have issues',
      'missing-lang-attribute': 'Missing lang attribute',
      'invalid-lang-code': 'Invalid language code',
      'mixed-languages-detected': 'Mixed languages detected',
      'auto-refresh-detected': 'Auto refresh detected',
      'pause-auto-refresh': 'Pause Auto Refresh',
      'resume-auto-refresh': 'Resume Auto Refresh',
      'auto-refresh-paused': 'Auto refresh paused',
      'auto-refresh-resumed': 'Auto refresh resumed',
      'no-auto-refresh-detected': 'No auto refresh detected',
      'enable-focus-trap': 'Enable Focus Trap',
      'disable-focus-trap': 'Disable Focus Trap',
      'focus-trap-enabled': 'Focus trap enabled',
      'focus-trap-disabled': 'Focus trap disabled',
      'focus-trapped': 'Focus is trapped in this area',
      'validate-touch-targets': 'Validate Touch Targets',
      'touch-targets-valid': 'Touch targets are valid',
      'touch-targets-invalid': 'Touch targets have issues',
      'small-touch-targets': 'Small touch targets found',
      'overlapping-touch-targets': 'Overlapping touch targets found',
      'minimum-size-44px': 'Touch targets should be at least 44px',
      'validate-reading-order': 'Validate Reading Order',
      'reading-order-valid': 'Reading order is valid',
      'reading-order-issues': 'Reading order has issues',
      'heading-structure-issues': 'Heading structure issues',
      'tab-order-issues': 'Tab order issues',
      'visual-reading-order': 'Visual reading order',
      'identify-errors': 'Identify Errors',
      'no-errors-found': 'No errors found',
      'errors-found': 'Errors found',
      'form-validation-errors': 'Form validation errors',
      'missing-error-messages': 'Missing error messages',
      'error-identification-active': 'Error identification active',
      'left-align': 'Left Align',
      'center-align': 'Center Align',
      'right-align': 'Right Align',
      'dictionary-active': 'Dictionary Active',
      'loading-definition': 'Loading definition...',
      'definition-not-found': 'Definition not found',
      'select-word-for-definition': 'Select a word for definition',
      'subtle-highlight': 'Subtle Highlight',
      'strong-highlight': 'Strong Highlight',
      'underline-all': 'Underline All',
      'pause-all': 'Pause All',
      'disable-autoplay': 'Disable Autoplay',
      'hide-decorative': 'Hide Decorative',
      'hide-all': 'Hide All',
      'show-alt-text': 'Show Alt Text',
      'dyslexia-font': 'Dyslexia Font',
      'high-contrast-text': 'High Contrast Text',
      'reading-guide': 'Reading Guide',
      'default-cursor': 'Default Cursor',
      'extra-large-cursor': 'Extra Large Cursor',
      'tooltip-active': 'Tooltip Active',
      'show-tooltips': 'Show Tooltips',
      'enhanced-tooltips': 'Enhanced Tooltips'
    },
    'es-ES': {
      'accessibility-tools': 'Herramientas de accesibilidad',
      'contrast': 'Contraste',
      'bigger-text': 'Texto más grande',
      'screen-reader': 'Lector de pantalla',
      'text-spacing': 'Espaciado de texto',
      'screen-mask': 'Máscara de pantalla',
      'saturation': 'Saturación',
      'line-height': 'Altura de línea',
      'skip-links': 'Enlaces de salto',
      'focus-enhancement': 'Mejora del foco',
      'form-enhancement': 'Mejora de formularios',
      'page-structure': 'Estructura de página',
      'reduced-motion': 'Movimiento reducido',
      'keyboard-navigation': 'Navegación por teclado',
      'invert': 'Invertir',
      'high-contrast': 'Alto contraste',
      'dark-high-contrast': 'Alto contraste oscuro',
      'medium-text': 'Texto mediano',
      'large-text': 'Texto grande',
      'extra-large-text': 'Texto extra grande',
      'read-normal': 'Leer normal',
      'read-fast': 'Leer rápido',
      'read-slow': 'Leer lento',
      'light-spacing': 'Espaciado ligero',
      'moderate-spacing': 'Espaciado moderado',
      'heavy-spacing': 'Espaciado pesado',
      'large-cursor': 'Cursor grande',
      'reading-mask': 'Máscara de lectura',
      'low-saturation': 'Saturación baja',
      'high-saturation': 'Saturación alta',
      'desaturated': 'Desaturado',
      'screen-reader-unavailable': 'Lector de pantalla no disponible en este dispositivo',
      'color-blind-support': 'Soporte para daltonismo',
      'protanopia': 'Protanopía',
      'deuteranopia': 'Deuteranopía',
      'tritanopia': 'Tritanopía',
      'alt-text-validator': 'Validador de texto alternativo',
      'page-title-validator': 'Validador de título de página',
      'language-validator': 'Validador de idioma',
      'auto-refresh-controls': 'Controles de actualización automática',
      'focus-trap': 'Trampa de foco',
      'touch-target-validator': 'Validador de objetivos táctiles',
      'reading-order-validator': 'Validador de orden de lectura',
      'error-identification': 'Identificación de errores',
      'text-align': 'Alineación de texto',
      'dictionary': 'Diccionario',
      'highlight-links': 'Resaltar enlaces',
      'pause-animations': 'Pausar animaciones',
      'hide-images': 'Ocultar imágenes',
      'dyslexia-friendly': 'Amigable para dislexia',
      'enable-dyslexia-friendly': 'Habilitar modo amigable para dislexia',
      'dyslexia-friendly-active': 'Modo amigable para dislexia activo',
      'dyslexia-friendly-disabled': 'Modo amigable para dislexia deshabilitado',
      'dyslexia-friendly-opendyslexic': 'Modo amigable para dislexia habilitado con fuente OpenDyslexic',
      'dyslexia-friendly-high-readability': 'Modo amigable para dislexia habilitado con alta legibilidad',
      'dyslexia-friendly-reading-guide': 'Modo amigable para dislexia habilitado con guía de lectura',
      'dyslexia-opendyslexic-font': 'Fuente OpenDyslexic',
      'dyslexia-high-readability': 'Alta legibilidad',
      'dyslexia-reading-guide': 'Guía de lectura',
      'cursor': 'Cursor',
      'tooltip': 'Información sobre herramientas',
      'open-accessibility-panel': 'Abrir panel de accesibilidad',
      'close-accessibility-panel': 'Cerrar panel de accesibilidad',
      'accessibility-options-panel': 'Panel de opciones de accesibilidad',
      'accessibility-features': 'Características de accesibilidad',
      'small-cursor': 'Cursor pequeño',
      'medium-cursor': 'Cursor mediano',
      'normal-saturation': 'Normal',
      'low-saturation-mode': 'Saturación baja',
      'high-saturation-mode': 'Saturación alta',
      'medium-saturation': 'Saturación media',
      'default-line-height': 'Predeterminado',
      'light-line-height': 'Altura ligera',
      'moderate-line-height': 'Altura moderada',
      'heavy-line-height': 'Altura pesada',
      'normal-motion': 'Movimiento normal',
      'reduce-motion': 'Reducir movimiento',
      'default-focus': 'Foco predeterminado',
      'enhanced-focus': 'Foco mejorado',
      'keyboard-nav-off': 'Navegación por teclado desactivada',
      'keyboard-nav-on': 'Navegación por teclado activada',
      'skip-to-main-content': 'Saltar al contenido principal',
      'skip-to-navigation': 'Saltar a la navegación',
      'skip-to-search': 'Saltar a la búsqueda',
      'skip-to-footer': 'Saltar al pie de página',
      'skip-links-enabled': 'Enlaces de salto habilitados',
      'skip-links-disabled': 'Enlaces de salto deshabilitados',
      'focus-enhancement-enabled': 'Indicadores de foco mejorados habilitados',
      'focus-enhancement-disabled': 'Indicadores de foco mejorados deshabilitados',
      'reduced-motion-enabled': 'Movimiento reducido habilitado - animaciones deshabilitadas',
      'reduced-motion-disabled': 'Movimiento reducido deshabilitado - animaciones restauradas',
      'enable-color-blind-support': 'Habilitar soporte para daltonismo',
      'color-blind-support-active': 'Soporte para daltonismo activo',
      'color-blind-support-disabled': 'Soporte para daltonismo deshabilitado',
      'color-blind-support-protanopia': 'Soporte para daltonismo habilitado para protanopía (ciego al rojo)',
      'color-blind-support-deuteranopia': 'Soporte para daltonismo habilitado para deuteranopía (ciego al verde)',
      'color-blind-support-tritanopia': 'Soporte para daltonismo habilitado para tritanopía (ciego al azul)',
      'validate-alt-text': 'Validar texto alternativo',
      'alt-text-issues-found': 'Se encontraron problemas con el texto alternativo',
      'no-alt-text-issues': 'No se encontraron problemas con el texto alternativo',
      'missing-alt-text': 'Texto alternativo faltante',
      'decorative-images': 'Imágenes decorativas',
      'complex-images': 'Las imágenes complejas necesitan descripciones',
      'validate-page-title': 'Validar título de página',
      'page-title-valid': 'El título de la página es válido',
      'page-title-invalid': 'El título de la página tiene problemas',
      'page-title-missing': 'El título de la página está faltante',
      'page-title-too-long': 'El título de la página es demasiado largo',
      'page-title-not-descriptive': 'El título de la página no es descriptivo',
      'validate-language': 'Validar idioma',
      'language-valid': 'Los atributos de idioma son válidos',
      'language-invalid': 'Los atributos de idioma tienen problemas',
      'missing-lang-attribute': 'Atributo lang faltante',
      'invalid-lang-code': 'Código de idioma inválido',
      'mixed-languages-detected': 'Se detectaron idiomas mixtos',
      'auto-refresh-detected': 'Actualización automática detectada',
      'pause-auto-refresh': 'Pausar actualización automática',
      'resume-auto-refresh': 'Reanudar actualización automática',
      'auto-refresh-paused': 'Actualización automática pausada',
      'auto-refresh-resumed': 'Actualización automática reanudada',
      'no-auto-refresh-detected': 'No se detectó actualización automática',
      'enable-focus-trap': 'Habilitar trampa de foco',
      'disable-focus-trap': 'Deshabilitar trampa de foco',
      'focus-trap-enabled': 'Trampa de foco habilitada',
      'focus-trap-disabled': 'Trampa de foco deshabilitada',
      'focus-trapped': 'El foco está atrapado en esta área',
      'validate-touch-targets': 'Validar objetivos táctiles',
      'touch-targets-valid': 'Los objetivos táctiles son válidos',
      'touch-targets-invalid': 'Los objetivos táctiles tienen problemas',
      'small-touch-targets': 'Se encontraron objetivos táctiles pequeños',
      'overlapping-touch-targets': 'Se encontraron objetivos táctiles superpuestos',
      'minimum-size-44px': 'Los objetivos táctiles deben tener al menos 44px',
      'validate-reading-order': 'Validar orden de lectura',
      'reading-order-valid': 'El orden de lectura es válido',
      'reading-order-issues': 'El orden de lectura tiene problemas',
      'heading-structure-issues': 'Problemas de estructura de encabezados',
      'tab-order-issues': 'Problemas de orden de tabulación',
      'visual-reading-order': 'Orden de lectura visual',
      'identify-errors': 'Identificar errores',
      'no-errors-found': 'No se encontraron errores',
      'errors-found': 'Se encontraron errores',
      'form-validation-errors': 'Errores de validación de formulario',
      'missing-error-messages': 'Mensajes de error faltantes',
      'error-identification-active': 'Identificación de errores activa',
      'left-align': 'Alinear a la izquierda',
      'center-align': 'Alinear al centro',
      'right-align': 'Alinear a la derecha',
      'dictionary-active': 'Diccionario activo',
      'loading-definition': 'Cargando definición...',
      'definition-not-found': 'Definición no encontrada',
      'select-word-for-definition': 'Selecciona una palabra para la definición',
      'subtle-highlight': 'Resaltado sutil',
      'strong-highlight': 'Resaltado fuerte',
      'underline-all': 'Subrayar todo',
      'pause-all': 'Pausar todo',
      'disable-autoplay': 'Desactivar reproducción automática',
      'hide-decorative': 'Ocultar decorativo',
      'hide-all': 'Ocultar todo',
      'show-alt-text': 'Mostrar texto alternativo',
      'dyslexia-font': 'Fuente dislexia',
      'high-contrast-text': 'Texto de alto contraste',
      'reading-guide': 'Guía de lectura',
      'default-cursor': 'Cursor por defecto',
      'extra-large-cursor': 'Cursor extra grande',
      'tooltip-active': 'Información sobre herramientas activa',
      'show-tooltips': 'Mostrar información sobre herramientas',
      'enhanced-tooltips': 'Información sobre herramientas mejorada'
    }
  };

  setLocale(locale: string): void {
    this.currentLocale = locale;
  }
  
  getTranslation(key: keyof AstralTranslations): string {
    const translations = this.translations[this.currentLocale] || this.translations['en-US'];
    return translations[key] || key.toString();
  }
}`;

// Write the clean file
const i18nPath = path.join(__dirname, 'projects/astral-accessibility/src/lib/services/i18n.service.ts');
fs.writeFileSync(i18nPath, cleanI18nService, 'utf8');

console.log('i18n service file has been cleaned and restored successfully!'); 