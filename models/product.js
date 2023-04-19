class Product {
    comments=[];
    tags=[];
    noOfUpvotes=0;
    noOfComments=0;
    images=[];

    constructor(name,visit_url,icon_url,long_desp,short_desp,created_by,updated_by)
    {
        this.name=name;
        this.visit_url=visit_url;
        this.icon_url=icon_url;
        this.long_desp=long_desp;
        this.short_desp= short_desp;
        this.created_by=created_by;
        this.updated_by=updated_by;
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

    addImages(image) {
        this.images.push(image);
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
    constructor(id,tag)
    {
        this.id=id;
        this.tag=tag;
    }
}
class Image {
    constructor(id,url)
    {
        this.id=id;
        this.url= url;
    }
}
module.exports = {Product, Comment, Tag, Image};