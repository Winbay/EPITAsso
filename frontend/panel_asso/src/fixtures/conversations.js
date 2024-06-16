// initializeFixtures.js
import fixture from 'can-fixture';

export let associations = []

export let conversations = [
  {
    id: 1,
    name: 'Conversation 1',
    associations_in_conversation: [],
    last_sent_at: '2018-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Conversation 2',
    associations_in_conversation: [],
    last_sent_at: '2018-01-02T00:00:00Z',
  }
];

export async function initializeConversations(associationService) {
  associations = await associationService.getAssociations();

  conversations[0].associations_in_conversation = [associations[0], associations[1]];
  conversations[1].associations_in_conversation = [associations[0]];

  fixture('GET /api/conversations/', (request) => {
    const id = parseInt(request.data.association_id);
    return conversations.filter((conversation) => {
      return conversation.associations_in_conversation.find((association) => association.id === id);
    });
  });

  fixture('POST /api/conversations/?association_id={id}', (request) => {
    const conversation_id = conversations.length === 0 ? 1 : conversations[conversations.length - 1].id + 1;
    const conversation = {
      id: conversation_id,
      name: request.data.name,
      associations_in_conversation: request.data.associations_in_conversation,
      last_sent_at: new Date().toISOString()
    };
    conversations.push(conversation);
    return conversation;
  });

  fixture('DELETE /api/conversations/{conversation_id}/', (request) => {
    const association_id = parseInt(request.data.association_id);
    const conversation_id = parseInt(request.data.conversation_id);
    const conversation = conversations.find((conversation) => conversation.id === conversation_id);
    const index = conversation.associations_in_conversation.findIndex((association) => association.id === association_id);
    conversation.associations_in_conversation.splice(index, 1);
    return conversation;
  });
}
