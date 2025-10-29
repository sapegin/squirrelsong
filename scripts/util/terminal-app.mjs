import { hexToRgb } from './hexToRgb.mjs';

// We use the original binary base64 data string created by Terminal.app and
// patch the RGB float color values
const sampleBase64 = `
YnBsaXN0MDDUAQIDBAUGBwpYJHZlcnNpb25ZJGFyY2hpdmVyVCR0b3BYJG9iamVjdHMS
AAGGoF8QD05TS2V5ZWRBcmNoaXZlctEICVRyb290gAGjCwwTVSRudWxs0w0ODxARElVO
U1JHQlxOU0NvbG9yU3BhY2VWJGNsYXNzTxAnMC4yMDc4NDMxMzczIDAuMTY0NzA1ODgy
NCAwLjEyOTQxMTc2NDcAEAKAAtIUFRYXWiRjbGFzc25hbWVYJGNsYXNzZXNXTlNDb2xv
cqIWGFhOU09iamVjdAgRGiQpMjdJTFFTV11kand+qKqssbzFzdAAAAAAAAABAQAAAAAA
AAAZAAAAAAAAAAAAAAAAAAAA2Q==
`.trim();

/** Returns base64 binary string for Terminal.app theme */
export function createNSKeyedArchiverColor(hexColor) {
  const [r, g, b] = hexToRgb(hexColor);

  // Decode the base64 template to a binary buffer
  const buffer = Buffer.from(sampleBase64, 'base64');

  // Convert RGB values to strings with 10 decimal places
  const rStr = (r / 255).toFixed(10);
  const gStr = (g / 255).toFixed(10);
  const bStr = (b / 255).toFixed(10);

  // Create the color string in the format `R G B`
  const colorString = `${rStr} ${gStr} ${bStr}`;

  // Find the color data in the buffer. The template contains a known RGB color
  // string, that we need to find this pattern and replace
  const templateColorString = '0.2078431373 0.1647058824 0.1294117647';
  const templateColorBytes = Buffer.from(templateColorString, 'ascii');
  const colorStringBytes = Buffer.from(colorString, 'ascii');

  // Find the position of the color string in the buffer
  const position = buffer.indexOf(templateColorBytes);

  if (position === -1) {
    throw new Error('Could not find color data in template');
  }

  // Create a new buffer with the updated color
  const newBuffer = Buffer.from(buffer);
  colorStringBytes.copy(newBuffer, position);

  // Encode back to base64 and format with proper line breaks
  const encoded = newBuffer.toString('base64');
  const formatted = encoded.match(/.{1,68}/g).join('\n\t');

  return formatted;
}
