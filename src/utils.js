export async function toBase64(input) {
  if (!input) return null;

  if (typeof input === 'string') {
    if (input.startsWith('data:image') || /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(input)) {
      return input.startsWith('data:') ? input : `data:image/jpeg;base64,${input}`;
    }
    
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const response = await fetch(input);
      const arrayBuffer = await response.arrayBuffer();
      const mimeType = response.headers.get('content-type') || 'image/jpeg';
      return bufferToBase64(arrayBuffer, mimeType);
    }

    const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
    if (isNode) {
      try {
        const fs = await import('node:fs');
        const data = fs.readFileSync(input);
        return `data:image/jpeg;base64,${data.toString('base64')}`;
      } catch (err) {
        throw new Error(`[AtenoSDK] Failed to read local file path: ${input}`);
      }
    }
  }

  if (typeof Blob !== 'undefined' && input instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(input);
    });
  }

  if (input.byteLength || input.length) {
    return bufferToBase64(input);
  }

  throw new Error('[AtenoSDK] Unsupported image format. Please provide a File, Blob, Buffer, URL, base64 string, or local file path.');
}

function bufferToBase64(buffer, mimeType = 'image/jpeg') {
  let base64;
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(buffer).toString('base64');
  } else {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  }
  return `data:${mimeType};base64,${base64}`;
}