
import i18n from 'i18next';
import enStr from './locales/en.json'
import viStr from './locales/vi.json'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next';
import Backend from "i18next-xhr-backend";
const defaultLanguage = 'vi-VI';
export const defaultNamespace = 'default';
export const resources = {
    'en-EN': {
        [defaultNamespace]: enStr
    },
    'vi-VI': {
        [defaultNamespace]: viStr
    }
}
i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        defaultNS:defaultNamespace,
        ns:[defaultNamespace],
        resources,
        lng:defaultLanguage,
        fallbackLng:defaultLanguage,
        interpolation:{
            escapeValue: false
        }
    })