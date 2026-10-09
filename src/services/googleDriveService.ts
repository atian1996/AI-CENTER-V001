import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with configured Drive and Docs scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/documents');
provider.setCustomParameters({
  prompt: 'select_account'
});

// Flag to indicate ongoing sign-in flow
let isSigningIn = false;
// In-memory access token cache (Never persist in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

/**
 * Initialize Firebase Auth listener
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User is signed in with Firebase, but we need an OAuth access token for Google Drive API.
        // If cached token was cleared by reload, require interactive sign-in for Google Workspace access.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Interactive Google Sign-In with popup
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('未能从 Google 账号认证中获取有效的访问凭证 (Access Token)');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Sign out and clear in-memory credentials
 */
export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface GoogleDriveFileResult {
  id: string;
  name: string;
  webViewLink: string;
  createdTime?: string;
}

/**
 * Upload & create the system design specification document directly in Google Drive as a Google Doc
 */
export const uploadDesignDocToGoogleDrive = async (
  title: string,
  content: string
): Promise<GoogleDriveFileResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('未检测到有效的 Google 登录凭证，请先登录 Google 账号。');
  }

  // Use multipart upload to create a Google Doc directly from text
  const metadata = {
    name: title,
    mimeType: 'application/vnd.google-apps.document',
    description: '千极AI系统整体功能架构与文字设计规范文档（基线版）'
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Failed to create file in Google Drive:', response.status, errText);
    
    // If multipart document conversion fails (e.g. rate limit or format issue), fallback to standard text/markdown upload
    const fallbackResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,createdTime',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body:
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify({
            name: `${title}.md`,
            mimeType: 'text/markdown',
            description: '千极AI系统整体功能架构与文字设计规范文档（Markdown格式）'
          }) +
          delimiter +
          'Content-Type: text/markdown; charset=UTF-8\r\n\r\n' +
          content +
          closeDelimiter,
      }
    );

    if (!fallbackResponse.ok) {
      const fallbackErr = await fallbackResponse.text();
      throw new Error(`创建 Google Drive 文件失败: ${fallbackErr}`);
    }

    const fallbackData = await fallbackResponse.json();
    return {
      id: fallbackData.id,
      name: fallbackData.name,
      webViewLink: fallbackData.webViewLink || `https://drive.google.com/file/d/${fallbackData.id}/view`,
      createdTime: fallbackData.createdTime,
    };
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    webViewLink: data.webViewLink || `https://docs.google.com/document/d/${data.id}/edit`,
    createdTime: data.createdTime,
  };
};
