import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: {
      welcome: "Welcome",
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
    },
    auth: {
      login: "Login",
      logout: "Logout",
      email: "Email",
      password: "Password",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password",
    },
    workspace: {
      title: "Workspaces",
      create: "Create Workspace",
      name: "Workspace Name",
    },
    credentialGroup: {
      title: "Credential Groups",
      create: "Create Group",
      name: "Group Name",
    },
    credential: {
      title: "Credentials",
      create: "Create Credential",
      name: "Credential Name",
    },
  },
  tr: {
    common: {
      welcome: "Hoş Geldiniz",
      loading: "Yükleniyor...",
      error: "Bir hata oluştu",
      save: "Kaydet",
      cancel: "İptal",
      delete: "Sil",
      edit: "Düzenle",
      create: "Oluştur",
    },
    auth: {
      login: "Giriş Yap",
      logout: "Çıkış Yap",
      email: "E-posta",
      password: "Şifre",
      signUp: "Kayıt Ol",
      forgotPassword: "Şifremi Unuttum",
    },
    workspace: {
      title: "Çalışma Alanları",
      create: "Çalışma Alanı Oluştur",
      name: "Çalışma Alanı Adı",
    },
    credentialGroup: {
      title: "Kimlik Bilgisi Grupları",
      create: "Grup Oluştur",
      name: "Grup Adı",
    },
    credential: {
      title: "Kimlik Bilgileri",
      create: "Kimlik Bilgisi Oluştur",
      name: "Kimlik Bilgisi Adı",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
