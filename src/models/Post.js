
const PostFactory = (title, content, tags, src='', date) => {
    return {title, content, tags, date, src};
};

export {PostFactory};
