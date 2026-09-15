class Toast {
  static show(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColor = {
      success: 'bg-green-100 border-green-300',
      error: 'bg-red-100 border-red-300',
      info: 'bg-blue-100 border-blue-300',
    }[type];

    const textColor = {
      success: 'text-green-800',
      error: 'text-red-800',
      info: 'text-blue-800',
    }[type];

    toast.innerHTML = `
      <div class="fixed bottom-4 right-4 ${bgColor} border rounded-lg p-4 ${textColor} shadow-lg max-w-sm z-50 animate-fadeIn">
        ${message}
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  static success(message) {
    this.show(message, 'success');
  }

  static error(message) {
    this.show(message, 'error');
  }

  static info(message) {
    this.show(message, 'info');
  }
}

export default Toast;