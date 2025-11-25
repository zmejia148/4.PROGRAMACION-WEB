<template>
  <div class="chat-page">
    <div class="chat-container">
      <div class="chat-header">
        <div class="chat-header-content">
          <div class="chat-icon">💬</div>
          <div>
            <h2>Chat en Vivo</h2>
            <p>Soporte al Cliente</p>
          </div>
        </div>
        <div class="chat-status">
          <span class="status-dot"></span>
          En línea
        </div>
      </div>

      <div class="chat-body" ref="chatBody">
        <!-- Mensaje de bienvenida del sistema -->
        <div class="system-message">
          <div class="system-bubble">
            💬 Bienvenido al chat de soporte. ¿En qué podemos ayudarte hoy?
          </div>
        </div>

        <div v-for="(msg, index) in messages" :key="index" :class="['chat-message', msg.from]">
          <div class="message-avatar" v-if="msg.from === 'other'">
            <div class="avatar">S</div>
          </div>
          <div class="message-content">
            <div class="bubble">{{ msg.text }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
          <div class="message-avatar" v-if="msg.from === 'me'">
            <div class="avatar user-avatar">U</div>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <div class="input-container">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Escribe un mensaje..."
            class="chat-input"
          />
          <button @click="sendMessage" class="send-btn" :disabled="!newMessage.trim()">
            <span class="send-icon">➤</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatView',
  data() {
    return {
      newMessage: '',
      messages: [
        {
          from: 'other',
          text: '¡Hola! Soy Sofia del equipo de soporte. ¿En qué puedo ayudarte?',
          time: '10:30 AM',
        },
      ],
    }
  },
  methods: {
    sendMessage() {
      if (!this.newMessage.trim()) return

      const currentTime = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })

      // Agregar mensaje del usuario
      this.messages.push({
        from: 'me',
        text: this.newMessage,
        time: currentTime,
      })

      this.newMessage = ''

      // Simular respuesta automática después de 1 segundo
      setTimeout(() => {
        this.messages.push({
          from: 'other',
          text: 'He recibido tu mensaje. Te ayudo en un momento...',
          time: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        })

        this.scrollToBottom()
      }, 1000)

      this.scrollToBottom()
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const body = this.$refs.chatBody
        body.scrollTop = body.scrollHeight
      })
    },
  },

  mounted() {
    this.scrollToBottom()
  },
}
</script>

<style src="../assets/css/chat.css"></style>
