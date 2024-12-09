// src/services/nfc.service.js

class NFCReader {
    constructor() {
      this.port = null;
      this.reader = null;
      this.isConnected = false;
    }
  
    async connect() {
      try {
        // Demander l'accès au port série
        this.port = await navigator.serial.requestPort({
          filters: [{ usbVendorId: 0x072f }] // ID vendeur pour ACR122U
        });
  
        // Ouvrir le port avec les bons paramètres pour ACR122U
        await this.port.open({
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: 'none',
          flowControl: 'none'
        });
  
        this.isConnected = true;
        return true;
      } catch (error) {
        console.error('Erreur de connexion au lecteur:', error);
        throw new Error('Impossible de se connecter au lecteur NFC');
      }
    }
  
    // Convertir un tableau de bytes en chaîne hexadécimale
    byteArrayToHex(array) {
      return Array.from(array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    }
  
    // Convertir une chaîne hexadécimale en tableau de bytes
    hexToByteArray(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      return bytes;
    }
  
    // Calculer la somme de contrôle
    calculateChecksum(data) {
      return data.reduce((acc, val) => acc ^ val, 0);
    }
  
    // Créer une commande APDU
    createAPDU(command, data = []) {
      const header = [0xFF, 0xCA, 0x00, 0x00];
      const length = data.length;
      const apdu = [...header, length, ...data];
      const checksum = this.calculateChecksum(apdu);
      return new Uint8Array([...apdu, checksum]);
    }
  
    async sendCommand(command) {
      if (!this.port || !this.isConnected) {
        throw new Error('Lecteur non connecté');
      }
  
      const writer = this.port.writable.getWriter();
      const reader = this.port.readable.getReader();
  
      try {
        // Envoyer la commande
        await writer.write(command);
  
        // Lire la réponse
        const response = [];
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          response.push(...value);
          if (response.length >= 2 && response[response.length - 2] === 0x90) break;
        }
  
        return new Uint8Array(response);
      } finally {
        writer.releaseLock();
        reader.releaseLock();
      }
    }
  
    async writeToCard(sector, block, data) {
      // Authentification du secteur
      const authCmd = this.createAPDU([0x00, 0x82, 0x00, sector, 0x06, ...this.hexToByteArray('FFFFFFFFFFFF')]);
      await this.sendCommand(authCmd);
  
      // Écriture des données
      const writeCmd = this.createAPDU([0x00, 0xD6, 0x00, block, data.length, ...data]);
      const response = await this.sendCommand(writeCmd);
  
      return response[response.length - 2] === 0x90;
    }
  
    generateNFCId() {
      const random = new Uint8Array(8);
      crypto.getRandomValues(random);
      return 'NFC-' + this.byteArrayToHex(random);
    }
  
    async disconnect() {
      if (this.port && this.isConnected) {
        await this.port.close();
        this.isConnected = false;
      }
    }
  }
  
  export default new NFCReader();