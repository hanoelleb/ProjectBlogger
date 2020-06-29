
const PostFactory = (title, content, tags, src='', srckey='', date) => {
    return {title, content, tags, date, src, srckey};
};

export {PostFactory};
