import axios from 'axios'
import FormData from 'form-data'
import type { Association } from '@/types/associationInterfaces'

interface DiscordMessage {
  content?: string
  image?: string
}

export default class DiscordWebhookService {
  static webhookUrlRegex: RegExp = /(?<url>^https:\/\/(?:(?:canary|ptb).)?discord(?:app)?.com\/api(?:\/v\d+)?\/webhooks\/(?<id>\d+)\/(?<token>[\w-]+)\/?$)/
  static webhookTooltip: string = "Quand un évènement est créé, un message sera automatiquement " +
    "envoyé dans un channel Discord si le Webhook est configuré."
  static webhookTooltipDisabled: string = "Aucun lien webhook n'est configuré sur l'association actuelle."

  static checkUrlValidity(webhookUrl: string): boolean {
    return this.webhookUrlRegex.test(webhookUrl);
  }

  static checkAttributeValidity(webhookUrl: string): boolean {
    return webhookUrl === undefined || webhookUrl === '' || this.checkUrlValidity(webhookUrl);
  }

  static eventContentToDiscordMessages(html: string): DiscordMessage[] {
    const messages: DiscordMessage[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    function convertNode(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }

      const element = node as HTMLElement;
      let markdown = '';

      switch (element.tagName.toLowerCase()) {
        case 'h1':
          markdown = `# ${convertChildren(element)}\n`;
          break;
        case 'h2':
          markdown = `## ${convertChildren(element)}\n`;
          break;
        case 'p':
          markdown = `${convertChildren(element)}\n`;
          break;
        case 'strong':
          markdown = `**${convertChildren(element)}**`;
          break;
        case 'em':
          markdown = `*${convertChildren(element)}*`;
          break;
        case 'u':
          markdown = `__${convertChildren(element)}__`;
          break;
        case 'ol':
          markdown = `${convertChildren(element)}`;
          break;
        case 'li':
          markdown = `- ${convertChildren(element)}\n`;
          break;
        case 'a': {
          const href = element.getAttribute('href');
          markdown = `[${convertChildren(element)}](${href})`;
          break;
        }
        case 'div':
          if (element.classList.contains('ql-code-block-container')) {
            markdown = `\`\`\`\n${convertCodeBlock(element)}\n\`\`\`\n`;
          }
          break;
        case 'img': {
          const src = element.getAttribute('src');
          if (src?.startsWith('data:image/png;base64,')) {
            messages.push({ image: src.replace('data:image/png;base64,', '') });
          }
          break;
        }
        default:
          markdown = convertChildren(element);
      }

      return markdown;
    }

    function convertChildren(element: HTMLElement): string {
      let markdown = '';
      element.childNodes.forEach(child => {
        markdown += convertNode(child);
      });
      return markdown;
    }

    function convertCodeBlock(element: HTMLElement): string {
      let code = '';
      element.querySelectorAll('.ql-code-block').forEach(block => {
        code += (block.textContent || '') + '\n';
      });
      return code.trim();
    }

    let currentContent = '';

    doc.body.childNodes.forEach(node => {
      if (node.nodeName.toLowerCase() === 'p' && node.childNodes[0].nodeName.toLowerCase() === 'img') {
        const discordMessage: DiscordMessage = {}
        if (currentContent.trim()) {
          discordMessage.content = currentContent.trim()
        }
        const imgElement = node.childNodes[0] as HTMLElement
        const src = imgElement.getAttribute('src')
        console.log("src: ", src)
        if (src?.includes('base64,')) {
          discordMessage.image = src.split('base64,')[1]
        }
        messages.push(discordMessage);
        currentContent = '';
      } else {
        currentContent += convertNode(node);
      }
    });

    if (currentContent.trim()) {
      messages.push({ content: currentContent.trim() });
    }

    return messages;
  }

  static async sendEventWebhook(currentAsso: Association, eventTitle: string, messages: DiscordMessage[]): Promise<void> {
    if (messages.length > 0) {
      messages[0].content = `# ${eventTitle}\n` + messages[0].content
    }
    for (const message of messages) {
      const form = new FormData()

      if (message.image) {
        const mimeTypeMatch = message.image.match(/^data:(.*?);base64,/)
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
        const base64Image = message.image.replace(/^data:(.*?);base64,/, '')
        const binary = atob(base64Image);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: mimeType });
        form.append('file', blob, 'image.' + mimeType.split('/')[1]);
      }

      const paylodJson = {
        "username": currentAsso.name,
        // "avatar_url": currentAsso.logo,
        "content": ""
      }

      if (message.content) {
        paylodJson.content = message.content
      }

      form.append('payload_json', JSON.stringify(paylodJson))
      await axios.post(currentAsso.webhook, form)
    }
  }
}