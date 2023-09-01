import axios from 'axios';

const LoggerWebHookUrl =
  `https://discord.com/api/webhooks/1146477027529081003/_6wEnwrlliXelfweQQFKgzuSvP-7KJkLpMSPtMAqN6dlSSncqvZsSWsQSj42xsFB5vPz` as const;
const ErrorWebHookUrl =
  `https://discord.com/api/webhooks/1146244914930270208/SNqh8925MJegbvj0OrG04LKcgmKGHALmgcQkFqhpmQW36XVrcK5BGMEFpD3GjaYaANGN` as const;
const fatigueWebHookUrl =
  `https://discord.com/api/webhooks/1147207898045362327/3CZ1wfG-kAT5hArtdPkgQDOqf_Rl4XZjLr8trryymS-6UyP_xHj94npuXGNR9O47-yLp` as const;

export function sendWebhook(text: string, webhookType?: 'Logger') {
  axios.post(webhookType === 'Logger' ? LoggerWebHookUrl : ErrorWebHookUrl, {
    content: text,
  });
}

export function sendFatigueWebhook(text: string) {
  axios.post(fatigueWebHookUrl, {
    content: text,
  });
}
