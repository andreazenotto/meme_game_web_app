function User(id, username, name, surname, email) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.email = email;
}

function Meme(id, imageUrl) {
    this.id = id;
    this.imageUrl = imageUrl;
}

function Caption(id, memeId, caption) {
    this.id = id;
    this.memeId = memeId;
    this.caption = caption;
}

function Game(id, userId, memeUrl1, selectedCaption1, score1,
    memeUrl2, selectedCaption2, score2, memeUrl3, selectedCaption3, score3) {
    this.id = id;
    this.userId = userId;
    this.memeUrl1 = memeUrl1;
    this.selectedCaption1 = selectedCaption1;
    this.score1 = score1;
    this.memeUrl2 = memeUrl2;
    this.selectedCaption2 = selectedCaption2;
    this.score2 = score2;
    this.memeUrl3 = memeUrl3;
    this.selectedCaption3 = selectedCaption3;
    this.score3 = score3;
}

export { User, Meme, Caption, Game };