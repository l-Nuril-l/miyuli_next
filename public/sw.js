self.addEventListener('notificationclick', function (event) {
    const promise = async () => {
        console.log(event)
        event.notification.close();
        const clients = await self.clients.matchAll();
        var url = self.location.origin + '/im?sel=' + event.notification.data;
        if (clients && clients.length > 0) {
            // Взять контроль над текущими клиентами
            await clients[0].claim();
            // Перенаправить текущую страницу на новый URL
            clients[0].navigate(url);
        } else {
            // Если нет открытых клиентов, открыть новое окно
            self.clients.openWindow(url);
        }
    };

    event.waitUntil(promise());
});