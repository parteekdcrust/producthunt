class Product {
    comments=[];
    tags=[];
    noOfUpvotes=0;
    noOfComments=0;

    constructor(name,visit_url,icon_url,long_desp,short_desp,created_by,created_on,updated_by,updated_on)
    {
        this.name=name;
        this.visit_url=visit_url;
        this.icon_url=icon_url;
        this.long_desp=long_desp;
        this.short_desp= short_desp;
        this.created_by=created_by;
        this.created_on=created_on;
        this.updated_by=updated_by;
        this.updated_on=updated_on;
    }
    
    addComments(comment) {
        this.comments.push(comment);
        this.noOfComments++;

    }
    
    addTag(tag) {
        this.tags.push(tag);
    }

    upvote(){
        this.noOfUpvotes++;
    }

    getComments() {
        console.log(this.comments);
    }

    
}


class Comment {
    constructor(id,description,created_by)
    {
        this.id=id;
        this.description=description;
        this.created_by=created_by;
    }
}
 
class Tag {
    constructor(id,name)
    {
        this.id=id;
        this.name=name;
    }
}



// let abcd = new Product("abcd","abcd.com","abcd.com","long_descrip","short_descrip",1,"created_on");

// abcd=JSON.stringify(abcd);
// console.log(abcd);
// const comment1 =  new Comment(1,"good",2);
// abcd.addComments(comment1);

// const tag1 = new Tag(1,"tag1");
// abcd.addTag(tag1);

// abcd.upvote();

// console.log(abcd);

module.exports = {Product, Comment, Tag};