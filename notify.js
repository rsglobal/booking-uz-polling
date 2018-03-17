const NOTIFICATION_GRUNTED = "granted";
const NOTIFICATION_DENIED = "denied";
const NOTIFICATION_DENIED_MESSAGE = "Notification permission denied";
const NOTIFICATION_UNSUPPORTED_MESSAGE =
  "Desktop notifications not available in your browser. Try Chromium.";

function initNotifications() {
  return new Promise((resolve, reject) => {
    switch (Notification && Notification.permission) {
      case undefined:
        reject(NOTIFICATION_UNSUPPORTED_MESSAGE);

        return;

      case NOTIFICATION_DENIED:
        reject(NOTIFICATION_DENIED_MESSAGE);

        return;

      case NOTIFICATION_GRUNTED:
        resolve();
        return;

      default:
        Notification.requestPermission(permission => {
          if (permission === NOTIFICATION_GRUNTED) {
            resolve();
          } else {
            reject(NOTIFICATION_DENIED_MESSAGE);
          }
        });
    }
  });
}

function notify(title, message, favicon) {
  initNotifications()
    .then(() => {
      let notification = new Notification(title, {
        icon: favicon || "/favicon.ico",
        body: message
      });

      notification.onclick = function () {
        notification.close();
        self.focus();
      };
    })
    .catch(error => {
      console.warn(error);
    });
}

export default notify;