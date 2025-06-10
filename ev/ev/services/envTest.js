import { OPENAI_API_KEY } from '@env';

export const testEnvVariables = () => {
  console.log('Environment Test:', {
    OPENAI_API_KEY_EXISTS: typeof OPENAI_API_KEY !== 'undefined',
    OPENAI_API_KEY_TYPE: typeof OPENAI_API_KEY,
    OPENAI_API_KEY_START: OPENAI_API_KEY?.substring(0, 20),
    OPENAI_API_KEY_LENGTH: OPENAI_API_KEY?.length
  });
}; 