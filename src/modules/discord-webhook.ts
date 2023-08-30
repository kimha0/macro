import axios from 'axios';

export function sendWebhook(text: string) {
  axios.post(
    `https://discord.com/api/webhooks/1146244914930270208/SNqh8925MJegbvj0OrG04LKcgmKGHALmgcQkFqhpmQW36XVrcK5BGMEFpD3GjaYaANGN`,
    { content: text },
  );
}
