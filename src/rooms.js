import { toBase64 } from './utils.js';

export class RoomsService {
  constructor(client) {
    this.client = client;
  }

  async generateRoom2D(payload, onProgress) {
    if (onProgress) {
      onProgress('Converting image and preparing request…');
    }

    const base64Image = await toBase64(payload.image);

    const formattedPayload = {
      aspectRatio: '16:9',
      resolution: '2K',
      ...payload,
      image: base64Image
    };

    if (onProgress) {
      onProgress('Generating room design…');
    }

    const result = await this.client.post('/rooms/analyze-and-generate', formattedPayload);

    const designId = 
      result.designId || 
      result.summary?.designId || 
      result.workflow?.designId || 
      null;

    const designSaveError = 
      result.designSaveError || 
      result.summary?.designSaveError || 
      null;

    const generatedImage = 
      result.workflow?.generate?.image || 
      result.workflow?.generate?.roomImage_result || 
      result.image || 
      result.generatedImage || 
      result.summary?.image || 
      null;

    return {
      raw: result,
      generatedImage,
      designId,
      designSaveError
    };
  }

  async generateRoom3D(payload, onProgress) {
    if (!payload.imageBase64 && !payload.roomImage) {
      throw new Error('[AtenoSDK] At least one of imageBase64 or roomImage is required');
    }

    if (onProgress) {
      onProgress('Processing images…');
    }

    const imagePayload = {};
    if (payload.imageBase64) {
      imagePayload.imageBase64 = await toBase64(payload.imageBase64);
    }
    if (payload.roomImage) {
      imagePayload.roomImage = await toBase64(payload.roomImage);
    }

    const formattedPayload = {
      ...payload,
      ...imagePayload
    };

    if (onProgress) {
      onProgress('Generating 3D space…');
    }

    const result = await this.client.post('/rooms/generate-space', formattedPayload);

    const storageUrl = 
      result.storageUrl || 
      result.summary?.storageUrl || 
      result.workflow?.storageUrl || 
      null;

    const designId = 
      result.designId || 
      result.summary?.designId || 
      null;

    const firebaseSaved = result.firebaseSaved === true || String(result.firebaseSaved).toLowerCase() === 'true';

    const firebasePath = result.firebasePath || result.firebase_gs_path || null;

    return {
      raw: result,
      storageUrl,
      designId,
      firebaseSaved,
      firebasePath
    };
  }
}