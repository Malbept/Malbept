// translations.js
export let currentLanguage = 'uk';
let translations = {};

export async function loadTranslations() {
  try {
    const response = await fetch('translations.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    translations = await response.json();
    console.log('Translations loaded:', translations);
  } catch (error) {
    console.error('Error loading translations:', error);
    translations = { uk: {}, ru: {}, en: {} }; // Фаллбэк
  }
}

export function getTranslation(key, lang = currentLanguage) {
  return translations[lang]?.[key] || key;
}

export function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
}