const fs = require('fs');
const path = require('path');

// Read the current i18n service file
const i18nPath = path.join(__dirname, 'projects/astral-accessibility/src/lib/services/i18n.service.ts');
let content = fs.readFileSync(i18nPath, 'utf8');

// Define translations for each language
const translations = {
  'fr-FR': {
    'accessibility-tools': 'Outils d\'accessibilité',
    'form-enhancement': 'Amélioration des formulaires',
    'page-structure': 'Structure de page',
    'hide-images': 'Masquer les images',
    'pause-animations': 'Pause des animations',
    'reduced-motion': 'Mouvement réduit',
    'tooltip': 'Info-bulle',
    'cursor': 'Curseur',
    'highlight-links': 'Surligner les liens',
    'dictionary': 'Dictionnaire',
    'text-align': 'Alignement du texte',
    'error-identification': 'Identification d\'erreurs',
    'reading-order-validator': 'Validateur d\'ordre de lecture',
    'touch-target-validator': 'Validateur de cibles tactiles',
    'focus-trap': 'Piège de focus',
    'auto-refresh-controls': 'Contrôles de rafraîchissement automatique',
    'language-validator': 'Validateur de langue',
    'page-title-validator': 'Validateur de titre de page',
    'alt-text-validator': 'Validateur de texte alternatif'
  },
  'de-DE': {
    'accessibility-tools': 'Barrierefreiheit-Tools',
    'form-enhancement': 'Formular-Verbesserung',
    'page-structure': 'Seitenstruktur',
    'hide-images': 'Bilder ausblenden',
    'pause-animations': 'Animationen pausieren',
    'reduced-motion': 'Reduzierte Bewegung',
    'tooltip': 'Tooltip',
    'cursor': 'Cursor',
    'highlight-links': 'Links hervorheben',
    'dictionary': 'Wörterbuch',
    'text-align': 'Textausrichtung',
    'error-identification': 'Fehleridentifikation',
    'reading-order-validator': 'Lesereihenfolge-Validator',
    'touch-target-validator': 'Touch-Target-Validator',
    'focus-trap': 'Fokus-Falle',
    'auto-refresh-controls': 'Auto-Refresh-Steuerung',
    'language-validator': 'Sprach-Validator',
    'page-title-validator': 'Seitentitel-Validator',
    'alt-text-validator': 'Alt-Text-Validator'
  },
  'zh-CN': {
    'accessibility-tools': '无障碍工具',
    'form-enhancement': '表单增强',
    'page-structure': '页面结构',
    'hide-images': '隐藏图片',
    'pause-animations': '暂停动画',
    'reduced-motion': '减少动画',
    'tooltip': '工具提示',
    'cursor': '光标',
    'highlight-links': '高亮链接',
    'dictionary': '词典',
    'text-align': '文本对齐',
    'error-identification': '错误识别',
    'reading-order-validator': '阅读顺序验证器',
    'touch-target-validator': '触摸目标验证器',
    'focus-trap': '焦点陷阱',
    'auto-refresh-controls': '自动刷新控制',
    'language-validator': '语言验证器',
    'page-title-validator': '页面标题验证器',
    'alt-text-validator': '替代文本验证器'
  },
  'ja-JP': {
    'accessibility-tools': 'アクセシビリティツール',
    'form-enhancement': 'フォーム強化',
    'page-structure': 'ページ構造',
    'hide-images': '画像を非表示',
    'pause-animations': 'アニメーションを一時停止',
    'reduced-motion': '動きを減らす',
    'tooltip': 'ツールチップ',
    'cursor': 'カーソル',
    'highlight-links': 'リンクをハイライト',
    'dictionary': '辞書',
    'text-align': 'テキスト配置',
    'error-identification': 'エラー識別',
    'reading-order-validator': '読み順バリデーター',
    'touch-target-validator': 'タッチターゲットバリデーター',
    'focus-trap': 'フォーカストラップ',
    'auto-refresh-controls': '自動更新コントロール',
    'language-validator': '言語バリデーター',
    'page-title-validator': 'ページタイトルバリデーター',
    'alt-text-validator': '代替テキストバリデーター'
  },
  'ko-KR': {
    'accessibility-tools': '접근성 도구',
    'form-enhancement': '양식 개선',
    'page-structure': '페이지 구조',
    'hide-images': '이미지 숨기기',
    'pause-animations': '애니메이션 일시정지',
    'reduced-motion': '움직임 감소',
    'tooltip': '툴팁',
    'cursor': '커서',
    'highlight-links': '링크 강조',
    'dictionary': '사전',
    'text-align': '텍스트 정렬',
    'error-identification': '오류 식별',
    'reading-order-validator': '읽기 순서 검증기',
    'touch-target-validator': '터치 타겟 검증기',
    'focus-trap': '포커스 트랩',
    'auto-refresh-controls': '자동 새로고침 제어',
    'language-validator': '언어 검증기',
    'page-title-validator': '페이지 제목 검증기',
    'alt-text-validator': '대체 텍스트 검증기'
  },
  'ar-SA': {
    'accessibility-tools': 'أدوات إمكانية الوصول',
    'form-enhancement': 'تحسين النماذج',
    'page-structure': 'هيكل الصفحة',
    'hide-images': 'إخفاء الصور',
    'pause-animations': 'إيقاف الرسوم المتحركة مؤقتاً',
    'reduced-motion': 'تقليل الحركة',
    'tooltip': 'تلميح',
    'cursor': 'المؤشر',
    'highlight-links': 'تمييز الروابط',
    'dictionary': 'القاموس',
    'text-align': 'محاذاة النص',
    'error-identification': 'تحديد الأخطاء',
    'reading-order-validator': 'محقق ترتيب القراءة',
    'touch-target-validator': 'محقق الأهداف اللمسية',
    'focus-trap': 'فخ التركيز',
    'auto-refresh-controls': 'أدوات التحكم في التحديث التلقائي',
    'language-validator': 'محقق اللغة',
    'page-title-validator': 'محقق عنوان الصفحة',
    'alt-text-validator': 'محقق النص البديل'
  },
  'ru-RU': {
    'accessibility-tools': 'Инструменты доступности',
    'form-enhancement': 'Улучшение форм',
    'page-structure': 'Структура страницы',
    'hide-images': 'Скрыть изображения',
    'pause-animations': 'Приостановить анимации',
    'reduced-motion': 'Уменьшенное движение',
    'tooltip': 'Подсказка',
    'cursor': 'Курсор',
    'highlight-links': 'Выделить ссылки',
    'dictionary': 'Словарь',
    'text-align': 'Выравнивание текста',
    'error-identification': 'Идентификация ошибок',
    'reading-order-validator': 'Валидатор порядка чтения',
    'touch-target-validator': 'Валидатор сенсорных целей',
    'focus-trap': 'Ловушка фокуса',
    'auto-refresh-controls': 'Элементы управления автообновлением',
    'language-validator': 'Валидатор языка',
    'page-title-validator': 'Валидатор заголовка страницы',
    'alt-text-validator': 'Валидатор альтернативного текста'
  },
  'pt-BR': {
    'accessibility-tools': 'Ferramentas de acessibilidade',
    'form-enhancement': 'Melhoria de formulários',
    'page-structure': 'Estrutura da página',
    'hide-images': 'Ocultar imagens',
    'pause-animations': 'Pausar animações',
    'reduced-motion': 'Movimento reduzido',
    'tooltip': 'Dica',
    'cursor': 'Cursor',
    'highlight-links': 'Destacar links',
    'dictionary': 'Dicionário',
    'text-align': 'Alinhamento de texto',
    'error-identification': 'Identificação de erros',
    'reading-order-validator': 'Validador de ordem de leitura',
    'touch-target-validator': 'Validador de alvos de toque',
    'focus-trap': 'Armadilha de foco',
    'auto-refresh-controls': 'Controles de atualização automática',
    'language-validator': 'Validador de idioma',
    'page-title-validator': 'Validador de título da página',
    'alt-text-validator': 'Validador de texto alternativo'
  },
  'it-IT': {
    'accessibility-tools': 'Strumenti di accessibilità',
    'form-enhancement': 'Miglioramento dei moduli',
    'page-structure': 'Struttura della pagina',
    'hide-images': 'Nascondi immagini',
    'pause-animations': 'Pausa animazioni',
    'reduced-motion': 'Movimento ridotto',
    'tooltip': 'Suggerimento',
    'cursor': 'Cursore',
    'highlight-links': 'Evidenzia link',
    'dictionary': 'Dizionario',
    'text-align': 'Allineamento testo',
    'error-identification': 'Identificazione errori',
    'reading-order-validator': 'Validatore ordine di lettura',
    'touch-target-validator': 'Validatore obiettivi touch',
    'focus-trap': 'Trappola del focus',
    'auto-refresh-controls': 'Controlli aggiornamento automatico',
    'language-validator': 'Validatore lingua',
    'page-title-validator': 'Validatore titolo pagina',
    'alt-text-validator': 'Validatore testo alternativo'
  }
};

// Update each language section
Object.keys(translations).forEach(lang => {
  const langTranslations = translations[lang];
  Object.keys(langTranslations).forEach(key => {
    const regex = new RegExp(`'${key}': '[^']*',?`, 'g');
    const replacement = `'${key}': '${langTranslations[key]}',`;
    content = content.replace(regex, replacement);
  });
});

// Write the updated content back to the file
fs.writeFileSync(i18nPath, content, 'utf8');

console.log('All translations have been updated successfully!'); 