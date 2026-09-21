import { YoutubeTranscript } from 'youtube-transcript';

export type ExtractResult = {
  type: 'url' | 'topic';
  text: string;
};

export function parseYouTubeId(input: string): string | null {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = input.match(regExp);
  return match ? match[1] : null;
}

export async function extractContent(input: string): Promise<ExtractResult> {
  const trimmed = input.trim();
  const isUrl = /^https?:\/\//i.test(trimmed);

  if (!isUrl) {
    return { type: 'topic', text: '' };
  }

  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const videoId = parseYouTubeId(trimmed);
    if (!videoId) {
      throw new Error('INVALID_YOUTUBE_URL');
    }

    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      if (!transcript || transcript.length === 0) {
        throw new Error('TRANSCRIPTION_EMPTY');
      }
      const text = transcript.map((t) => t.text).join(' ');
      return { type: 'url', text };
    } catch (err: any) {
      if (err?.message === 'INVALID_YOUTUBE_URL') throw err;
      throw new Error('TRANSCRIPTION_FAILED');
    }
  }

  if (trimmed.includes('instagram.com')) {
    throw new Error('INSTAGRAM_UNSUPPORTED');
  }

  throw new Error('UNSUPPORTED_SOURCE');
}
