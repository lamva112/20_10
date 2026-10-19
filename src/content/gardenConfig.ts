export const romanticWishes2010: string[] = [
    'Chúc Ánh một ngày 20/10 ngập tràn nụ cười, niềm vui và luôn là cô gái rạng rỡ nhất trong lòng anh! ❤️',
    'Chúc em mỗi ngày thức dậy đều thấy bình an, được yêu thương và luôn có những điều ngọt ngào bao quanh. ✨',
    'Chúc Ánh luôn xinh đẹp, tự tin và vững vàng trên mọi con đường em bước. Anh sẽ luôn ở phía sau ủng hộ em! 🌸',
    '20/10 này và mãi về sau, mong mọi điều may mắn, dịu dàng và tuyệt vời nhất thế gian đều đến bên Ánh. 🌹',
    'Gửi tặng Ánh ngàn đóa hoa thắm cùng lời chúc: Luôn vui tươi, nhiều sức khỏe, bình yên và hạnh phúc mỗi ngày! 💐',
    'Chúc em luôn ấm áp như nắng sớm, rạng ngời như ánh mặt trời và được nâng niu theo cách em xứng đáng nhất. ☀️',
    'Cảm ơn em vì đã là một sự hiện diện dịu dàng, đáng yêu. Chúc Ánh 20/10 thật nhiều niềm vui và quà nhé! 🎁',
    'Chúc Ánh mọi âu lo, mệt mỏi đều tan biến, chỉ còn lại nụ cười rạng rỡ và những khoảnh khắc thật êm đềm. 💫',
    'Mong em luôn được trân trọng, được yêu thương thật nhiều và luôn cảm nhận được sự ấm áp ngọt ngào bên mình. 💖',
    'Chúc cô gái đặc biệt một ngày 20/10 trọn vẹn hạnh phúc, nhiều hoa tươi và ngập tràn tình yêu thương! 🌷',
];

export function getRandomWish(excludeIndex = -1): { wish: string; index: number } {
    let newIndex = Math.floor(Math.random() * romanticWishes2010.length);
    if (romanticWishes2010.length > 1 && newIndex === excludeIndex) {
        newIndex = (newIndex + 1) % romanticWishes2010.length;
    }
    return { wish: romanticWishes2010[newIndex], index: newIndex };
}

export const romanticGreetingConfig = {
    recipient: 'Ánh',
    girlName: 'Ánh Bùi',
    dogName: 'Khôi Bùi',
    heroName: 'Lam Bùi',
    dragonName: 'Stress & Pessimistic Dragon',
    musicSrc: '/mp3/cho-chut.mp3',
    musicTitle: 'Chờ chút - CongB, Tinh Hà',
    dateLabel: '20/10',
    bouquetMessage: 'Một bó hoa đẹp như những điều tôi muốn chúc em luôn được yêu thương.',
    primaryGreeting: 'Chúc em 20/10 thật hạnh phúc ❤️',
    secondaryGreeting:
        'Chúc em luôn xinh đẹp, mạnh mẽ, bình an và luôn được yêu thương theo cách em xứng đáng.',
    prompt: 'Explore the scene',
    callHeroLabel: 'Call for Lam Bùi',
    heroShout: '⚔️ Lam Bùi: Đừng lo, để anh chém tan mọi Stress & Bi quan cho em!',
    heroVictory: '✨ Stress và muộn phiền đã tan biến! Anh luôn ở đây bảo vệ Ánh ❤️',
    interactionHint: 'Di chuột để ngắm nhìn • Nhấp vào bó hoa để bung nở yêu thương',
    wishes: romanticWishes2010,
};
