export type GameEvent = {
  type: string;
  data: any;
  timestamp: string;
};

type WebSocketCallback = (event: GameEvent) => void;
type ConnectionCallback = (connected: boolean) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private eventCallbacks: Set<WebSocketCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();
  private isConnecting = false;

  private pendingGameData: any = null;

  connect(gameData?: any) {
    // GameData'yı sakla
    if (gameData) {
      this.pendingGameData = gameData;
    }

    // Eğer zaten bağlıysa veya bağlanıyorsa, yeni bağlantı açma
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
      console.log('WebSocket zaten bağlı veya bağlanıyor');
      // Eğer bağlı ve gameData verilmişse, direkt gönder
      if (this.ws.readyState === WebSocket.OPEN && gameData) {
        console.log('Sending game data to existing connection');
        this.ws.send(JSON.stringify(gameData));
      }
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket bağlantısı zaten kuruluyor');
      return;
    }

    this.isConnecting = true;
    console.log('WebSocket bağlantısı kuruluyor...');

    this.ws = new WebSocket('ws://localhost:8765');

    this.ws.onopen = () => {
      console.log('✅ WebSocket bağlantısı kuruldu');
      this.isConnecting = false;
      this.notifyConnectionCallbacks(true);

      // Eğer pending gameData varsa onu kullan
      if (this.pendingGameData) {
        console.log('Sending pending game data:', this.pendingGameData);
        this.ws?.send(JSON.stringify(this.pendingGameData));
        this.pendingGameData = null; // Kullandıktan sonra temizle
      } else {
        // Yoksa default training verisini gönder
        const defaultGameData = {
          team1: {
            name: 'ANADOLU EFES',
            players: [
              { id: 1, name: 'Shane Larkin', attack: 85, defense: 70, max_energy: 100 },
              { id: 2, name: 'Vasilije Micic', attack: 82, defense: 68, max_energy: 100 },
              { id: 3, name: 'Will Clyburn', attack: 78, defense: 75, max_energy: 100 },
              { id: 4, name: 'Tibor Pleiss', attack: 70, defense: 80, max_energy: 100 },
              { id: 5, name: 'Rodrigue Beaubois', attack: 75, defense: 65, max_energy: 100 }
            ]
          },
          team2: {
            name: 'FENERBAHÇE',
            players: [
              { id: 6, name: 'Scottie Wilbekin', attack: 83, defense: 72, max_energy: 100 },
              { id: 7, name: 'Nando De Colo', attack: 80, defense: 70, max_energy: 100 },
              { id: 8, name: 'Jan Vesely', attack: 76, defense: 78, max_energy: 100 },
              { id: 9, name: 'Dyshawn Pierre', attack: 72, defense: 82, max_energy: 100 },
              { id: 10, name: 'Lorenzo Brown', attack: 77, defense: 68, max_energy: 100 }
            ]
          }
        };

        console.log('Sending default training data');
        this.ws?.send(JSON.stringify(defaultGameData));
      }
    };

    this.ws.onmessage = (event) => {
      const gameEvent: GameEvent = JSON.parse(event.data);
      this.notifyEventCallbacks(gameEvent);
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.isConnecting = false;
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket bağlantısı kapandı');
      this.isConnecting = false;
      this.notifyConnectionCallbacks(false);
    };
  }

  disconnect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket bağlantısı kapatılıyor...');
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
  }

  onEvent(callback: WebSocketCallback) {
    this.eventCallbacks.add(callback);
    return () => this.eventCallbacks.delete(callback);
  }

  onConnectionChange(callback: ConnectionCallback) {
    this.connectionCallbacks.add(callback);
    // Mevcut durumu bildir
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      callback(true);
    }
    return () => this.connectionCallbacks.delete(callback);
  }

  private notifyEventCallbacks(event: GameEvent) {
    this.eventCallbacks.forEach(callback => callback(event));
  }

  private notifyConnectionCallbacks(connected: boolean) {
    this.connectionCallbacks.forEach(callback => callback(connected));
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const websocketManager = new WebSocketManager();
