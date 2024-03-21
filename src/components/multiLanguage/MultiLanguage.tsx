import { useState } from "react";
import { useTranslation } from "react-i18next"


const MultiLanguage: React.FC =()=> {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState('vi-VI');
    const handleLangChange = (e: React.FormEvent) => {
        const lang = (e.target as any).value;  
        setLanguage(lang);
        (i18n as any).changeLanguage(lang)
    }
    return (
        <>
            <img src={language == "vi-VI" ? "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" : "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1200px-Flag_of_the_United_Kingdom.svg.png"} style={{ width: '23px', height: '16px', marginTop: 3 }} alt="Flag" />
            <select onChange={(e) => { handleLangChange(e) }} id="language" defaultValue={language}>
                <option value="vi-VI">VI
                </option>
                <option value="en-EN">EN
                </option>
            </select>
        </>

    )
}
export default MultiLanguage