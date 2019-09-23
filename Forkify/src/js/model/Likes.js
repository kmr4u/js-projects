export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const Like = {
            id,
            title,
            author,
            img
        }

        this.likes.push(Like);
        //Persist data in local stroge for page reload
        this.persisitData();
        return Like;
    }

    deleteLike(id){
        const index = this.likes.findIndex( el => el.id === id);
        this.likes.splice(index, 1);

        //Persist data in local stroge for page reload
        this.persisitData();
    }

    isLiked(id){
        return this.likes.findIndex( el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }
    persisitData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readLocalStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        //restore the local storage
        if(storage) this.likes = storage;
    }
}