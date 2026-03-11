import { AtenoClient } from './client.js';
import { RoomsService } from './rooms.js';

export class Ateno {
  constructor(config) {
    this._client = new AtenoClient(config);
    this.rooms = new RoomsService(this._client);
  }

  get usageCount() {
    return this._client.getTotalRequests();
  }
}

export default Ateno;