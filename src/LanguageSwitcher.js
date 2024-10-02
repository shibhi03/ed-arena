import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLang = (lng) => {
        i18n.changeLanguage(lng);
    }

    return (
        <div>
            <button onClick={() => changeLang('en')}>English</button>
            <button onClick={() => changeLang('ta')}>Tamil</button>
        </div>
    );
}

export default LanguageSwitcher;