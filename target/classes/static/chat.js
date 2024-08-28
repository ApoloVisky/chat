document.addEventListener("DOMContentLoaded", function() {
    const socket = new SockJS('/chat');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/messages', function (messageOutput) {
            const messageArea = document.getElementById("messages");
            const messageData = JSON.parse(messageOutput.body).content;
            const message = document.createElement("div");
            message.className = 'message';
            message.textContent = messageData;
            messageArea.appendChild(message);
            messageArea.scrollTop = messageArea.scrollHeight; // Auto-scroll para o final
        });
    }, function (error) {
        console.error('Error connecting to WebSocket:', error);
    });

    document.getElementById('sendButton').addEventListener('click', function () {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        if (message) {
            stompClient.send("/app/sendMessage", {}, JSON.stringify({ 'content': message }));
            input.value = ""; // Limpar campo de entrada
        }
    });

    document.getElementById('messageInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('sendButton').click();
        }
    });
});
