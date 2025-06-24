const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'projects/astral-accessibility/src/lib/services/i18n.service.ts');

// The new translation keys to add (in English - can be translated later)
const newTranslations = `
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
      'error-identification-active': 'Error identification active'`;

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern to find the end of each language section (just before the closing brace)
  // We look for the 'reduced-motion-disabled' line followed by the end of the object
  const pattern = /('reduced-motion-disabled': '[^']*')\s*(\n\s*},?)/g;
  
  content = content.replace(pattern, `$1,${newTranslations}$2`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated translations for all languages');
  
} catch (error) {
  console.error('Error updating translations:', error);
}
