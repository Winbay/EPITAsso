// initializeMessages.js
import fixture from 'can-fixture';
import { conversations, associations } from './conversations.js';

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let messages = [];

const sampleTexts = [
  'Hello!',
  'How are you?',
  'Nice to meet you.',
  'What\'s up?',
  'Good morning!',
  'Good afternoon.',
  'Good evening!',
  'How\'s everything?',
  'Just checking in.',
  'Have a great day!',
  'Looking forward to it.',
  'Let me know.',
  'Thanks!',
  'Best regards.',
  'Take care.',
  'See you later!',
  'I\'m here to help.',
  'Any updates?',
  'Keep me posted.',
  'Cheers!',
  'Wishing you well.',
  'Stay safe.',
  'Happy holidays!',
  'Let\'s discuss.',
  'Great job!',
  'You\'re welcome.',
  'Exciting news!',
  'Congratulations!',
  'Well done!',
  'Enjoy your weekend.'
];

export async function initializeMessages(userService){
  let members = await userService.getUsers();
  members = members.map((member) => {
    return {
      id: member.id,
      login: member.login,
      first_name: member.firstName,
      last_name: member.lastName,
      school: member.school
    };
  })

  for (let i = 0; i < 30; i++) {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    const randomContent = sampleTexts[randomIndex];
    const randomUserIndex = Math.floor(Math.random() * members.length);
    const randomAssociationIndex = Math.floor(Math.random() * associations.length);
    const randomConversationIndex = Math.floor(Math.random() * conversations.length);
    const randomSentAt = randomDate(new Date(2020, 0, 1), new Date());

    const message = {
      id: i + 1,
      conversation: conversations[randomConversationIndex],
      content: randomContent,
      author: members[randomUserIndex],
      association_sender: associations[randomAssociationIndex],
      sent_at: randomSentAt.toISOString(),
    };

    messages.push(message);
  }

  fixture('GET /api/messages/', (request) => {
    const limit = parseInt(request.data.limit, 10) || 20;
    const offset = parseInt(request.data.offset, 10) || 0;

    return messages.slice(offset, offset + limit);
  });

  fixture('GET /api/conversations/{id}/messages/', (request) => {
    const id = parseInt(request.data.id, 10);
    const limit = parseInt(request.data.limit, 10) || 20;
    const offset = parseInt(request.data.offset, 10) || 0;
    const filteredMessages = messages.filter((message) => message.conversation.id === id);
    filteredMessages.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
    return filteredMessages.slice(offset, offset + limit).reverse();
  });

  fixture('POST /api/conversations/{id}/messages/', (request) => {
    const id = parseInt(request.data.id);
    const message = {
      id: messages.length + 1,
      conversation: conversations.find((conversation) => conversation.id === id),
      content: request.data.content,
      author: members.find((user) => user.id === request.data.author.id),
      association_sender: associations.find((association) => association.id === request.data.association_sender.id),
      sent_at: new Date().toISOString()
    };
    messages.push(message);
    return message;
  });
}
