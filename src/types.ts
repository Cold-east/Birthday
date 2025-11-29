export enum AppStage {
  CREATOR_SETUP = 'CREATOR_SETUP',
  NAME_INPUT = 'NAME_INPUT',
  INTRO = 'INTRO',
  CAMERA_PERMISSION = 'CAMERA_PERMISSION',
  CAPTURE = 'CAPTURE',
  CELEBRATION = 'CELEBRATION'
}

export interface CelebrationProps {
  photoDataUrl: string | null;
  videoUrl?: string;
  audioUrl?: string;
  collageUrls?: string[];
  name: string;
  onReset?: () => void;
}

export interface CameraStageProps {
  onCapture: (dataUrl: string) => void;
  onSkip: () => void;
}

export interface IntroProps {
  name: string;
  onStart: () => void;
  onInstall?: () => void;
}

export interface NameEntryProps {
  onNameSubmit: (name: string) => void;
}

export interface CreatorSetupProps {
  onComplete: (videoBlob: Blob, audioBlob: Blob | null, collageBlobs: Blob[]) => void;
}