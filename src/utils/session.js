import { Blowfish } from "egoroof-blowfish";

const SECRET_KEY = import.meta.env.VITE_BLOWFISH_KEY;

const bf = new Blowfish(SECRET_KEY, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);

export const SessionUtils = {
  setSession: (value) => {
    try {
      const stringData = JSON.stringify(value);
      const encrypted = bf.encode(stringData);
      localStorage.setItem(
        "session",
        btoa(String.fromCharCode.apply(null, encrypted))
      );
    } catch (error) {
      console.error("Set session error:", error);
    }
  },

  getSession: () => {
    try {
      const encryptedData = localStorage.getItem("session");
      if (!encryptedData) return null;

      const encryptedArray = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((c) => c.charCodeAt(0))
      );

      const decrypted = bf.decode(encryptedArray, Blowfish.TYPE.STRING);

      return JSON.parse(decrypted.replace(/\0/g, ""));
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  },

  removeSession: () => {
    localStorage.removeItem("session");
  },
};
