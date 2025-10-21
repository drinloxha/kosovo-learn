export const countUnreadMessages = (messages, role) =>
  messages.filter(
    (message) =>
      (role === 'student' && message.sender === 'staff' && !message.readByStudent) ||
      (role === 'staff' && message.sender === 'student' && !message.readByStaff)
  ).length;

export const getAutoReply = (subject) => {
  switch (subject) {
    case 'Matematikë':
      return 'Për të zgjidhur ushtrimin, provo të vizatosh problemin dhe të kontrollosh formulat bazë. Jam në dispozicion nëse ngec diku!';
    case 'Shkencë':
      return 'Kujto eksperimentet që kemi bërë në klasë. Mund të krahasosh rezultatet për të kuptuar konceptin më mirë.';
    case 'Gjuha shqipe':
      return 'Lexo edhe njëherë paragrafët kryesorë dhe thekso pjesët që nuk i kupton. Mund të të dërgoj shembuj shtesë nëse dëshiron.';
    default:
      return 'E mora kërkesën tënde. Do ta shqyrtojmë me kujdes dhe të njoftojmë sapo të kemi përgjigje. Vazhdon të punosh me ritëm të mirë!';
  }
};
